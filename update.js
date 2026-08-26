import crypto from "crypto";

const URL =
  "https://prod-us.api.platts.com/ci-raas-prod/raas-report-api/es/public/retirements/publicReportPageSearch";

async function test(limit) {

  const payload = {
    searchFilter: {
      pagination: {
        start: 0,
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

  const json = await response.json();

  console.log(
    `LIMIT ${limit}: returned ${json.numberOfElements}`
  );
}

await test(50);
await test(100);
await test(250);
await test(500);
await test(1000);
