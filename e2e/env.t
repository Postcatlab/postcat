::: env_manage {

find:
    [label "Environment"] = sel

sel -> click

find:
    [img] [label "New"] = newLabel

newLabel -> click

}


::: add_data {
name -> "{$1}"
value -> "{$2}"
desc -> "{$3}"
}

=== Env 

--- add case

goto "http://localhost:4200"

find:
    [label "Environment"] = env

env -> click

find: 
    [label "Environment"] [img { height: 14px; width: 14px }] = add 

add -> click

find: 
    [button "Save"] = save
    [input] = envName
    [label "Host"]
    [input] = host
    [input] = name [input] = value [input] = desc 

envName -> "myEnv"
host -> "https://youtube.com"

--- add_data :a :b :c

save -> click

find:
    [img]
    [label "API"] = apiMenu

apiMenu -> click

find: 
    [label "Get City Weather Today"] = weatherApi

weatherApi -> click

find:
    [label "Preview"] [label "Edit"] [label "Test"] = testTab

testTab -> click

find:
    [img] [select "Environment"] = sel

sel -> "myEnv"

find:
    [label "https://youtube.com"] = target [input { height: 40px }]


--- del case

goto "http://localhost:4200"

find:
    [label "Environment"] = env

env -> click

find: 
    [label "Environment"] [button { width: 32px }] = add

add -> click

find: 
    [button "Save"] = save
    [input] = envName
    [label "Host"]
    [input] = host
    [input] = name [input] = value [input] = desc 

envName -> "myEnv"
host -> "https://youtube.com"

--- add_data :a :b :c

save -> click

find: 
    [label "myEnv"] = env

env -> hover

find: 
    [label "Environment"] [button { width: 32px }]
    [label "myEnv"] [img { height: 16px }] = delIcon [button "Save"]

delIcon -> click

find: 
    [button "Cancel"] [button "OK"]=ok
    
ok -> click
