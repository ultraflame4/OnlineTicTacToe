import json
import socket
import threading
import typing
import clients

def askuntilrecieve(prompt):
    while True:
        inp = input(prompt)
        if inp != '':
            break

    return inp

def askWithdefault(prompt,default):
    print(prompt+f"[Default: {default}]")
    inp = input(prompt)
    if inp == '':
        print("using",default)
        return default
    return inp

run = True


server=askWithdefault("Server ip: ",'localhost')
port = int(askWithdefault("Server port: ",str(8888)))

"""
server="localhost"
port=8888
"""
serverip = socket.gethostbyname(server)

sessionId=0

class GameSession:
    def __init__(self):
        self.id = sessionId

        self.players:typing.List[clients.pseudoClient] = []
        self.running = True
        self.waiting = True

        self.table = [0 for i in range(9)]

        self.funcs = {"setGridBoxState":self.setGridBox}

        self.playerTurn = 1

    def rotatePlayer(self):
        if self.playerTurn == 1:
            self.playerTurn = 2
        else:
            self.playerTurn=1

        for i in self.players:
            i.setTurn(self.playerTurn)
            #print(f"Client:{i.id} : running: {i.running}")


    def printTable(self):
        for i in range(3):
            print()
            print(self.table[0+i*3],' ',end='')
            print(self.table[1+i*3],' ',end='')
            print(self.table[2+i*3],' ',end='')
        print()

    def setTable(self,gameId):
        for p in self.players:
            for i in range(9):
                p.table[i]=gameId
                p.setGridBox(i,gameId)


    def clearTable(self):
        self.table = [0 for i in range(9)]
        for p in self.players:
            for b in range(9):
                p.table[b] = 0
                p.sendData("table/setGridBox",b,0)


    def setGridBox(self,client:clients.pseudoClient,index):
        if self.playerTurn == client.gameId:
            if self.table[index] == 0:
                self.table[index] = client.gameId
                client.table[index] = 1
                self.printTable()

                for i in self.players:
                    i.setGridBox(index,client.gameId)

                if client.checkWin():
                    self.setTable(client.gameId)
                    clients.invoke(1,self.clearTable)

                self.rotatePlayer()


    def recieveAndReply(self,client,data,jsonData):

        if not data:
            print(f"[GameSession:{self.id}] Data is {data}. stopping...")
            self.running=False
        else:
            print(f"[GameSession:{self.id}] From Player", client.gameId, ":", jsonData)

            try:
                self.funcs[jsonData["type"]](client,*jsonData["args"],**jsonData["kwargs"])

            except KeyError as e:
                print("Function not found",e)


    def sendAll(self,type,*a,**kw):
        for i in self.players:
            i.sendData(type,*a,**kw)

    def updateLoop(self):
        self.rotatePlayer()
        self.rotatePlayer()
        while self.running:
            pass



        print(f"[GameSession:{self.id}] Closing Connection")



    def addPlayer(self,c):
        c.reset()
        if len(self.players) < 2:
            c.setGameSession(len(self.players) + 1, self.id,self)
            c.recvCallback = self.recieveAndReply

            self.players.append(c)

        if len(self.players) > 1:
            self.waiting = False
            self.startGame()

        print(f"\nadded [client:{c.id}] as player: {c.gameId} to game session: {self.id}")
        print(f"\nClient {c.id} running: {c.running}")

    def killSession(self,rClientId):
        """
        :param rClientId: The client that disconnected id
        """
        if not self.waiting:
            print(f"[GameSession:{self.id}] killSession(): killing")
            self.running=False

            for i in self.players:
                i.running=False


            if rClientId ==1:
                c = self.players[1]
            else:
                c = self.players[0]


            del self.players


            c.reset()

            setGameSession(c)
            killGameSession(self.id)

        else:
            self.players=[]


    def startGame(self):
        self.sendAll("Game Start")
        threading.Thread(target=self.updateLoop).start()
        for i in self.players:
            i.InActiveGame=True


LimboSession=GameSession()
sessionId+=1
GameSessions={}

connecteduserId=0
connected_users = []


def killGameSession(gid):

    del GameSessions[gid]

def setGameSession(pseudoclient):
    global LimboSession,sessionId
    if LimboSession.waiting:
        LimboSession.addPlayer(pseudoclient)
        GameSessions[LimboSession.id]=LimboSession
    else:
        sessionId+=1
        LimboSession = GameSession()
        LimboSession.addPlayer(pseudoclient)



with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    try:
        s.bind((serverip,port))
    except socket.error as e:
        print(str(e))


    s.listen()
    print("Waiting for connection...")

    while True:
        conn,addr = s.accept()
        print("Connected to:",addr)
        connected_users.append(clients.pseudoClient(conn,connecteduserId,addr))
        setGameSession(connected_users[-1])
        connecteduserId+=1
