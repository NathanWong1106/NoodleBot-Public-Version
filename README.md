<p align"center">
  <h1 align="center"><b>NoodleBot</b></h1>
  <p align="center"><a href="#"><img src="images/noodle.png" width="200"></a></p>
  <h3 align="center">A Simple Discord Bot Hosted on Heroku</h3>
  <p align="center">A bot with code written as noodly as its name</p>
  <p align="center"><a href = "https://discordapp.com/oauth2/authorize?client_id=679532777221128213&scope=bot&permissions=8">Invite the Bot Here!</a></p>
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
- [youtube-search](https://github.com/MaxGfeller/youtube-search)

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
- <b>give [@user] [amount]</b>: gives the amount to the specified user

#### Moderation
- <b>addDefaultRole [@role]</b>: adds a default role that is applied on 'member-join' to the guild
- <b>removeDefaultRole [@role]</b>: removes the specified default role
- <b>defaultRoles</b>: lists the current default roles of the guild
- <b>purge [amount]</b>: purges the specified amount of messages from the channel


## Getting Started
---
### Cloning
- Clone this repository using the cloning button provided or by using the following line in Command Prompt:
```sh
git clone https://github.com/NathanWong1106/NoodleBot-Public-Version.git
```

### Set-Up
1. In `config/keys.js` fill in each API key with your own unique key from Discord, MongoDB, and Google:
```JS
module.exports = {
  mongoose_key: 'Your MongoDB API key here',
  discord_key: 'Your Discord bot key here',
  youtube_api_key: 'Your Google API key here'
}
```
2. Install NPM packages / node_modules:
```sh
npm init
```
3. To start up the bot, run the following in the terminal:
```sh
node bot.js
```
4. Pray that it doesn't crash...



###### NOTE: This is a public version of a private repository. Features are not up to date and are prone to bugs.
