
chcp 65001
:: 打包脚本项目名称
@set project_name=%1
@set pre_define_file=.\SetupScripts\%project_name%\pre_define.nsh

@echo %pre_define_file%

:: 1111以下几项信息，我们均尝试从electron-builder的配置文件package.json中读取，如果你不想从里面读取，请指定名称，并注释掉下面读取的代码 (guid与版本号必需读取)
:: 1111应用程序名称，用于作为程序安装路径的扩展路径，同时也作为主程序名称
@set app_name=
:: electron程序中打包的guid，用于安装在注册表中的key(卸载与软件信息)
@set electron_guid=
:: 软件版本号
@set electron_app_version=

:: electron项目所在目录
@set electron_build_path=..\
@set electron_unpacked_dir=%electron_build_path%\release\win-unpacked
@del get_electron_app_version.bat
:: 读取packge.json文件，提取版本号
.\Helper\NSISHelper.exe --mode="get_electron_app_info" --save_key="electron_app_version" --read_key="version" --src="%electron_build_path%\package.json" --dst=".\get_electron_app_version.bat"
:: 读取packge.json文件，提取guid作为安装时注册表中的key
.\Helper\NSISHelper.exe --mode="get_electron_app_info" --save_key="electron_guid" --read_key="guid" --src="%electron_build_path%\package.json" --dst=".\get_electron_app_version.bat"
:: 读取packge.json文件，提取name作为安装包名称的一部分，也作为其主程序的名称
.\Helper\NSISHelper.exe --mode="get_electron_app_info" --save_key="app_name" --read_key="name" --src="%electron_build_path%\package.json" --dst=".\get_electron_app_version.bat"

Call get_electron_app_version.bat
@echo %electron_app_version%
@echo %electron_guid%
@echo %app_name%


:: 主程序名称 
@set main_exe_name=%app_name%.exe
:: 完整的安装包名称
@set output_setup_file_name=%app_name%-Setup-%electron_app_version%.exe

@echo %pre_define_file%
@del "%pre_define_file%"

:: #安装与卸载项用到的KEY，与Electron中的guid相同

@echo !define /ifndef PRODUCT_PATHNAME			  "%electron_guid%"  #安装与卸载项用到的KEY，与Electron中的guid相同	  >> %pre_define_file%

@echo !define /ifndef INSTALL_APPEND_PATH         "%app_name%"	 	#安装路径追加的名称  >> %pre_define_file%
@echo !define /ifndef EXE_NAME               	   "%main_exe_name%"			#主程序EXE文件名 >> %pre_define_file%
@echo !define /ifndef PRODUCT_VERSION        	   "%electron_app_version%.0"				#版本号	>> %pre_define_file%
@echo !define /ifndef INSTALL_OUTPUT_NAME    		"%output_setup_file_name%"	#默认的安装包名称，在bat中控制传入  >> %pre_define_file%
@echo !define /ifndef INSTALL_LOCATION_KEY 		    "InstallLocation"				#默认的注册表中安装位置的key值    >> %pre_define_file%
@echo !define /ifndef TEST_SLEEP 				 0		#测试安装过程中的延时开关，方便查看进度变化和轮播图，实际使用，请改成0    >> %pre_define_file%

:: 以下注释的这部分，都是在soft_setup.nsi中有默认的值，如果你要修改，则将下面的指定注释打开，并修改宏的值(也可以直接在soft_setup.nsi中修改)
:: @echo !define /ifndef PRODUCT_PUBLISHER      		"Leeqia"				#发布者    >> %pre_define_file%
:: @echo !define /ifndef PRODUCT_LEGAL          		"Leeqia Copyright(c)2020"	#版权信息    >> %pre_define_file%
:: @echo !define /ifndef INSTALL_MODE_ALL_USERS 		"current"					# all current，是否安装到所有用户，默认为是，会影响注册表、快捷方式、开始菜单等  >> %pre_define_file%
:: @echo !define /ifndef INSTALL_EXECUTION_LEVEL 	"user"					# 如果INSTALL_MODE_ALL_USERS使用current，则此处请同步改成user (RequestExecutionLevel none|user|highest|admin)  >> %pre_define_file%
:: 如果是安装到当前用户下，建议默认安装路径：$APPDATA\${INSTALL_APPEND_PATH}
:: @echo @echo !define /ifndef INSTALL_DEFALT_SETUPPATH    "$PROGRAMFILES32\${INSTALL_APPEND_PATH}"       #默认生成的安装路径   >> %pre_define_file%
:: @echo !define /ifndef INSTALL_DEFAULT_AUTORUN  0		#默认是否自动开机启动   >> %pre_define_file%
:: @echo !define /ifndef INSTALL_DEFAULT_SHOTCUT  0		#默认是否添加快捷方式   >> %pre_define_file%
:: @echo !define /ifndef TEST_SLEEP 				 1		#测试安装过程中的延时开关，方便查看进度变化和轮播图，实际使用，请改成0   >> %pre_define_file%


chcp 936 
:: 打包，生成unpacked files (如果你的打包脚本是其他的，则修改此处，在具体环境中打包可能报错，需要调整package.json中的electron和electron-builder的版本号)
cd %electron_build_path%
:: call npm run build
:: 切换回当前脚本所在目录
cd %~dp0
:: 复制文件到我们指定的打包目录 
@set local_pack_dir_name=.\ElectronInstall
rd /s /Q ".\%local_pack_dir_name%\"
md ".\%local_pack_dir_name%\"
xcopy %electron_unpacked_dir%\*.* .\%local_pack_dir_name%\ /s
:: 开始打包
Call build-by-external.bat %project_name% %electron_app_version% %output_setup_file_name% %local_pack_dir_name% 1
