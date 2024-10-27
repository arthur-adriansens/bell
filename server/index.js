/** @format */

require("./server.js");
require("dotenv").config({ path: ".env" });
const { playSound, changeVolume } = require("./soundHelper.js");
const cron = require("node-cron");
const hubspot = require("@hubspot/api-client");
const hubspotClient = new hubspot.Client({ accessToken: process.env.access_token });
let last_time_checked = new Date().toISOString();

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
            return res.json();
        });
}

async function main() {
    // last_time_checked = "2024-08-10T16:42:59.535Z"; // custom test date (max 10 though...)
    const response = await getRecent();

    if (response.total > 0) {
        for (let i in response?.results) {
            console.log(response.results[i].id);
            const check = await check_deal(response.results[i].id);
            if (check) {
                playSound();
                break;
            }
        }
    }

    last_time_checked = new Date().toISOString();
    console.log(response.total, response.results?.length, response.results);
}

async function check_deal(id) {
    return await hubspotClient
        .apiRequest({
            method: "GET",
            path: `/crm/v3/objects/deals/${id}`,
        })
        .then(async (res) => {
            const result = await res.json();

            const closed_date = new Date(result.properties?.closedate).valueOf();
            const last_time_checked_date = new Date(last_time_checked).valueOf();
            // console.log(closed_date, last_time_checked_date, closed_date > last_time_checked_date);

            return result.properties?.dealstage == "closedwon" && closed_date >= last_time_checked_date;
        });
}

cron.schedule("* * * * *", main);
