<!-- @format -->

# bell

## discription

A bell that rings when a new client is created, powered by Microsoft Forms and the Raspberry pi 4. Checks for mails every 3-5 minutes.

## install

make sure u use node v20 and that git is installed:

`sudo apt-get update && sudo apt install git-all`

`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash && exit`

`nvm install 20.10.0 && nvm use 20.10.0`

`git clone https://github.com/arthur-adriansens/bell && cd bell`

`npm install && npm install pm2 -g && sudo apt-get install vlc` (for windows, see: https://www.videolan.org/vlc/download-windows.html)

`npm run start`

don't forget to edit the .env file

on startup:
`pm2 startup && pm2 save`

to download a song from YouTube, run the server/youtube.js file (change the url in the file first)

## testing

`npm run test` (= `pm2 monit`)

## update (!= install)

`git fetch origin && npm install`

## explanation (Dutch)

Het onderwerp moet bell123 zijn om af te spelen (het is een filter voor de mail parser), body mag niet leeg zijn, maakt niet uit wat er in body staat.

Voor nieuwe liedjes kunt u een mail sturen naar arthur.test2@outlook.com met als onderwerp addSound123 en een mp3 als attachment (de body mag niet leeg zijn).

Om alle liedjes te wissen kunt u een mail sturen naar arthur.test2@outlook.com met als onderwerp deleteAllSound123 (de body mag niet leeg zijn).

Om het volume te wissen kunt u een mail sturen naar arthur.test2@outlook.com met als onderwerp volumeChange123 en dan nog steeds in het onderwerp van de mail het volume (tussen 0 en 100, zonder percentage) na "volumeChange123 (de body mag niet leeg zijn).

Update met onderwerp update123 en iets in de body.
