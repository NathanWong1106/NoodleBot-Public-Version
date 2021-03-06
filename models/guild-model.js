const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema for each guild --saved in mongoDB
const guildSchema = new Schema({
	guildID: String,
	guildOwnerID: String,
	guildName: String,
	guildRoles: Array,
	guildDefaultRoles: Array,
	guildChannels: Array,
	guildAllowedChannels: Array,
	customCommands: Array,
	playlists: Array
});

const Guild = mongoose.model('Guilds', guildSchema);

module.exports = Guild;
