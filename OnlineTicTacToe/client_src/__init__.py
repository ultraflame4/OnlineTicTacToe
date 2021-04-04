import os

from cefpython3 import cefpython as cef
import platform
import sys

def check_versions():
    ver = cef.GetVersion()
    print("[ClientLauncher] CEF Python {ver}".format(ver=ver["version"]))
    print("[ClientLauncher] Chromium {ver}".format(ver=ver["chrome_version"]))
    print("[ClientLauncher] CEF {ver}".format(ver=ver["cef_version"]))
    print("[ClientLauncher] Python {ver} {arch}".format(
           ver=platform.python_version(),
           arch=platform.architecture()[0]))
    assert cef.__version__ >= "57.0", "CEF Python v57.0+ required to run this"


def getHtmlIndex():
    """Returns main html page"""

    return f"file:///{sys.path[0]}/OnlineTicTacToe/client_src/html/index.html"

def launchClient():
    check_versions()
    sys.excepthook = cef.ExceptHook  # To shutdown all CEF processes on error
    cef.Initialize()
    cef.CreateBrowserSync(url=getHtmlIndex(),
                          window_title="OnlineTicTacToe")
    cef.MessageLoop()
    cef.Shutdown()
