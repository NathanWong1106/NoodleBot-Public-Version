const Member = require('../../models/member-model');
const validNum = require('../../util/validNum');

module.exports = {
    name: 'deposit',

    execute(message, args, client){
        const userID = message.member.user.id;
        const amountToDeposit = parseInt(args[0]);

        if(!validNum.isValid(message,amountToDeposit)){
            return;
        }

        Member.findOne({userID: userID})
        .then(memberDB => {

            if (amountToDeposit > memberDB.currency){
                message.channel.send("You buffoon, you don't even have that many noodles!");
                return;
            } else if (memberDB.bank + amountToDeposit > 10000){
                message.channel.send("We're already rich enough. You will exceed our 10,000 noodle limit if you deposit that much!")
                return;
            } else {
                memberDB.bank = memberDB.bank + amountToDeposit;
                memberDB.currency = memberDB.currency - amountToDeposit;
                memberDB.save(err => {
                    if(err){
                        console.log(err);
                    } else {
                        return;
                    }
                })
                message.channel.send(`${amountToDeposit} noodles have been taken and added to your account!`);
            }
        })
        .catch(err => {
            message.reply("you have not joined the noodle game. Use '-work' to join!");
        })
    }
}