del ".\SetupScripts\app.7z"

rem ����app.7z
7z.exe a ".\SetupScripts\app.7z" "..\release\win-unpacked\*.*"

@set DestPath=%cd%\..\release\win-unpacked\
@echo off& setlocal EnableDelayedExpansion

for /f "delims=" %%a in ('dir /ad/b %DestPath%') do (
7z.exe a ".\SetupScripts\app.7z" "..\release\win-unpacked\%%a"
@echo "compressing ..\release\win-unpacked\%%a"
)