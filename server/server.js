/** @format */

// Setup express
require("dotenv").config({ path: ".env" });
const port = process.env.PORT || 3000;
const path = require("path");
const express = require("express");
const app = express();

// Setup multer
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "sounds/");
    },
    filename: (req, file, cb) => {
        cb(null, "new_client.mp3");
    },
});
const upload = multer({ storage: storage });

// Routes
app.use("/", express.static(path.join(__dirname, "../public")));
app.use("/sound", express.static(path.join(__dirname, "../sound")));

app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.body) {
        return res.status(400).send("No image data received.");
    }

    console.log(req.file);
    res.status(200).json({ message: "File uploaded successfully!" }).json(req.file);
});

app.post("/update", (req, res) => {
    console.log("updating...");

    exec("cd /home/pi/bell && git fetch origin && git reset --hard origin/main && npm install && sudo reboot", (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(400).send(error);
        }
        console.log(`stdout: ${stdout}`);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
