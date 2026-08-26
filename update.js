import crypto from "crypto";

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

const URL =
  "https://prod-us.api.platts.com/ci-raas-prod/raas-report-api/es/public/retirements/publicReportPageSearch";

async function getPage(searchAfter = null, pitId = null) {

  const payload = {
    searchFilter: {
      pagination: {
        limit: 5,
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

  if (searchAfter) {
    payload.searchFilter.pagination.searchAfter =
      searchAfter;
  }

  if (pitId) {
    payload.searchFilter.pagination.pitId =
      pitId;
  }

  const response = await fetch(
    URL,
    {
      method: "POST",
      headers: {
        ...HEADERS,
        "x-request-id": crypto.randomUUID()
      },
      body: JSON.stringify(payload)
    }
  );

  return await response.json();
}

console.log("PAGE 1");

const page1 =
  await getPage();

page1.entities.forEach(r =>
  console.log(r.id, r.retiredDate)
);

console.log("");
console.log("searchAfter:");
console.log(page1.searchAfter);

console.log("");
console.log("pitId:");
console.log(page1.pitId);

console.log("");
console.log("PAGE 2");

const page2 =
  await getPage(
    page1.searchAfter,
    page1.pitId
  );

page2.entities.forEach(r =>
  console.log(r.id, r.retiredDate)
);
