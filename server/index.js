/** @format */
const fs = require("fs");
const loudness = require("loudness");
const { exec } = require("child_process");
require("dotenv").config({ path: ".env" });
const { addSound, deleteSounds } = require("./addSound.js");

import express from "express";

//import routes from './routes';

const server = express();
server.use(express.json());

app.post("", (req, res) => {});

if (message.title == "bell random") {
    console.log("ringgg random...");
    playSound();
} else if (message.title.includes("bell")) {
    const type = message.title.split("bell ")[1];
    console.log(`ringgg ${type}...`);
    if (type) {
        playSound(`${type}.mp3`);
    }
}

if (message.title.includes("add")) {
    const type = message.title.split("add ")[1];
    console.log(`adding sound with type ${type}...`);
    addSound(message.UID, `${type}.mp3`, client);
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

function playSound(soundPath) {
    const sounds = fs.readdirSync("sounds");
    if (!sounds.length || sounds.length == 0) return;
    let sound = soundPath ?? sounds[Math.floor(Math.random() * sounds.length)];
    //let formattedSound = sound.replace(/\s/g, "_");
    console.log(`sounds/${sound}`);

    exec(`vlc sounds/${sound} vlc://quit`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`played sounds/${sound}`);
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

    exec("git pull && npm install && sudo reboot", (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}
