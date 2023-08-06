Contained here is a description of all the macros defined in `paths.h` (but not their actual values).

Absolute File paths:
----------------------
* `WRD`: Path to Microsoft Word
* `POWERPOINT`: Path to Microsoft Powerpoint
* `EXCEL`: Path to Microsoft Excel
* `STEAM`: Path to Steam
* `DISCORD`: Path to Discord
* `YOUTUBE`: Path to youtube.bat
* `SHUTCOMPUTER`: Path to shutdown.bat

Numbers:
-----------
* `NUM_APPS`: The number of absolute file paths being used for the "OPEN" command
* `SHUTCODE`: A 2-digit number used to verify the "SHUTDOWN COMPUTER" command
* `PORTN`: A number used to indicate the port for the client to connect to

Strings or misc.
------------------
* `PORT`: String of numbers used to indicate the port for the server to connect to (Stringified version of `PORTN`)
* `NETWORK_IP`: The IP address (a string) used for connecting to devices within the same network
* `VERIFY_TOKEN`: An X-digit string Token used to verify that the client is an authorized user
* `HASPATH`: A macro used to show that paths.h is properly implemented for the source code (Can be any value)


If there is not a `paths.h` file in this direcotry, then the two C++ files will not correctly compile.