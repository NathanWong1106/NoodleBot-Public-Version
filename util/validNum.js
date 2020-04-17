module.exports = {
    isValid(message, args){
        if(args){
            if(args < 0){
                message.reply("look. I know you have a very small brain, but you really should know that negative numbers don't work!");
                return false;
            }
            else if (args === 0){
                message.reply("come on. Why are you even here?");
                return false;
            }
            else if (args % 1 !== 0){
                message.reply("please give me a whole number!");
                return false;
            }
        } 
        else {
            message.reply('please give me a valid amount to work with!')
            return false;
        }

        return true;
    }
}