import sys
import random

GREEN = "\x1B[32m"
YELLOW = "\x1B[33m"
CYAN = "\x1B[36m"
RED = "\x1B[31m"
BASE = "\x1B[0m"

def printc(color,str):
    print(f'{color}{str}{BASE}')

def makeToken(length):
    invalid_chars = ['\\','"',"'"]
    #Get random number from 40 to 122 (inclusive)
    token_list = []
    for i in range(length):
        temp_char = '\\'
        while(temp_char in invalid_chars):
            temp_char = chr(random.randint(40,122))

        token_list.append(temp_char)
    
    return ''.join(token_list)


if __name__ == "__main__":
    token_length = input(f'{YELLOW}Please input the length of the token: {BASE}')
    try:
        token_length = int(token_length)
    except ValueError:
        printc(RED,"Error: Please input a number for token length")
        exit(1)
    
    printc(YELLOW,"Generating token...")
    token = makeToken(token_length)
    printc(GREEN,"Token successfully generated!\n")
    printc(CYAN,f'Token: {YELLOW}"{token}"')
    printc(CYAN,f'Length: {YELLOW}{token_length}')



