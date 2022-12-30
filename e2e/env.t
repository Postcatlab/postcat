::: env_manage {

find:
    [label 'Environment'] = sel

sel -> click

find:
    [img] [label 'New'] = newLabel

newLabel -> click

}


::: add_data {
name -> '{$1}'
value -> '{$2}'
desc -> '{$3}'
}

=== Env 

--- add case

goto 'http://localhost:4200'

find:
    [label 'Environment'] = env

env -> click

find: 
    [label 'Environment'] [button { width: 32px }] = add

add -> click

find: 
    [button 'Save'] = save
    [input] = envName
    [label 'Host']
    [input] = host
    [input] = name [input] = value [input] = desc 

envName -> 'myEnv'
host -> 'https://youtube.com'

--- add_data :a :b :c

save -> click

find:
    [select 'Environment'] = sel

sel -> 'myEnv'

find: 
    [label 'myEnv'] [input]

capture



--- del case

goto 'http://localhost:4200'

find:
    [label 'Environment'] = env

env -> click

find: 
    [label 'Environment'] [button { width: 32px }] = add

add -> click

find: 
    [button 'Save'] = save
    [input] = envName
    [label 'Host']
    [input] = host
    [input] = name [input] = value [input] = desc 

envName -> 'myEnv'
host -> 'https://youtube.com'

--- add_data :a :b :c

save -> click

find: 
    [label 'myEnv'] = env

env -> hover

find: 
    [label 'Environment'] [button]
    [label 'myEnv'] [img] = delIcon

delIcon -> click

find: 
    [label 'Cancel'] [label 'OK']=ok
    
ok -> click

capture
