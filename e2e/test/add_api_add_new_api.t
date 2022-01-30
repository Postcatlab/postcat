
goto 'http://localhost:4200'

find:
    [input] [img] [label 'API']=btn [img]

btn -> click

find: 
    [button '保存']=save
    [label 'API Path']
    [select 'HTTP']=protocol [select 'POST']=type [input '/']=url
    [label '分组 / API 名称']
    [label '根目录'] [input]=name

type -> 'GET'
name -> '新Get接口'
url -> 'https://m.weibo.cn/api/container/getIndex'
save -> click

find:
    [input] [img] [label 'API']=btn [img]
    [label '新Get接口']=target

