@rem 此脚本表示外部已经打好electron的unpacked files，并且已经复制到我们的FilesToInstall下，我们只需要相应的打包成最终的安装包即可 
@rem 打包脚本名称，如leeqia_simple，对于于SetupScripts目录下的具体文件夹名称
@set project_name=%1
@rem 软件版本号
@set app_version=%2
@rem 完整的安装包名
@set output_setup_file_name=%3
@rem 等待打包文件所在目录名，默认为FilesToInstall
@set file_pack_path=%4
@rem 是否生成latest.yml，用于electron相关程序的打包 
@set gen_latest=%5


@rem 打包模式1是app.7z, 2是no7z，3是online (默认按7z模式打包，与electron默认行为保持一致)
@set package_mode=1


if "%file_pack_path%" == "" (
	@set file_pack_path=FilesToInstall
)

if "%gen_latest%" == "" (
	@set gen_latest=0
)

@call prepare.bat %project_name%

Call nsis-build-and-sign.bat .\SetupScripts\%project_name%\soft_setup.nsi %output_setup_file_name% %package_mode% %file_pack_path% %project_name% " "

@rem 生成安装包的latest.yml文件，便于后续自动升级使用 
if "%gen_latest%" == "1" (
	.\Helper\NSISHelper.exe --mode="generate_electron_update_config" --src="..\release\%output_setup_file_name%" --dst="..\release\latest.yml" --version="%app_version%" 
)

@echo "pack postcat finished!"

:: ".\output\%output_setup_file_name%"