<!-- @format -->

# bell

## discription

A bell that rings when a new client is created, powered by the Hupspot API and a Raspberry pi 4 or zero 2W. Checks for deals every minute. Access the dashboard at raspberrypi.local:3000, here you can change the volume, upload new songs and more.

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

You can update new changes by clicking the update button on the dashboard (raspberrypi.local:3000), or you can do it manually:

Run if local changes: `git stash && git stash drop`
Update: `git pull --rebase origin main && npm install`

## explanation

Make sure the .env file has a access_token and a PORT.

Everything can be done through the awesome dashboard at raspberrypi.local:3000!

If the sound is not load enough, please visit:
https://www.mp3louder.com/
