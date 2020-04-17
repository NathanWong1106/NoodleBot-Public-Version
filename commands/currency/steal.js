const Member = require('../../models/member-model');
const memberObj = require('../../objects/memberObj');
const stealConfig = require('../../currency-config/stealConfig');
const timeString = require('../../util/timeString');
const validNum = require('../../util/validNum');

module.exports = {
    name: 'steal',

    execute(message, args, client){
        const memberUserID = message.member.user.id;
        const victim = message.mentions.members.first();
        let member = members.get(memberUserID);

        if(!victim){
            message.reply('tag a member to steal from!');
            return;
        }

        //TODO set the steal time
        if(!member){
            member = memberObj.create(message.member.user.username);
            members.set(memberUserID, member);
        }

        if(member.stealTime > 0){
            message.reply(`you can steal again in ${timeString.convert(member.stealTime)}`);
            return;
        }

        if(memberUserID === victim.id){
            message.reply('you fool, you absolute buffoon');
            return;
        }

        Member.findOne({userID: memberUserID})
        .then(memberDB => {

            Member.findOne({userID: victim.id})
            .then(victimDB => {

                if(victimDB.currency === 0){
                    message.channel.send(`There is nothing to steal from ${victim.user.username}`);
                    return;
                }

                const roll = Math.random(); //Random num between 0 - 1
                const multiplier = parseFloat((((Math.random() * (stealConfig.highestReturn - stealConfig.lowestReturn)) + stealConfig.lowestReturn).toFixed(2))); //Multiplier between 0.2 - 0.5

                if(roll < 0.5){
                    const amountStolen = Math.round(victimDB.currency * multiplier);
                    
                    //set the new values and save to MongoDB
                    victimDB.currency -= amountStolen;
                    memberDB.currency += amountStolen;
                    victimDB.save();
                    memberDB.save();

                    const embed = {
                        color:'#f5db47',
                        author:{
                            name:`${message.member.user.username}'s robbery of ${victim.user.username}`,
                            icon_url: message.member.user.displayAvatarURL()
                        },
                        fields:[
                        {
                            name: 'Multiplier:',
                            value: 'x' + multiplier,
                            inline: true
                        },
                        {
                            name: 'Stolen Noodles:',
                            value: amountStolen + ' noodles',
                            inline: true
                        }]
                    }

                    message.channel.send({embed:embed});
                    member.stealTime = stealConfig.TIME;
                    return;

                } else {
                    message.channel.send(`${message.member.user.username} failed to steal from ${victim.user.username}`);
                    member.stealTime = stealConfig.TIME;
                    return;
                }
                
            })
            .catch(err => {
                message.reply(`${victim.user.username} has not joined the noodle game.`) //TODO haven't joined string
                return;
            })
        })
        .catch(err => {
            message.reply("you have not joined the noodle game. Use '-work' to join!") //TODO haven't joined string
            return;
        })
    }
}