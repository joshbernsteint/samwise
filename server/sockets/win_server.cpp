#include <winsock2.h>
#include <windows.h>
#include <ws2tcpip.h>
#include <iphlpapi.h>
#include <stdio.h>

#include "paths.h" //This is omitted from GitHub because it contains security data
#include "command_id.h"
#include "printing.h"


#define CLEANUP WSACleanup();exit(EXIT_FAILURE);




/**
 * Creates a child process
 * @param cmd: Path to the executable
 * @param args: Command line arguments to the executable
 * @param si: A pointer to an empty STARTUPINFO struct
 * @param pi: A pointer to an empty PROCESS_INFORMATION struct
 * @return Integer value representing if the process creation was a success(0) or failure(-1)
*/
int makeProcess(const char* cmd,const char* args ,STARTUPINFO* si, PROCESS_INFORMATION* pi){
    char* real_cmd = (char*)cmd;
    char* real_args = (char*)args;
    ZeroMemory(si, sizeof(*si));
    si->cb = sizeof(*si);
    ZeroMemory(pi, sizeof(*pi));

    if(!CreateProcess(real_cmd, real_args, NULL, NULL, 0, CREATE_NO_WINDOW, NULL, NULL, si, pi))
    {
        //If there was an error in process creation
        printf("%sError: makeProcess failed: %s %s returned an error.%s\n",RED, cmd, args, BASE);
        return -1;
    }
    else{
        return 0;//The proccess was made successfully
    }
}


#ifdef HASPATH
/**
 * Parses the command_id and runs the appropriate command
 * @param command_id: The 4-digit command_id to be parsed
 * @param apps: A pointer to a list of strings
 * @return: 0 if everything went smoothly, 1 if something failed
*/
int parseCommand(int command_id, const char** apps){
    int opCode = command_id / 100;
    int argCode = command_id % 100;
    int retVal = 0;
    STARTUPINFO app_si;
    PROCESS_INFORMATION app_pi;


    switch (opCode)
    {
        case OPEN:
            if(argCode > 0 && argCode <= NUM_APPS)//Ensure the argCode is proper
            {
                retVal = makeProcess(apps[argCode-1],NULL,&app_si,&app_pi); // Creates the process to hold the app
            }
            else{
                retVal = -1;
            }
            break;
        case SHUTDOWN:
            if(argCode == SHUTCODE){
                //This will immediately shutdown the computer!
                TOCONSOLE("Shutting down computer...")
                // retVal = makeProcess(NULL,SHUTCOMPUTER,&app_si,&app_pi);
            }
            else{
                retVal = -1;
            }
            break;
        
        default:
            retVal = -1;
            break;
    }


    return retVal;
}


int main() {

    const char* apps[] = {WRD, POWERPOINT, EXCEL, STEAM, DISCORD};

    SOCKET serverSocket = INVALID_SOCKET;
    SOCKET clientSocket = INVALID_SOCKET;

    struct addrinfo* checkAddr = NULL;
    struct addrinfo serverAddr;

    WSADATA socketData;

    bool closeServer = false;
    int receivedNum = -1;
    int commandId = -1;
    char buffer[BUF_LEN];

    ZeroMemory(&serverAddr, sizeof(serverAddr));
    serverAddr.ai_family = AF_INET;
    serverAddr.ai_socktype = SOCK_STREAM;
    serverAddr.ai_protocol = IPPROTO_TCP;
    serverAddr.ai_flags = AI_PASSIVE;

    PRINTC(YELLOW,"Creating socket...");
    if(WSAStartup(MAKEWORD(2,2), &socketData) != 0){
        PRINTE("Server startup failed.");
        exit(EXIT_FAILURE);
    }
    if(getaddrinfo(NULL,PORT,&serverAddr,&checkAddr) != 0){
        PRINTE("Getting address info failed.");
        CLEANUP;
    }
    if((serverSocket = socket(checkAddr->ai_family,checkAddr->ai_socktype,checkAddr->ai_protocol)) == INVALID_SOCKET){
        PRINTE("Creating socket failed.");
        freeaddrinfo(checkAddr);
        CLEANUP;
    }
    PRINTC(GREEN, "Socket Created!");
    PRINTC(YELLOW,"Binding socket...");
    //Attempt to bind the socket to the server
    if(bind(serverSocket,checkAddr->ai_addr,(int)checkAddr->ai_addrlen) == SOCKET_ERROR){
        PRINTE("binding socket failed.");
        freeaddrinfo(checkAddr);
        closesocket(serverSocket);
        CLEANUP;
    }
    else{
        freeaddrinfo(checkAddr);
    }

    //Start listening
    if(listen(serverSocket,SOMAXCONN) == SOCKET_ERROR){
        PRINTE("Listening failed");
        closesocket(serverSocket);
        CLEANUP;
    }
    PRINTC(GREEN,"\nSocket successfully bound and listening!")


    PRINTC(CYAN,"Waiting for connections...")
    while(!closeServer){
        //Attempt to accept a socket
        if((clientSocket = accept(serverSocket, NULL, NULL)) == INVALID_SOCKET){
            PRINTE("Accepting socket failed.");
            closesocket(serverSocket);
            CLEANUP;
        }
        else{
            PRINTC(GREEN,"Connection established!");
            recv(clientSocket,buffer,BUF_LEN,0);
            receivedNum = atoi((buffer + TOKEN_LENGTH));
            if(strcmp(buffer,VERIFY_TOKEN) != 0){
                PRINTE(TOKEN_ERROR_MSG);
                send(clientSocket,TOKEN_ERROR,strlen(TOKEN_ERROR)+1,0);
            }
            else{
                send(clientSocket,TOKEN_CORRECT, strlen(TOKEN_CORRECT)+1,0);
                PRINTC(CYAN,TOKEN_CORRECT_MSG);
                commandId = receivedNum % 10000;
                if(commandId == 0){
                    PRINTC(YELLOW, "Shutting down the server...");
                    closeServer = true;
                }
                else if(parseCommand(commandId, apps) != 0){
                    printf("%sReceived unknown command id: %d.%s\n",YELLOW, commandId, BASE);

                }
            }

            closesocket(clientSocket);
            PRINTC(YELLOW, "Connection lost.\n");
        }
    } 

    //Server exiting
    PRINTC(YELLOW, "Server Closing!");
    closesocket(serverSocket);
    CLEANUP;

  return 0;
}
//If paths.h is not defined, the code will not properly compile
#else
int main(){
    PRINTE("paths.h is not defined!");
    return -1;
}
#endif