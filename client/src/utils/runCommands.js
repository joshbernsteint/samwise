import Timer from "./timer";
import TimerList from "./timerList";
function runCommands(cmd_list, timerList){
    const formatted_list = cmd_list.formatAll();
    var send_to_server = false;
    formatted_list.forEach(el => {
        switch (el.id) {
            case 0:
                //STOP Command
                break;
            case 1:
                //OPEN Command case
                send_to_server = true;
                break;
            case 2:
                //TIMER command case
                timerList.addTimer(new Timer(el.length));
                setTimeout(() => {
                    timerList.removeDone();
                    console.log(`Timer for ${el.length} seconds Complete!`);
                },el.length*1000);
                break;
            case 3:
                //Shutdown case
                console.log('Shutting down computer...');

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

export default runCommands;