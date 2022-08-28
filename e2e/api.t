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
    [input 'Search'] [button 'jspath:body > eo-root > eo-pages > div > div > div > eo-api > nz-layout > nz-sider > div > nz-content > nz-tabset > div > div > div.ant-tabs-tabpane.ant-tabs-tabpane-active.ng-star-inserted > div > eo-api-group-tree > header > div']=addBtn

addBtn -> hover

find:
    [label 'New API']=newApi
    [label 'New Group']

newApi -> click

find: 
    [button 'Save']=save
    [select 'POST']=method [input '/']=path
    [select 'Root directory'] [input 'jspath:#name']=name
    [input 'jspath:body > eo-root > eo-pages > div > div > div > eo-api > nz-layout > nz-layout > nz-content > div > section > eo-api-edit-edit > div > nz-collapse:nth-child(3) > nz-collapse-panel > div.ant-collapse-content.ng-tns-c220-32.ant-collapse-content-active.ng-trigger.ng-trigger-collapseMotion > div > nz-tabset > div > div > div.ant-tabs-tabpane.ant-tabs-tabpane-active.ng-star-inserted > eo-api-edit-body > list-block-common-component > div > div.wrap_table_container_lbcc.had_select_drag_wrap_lbcc.drag_wrap_lbcc > div.tbody_div_wrap.ng-scope > div > inner-html-common-directive > div > div > div > div.td-tbd.va-top-td-tbd.depth-td-tdb.plr5.th_drag_2_lbcc.po_re.ng-scope > div > input']=paramName [input 'jspath:body > eo-root > eo-pages > div > div > div > eo-api > nz-layout > nz-layout > nz-content > div > section > eo-api-edit-edit > div > nz-collapse:nth-child(3) > nz-collapse-panel > div.ant-collapse-content.ng-tns-c220-32.ant-collapse-content-active.ng-trigger.ng-trigger-collapseMotion > div > nz-tabset > div > div > div.ant-tabs-tabpane.ant-tabs-tabpane-active.ng-star-inserted > eo-api-edit-body > list-block-common-component > div > div.wrap_table_container_lbcc.had_select_drag_wrap_lbcc.drag_wrap_lbcc > div.tbody_div_wrap.ng-scope > div > inner-html-common-directive > div > div > div > div.td-tbd.input-tbd.va-top-td-tbd.plr5.th_drag_5_lbcc.po_re.ng-scope > input']=desc [input 'jspath:body > eo-root > eo-pages > div > div > div > eo-api > nz-layout > nz-layout > nz-content > div > section > eo-api-edit-edit > div > nz-collapse:nth-child(3) > nz-collapse-panel > div.ant-collapse-content.ng-tns-c220-32.ant-collapse-content-active.ng-trigger.ng-trigger-collapseMotion > div > nz-tabset > div > div > div.ant-tabs-tabpane.ant-tabs-tabpane-active.ng-star-inserted > eo-api-edit-body > list-block-common-component > div > div.wrap_table_container_lbcc.had_select_drag_wrap_lbcc.drag_wrap_lbcc > div.tbody_div_wrap.ng-scope > div > inner-html-common-directive > div > div > div > div.td-tbd.input-tbd.va-top-td-tbd.plr5.th_drag_6_lbcc.po_re.ng-scope > input']=example

method -> 'GET'
# TODO path => '/api/data'
path -> 'api/data'
name -> 'yoo'
paramName -> 'a'
desc -> 'adesc'
example -> 'a Example'
save -> click

capture
