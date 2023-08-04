# Samwise Roadmap
*July 31st, 2023*



### Version 0.0.1
* Features
  * Able to take in audio input and parse into commands
  * **Different commands**
    * `Open`
      * Used for opening an application
      * *Options*
        * `Word`
        * `PowerPoint`
        * `Excel`
        * `Steam`
    * `Set`
      * Changing config variables, or for setting a timer
      * *Options*
        * `[X] [T] timer`
* Implementation
  * Combination of NodeJS and vanilla javascript
* Limitations
  * Only work on Microsoft Edge / Google chrome

### Version 0.0.2 
* Features
  * **New commands**
    * `OPEN`
      * Enable multiple opens in a row (without repeating open)
    * `SET`
      * Enable for specific timers (i.e. set a 1hr30min timer)
* Implementation
  * Combination of NodeJS and vanilla javascript
* Limitations
  * Only work on Microsoft Edge / Google chrome

### Version 0.0.3 (**CURRENT VERSION**)
* Features
  * Backend: Canvas API helper functions
  * **New Commands**
    * `SHUTDOWN`
      * Shuts down the host computer
      * Requires a confirmation before executing
    * `STOP TIMER`
      * Stops the currently running timer
      * If more than one timer is currently active, ask the user to choose from a list
  * Bug fixes with voice parser
* Implementation
  * NodeJS and React
* Limitations
  * Only usable with Edge and Chrome (with internet)


