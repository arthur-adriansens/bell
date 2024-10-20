/** @format */

require("./server.js");
require("dotenv").config({ path: ".env" });
const { playSound, changeVolume } = require("./soundHelper.js");
const cron = require("node-cron");
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
                        value: last_time_checked || new Date().toISOString(),
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
            return res.json();
        });
}

async function main() {
    // most_recent_id = await getRecent(1);
    // console.log(most_recent_id.results[0].id);

    const response = await getRecent();
    if (response.total > 0 && response[0]?.id) {
        const check = await check_deal(response[0]?.id);
        if (check) {
            playSound();
        }
    }
    last_time_checked = new Date().toISOString();
    console.log(response.total, response.results);
}

async function check_deal(id) {
    return await hubspotClient
        .apiRequest({
            method: "GET",
            path: `/crm/v3/objects/deals/${id}`,
        })
        .then(async (res) => {
            const result = await res.json();
            return result.properties.dealstage == "closedwon";
        });
}

cron.schedule("* * * * *", main);
