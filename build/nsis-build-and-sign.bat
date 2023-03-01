@set nsi_path=%1
@set output_filename=%2
@rem 打包模式1是app.7z, 2是no7z，3是online
@set package_mode=%3
@set uninst_name="Uninstall Postcat.exe"
@set unpacket_file_dir_name=%4
@set project_name=%5
@set more_macro=%6
@echo "11111111"
if "%%more_macro" == "" (
	@set more_macro=" "
)

@rem 替换掉双引号，否则会在打包时导致宏定义没传入 
setlocal enabledelayedexpansion
set more_macro=!more_macro:^"= !
@echo %more_macro%

@rem 是否在安装时自动生成卸载程序包，如果是，则不会有提前生成卸载程序并释放、签名、复制的过程
@set auto_write_uninst=0
@set auto_write_uninst_macro=
@set need_sign=1


if %auto_write_uninst% == 1 ( 
  @set auto_write_uninst_macro=/DAUTO_WRITE_UNINSTALL_FILE=1
) ^
else ( 
	@rem 生成带uninst.exe的安装包
	del ..\release\%output_filename%
	@echo sleep
	ping -n 3 127.0.0.1 > nul
	".\NSIS\makensis.exe" /DBUILD_FOR_GENERATE_UNINST=1 %more_macro% %auto_write_uninst_macro% /DUNINST_FILE_NAME=%uninst_name% /DINSTALL_OUTPUT_NAME=%output_filename% %more_macro% "%nsi_path%"
	@echo sleep
	ping -n 3 127.0.0.1 > nul
	del ..\release\%uninst_name%
	@rem 释放uninst.exe
	..\release\%output_filename%
	@rem uninst.exe签名
	if %need_sign% == 1 ( 
	    cd .\Sign\
		Call sign.bat ...\release\%uninst_name%
		cd ..\
	)	
	@echo "是时候给 Uninstall Postcat.exe 签名了"
	@rem 复制uninst.exe到FilesToInstall
	copy ..\release\%uninst_name% ".\%unpacket_file_dir_name%\"
	@echo "复制uninst.exe到FilesToInstall 完成！"
)

if "%package_mode%" == "1" ( 
	@rem 7z
	Call makeapp.bat %unpacket_file_dir_name%
) ^
else if "%package_mode%" == "2" ( 
	@rem no7z
	Call makensiscode.bat %unpacket_file_dir_name%
	@set more_macro=/DINSTALL_WITH_NO_NSIS7Z=1
) ^
else if "%package_mode%" == "3" ( 
	@rem 不将卸载程序放到安装包中，而是放到在线的app.7z中
	del ".\SetupScripts\app.nsh"
	@echo. >> ".\SetupScripts\app.nsh"
	
	@rem 生成在线的app.7z至Output目录下
	del "..\release\app.7z"
	7z.exe a "..\release\app.7z" ".\%unpacket_file_dir_name%\*.*" -r
	@rem 生成config.ini
	del "..\release\config.ini"
	"./Helper/NSISHelper.exe" --mode="generate_online_config" --src="%~dp0\Output\app.7z" --dst="%~dp0\Output\config.ini"
	
	@set more_macro=/DINSTALL_DOWNLOAD_7Z=1
)

@rem 打正常包
del ..\release\%output_filename%
@echo sleep
ping -n 3 127.0.0.1 > nul
@echo ".\NSIS\makensis.exe" %auto_write_uninst_macro% /DUNINST_FILE_NAME=%uninst_name% /DINSTALL_OUTPUT_NAME=%output_filename% %more_macro% "%nsi_path%"
".\NSIS\makensis.exe" %auto_write_uninst_macro% /DUNINST_FILE_NAME=%uninst_name% /DINSTALL_OUTPUT_NAME=%output_filename% %more_macro% "%nsi_path%"
@echo sleep
ping -n 3 127.0.0.1 > nul
@rem 如果要调试错误，请使用下面的脚本，这样会打开编译界面（命令行界面中文会显示成?号）
@rem ".\NSIS\makensisw.exe" %auto_write_uninst_macro% /DUNINST_FILE_NAME=%uninst_name% /DINSTALL_OUTPUT_NAME=%output_filename% %more_macro% "%nsi_path%"

@rem 最终安装包签名
if %need_sign% == 1 ( 
	cd .\Sign\
	Call sign.bat ..\Output\%output_filename%
	cd ..\
)