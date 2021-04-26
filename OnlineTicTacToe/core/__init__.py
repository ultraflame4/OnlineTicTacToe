"""
Common code shared between clients. Eg. Networking, protocols .. etc
"""
from . import server
from . import client

def testimport():
    print("OnlineTicTacToe Core imported successfully")


class GameSession:
    def __init__(self):
        self.player1:client.BaseClient=None
        self.player2:client.BaseClient=None


def startSingleplayerGame():
    print("[Core]: Starting singleplayer game session")

