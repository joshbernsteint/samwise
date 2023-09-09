# Command Down Guide
### Overview
`command_down` is a way of generating a json file to register commands with a **Samwise Virtual Assistant**. 
* There are 4 components of writing a valid `command_down` script:   
    1. `Action`
        * Either via the `Action` or `MultiAction` classes
    2. `Option`
    3. `Command`
    4. `CommandList`
## Actions
Actions are the basic building blocks of `command_down`. An action simply takes an input, and performs an action when that input is received. There are many different types of actions, which are listed below. In Python, an `Action` class can only perform one action at a time. To do multiple actions per input, use the `MultiAction` class (We will go into more detail with this later).
### Constructor Arguments
When creating an `Action` object, there are arguments that **must** be included in the constructor if the values are different than the default.
|   Argument    |   Type    |   Default |
|   :---:       |   :---:   |   :---:   |
|   `input`     |   string  |   `""`      |
|   `type`     |   string   |   `""`      |
|   `has_response`  |   boolean     |   `False`   |
|   `has_callback`  |   boolean     |   `False`   |

Based on the `type` inputted in the constructor argument, additional arguments may be needed. See below for more details: 
#### Action Types
| Type          |       Required Args                     |    Description                          |
| :---:         |       :---:                             | :---:                                   |
| `FILE_OPEN`   |       `path` &ndash; Absolute file path |     Opens the file specified by `path`  |
| `URL_OPEN`    |       `url` &ndash; URL                 |     Opens the URL specified by `url`    |
|  `RUN_SCRIPT` |       `script_path` &ndash; Absolute file path <br/>to script | Runs the script specified by `script_path`    |
| `CMD_LINE`     |       `command` &ndash; Windows CMD | Runs command specified by `command` |
| `TIMER`       |       `NONE`                            |     Creates a timer based on the inputs |

Additionally, if True, the `has_response` and `has_callback` require additional arguments, `response` and `callback` respectively.

### Responses


### Callbacks

