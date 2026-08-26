import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const URL =
  "https://prod-us.api.platts.com/ci-raas-prod/raas-report-api/es/public/retirements/publicReportPageSearch";

async function fetchPage(start = 0, limit = 5) {
  const payload = {
    searchFilter: {
      pagination: {
        start,
        limit,
        sortOptions: [
          {
            sort: "retiredDate",
            dir: "DESC"
          }
        ]
      },
      filterModel: {}
    }
  };

  const response = await fetch(URL, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      appkey: "wOKHFGuxKApQaujPSKgF",
      application: "Markit",
      language: "en",
      registry: "VERRA",
      standardacronym: "VCS",
      standardid: "150000000000001",
      "x-xsrf-token": "t20",
      "x-request-id": crypto.randomUUID(),
      origin: "https://registry.verra.org",
      referer: "https://registry.verra.org/"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status}: ${await response.text()}`
    );
  }

  return await response.json();
}

async function main() {

  console.log("=================================");
  console.log("VERIFICATION TEST");
  console.log("=================================");

  const result = await fetchPage(0, 5);

  console.log(
    `Records returned: ${result.numberOfElements}`
  );

  const rows = result.entities.map(r => ({
    id: r.id,
    project_id: r.projectId,
    project_name: r.projectName,
    retired_date: r.retiredDate,
    vintage: r.vintage,
    quantity: r.holdingQuantity,
    beneficial_owner: r.beneficialOwner,
    retirement_reason: r.retirementReason,
    methodology: r.methodologies,
    country: r.countryName,
    region: r.regionName,
    serial_number: r.serialNo,
    raw: r
  }));

  console.log(
    `Preparing upload of ${rows.length} rows`
  );

  const { error } =
    await supabase
      .from("retirements")
      .upsert(rows);

  if (error) {
    console.error("SUPABASE ERROR:");
    console.error(error);
    throw error;
  }

  console.log("=================================");
  console.log("SUCCESS");
  console.log("Rows inserted successfully");
  console.log("=================================");
}

main().catch(err => {
  console.error("FATAL ERROR");
  console.error(err);
  process.exit(1);
});
