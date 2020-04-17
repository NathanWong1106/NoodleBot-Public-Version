module.exports = {

    /*creates an object of the user to be put in the global member list
    @scope -- global
    @related --recursive/timer, currency-config, commands/currency
    */
    create(username){
        return{

            //Timing
            username: username,
            workTime: 0,
            investmentTime: 0,
            gambleTime: 0,
            stealTime: 0,
            giveTime: 0,

            //functions for use in recursive/timer
            decrement(){
                //decrements valid variables every second
                if(this.workTime > 0){
                    this.workTime -= 1;
                }
                if (this.investmentTime > 0){
                    this.investmentTime -= 1;
                }
                if(this.gambleTime > 0){
                    this.gambleTime -= 1;
                }
                if(this.stealTime > 0){
                    this.stealTime -= 1;
                }
                if(this.giveTime > 0){
                    this.giveTime -= 1;
                }
            },

            isDeletable(){
                //checks if the member is safe for deletion --memory management
                if(this.workTime === 0 && this.investmentTime === 0 && this.gambleTime === 0 && this.stealTime === 0 && this.giveTime === 0){
                    return true;
                } else {
                    return false;
                }
            }
        }
    }
}