/** @format */

// Setup express
require("dotenv").config({ path: ".env" });
const { playSound, changeVolume } = require("./soundHelper.js");
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

// Routes
//! TODO
app.use("/public", express.static(path.join(__dirname, "../public")));

app.get("/", async (req, res) => {
    const temp = await exec("vcgencmd measure_temp", (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return "Temperature not available";
        }
        return stdout.replace("temp=", "").replace("'", "°");
    });
    console.log(temp);
    const helpers = {
        temperature: temp,
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
    });

    return res.status(200).send("Updating!");
});

app.get("/volume", async (req, res) => {
    changeVolume(req.query.volume);
    console.log("volume:", req.query.volume);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
