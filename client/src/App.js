import './App.css';
import parseVoice from './utils/parseVoice';
import Command from './utils/command';
import CommandList from './utils/commandList';
import { useState, useEffect, useMemo } from 'react'
import { isIn } from './utils/tools';
import Timer from './utils/timer';
import SpeechRecognition from './utils/speechRecognition';
import TimerList from './utils/timerList';

function App() {
  const [commands, setCommands] = useState(null);
  const [responses, setResponses] = useState(null);
  const [uniqueCommands, setUniqueCommands] = useState([]);
  const [current_cmd, setCurrentCmd] = useState(null);
  const [awaitingResponse, setAwaitingResponse] = useState(false);
  const [wordList, setWordList] = useState([]);

  const speechReg = useMemo(() => new SpeechRecognition(), [])
  const cmd_list = useMemo(() => new CommandList(), []);
  const timerList = useMemo(() => new TimerList(), [])

  useEffect(()=>{
    async function fetchCommands(){
      await fetch('http://localhost:5000/get_command_list').then(res => res.json().then(data => {
        setCommands(data.commands);
        setResponses(data.responses);
        setCurrentCmd(new Command("",[],-1,data))
        setUniqueCommands(Object.keys(data));
      }))
    }

    fetchCommands(); //Get the commands from the server
  },[]);
  


  function parseInput(listPhrase){
      if(!awaitingResponse || current_cmd.key === ""){
        for (let index = 0; index < listPhrase.length; index++) {
            if(isIn(listPhrase[index],uniqueCommands)){
                if(current_cmd.key !== ""){
                    if(current_cmd.hasResponse()){
                      setWordList(listPhrase.slice(index));
                      setAwaitingResponse(true);
                      console.log(current_cmd.getResponseObj().prompt); // Display prompt to the user
                      return;
                    }
                    else{
                      cmd_list.add(current_cmd.makeCopy());
                      current_cmd.reset();
                    }
                }
                current_cmd.addKey(listPhrase[index]);
            }
            else if(current_cmd.key !== ""){
              current_cmd.AddIfArgument(listPhrase[index])
            }            
          }

          if(current_cmd.hasResponse()){
            setAwaitingResponse(true);
            setWordList([]);
            console.log(current_cmd.getResponseObj().prompt);
          }
          else if(current_cmd.key !== ""){
            cmd_list.add(current_cmd.makeCopy());
            current_cmd.reset();
          }
      }
      else if(awaitingResponse){
        const response_obj = current_cmd.getResponseObj();
        switch (response_obj.type) {
          case "CONFIRM":
            for (let index = 0; index < listPhrase.length; index++) {
              const element = listPhrase[index];
              if(isIn(element,Object.keys(responses.CONFIRM.options.YES))){
                  current_cmd.setResponse({error: false, val: true});
              }
              else if (isIn(element,Object.keys(responses.CONFIRM.options.NO))){
                  current_cmd.setResponse({error: false, val: false});
              }
            }
            break;
        
          default:
            break;
        }

        cmd_list.add(current_cmd.makeCopy());
        current_cmd.reset();
        setAwaitingResponse(false);
        parseInput(wordList);
      }
    }




  
  speechReg.recognition.onresult = function(e){
    const phraseList = parseVoice(e.results);
    // console.log(phraseList);
    parseInput(phraseList);
  }



  return (
    <div className="App">
        <button onClick={(e) => {
          e.preventDefault();
          speechReg.start();
        }}>Start Listening</button>
        <button onClick={(e) => {
          e.preventDefault();
          speechReg.stop();
        }}>Stop Listening</button>

        <button onClick={(e) => {
          e.preventDefault();
          console.log('Printing Commands...');
          cmd_list.print()
        }}>Print Commands</button>

        
        <button onClick={(e) => {
          e.preventDefault();
          console.log('Running Commands...');
          runCommands(cmd_list,timerList);
          cmd_list.reset()
        }}>Submit Commands</button>
    </div>
  );
}

export default App;
