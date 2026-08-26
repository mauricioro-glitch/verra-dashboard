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

  console.log("");
  console.log("START =", start);

  data.entities.forEach(r => {
    console.log(
      r.id,
      r.retiredDate
    );
  });
}

await test(0);
await test(5);
await test(10);
await test(15);
