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
    def __init__(self,conn,id,gid):
        self.GameSessionId = gid
        self.conn:socket.socket = conn
        self.gameId = id
        self.recvCallback = pseudoClient.dummyFunc
        self.thread=threading.Thread(target=self.recieveListener)
        self.running = True


        self.id = f"{self.GameSessionId}X{self.gameId}"

        self.table = [0 for i in range(9)]


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
        while self.running:
            try:
                data = self.conn.recv(2048)
                self.recvCallback(self,data)

            except Exception as e:
                print("An Error Has Occured:",e)
                traceback.print_tb(e.__traceback__)
                self.running=False
                break

        self.conn.close()

    def setGridBox(self,index,gameId):
        state = 3
        if gameId != self.gameId:
            state = 4

        self.sendData("setGridBox",index,state)

    def setTurn(self,gameId):
        state = 1
        if gameId != self.gameId:
            state = 2

        self.sendData("setTurn",state)


    def sendData(self,type, *args, **kwargs):
        data = {
            "type":type,
            "args":list(args),
            "kwargs": kwargs
            }
        print(f"Client:{self.id}..","Sending:",data)
        self.conn.send((str(data)+"<!>").replace("'",'"').encode())
