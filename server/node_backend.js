require('dotenv').config(); //Used for .env file
const cors = require('cors');
const cp = require('child_process');
const express = require('express');
const command_list = require('./commands.json');
const response_list = require('./responses.json')
const fs = require('fs');
const path = require('path'); 

const app = express()
app.use(cors());
app.use(express.json());
const socket_path = "sockets/client";


/**
 * Converts the node command id to the socket command id
 * @param node_id: The id passed by the frontend server
 * @param args: The args
 */
function getCommandID(node_id, args){
  var id = -1;
  switch (node_id) {
      case 1:
          const opt_list = command_list.OPEN.accepted.W;
          //OPEN case
          const arg_id = opt_list.findIndex(args) + 1;
          id =  1100 + arg_id;
          break;
      case 9:
          //SHUTDOWN case
          id =  9962;
          break;
      case 4:
          //TODO: GO case
      default:
          break;
  }

  return id;
}


app.get('/', (req, res) => {
    res.send('')
})

app.get('/get_command_list', (req,res) => {
  res.send({commands: command_list, responses: response_list});
});

app.get('/get_token/:type', (req, res) => {
  switch (req.params.type) {
    case 'canvas':
        res.send({app: "Canvas", token: process.env.CANVAS_TOKEN});
      break;
  
    default:
        res.send({error: "No matching app found"})
      break;
  }
})

app.post('/run_command',(req,res) =>{
  const command = req.body;
  command.args.forEach(element => {
    const id = getCommandID(command.id,element);
    cp.exec(`"${socket_path}" ${id}`, (err, stdout, stderr) => {
      if(stdout !== "0"){
        console.log("An error has occured, error code: ",stdout);
      }
    });
  });
  res.send('All Good!');
});



app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
})