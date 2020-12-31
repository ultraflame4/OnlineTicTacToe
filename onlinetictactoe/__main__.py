import sys
if len(sys.argv) < 2:
    print("Atleast 1 argument is required")
    print("Arguments Help:")
    print("client -> Launches the client for joining games")
    print("server -> Launches the server for hosting games")

else:
    arg = sys.argv[1]
    if arg == "client":
        print("Launching client...")
        from client_src import client_main

    elif arg == "server":
        print("Launching server...")
        from server_src import server_main
    else:
        print("\nInvalid argument")
        print("Expected 'client' or 'server'")