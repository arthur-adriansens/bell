/** @format */

// Setup express
require("dotenv").config({ path: ".env" });
const { playSound, changeVolume, requestVolume } = require("./soundHelper.js");
const { exec } = require("child_process");
const port = process.env.PORT || 3000;
const path = require("path");
const express = require("express");
const app = express();

// Setup multer
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/sounds/");
    },
    filename: (req, file, cb) => {
        cb(null, "new_client.mp3");
    },
});
const upload = multer({ storage: storage });

// Setup handlebars
const { engine } = require("express-handlebars");
app.engine("handlebars", engine({ defaultLayout: false }));
app.set("view engine", "handlebars");
app.set("views", __dirname);

// Helper function to promisify exec
function execPromise(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`exec error: ${error}`);
                return;
            }
            resolve(stdout);
        });
    });
}

// Routes
//! TODO
app.use("/public", express.static(path.join(__dirname, "../public")));

app.get("/", async (req, res) => {
    const temp_output = await execPromise("vcgencmd measure_temp").catch(() => "Temperature not available");
    const temp = temp_output.replace("temp=", "").replace("'", "°");
    const volume = await requestVolume().catch(() => 50);
    const up = await execPromise("uptime -p").catch(() => "Uptime not available");

    const helpers = {
        temperature: temp,
        tempColor: temp < 60 ? "green" : temp < 75 ? "orange" : "red",
        volumeLevel: volume,
        volumeLevelRight: 100 - volume,
        uptime: up.charAt(0).toUpperCase() + up.slice(1),
    };
    res.render("index", helpers);
});

app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.body) {
        return res.status(400).send("No image data received.");
    }

    console.log(req.file);
    res.status(200)
        .json({ message: "File uploaded successfully!" })
        .json(req.file)
        .catch((e) => console.log(e));
});

app.get("/update", (req, res) => {
    console.log("updating...");

    exec("cd /home/pi/bell && git fetch origin && git reset --hard origin/main && npm install && sudo reboot", (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(400).send(error);
        }

        console.log(`stdout: ${stdout}`);
        return res.status(200).send("Updating!");
    });
});

app.get("/shutdown", (req, res) => {
    console.log("shutting down...");

    exec("sudo shutdown now", (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(400).send(error);
        }

        console.log(`stdout: ${stdout}`);
        return res.status(200).send("Shutting down!");
    });
});

app.get("/volume", async (req, res) => {
    changeVolume(req.query.volume);
    console.log("volume:", req.query.volume);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
