import crypto from "crypto";

const URL =
  "https://prod-us.api.platts.com/ci-raas-prod/raas-report-api/es/public/project/publicReportPageSearch";

async function fetchPage(start = 0, limit = 1) {

  const payload = {
    searchFilter: {
      pagination: {
        start,
        limit,
        sortOptions: [
          {
            sort: "projectName.keyword",
            dir: "ASC"
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

  const json = await response.json();

  console.log("STATUS:", response.status);
  console.log("TOP LEVEL KEYS:");
  console.log(Object.keys(json));

  console.log("FIRST RECORD:");
  console.log(
    JSON.stringify(
      json.entities?.[0] || json.content?.[0] || json,
      null,
      2
    ).substring(0, 15000)
  );
}

fetchPage();
