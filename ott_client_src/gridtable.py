import pygame
from . import network
from . import other


class GridBox(pygame.Rect):
    boxSize = 110
    offset = 10
    lineWidth = 10

    colors = {0:(255,255,255),1:(160, 255, 160),2:(255, 160, 160),3:(10, 255, 90),4:(255, 40, 85)}

    def __init__(self, window, i, row):
        pygame.Rect.__init__(self,
                             i * GridBox.boxSize + GridBox.offset + i * GridBox.lineWidth,
                             row * GridBox.boxSize + GridBox.offset + row * GridBox.lineWidth,
                             GridBox.boxSize,
                             GridBox.boxSize
                             )

        self.IndexNo=i+row*3

        self.window = window

        # 0 -> Normal
        # 1 -> Hovered (green) 2-> Hovered (red)
        # 3-> selected (green) 4-> Selected (red)
        self.state=0

    def isHovered(self):
        if self.collidepoint(*pygame.mouse.get_pos()) and self.state < 3:
            self.state = 1

        elif self.state < 2:
            self.state = 0



    def setState(self,state):
        self.state = state

    def requestSetState(self):
        print("Requesting Setstate")
        network.SessionManager.requestSetBoxState(self.IndexNo)

    def isClicked(self):
        if self.state==1 and other.EventManager.MouseUp and self.state < 3:
            self.requestSetState()

    def drawAndUpdate(self):

        self.isHovered()

        self.isClicked()

        pygame.draw.rect(self.window,GridBox.colors[self.state],self)

    def reset(self):
        self.state = 0


class TableManager:
    window = None
    GridRectangles = []


    @staticmethod
    def createTable(window):
        TableManager.window=window
        t=[[GridBox(TableManager.window, i, row) for i in range(3)]for row in range(3)]
        for y in t:
            for x in y:
                TableManager.GridRectangles.append(x)

        network.SessionManager.gridtable = TableManager

    @staticmethod
    def updateTable():
        for i in TableManager.GridRectangles:
            i.drawAndUpdate()

    @staticmethod
    def resetTable():
        for i in TableManager.GridRectangles:
            i.reset()


