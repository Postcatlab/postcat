=== API

--- API test

goto "http://localhost:4200"

find: 
    [img { width: 14px }] [img { width: 14px }] = history [label "New Request"]
    [select "POST"] = method  [input] = input [button "Send"] = sendBtn 
    [label "Headers"] = header

method -> "GET"
input -> "https://weibo.com/ajax/side/cards/sideInterested?count=60"
sendBtn -> click
wait 3000

find:
    [label "Response"]=res

res -> click
capture

history -> click

find:
    [label "https://weibo.com/ajax/side/cards/sideInterested?count=60"] = target

wait

--- add New API

goto "http://localhost:4200"

find:
    [input 'Search' { height: 22px }] [button '' { height: 32px; width: 32px }] = addBtn 

addBtn -> hover

find:
    [label "New API"]=newApi
    [label "New Group"]

newApi -> click

find: 
    [button "Save"] = save
    [select "POST"] = method [input "/"] = path
    [select "Root Group"] [input] = name
    # [input]=paramName [input]=desc [input]=example

method -> "GET"
# TODO path => '/api/data'
path -> "api/data"
name -> "yoo"
# paramName -> 'a'
# desc -> 'adesc'
# example -> 'a Example'
# save -> click

capture
