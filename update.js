import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const HEADERS = {
  accept: "application/json",
  "content-type": "application/json",
  appkey: "wOKHFGuxKApQaujPSKgF",
  application: "Markit",
  language: "en",
  registry: "VERRA",
  standardacronym: "VCS",
  standardid: "150000000000001",
  "x-xsrf-token": "t20",
  origin: "https://registry.verra.org",
  referer: "https://registry.verra.org/"
};

async function fetchPage(url, sortField, start, limit = 1000) {

  const payload = {
    searchFilter: {
      pagination: {
        start,
        limit,
        sortOptions: [
          {
            sort: sortField,
            dir: "ASC"
          }
        ]
      },
      filterModel: {}
    }
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      ...HEADERS,
      "x-request-id": crypto.randomUUID()
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status}`
    );
  }

  return await response.json();
}

async function loadProjects() {

  console.log("========== PROJECTS ==========");

  const url =
    "https://prod-us.api.platts.com/ci-raas-prod/raas-report-api/es/public/project/publicReportPageSearch";

  const first =
    await fetchPage(
      url,
      "projectName.keyword",
      0
    );

  console.log(
    `Projects: ${first.totalEntities}`
  );

  const pages =
    Math.ceil(
      first.totalEntities / 1000
    );

  for (let page = 0; page < pages; page++) {

    const start = page * 1000;

    console.log(
      `Projects page ${page + 1}/${pages}`
    );

    const data =
      page === 0
        ? first
        : await fetchPage(
            url,
            "projectName.keyword",
            start
          );

    const rows =
      data.entities.map(p => ({
        project_id: p.projectId,
        project_name: p.projectName,
        status: p.status,
        country: p.countryName,
        region: p.regionName,
        sectoral_scope: p.sectoralScope,
        methodologies: p.methodologies,
        validator_name: p.validatorName,
        proponents: p.proponents,
        avg_annual_vol_vcu: p.avgAnnualVolVcu,
        project_size: p.projectSize,
        latitude: p.latitude,
        longitude: p.longitude,
        raw: p
      }));

    const { error } =
      await supabase
        .from("projects")
        .upsert(rows);

    if (error) throw error;
  }
}

async function loadIssuances() {

  console.log("========== ISSUANCES ==========");

  const url =
    "https://prod-us.api.platts.com/ci-raas-prod/raas-report-api/es/public/issuances/publicReportPageSearch";

  const first =
    await fetchPage(
      url,
      "issueDate",
      0
    );

  console.log(
    `Issuances: ${first.totalEntities}`
  );

  const pages =
    Math.ceil(
      first.totalEntities / 1000
    );

  for (let page = 0; page < pages; page++) {

    const start = page * 1000;

    console.log(
      `Issuances page ${page + 1}/${pages}`
    );

    const data =
      page === 0
        ? first
        : await fetchPage(
            url,
            "issueDate",
            start
          );

    const rows =
      data.entities.map(r => ({
        id: r.id,
        project_id: r.projectId,
        project_name: r.projectName,
        vintage: r.vintage,
        quantity: r.holdingQuantity,
        issue_date: r.issueDate,
        verifier_name: r.verifierName,
        methodology: r.methodologies,
        country: r.countryName,
        region: r.regionName,
        serial_number: r.serialNo,
        raw: r
      }));

    const { error } =
      await supabase
        .from("issuances")
        .upsert(rows);

    if (error) throw error;
  }
}

async function loadRetirements() {

  console.log("========== RETIREMENTS ==========");

  const url =
    "https://prod-us.api.platts.com/ci-raas-prod/raas-report-api/es/public/retirements/publicReportPageSearch";

  const first =
    await fetchPage(
      url,
      "retiredDate",
      0
    );

  console.log(
    `Retirements: ${first.totalEntities}`
  );

  const pages =
    Math.ceil(
      first.totalEntities / 1000
    );

  for (let page = 0; page < pages; page++) {

    const start = page * 1000;

    console.log(
      `Retirements page ${page + 1}/${pages}`
    );

    const data =
      page === 0
        ? first
        : await fetchPage(
            url,
            "retiredDate",
            start
          );

    const rows =
      data.entities.map(r => ({
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

    const { error } =
      await supabase
        .from("retirements")
        .upsert(rows);

    if (error) throw error;
  }
}

async function main() {

  console.log("START");

  await loadProjects();
  await loadIssuances();
  await loadRetirements();

  console.log("FINISHED");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
