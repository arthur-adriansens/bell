/** @format */

const fs = require("fs");
const player = require("play-sound")((opts = {}));
const inbox = require("inbox");
const cron = require("node-cron");
require("dotenv").config({ path: ".env" });
const { addSound } = require("./addSound.js");

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

                client.close();
            });
        });
    });

    client.on("close", () => {
        console.log("Successfully disconnected!");
    });
});

function deleteMail(uid) {
    client.deleteMessage(uid, (err) => {
        if (err) throw err;
        console.log(`deleted "${message.title}"`);
    });
}

function handleMessage(message) {
    if (message.title == "bell123") {
        console.log("ringgg");
        playSound();

        deleteMail(message.UID);
        return;
    }

    if (message.title == "addSound123") {
        console.log("adding sound...");
        addSound(message.UID, client);
        return;
    }

    console.log(message.UID);
    deleteMail(message.UID);
}

function playSound() {
    const sounds = fs.readdirSync("sounds");
    if (!sounds.length || sounds.length == 0) return;
    let randomSound = sounds[Math.floor(Math.random() * sounds.length)];
    console.log(randomSound, `sounds/${randomSound}`);

    player.play(`sounds/${randomSound}`, function (err) {
        if (err) throw err;
    });
}
