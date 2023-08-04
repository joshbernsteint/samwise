require('dotenv').config(); //Used for .env file
const cors = require('cors');
const cp = require('child_process');
const express = require('express');
const file_paths = require('./paths.json');
const command_list = require('./commands.json');
const fs = require('fs');
const path = require('path'); 

const app = express()
app.use(cors());
app.use(express.json());




app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/get_command_list', (req,res) => {
  res.send(command_list);
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
  switch (command.id) {
    case 1:
      const argList = command.args;
      argList.forEach(element => {
        cp.exec(`"${file_paths[element]}"`);
      });
      break;
    case 3:
      // cp.exec('../scripts/shutdown.bat');
      console.log('Shutting down computer');
    default:
      break;
  }
  res.send('All Good!');
});



app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
})