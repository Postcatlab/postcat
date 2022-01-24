=== Env

::: open modal
goto 'http://localhost:4200'

find:
    [img] [label 'API'] [img] [select]=sel [img]

sel -> '管理环境'

wait 800


--- add new Env
--- open env modal

find:
    [label '环境名称']=jjj
    [input '']=envName
    [label '前置URL']
    [input '']=envUrl
    [label '环境变量：在接口文档或测试的过程中，使用{{变量名}}即可引用该环境变量']
    [input ''] = name [input ''] = value [input ''] = des
    [button '保存']=save [button '取消']=cancel

envName -> '环境名称A'
envUrl -> 'http://www.youtube.com'
name -> 'AA'
# value -> 'aa'
# des -> '变量A'
save -> click

# capture

wait 

cancel -> click

sel -> '环境名称A'

wait

find: 
    [label 'http://www.youtube.com'] = url

# capture

