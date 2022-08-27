=== API

--- test

goto 'http://www.eoapi.io/en'

find: 
    [input] = input [button 'Send'] = sendBtn 
    [label 'Headers'] = header

input -> 'https://weibo.com/ajax/side/cards/sideInterested?count=60'
sendBtn -> click
