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
}

export default CommandList;