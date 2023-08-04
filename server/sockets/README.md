Contained here is a description of all the macros defined in `paths.h` (but not their actual values).

Absolute File paths:
----------------------
* `WRD`: Path to Microsoft Word
* `POWERPOINT`: Path to Microsoft Powerpoint
* `EXCEL`: Path to Microsoft Excel
* `STEAM`: Path to Steam
* `DISCORD`: Path to Discord
* `SHUTCOMPUTER`: Path to shutdown.bat

Numbers:
-----------
* `NUM_APPS`: The number of absolute file paths being used for the "OPEN" command
* `SHUTCODE`: A 2-digit number used to verify the "SHUTDOWN COMPUTER" command
* `TOKEN_LENGTH`: A number indicating the length of the `VERIFY_TOKEN` string (including null pointer)
* `PORTN`: A number used to indicate the port for the client to connect to

Strings or misc.
------------------
* `PORT`: String of numbers used to indicate the port for the server to connect to (Stringified version of `PORTN`)
* `NETWORK_IP`: The IP address (a string) used for connecting to devices within the same network
* `VERIFY_TOKEN`: An X-digit string Token used to verify that the client is an authorized user
* `HASPATH`: A macro used to show that paths.h is properly implemented for the source code (Can be any value)


The file `paths_template.h` has been provided with the macros already defined, but with incorrect values. These values can be filled in by you and the file renamed to paths.h for the source code to compile correctly.