/** @format */

const fs = require("fs");
const player = require("play-sound");
const inbox = require("inbox");
const cron = require("node-cron");
require("dotenv").config({ path: ".env" });

cron.schedule("*/3-5 * * * *", () => {
    const client = inbox.createConnection(false, "outlook.office365.com", {
        secureConnection: true,
        auth: {
            user: process.env.email,
            pass: process.env.password,
        },
    });

    client.connect();

    client.on("connect", () => {
        console.log("Successfully connected to server:");

        client.openMailbox("INBOX", (error, info) => {
            if (error) throw error;
            console.log("   message count in INBOX: " + info.count);

            client.listMessages(0, (err, messages) => {
                messages.forEach((message) => {
                    console.log(message.UID + ": " + message.title);
                    handleMessage(message);
                });
            });
        });

        client.close();
    });

    client.on("close", () => {
        console.log("Successfully disconnected!");
    });
});

function handleMessage(message) {
    if (message.title == "bell123") {
        console.log("ringgg");

        client.deleteMessage(message.UID, (err) => {
            if (err) throw err;
            console.log(`deleted "${message.title}"`);
        });
    } else {
        client.deleteMessage(message.UID, (err) => {
            if (err) throw err;
            console.log(`deleted ${message.title}`);
        });
    }
}

function playSound() {
    const sounds = fs.readdirSync("../sounds");
    console.log(sounds);

    player.play("path/to/audio/file.mp3", function (err) {
        if (err) throw err;
    });
}
