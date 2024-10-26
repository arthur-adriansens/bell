/** @format */

require("./server.js");
require("dotenv").config({ path: ".env" });
const { playSound, changeVolume } = require("./soundHelper.js");
const cron = require("node-cron");
const hubspot = require("@hubspot/api-client");
const hubspotClient = new hubspot.Client({ accessToken: process.env.access_token });
let last_time_checked = new Date().toISOString();

async function getRecent(custom_date) {
    const searchCriteria = {
        filterGroups: [
            {
                filters: [
                    {
                        propertyName: "hs_lastmodifieddate",
                        operator: "GTE",
                        value: custom_date || last_time_checked,
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
    const response = await getRecent();

    if (response.total > 0) {
        for (let i in response?.results) {
            console.log(response.results[i].id);
            const check = await check_deal(response.results[i].id);
            if (check) playSound();
        }
    }

    last_time_checked = new Date().toISOString();
    // console.log(response.total, response.results?.length, response.results);
}

async function check_deal(id) {
    return await hubspotClient
        .apiRequest({
            method: "GET",
            path: `/crm/v3/objects/deals/${id}`,
        })
        .then(async (res) => {
            const result = await res.json();
            // console.log(result.properties?.dealstage);
            return result.properties?.dealstage == "closedwon";
        });
}

cron.schedule("* * * * *", main);
