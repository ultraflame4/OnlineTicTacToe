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
<strike>
1. Download this repository
2. Extract the downloaded zip file to a folder
3. Use the executables in the "standalones" folder 
   
   Note: the executables will only work for windows


**or**

1. Download python 3.9

2. Install pygame with pip
```
pip install pygame
```

3. Install with pip

``
pip install https://github.com/ultraflame4/OnlineTicTacToe/archive/master.zip
``

**or**

( May require git to be installed)

``
pip install git+https://github.com/ultraflame4/OnlineTicTacToe/
``


5. Host or Play!
</strike>

This version is currently unplayable

### Instructions

To host a server,
``python -m OnlineTicTacToe server``

To join a server,
``python -m OnlineTicTacToe server client``

## Dependencies
* pygame
