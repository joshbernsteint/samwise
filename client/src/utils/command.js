import { isIn } from "./tools";

const output_args = ["[W]","[W]...","[S]","[B]"];

class Command{

    constructor(key="",args=[],id=0,all_commands={},response={}){
        this.key=key;
        this.args = args;
        this.command_id = id;
        this.arg_index = 0;
        this.opt_index = 0;
        this.command_complete = false;
        this.all_commands = all_commands;
        this.response = response;
    }

    /**
     * Sets the objects key parameter
     * @param {*} str: The value that will be set as the key 
     */
    addKey(str){
        this.key = str;
        this.options = this.all_commands[this.key].options
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
            else if(el.args[this.arg_index] === "[W]" && isIn(str,this.all_commands[this.key].accepted.W)){
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
            this.opt_index = index;
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

    hasResponse(){
        if(this.key === ""){
            return false;
        }
        else{
            return this.options[this.opt_index].has_response;
        }
    }

    getResponseType(){
        if(this.key !== ""){
            return this.options[this.opt_index].response;
        }
        else{
            return {};
        }
    }

    setResponse(obj){
        if(!obj.error){
            this.response = obj;
        }
    }

    getCurResponse(){
        return this.response;
    }

    toJSON(){
        return {
            key: this.key,
            id: this.command_id,
            arguments: this.args,
            response: this.response
        };
    }

    formatArgs(){
        const output_format_id = Math.floor(this.command_id)
        switch (output_args[output_format_id]) {
            case "[S]":
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
            case "[W]":
                return {id: output_format_id, args: this.args[0]}
            case "[W]...":
                return {id: output_format_id, args: this.args}
            case "[B]":
                return {id: output_format_id, bool: this.response.val}
            default:
                break;
        }
    }

    /**
     * Makes a shallow copy of the Command object
     * @returns 
     */
    makeCopy(){
        return new Command(this.key,this.args,this.command_id,{},this.response);
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
        this.response = {};
        this.command_complete = false;
    }

}

export default Command;