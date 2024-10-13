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
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({ storage: storage });

// Routes
app.use("/", express.static(path.join(__dirname, "../public")));

app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.body) {
        return res.status(400).send("No image data received.");
    }

    console.log(req.file);
    res.status(200).json({ message: "File uploaded successfully!" }).json(req.file);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
