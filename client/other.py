import threading
import time

import pygame


class EventManager:
    quit=False
    MouseUp = False

    @staticmethod
    def update():
        EventManager.reset()
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                EventManager.quit = True
            elif event.type == pygame.MOUSEBUTTONUP:
                EventManager.MouseUp=True

    @staticmethod
    def reset():
        EventManager.quit=False
        EventManager.MouseUp=False

class PlayerTurnDisplay(pygame.rect.Rect):
    colors = {1:(160, 255, 160),2:(255, 160, 160),3:(10, 255, 90),4:(255, 40, 85)}
    def __init__(self,win):
        self.win = win
        pygame.rect.Rect.__init__(self,370,10,220,350)
        self.color = (255,255,255)

    def setTurn(self,turn):
        self.color = PlayerTurnDisplay.colors[turn]


    def draw(self):
        pygame.draw.rect(self.win,self.color,self)