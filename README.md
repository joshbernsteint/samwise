# Samwise: A virtual Assistant
*Made by Joshua Bernstein*

## Introduction
* This program is a virtual assistant I designed to be able to accomplish simple tasks for me autonomously. 
* Samwise can do a variety of commands, each of them voice activated with specific arguments it requires
* This is not intended for use outside of my own computer, so I don't recommend using this yourself.
  * Although anyone is welcome to use it as a base for a virtual assistant they want to create

## Features
*Not filled in yet...*


## If you want to use it yourself...
If you want to use this virtual assistant yourself (for whatever reason), there are some files you have to add/edit
  1. You need to add an .env file with the following fields
       * `PORT`: A port for the front/backend to connect to
       * If you want to use Canvas functionality, you need a `CANVAS_TOKEN` field as wekk
  2. Under server/sockets, you need a header file called `paths.h`. This contains macros that are required for compiling the two C++ files
     * In that same directory, there is a file called `README` file that contains instructions on what `paths.h` contains
     * Follow the instructions in the `README` to change `paths_template.h`
