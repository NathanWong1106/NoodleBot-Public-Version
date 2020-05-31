<p align"center">
  <h1 align="center"><b>NoodleBot</b></h1>
  <p align="center"><a href="#"><img src="images/noodle.png" width="200"></a></p>
  <h3 align="center">A Simple Discord Bot</h3>
  <p align="center">A bot with code written as noodly as it's name</p>
</p>

## Invite The Bot
The NoodleBot is currently being hosted on Heroku. If you don't want to set up the bot yourself, you can use this <a href =  "https://discordapp.com/oauth2/authorize?client_id=679532777221128213&scope=bot&permissions=8">link</a> to invite NoodleBot to your server!
###### Disclaimer: NoodleBot will require administrator priviledges for planned auto-mod features to be implemented in the future
###### Important: Make sure the NoodleBot Role is above all other roles on your channel in order for default roles to work!
## About The Bot
---
### Features
- Audio streaming from YouTube straight to server voice channels
- Integration with `youtube-search` through the YouTube-Data-API
- Points system based around the noodle currency
- Integrated with MongoDB databases (data carries over from different servers)

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
- <b>help</b>: links to this README (proper documentation for commands will be written in the future)
- <b>server</b>: returns an embed message showing basic server info
- <b>covid [country name/tag]</b>: returns an embed message showing the developments of COVID-19 in the specified country

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

#### Fun
- <b>meme</b>: returns a random post from r/dankmemes (250+ updoots)
- <b>r [subredditName]</b>: returns a random post from the specified subreddit (250+ updoots)
- <b>gif [search]</b>: returns an embed message with the gif from GIPHY
- <b>chuck</b>: spits out a random funny Chuck Norris fact (definitely not fake)

#### Moderation
- <b>addDefaultRole [@role]</b>: adds a default role that is applied on 'member-join' to the guild
- <b>removeDefaultRole [@role]</b>: removes the specified default role
- <b>defaultRoles</b>: lists the current default roles of the guild
- <b>purge [amount]</b>: purges the specified amount of messages from the channel
- <b>bind</b>: binds the bot to the channel the message was sent in
- <b>unbind</b>: unbinds the bot from the channel the message was sent in


Honestly might just work on external documentation somewhere instead of this README... this is definitely not a full list


## Getting Started
---
### Set-Up
1. In `config/keys.js` fill in each API key with your own unique key from Discord, MongoDB, Google, Giphy, and Reddit:
```JS
module.exports = {
  mongoose_key: 'Your MongoDB API key here',
  discord_key: 'Your Discord bot key here',
  youtube_api_key: 'Your Google API key here',
  giphy_key: 'Your GIPHY key here',
  reddit: {
		userAgent: 'Discord Bot',
		clientId: 'Your Reddit client ID here',
		clientSecret: 'Your Reddit client secret here',
		username: 'Your Reddit account name here',
		password: 'Your Reddit account password here'
	}
}
```
###### The Youtube API key is no longer needed after switching to `node-ytsr`
2. Install NPM packages / node_modules:
```sh
npm install
```
3. To start up the bot, run by in the terminal with:
```sh
node bot.js
```
4. Pray that it doesn't crash...
