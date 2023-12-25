/** @format */

require("dotenv").config({ path: ".env" });
const Imap = require("imap");
const MailParser = require("mailparser").MailParser;
const fs = require("fs");

function addSound(uid) {
    const imap = new Imap({
        user: process.env.email,
        password: process.env.password,
        host: "outlook.office365.com",
        port: 993,
        tls: true,
    });

    // let uid = 88;
    let mailbox = "INBOX";

    imap.once("ready", function () {
        imap.openBox(mailbox, false, function (err, box) {
            if (err) throw err;
            console.log("opened mailbox");

            let fetched = imap.fetch(uid, { bodies: "" });
            if (err) throw err;

            fetched.on("message", function (msg, seqno) {
                let mailparser = new MailParser();
                console.log(`   Message #${seqno}`);
                var prefix = "(#" + seqno + ")";

                mailparser.on("data", function (data) {
                    if (data.type === "attachment") {
                        console.log(`       ${prefix} Attributes`);
                        let writeStream = fs.createWriteStream(`sounds/sound-${seqno}.mp3`);
                        data.content.pipe(writeStream);
                    }
                    if (data.type === "text") {
                        (async () => {
                            return data.text;
                        })();
                    }
                });

                msg.on("body", function (stream, info) {
                    console.log(`       ${prefix} Body`);
                    stream.pipe(mailparser);
                    // stream.pipe(fs.createWriteStream(`sounds/msg-${seqno}-body.txt`));
                });

                msg.on("end", function () {
                    console.log(`       ${prefix} finished`);
                });
            });
            fetched.once("error", function (err) {
                console.log(`   fetch error: ${err}`);
                return false;
            });
            fetched.once("end", function () {
                imap.end();
            });
        });
    });

    imap.on("error", (err) => {
        console.error(err);
        return false;
    });

    imap.on("end", () => {
        console.log("ended imap connection");
        return true;
    });

    imap.connect();
}

function deleteSounds() {
    fs.readdir("sounds", (err, files) => {
        if (err) throw err;

        for (let file of files) {
            fs.unlink(`sounds/${file}`, (err) => {
                if (err) throw err;
            });
        }
    });
}

module.exports = {
    addSound,
    deleteSounds,
};
