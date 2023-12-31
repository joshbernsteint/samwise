#include <stdio.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <string.h>
#include <string>

#include "paths.h"//This is omitted from GitHub because it contains security data
#include "command_id.h"
#include "printing.h"



#ifdef HASPATH
int main(int argc,char* argv[]){

    int socketfd;
    int retVal = 0;
    const int TOKEN_LENGTH = strlen(VERIFY_TOKEN) + 1;
    struct sockaddr_in addr;
    socklen_t addr_size = sizeof(addr);

    //Creating the buffer to send to the server
    char buffer[BUF_LEN];
    strcpy(buffer, VERIFY_TOKEN);
    strcpy((buffer+TOKEN_LENGTH),argv[1]);

    //Attempting to create the socket
    PRINTC(YELLOW, "Attempting to create socket...")
    if((socketfd = socket(PF_INET,SOCK_STREAM,0)) == -1){
        PRINTE("Creating socket failed.");
        return -1;
    }
    PRINTC(GREEN, "Socket successfully created!\n")

    //Initialize addr
    memset(&addr, 0, sizeof(addr));
    addr.sin_family = AF_INET;
    addr.sin_port = htons(PORTN);
    addr.sin_addr.s_addr = inet_addr(NETWORK_IP);

    //Attempt to connect to the server
    PRINTC(YELLOW, "Attempting to connect to server...")
    if(connect(socketfd,(struct sockaddr*)&addr, addr_size) != 0){
        PRINTE("Connection to server failed.");
        return -1;
    }
    else{
        PRINTC(GREEN, "Successfully connected to the server!\n");
    }
    
    //Send a message to the server
    if(send(socketfd, buffer, BUF_LEN, 0) < 0){
        PRINTE("Send failed.")
        return -1;
    }
    recv(socketfd, buffer, BUF_LEN, 0);
    TOCONSOLE(buffer);
    return 0;
}
#else
int main(){
    PRINTE("paths.h is not defined!");
    return -1;
}
#endif

