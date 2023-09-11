require('dotenv').config(); //Used for .env file
const cors = require('cors');
const cp = require('child_process');
const express = require('express');
const response_list = require('./responses.json')
const fs = require('fs');
const path = require('path'); 

const app = express()
app.use(cors());
app.use(express.json());
const socket_path = "sockets/client";

const command_json_name = "SAMWISE_COMMANDS.json"

var REGISTERED_COMMANDS = {};
var UNIQUE_COMMANDS = [];


var USER_PARSED_COMMANDS = [];
var REQUIRE_USER_RESPONSE = false;

function getCommands(){
    const data = fs.readFileSync(command_json_name);
    const json_data = data.toJSON();
    REGISTERED_COMMANDS = json_data;
    UNIQUE_COMMANDS = Object.keys(json_data);
}



function isIn(el, list){
  return !list.every(item => {
    if(item === el){
      return false;
    }
    return true;
  })
}



app.get('/', (req, res) => {
    res.send('')
})

app.get('/command/register/:fileName', (req,res) => {
  if(!fs.existsSync(req.params.fileName)){
      res.send({has_error: true,error: "JSON file could not be found"});
  }
  else{
    fs.renameSync(command_json_name,"__temp__.json");
    const basename = fs.basename(req.params.fileName);
    fs.copyFileSync(req.params.fileName,command_json_name);
    if(fs.existsSync(command_json_name)){
      fs.unlinkSync("__temp__.json");
      getCommands();
    }
    else{
      fs.renameSync("__temp__.json", command_json_name);
    }
  }
})

app.get('/command/parse', (req, res) => {
  const input = req.body;
  const current_command_base = {key: "", args: [], option_index: -1};
  var found_commands = [];
  var current_command = current_command_base;
  var KEYED_COMMAND = {};

  function AddIfValidArgument(str){
    //TODO: Make this not suck
      return !KEYED_COMMAND.every((option, i) => {
          if(isIn(str, option)){
              current_command = {...current_command, option_index: i, args: [...current_command.args, str]};
              return false;
          }
          return true;
      })
  }

  for(let index = 0; index < input.length; index++) {
    const element = input[index];
    if(isIn(element,UNIQUE_COMMANDS)){
      if(current_command.key !== ""){
          found_commands.push(current_command);
          current_command = current_command_base;
      }
      current_command =  {...current_command, key: element};
      KEYED_COMMAND = REGISTERED_COMMANDS[element];
    }
    else if(current_command.key !== ""){
        AddIfValidArgument(element);

    }
  }

  USER_PARSED_COMMANDS = found_commands;

  respones = [];
  callbacks = [];
  found_commands.forEach((element,i) => {
      const actions = REGISTERED_COMMANDS[element.key][element.option_index].actions;
      actions.forEach((el) => {
        if(el.has_response){
          responses.push({command_index: i, response: el.response});
        }
        else if(el.has_callback){
          callbacks.push({command_id: i, callback: el.callback});
        }
      })
  });
})

app.get('/get_command_list', (req,res) => {
  res.send({commands: REGISTERED_COMMANDS, responses: response_list});
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



app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
})