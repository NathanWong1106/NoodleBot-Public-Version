const Member = require('../../models/member-model');
const gambleConfig = require('../../currency-config/gambleConfig');
const timeString = require('../../util/timeString');
const validNum = require('../../util/validNum');
const memberObj = require('../../objects/memberObj');

module.exports = {
    name: 'gamble',
    
    execute(message, args, client){
        const userID = message.member.user.id;
        const amountToGamble = parseFloat(args[0]);
        let member = members.get(userID);

        if(!validNum.isValid(message,amountToGamble)){
            return;
        }

        if(!member){
            const memberObject = memberObj.create(message.member.user.username);
            members.set(userID, memberObject)
            member = members.get(userID);
        }
        else if (member.gambleTime > 0){
            message.reply(`you can gamble again in ${timeString.convert(member.gambleTime)}`);
            return;
        }

        Member.findOne({userID: userID}).then(memberDB => {
            if(amountToGamble > memberDB.currency){
                message.reply("you don't have that many noodles on you. Maybe try withdrawing some noodles from the IBN?")
            } else {

                const chance = Math.random() * gambleConfig.CHANCE;

                if(chance <= 1){
                    memberDB.currency -= amountToGamble;
                    message.channel.send(message.member.user.username + " lost `" + amountToGamble + "` noodles!");
                } else {
                    memberDB.currency += amountToGamble;
                    message.channel.send(message.member.user.username + " won `" + amountToGamble + "` noodles!");
                }

                memberDB.save();
                member.gambleTime = gambleConfig.TIME;
            }
        })
        .catch(err => {
            console.log(err);
            message.reply("you have not joined the noodle game. Use '-work' to join!");
        })
    }
}