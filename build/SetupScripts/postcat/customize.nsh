Function CustomizeInit
	
FunctionEnd

Function un.CustomizeUnInit
	nsNiuniuSkin::SetControlAttribute $hInstallDlg "title" "visible" "true"
FunctionEnd

Function un.OnCustomizeUnInstall
	nsNiuniuSkin::SetControlAttribute $hInstallDlg "title" "textcolor" "0xFF333333"
	nsNiuniuSkin::SetControlAttribute $hInstallDlg "title" "bkimage" "file='images\logo_gray.png' dest='0,0,16,16'"
FunctionEnd

Function ResetUIByLanguageEx
	#此处用来替换安装过程中带文字的图片等
	#也可以用来根据不同的语言对控件的尺寸做微调 
	nsNiuniuSkin::GetCurrentLangId
	Pop $1

	${If} $1 == 2052
		
	${ElseIf} $1 == 1033

	${Endif}
FunctionEnd