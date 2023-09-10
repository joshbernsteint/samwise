# Command Down Guide
### Overview
`command_down` is a way of generating a json file to register commands with a **Samwise Virtual Assistant**. 
* There are 3 components of writing a valid `command_down` script:   
    1. `Action`
        * Either via the `Action` or `MultiAction` classes
    2. `Option`
    3. `CommandList`
## Actions
Actions are the basic building blocks of `command_down`. An action simply takes an input, and performs an action when that input is received. There are many different types of actions, which are listed below. In Python, an `Action` class can only perform one action at a time. To do multiple actions per input, use the `MultiAction` class (We will go into more detail with this later).
### Constructor Arguments
When creating an `Action` object, there are arguments that **must** be included in the constructor if the values are different than the default.
|   Argument    |   Type    |   Default |
|   :---:       |   :---:   |   :---:   |
|   `input`     |   string or list  |   `""`      |
|   `type`     |   string   |   `""`      |
|   `has_response`  |   boolean     |   `False`   |
|   `has_callback`  |   boolean     |   `False`   |

Based on the `type` inputted in the constructor argument, additional arguments may be needed. See below for more details: 
#### Action Types
| Type          |       Required Args                     |    Description                          |
| :---:         |       :---                             | :---                                  |
| `FILE_OPEN`   |       `path` &ndash; Absolute file path |     Opens the file specified by `path`  |
| `URL_OPEN`    |       `url` &ndash; URL                 |     Opens the URL specified by `url`    |
|  `RUN_SCRIPT` |       `script_path` &ndash; Absolute file path <br/>to script | Runs the script specified by `script_path`    |
| `CMD_LINE`     |       `command` &ndash; Windows CMD | Runs command specified by `command` |
| `TIMER`       |       NONE                            |     Creates a timer based on the inputs |

Additionally, if True, the `has_response` and `has_callback` require additional arguments, `response` and `callback` respectively.


#### Responses & Callbacks
A response/callback dictionary outlines something to run **before** execution of the Action. The smallest response dictionary only contains the type of the response/callback. However, like Actions, different types may require additional arguments (in this case, keys)
* **Responses**
    | Type          |       Required Args                     |    Description                          |
    | :---:         |       :---                             | :---:                                   |
    | `CONFIRM`     |       `prompt` &ndash; String prompt    |  Asks the user to confirm something and is given `prompt` |
* **Callbacks**
    | Type          |       Required Args                     |    Description                          |
    | :---:         |       :---:                             | :---:                                   |
    | `SAY_OUTPUT`  |       NONE                              |  Relays the output of the Action to the user (if there is any) |
    | `TIMER_CALLBACK`|       NONE                            |  Specifically for timers, to remind the user when it is complete |

### Usage in Python
In Python, Actions are declared with the `Action` class, like this:
```Python
import command_down as cd

cd.Action(input="YOUTUBE",type="URL_OPEN",url="https://youtube.com")
```
What this code block says is that when the input "YOUTUBE" is encountered, the following URL will be opened


### MultiActions
Essentially, `MultiAction` objects are a list of `Action` objects that share 1 input. In a MultiAction object, 1 input triggers multiple actions that will fire one after another. Here is an example of how to create a `MultiAction` object
```Python
import command_down as cd

open_youtube_and_twitch = cd.MultiAction(input="VIDEOS",[
    cd.Action(input="",type="URL_OPEN",url="https://youtube.com"),
    cd.Action(input="",type="URL_OPEN",url="https://twitch.tv", has_callback=True, callback={
        "type": "SAY_OUTPUT"
    })
]) 
```
What is important to note here is that the individual inputs of the `Action` objects inside of the `MultiAction` list do not matter, and can be omitted entirely. This is because only the input described in the top-level is what will be searched for (In this case, "VIDEOS" is the only input that will be searched for).

## Options
Options are the next step above Actions when creating a command JSON. Simply, options group together actions of similar input formats. For example, actions that only deal with URLs can be housed within the same option, as they have the same input format.
### Constructor Arguments
A `Option` object always requires three parameters for its constructor. Those parameters are:
|   Argument    |   Type    |   Default |   Description        |
|   :---:       |   :---:   |   :---:   |   :---:              |
|   `label`     |   string or list  |   `""`      |     Label for debugging     |
|   `format`     |   list   |   `[]`      |       Format for Input        |
|   `actionMap`  |   list    |   `[]`   |     List of `Action` or `MultiAction` objects     |

### Python Demo
```Python
import command_down as cd

cd.Option("Time and YouTube",["[W]"],[
    cd.Action("TIME", "CMD_LINE", command="TIME /T", has_callback=True, callback={
        "type": "SAY_OUTPUT",
    }),
    cd.Action("YOUTUBE", "URL_OPEN",url="https://youtube.com"),
])
```
## CommandLists
A `CommandList` object stores multiple commands to be outputted to a JSON file. The constructor of a `CommandList` only has 1 argument, a list of tuples containing a string(command key) and `Option` list pair. For example:
```Python
import command_down as cd

time_and_youtube = cd.Option("Time and YouTube",["[W]"],[
    cd.Action("TIME", "CMD_LINE", command="TIME /T", has_callback=True, callback={
        "type": "SAY_OUTPUT",
    }),
    cd.Action("YOUTUBE", "URL_OPEN",url="https://youtube.com"),
])

commands = cd.CommandList([
    ("OPEN",[time_and_youtube]),
])
commands.toJSON("commands.json")
```
The above code snippet creates a `commandList` object that has the "OPEN" command registered,with key "OPEN" and with option `time_and_youtube` (there can be more than one option). Then, the function `toJSON(fileName)` is called, which creates a JSON file called *fileName* that can be parsed by Samwise. Essentially, Samwise will listen for the command key called "OPEN", and then constantly check the options for possible actions to perform.