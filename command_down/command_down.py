import json

BROWSER_OPENER_PATH = "D:/Coding/samwise/scripts/firefox.bat"

class Action:
    def __init__(self, input="", type="", has_response=False,has_callback=False, **kwargs):
        if(isinstance(input, list)):
            self.input = list(map(lambda x: x.upper(),input))
        else:
            self.input = input.upper()
        self.type = type.upper()
        self.hasResponse = has_response
        self.hasCallback = has_callback
        self.args = kwargs
    def toDictHeadless(self):
        result =  {
            "type": self.type,
            "has_response": self.hasResponse,
            "has_callback": self.hasCallback,
            }
        if(self.hasResponse):
            result["response"] = self.args["response"]
        if(self.hasCallback):
            result["callback"] = self.args["callback"]

        match self.type:
            case "FILE_OPEN":
                result["path"] = self.args["path"]
            case "URL_OPEN":
                result["url"] = self.args["url"]
                result["opener"] = BROWSER_OPENER_PATH
            case "TIMER":
                pass
            case "RUN_SCRIPT":
                result["script_path"] = self.args["script_path"]
            case "CMD_LINE":
                result["command"] = self.args["command"]
        return result
    
    def toDict(self):
        temp = {"input": self.input}
        temp.update(self.toDictHeadless())
        return temp
    

    
class MultiAction:
    def __init__(self,input="", actions=[]):
        if(isinstance(input, list)):
            self.input = list(map(lambda x: x.upper(),input))
        else:
            self.input = input.upper()
        
        self.numActions = len(actions)
        self.actions = actions

    def toDict(self):
        result = {
            "input": self.input,
            "num_actions": self.numActions,
        }
        actList = []
        for action in self.actions:
            actList.append(action.toDictHeadless())
        result["actions"] = actList
        return result
        

class Option:
    def __init__(self,label, format ,actionMap: list):
        self.label = label
        self.format = format
        self.actionMap = list(map(lambda x: x.toDict(), actionMap))
    def getAllInputs(self):
        result = []
        for item in self.actionMap:
            result.append(item["input"])
        return result


class Command:
    def __init__(self, label: str, options: list[Option]):
        self.name = label.upper()
        self.option_list = options

    def toDict(self):
        pass

class CommandList:
    def __init__(self, command_list: list[Command]):
        self.commands = command_list
    
    def toJSON(self,fileName):
        result = {}
        upper_id = 1
        lower_id = 1
        for command in self.commands:
            temp_list = []
            for option in command.option_list:
                temp_list.append({
                    "label": option.label,
                    "id": float(f"{upper_id}."+f"{lower_id}"),
                    "format": option.format,
                    "allowed_inputs": option.getAllInputs(),
                    "actions": option.actionMap
                })
                lower_id += 1
            upper_id += 1
            lower_id = 1
            result[command.name] = temp_list

        with open(fileName,'w') as json_file:
            temp_str = json.dumps(result, indent=4)
            json_file.write(temp_str)
