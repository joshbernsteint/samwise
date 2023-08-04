#include <stdio.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <string.h>

#include "paths.h"//This is omitted from GitHub because it contains security data
#include "command_id.h"
#include "printing.h"


#ifdef HASPATH
int main(int argc,char* argv[]){

    int socketfd;
    int retVal = 0;
    struct sockaddr_in addr;
    socklen_t addr_size = sizeof(addr);

    //Creating the buffer to send to the server
    char buffer[BUF_LEN];
    strcpy(buffer, VERIFY_TOKEN);
    strcpy((buffer+TOKEN_LENGTH),argv[1]);

    //Attempting to create the socket
    if((socketfd = socket(PF_INET,SOCK_STREAM,0)) == -1){
        PRINTE("Creating socket failed.");
        return -1;
    }
    //Initialize addr
    memset(&addr, 0, sizeof(addr));
    addr.sin_family = AF_INET;
    addr.sin_port = htons(PORTN);
    addr.sin_addr.s_addr = inet_addr(NETWORK_IP);

    //Attempt to connect to the server
    if(connect(socketfd,(struct sockaddr*)&addr, addr_size) != 0){
        PRINTE("Connection to server failed.");
        return -1;
    }
    else{
        PRINTC(GREEN, "Successfully connected to the server!");
    }
    
    //Send a message to the server
    if(send(socketfd, buffer, BUF_LEN, 0) < 0){
        PRINTE("Send failed.")
        return -1;
    }
    recv(socketfd, buffer, BUF_LEN, 0);
    retVal = atoi(buffer);
    DEBUG(retVal);

    return 0;
}
#else
int main(){
    PRINTE("paths.h is not defined!");
    return -1;
}
#endif

