const RETIREMENTS_URL =
  "https://prod-us.api.platts.com/ci-raas-prod/raas-report-api/es/public/retirements/publicReportPageSearch";

async function main() {

  const payload = {
    searchFilter: {
      pagination: {
        start: 0,
        limit: 50,
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
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  console.log("STATUS:", response.status);

  const json = await response.json();

  console.log("TOP LEVEL KEYS:");
  console.log(Object.keys(json));

  console.log("FIRST 3000 CHARS:");
  console.log(JSON.stringify(json, null, 2).substring(0, 3000));
}

main().catch(console.error);
