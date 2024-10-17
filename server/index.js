/** @format */

require("dotenv").config({ path: ".env" });
const { playSound, changeVolume } = require("./soundHelper.js");
const hubspot = require("@hubspot/api-client");
const hubspotClient = new hubspot.Client({ accessToken: process.env.access_token });
let last_time_checked;

async function getRecent() {
    const searchCriteria = {
        filterGroups: [
            {
                filters: [
                    {
                        propertyName: "hs_lastmodifieddate",
                        operator: "GTE",
                        value: last_time_checked,
                    },
                ],
            },
        ],
        sorts: [
            {
                propertyName: "hs_lastmodifieddate",
                direction: "DESCENDING",
            },
        ],
        properties: ["amount", "hs_lastmodifieddate"],
    };

    return await hubspotClient
        .apiRequest({
            method: "POST",
            path: `/crm/v3/objects/deals/search`,
            body: searchCriteria,
        })
        .then((res) => {
            last_time_checked = new Date().toISOString();
            return res.json();
        });
}

async function main() {
    if (!last_time_checked) {
        last_time_checked = new Date().toISOString();
    }
    // most_recent_id = await getRecent(1);
    // console.log(most_recent_id.results[0].id);

    const response = await getRecent();
    console.log(response.results, response.results.length);
    console.log(last_time_checked);
}

main();
