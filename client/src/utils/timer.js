class Timer{
    /**
     * @param {int} time: Time in seconds for the timer 
     */
    constructor(time){
        this.base_duration = time;
        this.time_left = this.base_duration*1000;
        this.complete = false;
    }

    /**
     * Starts the timer
     */
    async start(debug=false){
        if(debug){
            console.log('Starting timer for ',this.base_duration,' seconds');
        }
        this.timer_object = setInterval(() => {
            this.time_left -= 1000;
            if(this.time_left < 1000){
                clearInterval(this.timer_object);
                this.complete = true;
                if(debug){
                    console.log('Timer done!');
                }
              }
              else{
                // console.log('1 second passed...');
              }
        }, 1000);
    }

    /**
     * @returns True if the timer is complete, False otherwise
     */
    isComplete(){
        return this.complete;
    }
    /**
     * @returns Time left in seconds on the timer
     */
    getTimeLeft(){
        return this.time_left/1000;
    }

    /**
     * 
     * @returns The Timer object with its fields in a JSON parse-able form
     */
    toJSON(){
        return {
            base_duration: this.base_duration,
            time_left: this.time_left/1000,
            is_complete: this.complete
        }
    }

}

export default Timer;