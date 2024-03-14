/** @format */
const fs = require("fs");
const loudness = require("loudness");
const inbox = require("inbox");
const cron = require("node-cron");
const { exec } = require("child_process");
require("dotenv").config({ path: ".env" });
const { addSound, deleteSounds } = require("./addSound.js");
//(test change))
cron.schedule("*/1 * * * *", () => {
    const client = inbox.createConnection(false, "outlook.office365.com", {
        secureConnection: true,
        auth: {
            user: process.env.email,
            pass: process.env.app_password,
        },
        port: 993,
    });

    client.on("connect", () => {
        console.log("Successfully connected to server:");

        client.openMailbox("INBOX", (error, info) => {
            if (error) throw error;
            console.log("   message count in INBOX: " + info.count);

            client.listMessages(0, async (err, messages) => {
                await messages.forEach(async (message) => {
                    console.log(message.UID + ": " + message.title);
                    await handleMessage(message);
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

    function deleteMail(uid, title = "message") {
        client.deleteMessage(uid, (err) => {
            if (err) throw err;
            console.log(`deleted "${title}"`);
        });
    }

    async function handleMessage(message) {
        if (message.title == "bell random") {
            console.log("ringgg random...");
            await playSound();
        } else if (message.title.includes("bell")) {
            const type = message.title.split("bell ")[1];
            console.log(`ringgg ${type}...`);
            if (!type) {
                await playSound(`${type}.mp3`);
            }
        }

        if (message.title.includes("add")) {
            const type = message.title.split("add ")[1];
            console.log(`adding sound with type ${type}...`);
            await addSound(message.UID, `${type}.mp3`);
        }

        // if (message.title == "deleteAllSound123") {
        //     console.log("deleting sound...");
        //     deleteSounds(message.UID);
        // }

        if (message.title.includes("change volume")) {
            console.log("changing volume...");
            changeVolume(message.title);
        }

        if (message.title == "update") {
            update();
        }
    }

    async function playSound(soundType) {
        const sounds = fs.readdirSync("sounds");
        if (!sounds.length || sounds.length == 0) return;
        let randomSound = soundType ?? sounds[Math.floor(Math.random() * sounds.length)];
        //let formattedSound = randomSound.replace(/\s/g, "_");
        //console.log(`sounds/${formattedSound}`);

        exec(`vlc sounds/${randomSound} vlc://quit`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`played sounds/${randomSound}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
    }

    function changeVolume(title) {
        let volume = title.split("change volume")[1];

        if (!isNaN(volume)) {
            loudness.setVolume(Number(volume));
        }
    }

    function update() {
        console.log("updating...");

        exec("git stash && git pull --rebase origin main && git stash pop && npm install && sudo reboot", (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
    }
});
