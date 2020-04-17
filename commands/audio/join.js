const ytdl = require('ytdl-core');

module.exports = {
    name:'join',

    async execute(message, args, client){
        const voiceChannel = message.member.voice.channel;
        const serverQueue = queue.get(message.guild.id);
        
        //If the bot is already in another voice channel
        if(serverQueue){
           if (serverQueue.connection.channel.id !== voiceChannel.id){
                message.channel.send("I'm already connected to another voice channel!");
                return;
            } 
            else if (serverQueue.connection.channel.id === voiceChannel.id){
                message.channel.send("I'm aleady in your voice channel you buffoon");
                return;
            }
        }
        
        //If the user is not in a voice channel
        if(!voiceChannel){
            message.reply("you need to be in a voice channel!");
            return;
        } 
        else {
            //finds the permissions of the bot in that their voice channel
            const permissions = voiceChannel.permissionsFor(client.user);

            if (!permissions.has('CONNECT') || !permissions.has('SPEAK')){
                message.reply("I do not have permissions to join/speak in your channel!");
                return;
            } else {
                //establishes a connection with the voice channel
                const connection = await voiceChannel.join();

                if (!serverQueue) {

                    //value stored in the global queue Map()
                    const queueConstruct = {
                        textChannel: message.channel,
                        voiceChannel: voiceChannel,
                        connection: connection,
                        songs: [],
                        volume: 5,
                        playing: false,
                        looping: false
                    };
    
                    //sets the key and value into the global queue Map()
                    queue.set(message.guild.id, queueConstruct);
                }
            }
        }
    }
}