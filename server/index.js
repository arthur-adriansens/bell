/** @format */

require("dotenv").config({ path: ".env" });
const hubspot = require("@hubspot/api-client");
const hubspotClient = new hubspot.Client({ accessToken: process.env.access_token, developerApiKey: process.env.api_key });

async function main() {
    const response = await hubspotClient.apiRequest({
        method: "GET",
        path: "/crm/v3/objects/contacts",
    });
    const json = await response.json();
    console.log(json);
}

main();
