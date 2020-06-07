<p align"center">
  <h1 align="center"><b>NoodleBot</b></h1>
  <p align="center"><a href="#"><img src="images/noodle.png" width="200"></a></p>
  <h3 align="center">A Simple Discord Bot</h3>
  <p align="center">A bot with code written as noodly as it's name</p>
</p>


## About The Bot
---
### Features
- Audio streaming from YouTube straight to server voice channels
- Integration with `youtube-search` through the YouTube-Data-API
- Points system based around the noodle currency
- Integrated with MongoDB databases to ensure continuity for users between servers

### In Progress
- Additional features for currency
- Moderation features (e.g. role management, kicks, bans, softbans, etc)

### Built With
- [MongoDB](https://www.mongodb.com/)
- [NodeJS](https://nodejs.org/en/)
- [Discord.js](https://discord.js.org/#/)
- [Axios](https://github.com/axios/axios)
- [node-ytdl-core](https://github.com/fent/node-ytdl-core)
- [ytsr](https://github.com/TimeForANinja/node-ytsr)

## Usage
---
### Commands
The current prefix is a hyphen ("-")

#### General
- <b>ping</b>: responds with 'pong' (why would you use this?)
- <b>server</b>: returns an embed message showing basic server info

#### Audio
- <b>join</b>: joins the voice-channel the user is present in
- <b>leave</b>: leaves the voice channel
- <b>np</b>: returns an embed message of the currently playing audio
- <b>play [url/search]</b>: adds the YouTube audio to the queue
- <b>queue</b>: returns an embed message showing the audio queue
- <b>skip</b>: skips the current audio and plays from the queue

#### Currency
- <b>mynoodles</b>: returns an embed message showing the user's currency info
- <b>deposit</b>: deposits currency into the user's bank
- <b>withdraw</b>: withdraws currency from the user's bank
- <b>gamble [amount]</b>: double or nothing of the specified amount
- <b>invest [amount]</b>: random multiplier returns the result of {amount * multiplier}
- <b>steal [@user]</b>: steals currency from the specified user
- <b>give [@user] [amount]</b>: gives the an amount to the specified user

## Getting Started
---
### Set-Up
1. In `config/keys.js` fill in each API key with your own unique key from Discord, MongoDB, and Google:
```JS
module.exports = {
  mongoose_key: 'Your MongoDB API key here',
  discord_key: 'Your Discord bot key here',
  youtube_api_key: 'Your Google API key here'
}
```
###### The Youtube API key is no longer needed after switching to `node-ytsr`
2. Install NPM packages / node_modules:
```sh
npm init
```
3. To start up the bot, run by in the terminal with:
```sh
node bot.js
```
4. Pray that it doesn't crash...
