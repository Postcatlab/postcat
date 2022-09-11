=== Websocket

--- add

goto 'http://localhost:4200'

find:
    [label 'New Request'] [img] = plus [img] [img]

plus -> hover
wait 500

find: 
    [label 'HTTP']
    [label 'Websocket'] = ws

ws -> click

find: 
    [select 'WS'] [input] = urlInput [button 'Connect'] = connect

urlInput -> 'wss://echo-websocket.hoppscotch.io'
connect -> click

wait 1000

find: 
    [button 'Disconnect'] = disconnect
    [input 'body > eo-root > eo-pages > div > div > div > eo-api > nz-layout > nz-layout > nz-content > div > section > websocket-content > div > eo-split-panel > div > div.flex-shrink-0.scalable > div > nz-tabset > div > div > div.ant-tabs-tabpane.ant-tabs-tabpane-active.ng-star-inserted > div > eo-monaco-editor > nz-code-editor > div > div.overflow-guard > div.monaco-scrollable-element.editor-scrollable.vs.mac > div.lines-content.monaco-editor-background > div.view-lines.monaco-mouse-cursor-text'] = text
    [button 'Send'] = sendBtn

text -> 'hello'
sendBtn -> click

wait 3000

disconnect -> click

capture


