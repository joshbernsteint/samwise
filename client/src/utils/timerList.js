class TimerList{
    constructor(){
        this.cur_timers = [];
        this.num_timers = 0;
    }

    getNextToFinish(){
        if(this.cur_timers.length === 0){
            return -1;
        }
        else{
            var min_time = this.cur_timers[0].time_left;
            for (let index = 1; index < this.cur_timers.length; index++) {
                const element = this.cur_timers[index];
                if(element.time_left < min_time){
                    min_time = element.time_left;
                }
            }

            return min_time;
        }
    }

    addTimer(timer_obj){
        timer_obj.start();
        this.cur_timers.push(timer_obj);
        this.num_timers++;

        return this.getNextToFinish()
    }

    /**
     * Removes all finished timers from the TimerList object
     */
    removeDone(){
        var temp_list = this.cur_timers;
        for (let index = 0; index < this.cur_timers.length; index++) {
            const element = this.cur_timers[index];
            if(element.isComplete()){
                temp_list = temp_list.splice(index,1);
                this.num_timers--;
            }
        }
        this.cur_timers = temp_list;
    }

    /**
     * Produces a list of all the running timers
     * @returns A list of JSON objects representing each timer
     */
    getTimers(){
        var result_list = [];
        this.removeDone();

        this.cur_timers.forEach(el => {
            result_list.push(el.toJSON())
        });

        return result_list;
    }
    
    /**
     * Resets the object to its default state
     * No real use for this atm, just in case I ever need it
     */
    reset(){
        this.cur_timers = [];
        this.num_timers = 0;
    }
}

export default TimerList;