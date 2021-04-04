import pygame
from . import gridtable
from . import network
from . import other

network.SessionManager.serverinfo_input()



pygame.init()
pygame.font.init()
window = pygame.display.set_mode([600, 370])
network.SessionManager.connect()
gridtable.TableManager.createTable(window)
scoreboard = other.PlayerTurnDisplay(window)
network.SessionManager.scoreboard = scoreboard

run = True


while run:
    other.EventManager.update()
    if other.EventManager.quit:
        network.SessionManager.run=False
        print("Killed session manager")
        network.SessionManager.killConnection()
        run = False


    window.fill((0,0,0))


    gridtable.TableManager.updateTable()
    scoreboard.draw()
    pygame.display.flip()