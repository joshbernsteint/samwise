import { isIn } from "./tools";


function formatString(str){
    var result = str;
    result = result.replaceAll(',','');
    result = result.replaceAll('?','');
    result = result.replaceAll('.','');
    result = result.toUpperCase();
    return result;
}


function parseVoice(eventList, cur_command, caught_commands){
    const curIndex = Object.keys(eventList).length - 1;
    const phrase = formatString(eventList[curIndex][0].transcript)
    const listPhrase = phrase.split(' ');
    return listPhrase;
}

export default parseVoice;