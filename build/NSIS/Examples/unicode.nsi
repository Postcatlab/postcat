; Unicode installers will not be able to run on Windows 9x!
Unicode true

Name "Unicode Games"
OutFile "unicode.exe"
RequestExecutionLevel User
ShowInstDetails show
XPStyle on


Section "Unicode in UI"

	DetailPrint "Hello World!"
	DetailPrint "שלום עולם!"
	DetailPrint "مرحبا العالم!"
	DetailPrint "こんにちは、世界！"
	DetailPrint "你好世界！"
	DetailPrint "привет мир!"
	DetailPrint "안녕하세요!"

	DetailPrint "${U+00A9}" # arbitrary unicode chars

SectionEnd


Section "Unicode in Files"

	Var /Global Message

	InitPluginsDir
	FileOpen $0 "$PluginsDir\Test.txt" w
	IfErrors done
	FileWriteUTF16LE /BOM $0 "Hello World "
	FileWriteWord $0 0xD83C # Manually write ${U+1F30D}
	FileWriteWord $0 0xDF0D # as surrogate-pair
	FileWriteUTF16LE $0 " and Sun ${U+2600}$\r$\n"
	FileClose $0

	FileOpen $0 "$PluginsDir\Test.txt" r
	IfErrors done
	FileReadUTF16LE $0 $Message
	FileClose $0

	DetailPrint "Message: $Message"
	done:

SectionEnd
