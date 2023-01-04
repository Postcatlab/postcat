=== Websocket

--- add

goto "http://localhost:4200"

find:
    [label "New Request"] [img] = plus [img]

plus -> hover
wait

find: 
    [label "HTTP"]
    [label "Websocket"] = ws

ws -> click

find: 
    [input] = urlInput [button "Connect"] = connect

urlInput -> "wss://echo-websocket.hoppscotch.io"
connect -> click

wait 5000

find: 
    [button "Disconnect"] = disconnect

disconnect -> click

find: 
    [label "Disconnect from wss://echo-websocket.hoppscotch.io"] = disconnectSuccess
    [label "Connected to wss://echo-websocket.hoppscotch.io"] = connectSuccess

# check history

find: 
    [img] [img] = historyIcon [label "New Request"] = newRequest

newRequest -> click
historyIcon -> click

find:
    [label "History"]
    [label "wss://echo-websocket.hoppscotch.io"] = targetHistory
    
targetHistory -> click

find: 
    [label "Disconnect from wss://echo-websocket.hoppscotch.io"] = disconnectSuccess
    [label "Connected to wss://echo-websocket.hoppscotch.io"] = connectSuccess