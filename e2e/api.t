=== API

--- API test

goto 'http://www.eoapi.io/en'

find: 
    [select 'POST'] = method  [input] = input [button 'Send'] = sendBtn 
    [label 'Headers'] = header

method -> 'GET'
input -> 'https://weibo.com/ajax/side/cards/sideInterested?count=60'
sendBtn -> click
wait 5000

find:
    [label 'Response']=res

res -> click

# TODO 查看测试历史

capture


--- add New

goto 'http://www.eoapi.io/en'

find:
    [input 'Search'] [button]=addBtn

addBtn -> hover

# find:
#     [label 'New API']=newApi
#     [label 'New Group']

# newApi -> click

# find: 
#     [button 'Save']=save
#     [select 'POST']=method [input '/']=path
#     [select 'Root directory'] [input]=name
#     [label 'Param Name']
#     [input]=paramName [input]=desc [input]=example

# method -> 'Get'
# # TODO path => '/api/data'
# path -> 'api/data'
# name -> yoo
# paramName -> 'a'
# desc -> 'adesc'
# example -> 'a Example'
# save -> click

# capture
