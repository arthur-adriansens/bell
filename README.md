<!-- @format -->

# bell

## discription

A bell that rings when a new client is created, powered by Microsoft Forms and the Raspberry pi 4.

## install

make sure u use node v20 and that git is installed:
`sudo apt-get update && sudo apt install git-all`
`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash && exit`
`nvm install 20.10.0 && nvm use 20.10.0`

`git clone https://github.com/arthur-adriansens/bell && cd bell`

`npm install && npm install pm2 -g`
`npm run start`

don't forget to edit the .env file

on startup:
`pm2 startup && pm2 save`

## testing

`npm run test` (= `pm2 monit`)
