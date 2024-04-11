<!-- @format -->

# bell

## discription

A bell that rings when a new client is created, powered by Microsoft Forms and a Raspberry pi. Checks for mails every 3-5 minutes.

## install

make sure u use node v20 and that git is installed:

`sudo apt-get update && sudo apt install git-all`

`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash && exit`

`nvm install 20.10.0 && nvm use 20.10.0`

`git clone https://github.com/arthur-adriansens/bell && cd bell`

`npm install && npm install pm2 -g && sudo apt-get install vlc` (for windows, see: https://www.videolan.org/vlc/download-windows.html)

`npm run start`

don't forget to edit the .env file

on startup:
`pm2 startup && pm2 save` (copy and execute the given command, remove with "pm2 unstartup systemd")

to download a song from YouTube, run the server/youtube.js file (change the url in the file first)

## testing

`npm run test` (= `pm2 monit`)

## update (!= install)

if local changes: `git stash && git stash drop`
update: `git pull --rebase origin main && npm install`

## explanation
The body of the mail can **never be empty**! The email will be skipped if the body is empty (I don't know why). The email address is "arthur.test2@outlook.com".

| email subject                    | explantation                                                                                 | example                  |
|----------------------------------|----------------------------------------------------------------------------------------------|--------------------------|
| bell random                      | Plays one of the sounds randomly.                                                            | /                        |
| bell "type"                      | Plays the "type" sound. The 3 types are: "new_client", "actived_client" and "churned_client". | bell new_client          |
| change volume "new volume level" | Changes the volume to "new volume level"%. Max value is 100.                                 | change volume 20         |
| update                           | Updates the Raspberry Pi with new changes in this GitHub repo.                               | /                        |
| add "type"                 | Adds a new sound. Place the **mp3** in the attachment of the mail. The 3 types are: "new_client", "actived_client" and "churned_client".                                | add actived_client |

If the sound is not load enough, please visit:
https://www.mp3louder.com/
