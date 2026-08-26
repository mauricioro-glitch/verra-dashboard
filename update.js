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

async function test(start) {

  const payload = {
    searchFilter: {
      pagination: {
        start,
        limit: 1,
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

  const response = await fetch(
    "https://prod-us.api.platts.com/ci-raas-prod/raas-report-api/es/public/retirements/publicReportPageSearch",
    {
      method: "POST",
      headers: {
        ...HEADERS,
        "x-request-id": crypto.randomUUID()
      },
      body: JSON.stringify(payload)
    }
  );

  const data = await response.json();

  console.log(
    "START",
    start,
    "=>",
    data.entities?.[0]?.id,
    data.entities?.[0]?.retiredDate
  );
}

await test(0);
await test(1000);
await test(5000);
await test(10000);
await test(20000);
await test(50000);
await test(100000);
