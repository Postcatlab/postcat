@call makensiscode.bat

@call makeskinzip.bat nim

".\NSIS\makensis.exe" /DINSTALL_WITH_NO_NSIS7Z=1 ".\SetupScripts\nim\nim_setup.nsi"

@rem 如果要调试错误，请使用下面的脚本，这样会打开编译界面（命令行界面中文会显示成?号）
@rem ".\NSIS\makensisw.exe" /DINSTALL_WITH_NO_NSIS7Z=1 ".\SetupScripts\nim\nim_setup.nsi"
@pause