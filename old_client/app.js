

const output_args = ["[W]","[W]...","[S]",""];


var commands;
var different_commands;
fetch('http://localhost:5000/get_command_list').then(res => res.json().then(data => {
    commands=data; different_commands = Object.keys(data);}))

/** 
 * @param {*} element: Variable to be searched for in `list`
 * @param {*} list: List that will be searched for `element`
 * @returns: `true` if `element` is found in `list`, `false` otherwise
 */
function isIn(element,list){
    for (let index = 0; index < list.length; index++) {
        if(element === list[index]){
            return true;
        }
    }
    return false
}

class Timer{
    /**
     * @param {int} time: Time in seconds for the timer 
     */
    constructor(time){
        this.base_duration = time*1000;
        this.time_left = this.base_duration;
        this.complete = false;
    }

    /**
     * Starts the timer
     */
    async start(debug=false){
        if(debug){
            console.log('Starting timer for ',this.base_duration/1000,' seconds');
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

}

class Command{

    constructor(key="",args=[],id=0){
        this.key=key;
        this.args = args;
        this.command_id = id;
        this.arg_index = 0;
        this.command_complete = false;
    }

    /**
     * Sets the objects key parameter
     * @param {*} str: The value that will be set as the key 
     */
    addKey(str){
        this.key = str;
        this.options = commands[this.key].options
    }

    /**
     * Adds an argument to the object's arg field if it is a valid argument parameter
     * @param {*} str: The value to be checked(and potentially added)
     * @returns true if the argument is added, false if not
     */
    AddIfArgument(str){
        
        var index = 0;
        var id = 0;
        var looping = false;
        var prevArgs = [];

        const prevIndex = this.arg_index;
  
        const found = !this.options.every((el,i) => {
            if(el.args.length <= this.arg_index || el.args[this.arg_index] === "..."){
                this.arg_index = prevIndex % (el.args.length);
                looping = true;
            }
            // console.log(this.arg_index, str,el.args[this.arg_index]);

            if(el.args[this.arg_index] === str){
                index = i;
                id = el.id;
                this.args.push(str);
                return false;
            }
            else if(el.args[this.arg_index] === "[W]" && isIn(str,commands[this.key].accepted.W)){
                index = i;
                id = looping ? Math.floor(el.id)+ 0.2 : el.id;
                this.args.push(str);
                return false;
            }
            else if (el.args[this.arg_index] === "[T]") {
                const time_units = [
                    {unit: "HOUR", plural: "HOURS"},
                    {unit: "MINUTE", plural: "MINUTES"},
                    {unit: "SECOND", plural: "SECONDS"}];
                const ret = time_units.every((t_el) => {
                    if(str === t_el.unit || str === t_el.plural){
                        index = i;
                        id = looping ? Math.floor(el.id)+ 0.2 : el.id;
                        this.args.push(t_el.unit);
                        return false;
                    }  
                    return true;
                })
                if(ret === false){
                    return false;
                }
            }
            else if(el.args[this.arg_index] === "[N]"){
                const numbers = {
                    "ONE": 1, "TWO":2,"THREE":3,"FOUR":4,"FIVE":5,"SIX":6,"SEVEN":7,"EIGHT":8,"NINE":9,"TEN":10
                }
                if(!isNaN(Number(str))){
                    index = i;
                    id = looping ? Math.floor(el.id)+ 0.2 : el.id;
                    this.args.push(Number(str));
                    return false;
                }
                else if(isIn(str,Object.keys(numbers))){
                    index = i;
                    id = looping ? Math.floor(el.id)+ 0.2 : el.id;
                    this.args.push(numbers[str]);
                    return false;
                }
            }
            return true;
        });
        this.arg_index = prevIndex;
        if(found){
            this.arg_index++;
            if(this.arg_index === this.options[index].args.length){
                this.command_complete = true;
            }
            this.command_id = id;
        }
        return found;
    }
    getOptions(){
        return this.options;
    }

    addArg(val){
        this.args.push(val);
    }

    toJSON(){
        return {
            key: this.key,
            id: this.command_id,
            arguments: this.args,
        };
    }

    formatArgs(){
        const output_format_id = Math.floor(this.command_id)
        if(output_args[output_format_id] === "[S]"){
            var num_seconds = 0;
            var temp_seconds = 0;
            var unit = "";
            var lastNumber = false;
            for (let index = 0; index < this.args.length; index++) {
                const element = this.args[index];
                if(!isNaN(Number(element))){
                    temp_seconds = Number(element);
                    lastNumber = true;
                }
                else if(lastNumber){
                    lastNumber = false;
                    unit = element;
                    switch (unit) {
                        case "MINUTE":
                            num_seconds += temp_seconds*60;
                            break;
                        case "HOUR":
                            num_seconds += temp_seconds*60*60;
                            break;
                        default:
                            num_seconds += temp_seconds
                            break;
                    }
                }
            }
            return {id: output_format_id, length: num_seconds}

        }
        else if(output_args[output_format_id] === "[W]"){
            return {id: output_format_id, args: this.args[0]}
        }
        else if(output_args[output_format_id] === "[W]..."){
            return {id: output_format_id, args: this.args}
        }
    }

    /**
     * Makes a shallow copy of the Command object
     * @returns 
     */
    makeCopy(){
        return new Command(this.key,this.args,this.command_id);
    }

    /**
     * Resets all of the global variables
     */
    reset(){
        this.key = "";
        this.args = [];
        this.options = [];
        this.arg_index = 0;
        this.command_id = 0;
        this.command_complete = false;
    }

}

class CommandList{
    constructor(){
        this.command_list = [];
    }
    /**
     * Adds a new command to the command list
     * @param {Command} new_command 
     */
    add(new_command){
        this.command_list.push(new_command);
    }

    /**
     * Formats every element in the command list to be compatible with the command runner
     * 
     * Used for internal object purposes
     * @returns A list of JSON objects with the simplified version of each element
     */
    formatAll(){
        var result = [];
        this.command_list.forEach(el => {
            result.push(el.formatArgs());
        })
        return result;
    }

    /**
     * Prints the JSON version of every element of the command list
     */
    print(){
        if(this.command_list.length === 0){
            console.log('No commands in list');
        }
        else{
            this.command_list.map(el => {
                console.log(el.toJSON());
            })
        }
    }

    /**
     * Resets the command list, discarding all commands currently in the list
     * 
     * This is NOT reversible
     */
    reset(){
        this.command_list = [];
    }

    /**
     * Runs all commands in the command list
     */
    runCommands(){
        const formatted_list = this.formatAll();
        var send_to_server = false;
        formatted_list.forEach(el => {
            switch (el.id) {
                case 0:
                    //STOP Command
                    if(el.arg === "LISTENING"){
                        recognition.stop();
                        console.log('Stopped listening...');
                    }
                    break;
                case 1:
                    //OPEN Command case
                    send_to_server = true;
                    break;
                case 2:
                    //TIMER command case
                    var temp_timer = new Timer(el.length);
                    temp_timer.start(true);
                    break;
                case 3:
                    //Shutdown case

                default:
                    break;
            }
            //Sends the command to the NodeJS server if needed
            if(send_to_server){
                fetch('http://localhost:5000/run_command',{
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(el)
                }).then(res => console.log(res.status));
                send_to_server = false; //Resets the send_to_server switch so it can be potentially used again
            }
        })
    }

}   



function parseInput(eventList){
    function formatString(str){
        var result = str;
        result = result.replaceAll(',','');
        result = result.replaceAll('?','');
        result = result.replaceAll('.','');
        result = result.toUpperCase();
        return result;
    }
    const curIndex = Object.keys(eventList).length - 1;
    const phrase = formatString(eventList[curIndex][0].transcript)
    const listPhrase = phrase.split(' ');
    // const listPhrase = ["OPEN","WORD","AND","POWERPOINT"]
    for (let index = 0; index < listPhrase.length; index++) {
        if(isIn(listPhrase[index],different_commands)){
            if(cur_command.key !== ""){
                caught_commands.add(cur_command.makeCopy());
                cur_command.reset();
            }
            cur_command.addKey(listPhrase[index]);
            cur_options = cur_command.getOptions();
        }
        else if(cur_command.key !== ""){
            cur_command.AddIfArgument(listPhrase[index])
        }
        
    }
    caught_commands.add(cur_command.makeCopy());
    cur_command.reset();
}

var waiting_for_input = false;
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
const recognition = new SpeechRecognition()
caught_commands = new CommandList();
cur_command = new Command();
recognition.continuous = true;
recognition.lang = 'en-US'


const button = document.getElementById('start-button');
button.addEventListener('click', () => {
    console.log('starting recording');
    recognition.start();
})
document.getElementById('stop-button').addEventListener('click', () => {
    console.log('stopping recording');
    recognition.stop();
})

document.getElementById('print-button').addEventListener('click', () => {
    // parseInput("hello there my good friends")
    // caught_commands.print();
    console.log(caught_commands.formatAll());
})

document.getElementById('send-button').addEventListener('click', () => {
    console.log('Sending commands...');
    caught_commands.runCommands();
    console.log('Resetting Command List...');
    caught_commands.reset();
})

recognition.onresult = function(e){
    parseInput(e.results)
    // caught_commands.runCommands();
    // caught_commands.reset();

}

