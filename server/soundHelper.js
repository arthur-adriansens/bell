/** @format */

require("dotenv").config({ path: ".env" });
const fs = require("fs");
const loudness = require("loudness");
const { exec } = require("child_process");

function changeVolume(percentage) {
    loudness.setVolume(Number(percentage));
}

async function requestVolume() {
    return await loudness.getVolume();
}

function playSound(soundName = "new_client") {
    const sounds = fs.readdirSync("public/sounds");
    if (!sounds.length || sounds.length == 0) return;
    // console.log(`public/sounds/${soundName}.mp3`);

    exec(`vlc public/sounds/${soundName}.mp3 vlc://quit`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`played public/sounds/${soundName}.mp3`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}

module.exports = { playSound, changeVolume, requestVolume };
