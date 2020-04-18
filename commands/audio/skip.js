const ytdl = require('ytdl-core');

module.exports = {
    name: 'skip',

    execute(message, args, client){
        
        //Get the value from the global queue Map()
        voiceChannel = message.member.voice.channel;
        serverQueue = queue.get(message.guild.id);

        //If the user is not in a voice channel
        if(!voiceChannel){
            message.reply("you must be a voice channel to skip!");
        }
        //If the bot is not currently in a voice channel
        else if (!serverQueue){
            message.reply("I'm not in a voice channel. Use -join to let me in!");
        }
        else if (serverQueue.connection.channel.id !== voiceChannel.id){
            message.channel.send("To skip, you must be in the same channel!")
        }
        else {

            //if there are currently no dispatchers to the voice channel connection
            if(!serverQueue.connection.dispatcher){
                message.reply("There is no audio for me to skip!");
            }else {

                //ends the current audio (triggers nextSong.execute() recursion)
                serverQueue.connection.dispatcher.end();
                serverQueue.looping = false;
                message.channel.send("Skipped!");
            }
            
        }
    }
}