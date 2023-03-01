Unicode true
# 前置的宏定义，部分bat脚本会提前预设，如果某一个宏被预设，则下面的相应的宏定义将不生效
!include "pre_define.nsh"

# ====================== 自定义宏 产品信息==============================
!define /ifndef PRODUCT_NAME           		"Postcat"		#产品名称
!define /ifndef PRODUCT_NAME_EN           	"Postcat"	#英文产品名称
!define /ifndef PRODUCT_PATHNAME			"Postcat"  		#安装与卸载项用到的KEY，与Electron中的guid相同
!define /ifndef INSTALL_APPEND_PATH         "Postcat"	 	#安装路径追加的名称 
!define /ifndef INSTALL_DEFALT_SETUPPATH    "$PROGRAMFILES32\${INSTALL_APPEND_PATH}"       #默认生成的安装路径  
!define /ifndef EXE_NAME               		"Postcat.exe"			#主程序EXE文件名
!define /ifndef PRODUCT_VERSION        		"2.5.0.0"				#版本号
!define /ifndef PRODUCT_PUBLISHER      		"Postcat"				#发布者
!define /ifndef PRODUCT_LEGAL          		"Postcat Copyright（c）2022"	#版权信息
!define /ifndef INSTALL_MODE_ALL_USERS 		"all"					# all current，是否安装到所有用户，默认为是，会影响注册表、快捷方式、开始菜单等
!define /ifndef INSTALL_EXECUTION_LEVEL 	"admin"					# 如果INSTALL_MODE_ALL_USERS使用current，则此处请同步改成user (RequestExecutionLevel none|user|highest|admin)
!define /ifndef INSTALL_OUTPUT_NAME    		"Test_PC_Setup_v2.5.0.exe"	#默认的安装包名称，在bat中控制传入 
!define /ifndef INSTALL_LOCATION_KEY 		"InstPath"				#默认的注册表中安装位置的key值
# ====================== 以下宏用于控制特定的行为 ==============================
!define /ifndef INSTALL_DEFAULT_AUTORUN  0		#默认是否自动开机启动
!define /ifndef INSTALL_DEFAULT_SHOTCUT  1		#默认是否添加快捷方式
!define /ifndef TEST_SLEEP 				 0		#测试安装过程中的延时开关，方便查看进度变化和轮播图，实际使用，请改成0
# ====================== 上述具体的宏定义均可以在pre_define.nsh文件中预先定义，可任意指定为其他的值 ==============================


# ====================== 自定义宏 安装信息==============================
!define INSTALL_7Z_PATH 	   		"..\app.7z"
!define INSTALL_7Z_NAME 	   		"app.7z"
!define INSTALL_RES_PATH       		"skin.zip"
!define INSTALL_LICENCE_FILENAME    "licence.rtf"
!define INSTALL_ICO 				"logo.ico"
!define UNINSTALL_ICO				"uninst.ico"

# ====================== 自定义宏 在线安装包控制项=======================
!define INSTALL_DOWNLOAD_BASEURL	"http://www.ggniu.cn/test_online_install/"
!define INSTALL_DOWNLOAD_CONFIG		"config.ini"
!define INSTALL_DOWNLOAD_SERVERFILENAME	"app.7z"	#此数据为服务器上的文件名，将追加到BASEURL后下载 
!define INSTALL_DOWNLOAD_IGNOREMD5	0				#如果此开关打开，则不读取配置，不校验MD5，直接下载
!define INSTALL_DOWNLOAD_INITSIZE	80102400		#不校验的情况下的服务器文件大概大小，用于显示进度
#!define INSTALL_DOWNLOAD_7Z    1   #/DINSTALL_DOWNLOAD_7Z=1
#安装包名称请使用 ${INSTALL_7Z_NAME}



# ==================== NSIS属性 ================================
#固定值，脚本中会有控制判断逻辑
InstallDir "1"	

# 安装包运行权限 (RequestExecutionLevel none|user|highest|admin)
RequestExecutionLevel ${INSTALL_EXECUTION_LEVEL}

; 安装包名字.
Name "${PRODUCT_NAME}"

# 安装程序文件名.
OutFile "..\..\..\release\${INSTALL_OUTPUT_NAME}"

# 安装和卸载程序图标
Icon              "${INSTALL_ICO}"
UninstallIcon     "uninst.ico"

ManifestDPIAware true

# ==================== 引用安装逻辑脚本 ================================
!include "..\setup_control.nsh"
!include "customize.nsh"