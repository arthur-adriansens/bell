/** @format */

require("dotenv").config({ path: ".env" });
const fs = require("fs");
const loudness = require("loudness");
const { exec } = require("child_process");

function changeVolume(percentage) {
    loudness.setVolume(Number(percentage));
}

function playSound(soundPath = "new_client.mp3") {
    const sounds = fs.readdirSync("sounds");
    if (!sounds.length || sounds.length == 0) return;
    console.log(`sounds/${soundPath}`);

    exec(`vlc sounds/${soundPath} vlc://quit`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`played sounds/${soundPath}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}
async function test() {
    playSound();
}
test();

module.exports = { playSound, changeVolume };
