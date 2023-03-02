@rem 指定安装包名称
@set output_setup_file_name=General_PC_Setup_v2.5.0.exe
@set project_name=leeqia_general
@rem 打包模式1是app.7z, 2是no7z，3是online
@set package_mode=2

@call prepare.bat %project_name%

Call nsis-build-and-sign.bat .\SetupScripts\%project_name%\soft_setup.nsi %output_setup_file_name% %package_mode% FilesToInstall %project_name% " "

".\output\%output_setup_file_name%"