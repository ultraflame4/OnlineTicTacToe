import json
import threading
import socket
import traceback
import time


def invokeworker(secs,func):
    time.sleep(secs)
    func()


def invoke(secs,func):
    threading.Thread(target=invokeworker,args=(secs,func)).start()

class pseudoClient:
    def __init__(self,conn,id,addr):
        self.conn:socket.socket = conn

        self.GameSessionId = None
        self.gameId = None
        self.gameSession=None

        self.recvCallback = pseudoClient.dummyFunc

        self.running = True
        self.InActiveGame=False
        self.addr = addr
        self.id = id

        self.thread=threading.Thread(target=self.recieveListener,name=f"[Client:{self.id}-Thread]")
        self.table = [0 for i in range(9)]

        self.startListening()

    def reset(self):
        self.GameSessionId = None
        self.gameId = None
        self.gameSession=None
        self.recvCallback = pseudoClient.dummyFunc
        self.running = True
        self.InActiveGame=False
        self.table = [0 for i in range(9)]
        self.sendData("all/reset")

    def setGameSession(self,gameId,sessionId,session):
        self.GameSessionId = sessionId
        self.gameId = gameId
        self.gameSession = session


    def checkWin(self):
        # Grp1
        if self.table[0]:
            if self.table[1] and self.table[2]:
                return True
            elif self.table[4] and self.table[8]:
                return True
            elif self.table[3] and self.table[6]:
                return True
        if self.table[2]:
            if self.table[4] and self.table[6]:
                return True
            elif self.table[5] and self.table[8]:
                return True

        if self.table[4]:
            if self.table[3] and self.table[5]:
                return True
            elif self.table[1] and self.table[7]:
                return True
        if self.table[6] and self.table[7] and self.table[8]:
            return True

        return False


    def startListening(self):
        self.thread.start()



    @staticmethod
    def dummyFunc(*args):
        pass


    def recieveListener(self):
        print(f"[PClient:{self.id}] running:{self.running}")
        while self.running:
            try:
                data = self.conn.recv(2048)
                reply = data.decode().replace("'", '"')

                for d in reply.split('<!>'):
                    if d == '':
                        continue
                    print(d)
                    jsonData = json.loads(d)
                    print(f"\nFrom Client:{self.id}..{jsonData}")
                    if jsonData["type"] == "pClient/disconnect":
                        self.running=False
                        print(f"Client {self.id}: Goodbye")
                        self.gameSession.killSession(self.gameId)
                        continue




                    if self.InActiveGame:
                        self.recvCallback(self,data,jsonData)

            except Exception as e:
                print(f"[PClient:{self.id}] Error at recieveListener")
                print("An Error Has Occured:",e)
                traceback.print_tb(e.__traceback__)
                break

        print(f"[Client:{self.id}] Closing socket. [running: {self.running}]")
        self.conn.close()

    def setGridBox(self,index,gameId):
        state = 3
        if gameId != self.gameId:
            state = 4



        self.sendData("table/setGridBox",index,state)

    def setTurn(self,gameId):
        state = 1
        if gameId != self.gameId:
            state = 2

        self.sendData("player/setTurn",state)


    def sendData(self,type, *args, **kwargs):
        data = {
            "type":type,
            "args":list(args),
            "kwargs": kwargs
            }
        print(f"\nSending to Client:{self.id}..",data)

        self.conn.send((str(data)+"<!>").replace("'",'"').encode())
