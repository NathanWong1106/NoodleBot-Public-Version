//Discord dependencies
const Discord = require('discord.js');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const User = require('./models/user-model');
const Guild = require('./models/guild-model');
const fs = require('fs'); //file system
const PREFIX = "-";
const client = new Discord.Client();
const timer = require('./recursive/timer');

//Collection of commands for users
client.commands = new Discord.Collection();

//Collection of commands for the MongoDB database
client.updates = new Discord.Collection();

//Keu: guildID, Value: Array of objects --contains info and an array of song objects to be played
//GLOBAL --used anywhere
global.queue = new Map();

//Key: userID, Value: Object containing info of gameTime --decremented by timer
//GLOBAL --used anywhere
global.members = new Map()

//creates an array of all files in the commands directory
const generalFiles = fs.readdirSync('./commands/general').filter(file => file.endsWith('js'));
const audioFiles = fs.readdirSync('./commands/audio').filter(file => file.endsWith('js'));
const moderationFiles = fs.readdirSync('./commands/moderation').filter(file => file.endsWith('js'));
const currencyFiles = fs.readdirSync('./commands/currency').filter(file => file.endsWith('js'));
const updateFiles = fs.readdirSync('./data/general').filter(file => file.endsWith('js'));

//Creates a collection of commands --command name as the key and the command as the value
for (const file of generalFiles){
    const command = require(`./commands/general/${file}`);
    client.commands.set(command.name, command);
}
for (const file of audioFiles){
    const command = require(`./commands/audio/${file}`);
    client.commands.set(command.name, command);
}
for (const file of moderationFiles){
    const command = require(`./commands/moderation/${file}`);
    client.commands.set(command.name, command);
}
for (const file of currencyFiles){
    const command = require(`./commands/currency/${file}`);
    client.commands.set(command.name, command);
}

//Creates a collection of commands for the database --command name as the key and the command as the value
for (const file of updateFiles){
    const update = require(`./data/general/${file}`);
    client.updates.set(update.name, update);
}

client.once('ready', async () => {
    console.log('READY!');
    
    client.guilds.cache.forEach(guild => {
        client.updates.get('startUp').execute(guild);
    })
    
    timer.execute();
})

//on receiving a message
client.on('message', message => {
    //ignore bot messages and messages that start without the prefix {!}
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;

    //args contain an array of all strings within the message split by whitespace --ignores 0th index (prefix) --regex
    const args = message.content.slice(PREFIX.length).split(/ +/);
    
    //shift removes and returns the first element in the array
	const command = args.shift().toLowerCase();

    //check if commands contains the key
	if (!client.commands.has(command)) return;

    //execute the command --pass in message and arguments
	try {
		client.commands.get(command).execute(message, args, client);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
    }
})

//login the client
client.login(keys.discord_key);

/*--------------------------------MongoDB Login---------------------------------*/
mongoose.connect(keys.mongoose_key, {useNewUrlParser:true, useUnifiedTopology: true})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.log(err);
});
/*------------------------------------------------------------------------------*/

//on joining a guild
client.on('guildCreate', guild => {
    client.updates.get('GuildCreate').execute(guild);
})

//on removal from a guild
client.on('guildDelete', guild => {
    client.updates.get('GuildDelete').execute(guild);
})

//on updating the guild
client.on('guildUpdate', (oldGuild, newGuild) => {
    client.updates.get('GuildUpdate').execute(newGuild);
});

//on creation of a new channel
client.on('channelCreate', channel => {
    client.updates.get('ChannelUpdate').execute(channel);
});

//on deletion of an existing channel
client.on('channelDelete', channel => {
    client.updates.get('ChannelUpdate').execute(channel);
});

//on update of an existing channel
client.on('channelUpdate', channel => {
    client.updates.get('ChannelUpdate').execute(channel);
})

//on creation of a new role
client.on('roleCreate', role => {
    client.updates.get('RoleUpdate').execute(role);
});

//on deletion of an existing role
client.on('roleDelete', role => {
    client.updates.get('RoleUpdate').execute(role);
});

//on update of an existing role
client.on('roleUpdate', role => {
    client.updates.get('RoleUpdate').execute(role);
})

client.on('voiceStateUpdate', (oldState, newState) => {
    if (newState.member.id === client.user.id){
        //the server queue
        const serverQueue = queue.get(newState.guild.id);
        //returns null if the bot has been disconnected
        const newChannel = newState.guild.voice.connection;

        //async function --await establishment of new channel
        const establishConnection = async function(){
            serverQueue.connection = await newState.channel.join();
        }
        
        //if the bot has been disconnected from the voice channel
        if(!newChannel){
            queue.delete(newState.guild.id);
            return;
        }
        //if the bot has been moved by an external source to another voice channel
        else if (serverQueue){
            establishConnection();
            return;
        }

    }    
})

client.on('guildMemberAdd', member => {
    const giveRoles = require('./util/giveRoles');
    giveRoles.execute(member, member.guild);
})

