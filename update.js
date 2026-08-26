import crypto from "crypto";

const URLS = {
  projects:
    "https://prod-us.api.platts.com/ci-raas-prod/raas-report-api/es/public/project/publicReportPageSearch",

  issuances:
    "https://prod-us.api.platts.com/ci-raas-prod/raas-report-api/es/public/issuances/publicReportPageSearch",

  retirements:
    "https://prod-us.api.platts.com/ci-raas-prod/raas-report-api/es/public/retirements/publicReportPageSearch"
};

async function test(url, sortField) {

  const payload = {
    searchFilter: {
      pagination: {
        start: 0,
        limit: 1,
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

  return {
    totalEntities: json.totalEntities,
    totalPages: json.totalPages,
    limit: json.limit
  };
}

console.log(
  "PROJECTS",
  await test(URLS.projects, "projectName.keyword")
);

console.log(
  "ISSUANCES",
  await test(URLS.issuances, "issueDate")
);

console.log(
  "RETIREMENTS",
  await test(URLS.retirements, "retiredDate")
);
