import crypto from "crypto";

const URL =
  "https://prod-us.api.platts.com/ci-raas-prod/raas-report-api/es/public/retirements/publicReportPageSearch";

async function fetchPage(start = 0, limit = 50) {
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

  return await response.json();
}

const result = await fetchPage();

console.log("TOTAL ENTITIES:", result.totalEntities);
console.log("TOTAL PAGES:", result.totalPages);
console.log("LIMIT:", result.limit);
console.log("NUMBER OF ELEMENTS:", result.numberOfElements);
