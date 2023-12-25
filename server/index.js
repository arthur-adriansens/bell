/** @format */

const fs = require("fs");
const player = require("play-sound")((opts = {}));
const loudness = require("loudness");
const inbox = require("inbox");
const cron = require("node-cron");
require("dotenv").config({ path: ".env" });
const { addSound, deleteSounds } = require("./addSound.js");

console.log("hi");

cron.schedule("*/5 * * * *", () => {
    const client = inbox.createConnection(false, "outlook.office365.com", {
        secureConnection: true,
        auth: {
            user: process.env.email,
            pass: process.env.password,
        },
    });

    client.on("connect", () => {
        console.log("Successfully connected to server:");

        client.openMailbox("INBOX", (error, info) => {
            if (error) throw error;
            console.log("   message count in INBOX: " + info.count);

            client.listMessages(0, (err, messages) => {
                messages.forEach((message) => {
                    console.log(message.UID + ": " + message.title);
                    handleMessage(message);
                    deleteMail(message.UID, message.title);
                });

                client.close();
            });
        });
    });

    client.on("close", () => {
        console.log("Successfully disconnected!");
    });

    client.connect();
});

function deleteMail(uid, title = "message") {
    client.deleteMessage(uid, (err) => {
        if (err) throw err;
        console.log(`deleted "${title}"`);
    });
}

function handleMessage(message) {
    if (message.title == "bell123") {
        console.log("ringgg...");
        playSound();
    }

    if (message.title == "addSound123") {
        console.log("adding sound...");
        addSound(message.UID);
    }

    if (message.title == "deleteAllSound123") {
        console.log("deleting sound...");
        deleteSounds(message.UID);
    }

    if (message.title.includes("volumeChange123")) {
        console.log("changing volume...");
        changeVolume(message.title);
    }

    console.log(message.UID);
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

function changeVolume(title) {
    let volume = title.split("volumeChange123")[1];

    if (!isNaN(volume)) {
        loudness.setVolume(Number(volume));
    }
}
