=== API

--- API test

goto 'http://localhost:4200'

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

goto 'http://localhost:4200'

find:
    [input 'Search'] [button 'xpath:body > eo-root > eo-pages > div > div > div > eo-api > nz-layout > nz-sider > div > nz-content > nz-tabset > div > div > div.ant-tabs-tabpane.ant-tabs-tabpane-active.ng-star-inserted > div > eo-api-group-tree > header > div']=addBtn

addBtn -> hover

find:
    [label 'New API']=newApi
    [label 'New Group']

newApi -> click

find: 
    [button 'Save']=save
    [select 'POST']=method [input '/']=path
    [select 'Root directory'] [input]=name
    # [input]=paramName [input]=desc [input]=example

method -> 'GET'
# TODO path => '/api/data'
path -> 'api/data'
name -> 'yoo'
# paramName -> 'a'
# desc -> 'adesc'
# example -> 'a Example'
# save -> click

capture
