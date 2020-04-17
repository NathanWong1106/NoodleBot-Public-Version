const Member = require('../../models/member-model');
const timeString = require('../../util/timeString');
const validNum = require('../../util/validNum');
const memberObj = require('../../objects/memberObj');
const giveConfig = require('../../currency-config/giveConfig');

//Giving to other members
module.exports = {
    name: 'give',

    execute(message, args, client){
        const memberUserID = message.member.user.id;
        const receiver = message.mentions.members.first();
        const amountToGive = parseInt(args[1]);
        let member = members.get(memberUserID);

        if(!receiver || receiver.id === client.user.id){
            message.reply('tag a member to give noodles to!');
            return;
        }

        if(!member){
            member = memberObj.create(message.member.user.username);
            members.set(memberUserID, member);
        }

        if(member.giveTime > 0){
            message.reply(`you can give again in ${timeString.convert(member.giveTime)}`);
            return;
        }

        if(memberUserID === receiver.id){
            message.reply('you fool, you absolute buffoon');
            return;
        }


        if(!validNum.isValid(message, amountToGive)){
            return;
        }

        Member.findOne({userID: memberUserID}).then(memberDB => {

            if(amountToGive > memberDB.currency){
                message.reply("you absolute ape, you don't even have that many noodles!");
                return;
            }

            Member.findOne({userID: receiver.id}).then(receiverDB => {

                memberDB.currency -= amountToGive;
                receiverDB.currency += amountToGive;

                try{
                    memberDB.save();
                    receiverDB.save()
                } catch(err){
                    message.channel.send('There was a problem with the DB. Please try again later.');
                    return;
                }

                message.channel.send(`${message.member.user.username} has given ${amountToGive} noodles to ${receiver.user.username}!`);
                member.giveTime = giveConfig.TIME;

            })
            .catch(err => {
                if(err){
                    message(`${receiver.user.username} has not joined the noodle game.`);
                    return;
                }
            })

        })
        .catch(err => {
            if(err){
                message.reply("you have not joined the noodle game. Use '-work' to join!");
                return;
            }
        })
    }
}