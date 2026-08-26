import crypto from "crypto";

const RETIREMENTS_URL =
  "https://prod-us.api.platts.com/ci-raas-prod/raas-report-api/es/public/retirements/publicReportPageSearch";

async function fetchRetirements(start = 0, limit = 50) {
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

  const response = await fetch(RETIREMENTS_URL, {
    method: "POST",
    headers: {
      "accept": "application/json",
      "content-type": "application/json",

      "appkey": "wOKHFGuxKApQaujPSKgF",
      "application": "Markit",
      "language": "en",
      "registry": "VERRA",
      "standardacronym": "VCS",
      "standardid": "150000000000001",
      "x-xsrf-token": "t20",
      "x-request-id": crypto.randomUUID(),

      "origin": "https://registry.verra.org",
      "referer": "https://registry.verra.org/"
    },
    body: JSON.stringify(payload)
  });

  console.log("STATUS:", response.status);

  const text = await response.text();

  console.log("FIRST 5000 CHARS:");
  console.log(text.substring(0, 5000));

  try {
    const json = JSON.parse(text);

    console.log("TOP LEVEL KEYS:");
    console.log(Object.keys(json));

    if (Array.isArray(json)) {
      console.log("ARRAY LENGTH:", json.length);
    }
  } catch (e) {
    console.log("Response is not JSON");
  }
}

async function main() {
  console.log("Starting Verra API test...");
  await fetchRetirements();
  console.log("Finished.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
