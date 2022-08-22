::: env_manage {

find: (<)
    [select 'Environment'] = sel

sel -> 'Mangage Environment'

find: (<)
    [icon] [label 'New'] = newLabel

newLabel -> click
}

::: modal_layout {
find: 
    [input] = envName
    [input] = host
    [input] = name [input] = value [input] = desc [icon] 
    [button 'Save'] = save
}

::: add_data {
name -> '{$1}'
value -> '{$2}'
desc -> '{$3}'
}

=== Env 

--- add case

goto 'http://localhost:4200'

--- env_manage

--- modal_layout

envName -> 'myEnv'
host -> 'https://youtube.com'

--- add_data :a:b:c

save -> click

find: (<)
    [label 'myEnv']

find: (<)
    [select 'Environment'] = sel

sel -> 'myEnv'

find: 
    [label 'myEnv'] [input]



--- del case

goto 'http://localhost:4200'

--- env_manage

--- modal_layout

envName -> 'myEnv'
host -> 'https://youtube.com'

--- add_data :a:b:c

save -> click
sel -> hover

find: 
    [label 'myEnv'] [icon] = del_icon
icon -> click

find: 
    [label 'Cancel'] [label 'OK']=OK
ok -> click

find: (!)
    [label 'myEnv']


