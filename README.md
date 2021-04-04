# OnlineTicTacToe


This is a multiplayer TicTacToe
that can be hosted and played

## Rewrite branch.
This branch is **incompaitable** with other older versions
This is due to changes in protocol for client-serve communication
This rewrite version will also switch to a html-based client and 
the server code will be completely rewritten from scratch

This rewrite will also change the required dependencies.

Its basically almost a new project

### Installation instructions

1. Download this repository
2. Extract the downloaded zip file to a folder
3. Use the executables in the "standalones" folder 
   
   Note: the executables will only work for windows
   
   ( And windows defender and other antivirus will definately be triggered [Thus download fails, try again])


 **or**

1. Download python 3.9

2. Install with pip

``
pip install https://github.com/ultraflame4/OnlineTicTacToe/archive/master.zip
``

**or**

( May need git to be installed )

``
pip install git+https://github.com/ultraflame4/OnlineTicTacToe/
``


3. Host or Play!


### Instructions

To host a server,
``python -m OnlineTicTacToe server``

To join a server,
``python -m OnlineTicTacToe server client``

## Dependencies
* pygame
