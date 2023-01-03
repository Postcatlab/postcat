chcp 65001
For %%A in ("%cd%") do (
    @set Folder=%%~dpA
)
@set DestPath=%Folder%release\win-unpacked\
@echo off& setlocal EnableDelayedExpansion
@set DestFiles=%cd%\SetupScripts\app.nsh
del ".\SetupScripts\app.nsh"
@set total=1

@echo off
@rem 统计文件总数
for /f  "tokens=*" %%a in ('dir /s/b/a-d %DestPath%') do (
@set /a total+=1
)

@set curr=0
@set tmpValue=1

@rem 做首级目录处理
for /f "delims=*" %%d in ('dir /a-d/b %DestPath%') do (
set /a curr+=1
@echo Push !total!  >> %DestFiles%
@echo Push !curr!  >> %DestFiles%
@echo Call ExtractCallback >> %DestFiles%
@echo File "%DestPath%%%d"  >> %DestFiles%
@rem @echo  "%%d"
)

@rem 循环遍历各个子目录，进行处理，生成NSIS指令
@set dstString=
for /f "delims=*" %%a in ('dir /s/ad/b %DestPath%') do (

@set foldername=%%a
@set "foldername=!foldername:%DestPath%=%dstString%!"
@rem @echo !foldername!
@rem 截取出来相关的目录 设置OutputPath

@echo SetOutPath "$INSTDIR\!foldername!" >> %DestFiles%

@rem 循环其下的文件
for /f "delims=*" %%c in ('dir /a-d/b %%a') do (
@set /a curr+=1
@echo Push !total!  >> %DestFiles%
@echo Push !curr!  >> %DestFiles%
@echo Call ExtractCallback >> %DestFiles%
@echo File "%%a\%%c"  >> %DestFiles%
@rem @echo  "%%c"
)

)

@echo Push %total%  >> %DestFiles%
@echo Push %total%  >> %DestFiles%
@echo Call ExtractCallback >> %DestFiles%
chcp 936
