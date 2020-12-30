import json
import socket
import threading

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
        return default
    return inp


class SessionManager:
    host = "localhost"
    serverip = None
    port = 8888

    client:socket.socket=None
    run = True
    waiting=True

    thread=None

    gridtable=None

    scoreboard=None

    @staticmethod
    def serverinfo_input():
        print("f")
        SessionManager.host = askuntilrecieve("Server ip address: ")

        SessionManager.port = int(askWithdefault("Server port: ",str(8888)))



    @staticmethod
    def connect():
        SessionManager.serverip = socket.gethostbyname(SessionManager.host)

        SessionManager.client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        SessionManager.client.connect((SessionManager.serverip, SessionManager.port))
        SessionManager.thread=threading.Thread(target=SessionManager.serverListener)
        SessionManager.thread.start()


    @staticmethod
    def sendRequest(type, *args, **kwargs):
        data = {
            "type":type,
            "args":list(args),
            "kwargs": kwargs
            }
        print("Sending request with data:",data)
        SessionManager.client.send((str(data)+"<!>").encode())

    @staticmethod
    def killConnection():
        SessionManager.client.shutdown(socket.SHUT_RD)
        SessionManager.client.send("Gotta Go!".encode())
        SessionManager.client.shutdown(socket.SHUT_RDWR)
        SessionManager.client.close()


    @staticmethod
    def requestSetBoxState(index):

        SessionManager.sendRequest("setGridBoxState",index)



    @staticmethod
    def serverListener():
        while SessionManager.run:
            print("Running")
            data = SessionManager.client.recv(2048).decode()
            if not data:
                break

            else:
                for d in data.split("<!>"):
                    if d == '':
                        continue

                    print("loading",d)

                    jsonData = json.loads(d)


                    print("From server:",d)

                    if jsonData["type"] == "Game Start":
                        SessionManager.waiting=False

                    elif jsonData["type"] == "setGridBox":

                        SessionManager.gridtable.GridRectangles[jsonData["args"][0]].setState(jsonData["args"][1])

                    elif jsonData["type"] == "setTurn":
                        SessionManager.scoreboard.setTurn(jsonData["args"][0])


        print("Session listener stopped.")