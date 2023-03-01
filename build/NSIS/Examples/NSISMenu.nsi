OutFile "NSIS.exe"
Name "NSIS Menu"
Unicode True
RequestExecutionLevel User
XPStyle On
ManifestDPIAware System
SetCompressor LZMA
ChangeUI IDD_INST "${NSISDIR}\Contrib\UIs\modern_headerbmp.exe"
Icon "${NSISDIR}\Contrib\Graphics\Icons\nsis-menu.ico"
BrandingText " "
MiscButtonText " " " " " " " "
InstallButtonText " "
CompletedText " "
LangString ^ClickInstall 0 " "
Caption "$(^Name)"

!macro UNPACKVERFIELD out in shr mask fmt
!define /redef /math ${out} ${in} >>> ${shr}
!define /redef /math ${out} ${${out}} & ${mask}
!define /redef /intfmt ${out} "${fmt}" ${${out}}
!macroend

!ifndef VER_MAJOR & VER_MINOR
!ifdef NSIS_PACKEDVERSION
!insertmacro UNPACKVERFIELD VER_MAJOR ${NSIS_PACKEDVERSION} 24 0x0ff "%X"
!insertmacro UNPACKVERFIELD VER_MINOR ${NSIS_PACKEDVERSION} 12 0xfff "%X"
!insertmacro UNPACKVERFIELD VER_REVISION ${NSIS_PACKEDVERSION} 4 255 "%X"
!insertmacro UNPACKVERFIELD VER_BUILD ${NSIS_PACKEDVERSION} 00 0x00f "%X"
!endif
!endif
!ifdef VER_MAJOR & VER_MINOR
!define /ifndef VER_REVISION 0
!define /ifndef VER_BUILD 0
!searchreplace VERSTR "${NSIS_VERSION}" "v" ""
VIProductVersion ${VER_MAJOR}.${VER_MINOR}.${VER_REVISION}.${VER_BUILD}
VIAddVersionKey "ProductName" "NSIS"
VIAddVersionKey "ProductVersion" "${VERSTR}"
VIAddVersionKey "FileVersion" "${VERSTR}"
VIAddVersionKey "FileDescription" "NSIS Menu"
VIAddVersionKey "LegalCopyright" "http://nsis.sf.net/License"
!endif

!include nsDialogs.nsh
!include WinMessages.nsh
!include LogicLib.nsh
!define /IfNDef IDC_CHILDRECT 1018
!define QUIT_ON_EXECUTE
!define PR $ExeDir ; Local root path
!define PD "Docs" ; Local with WWW fallback (located at the same relative path)
!define WWW "http://nsis.sf.net"

!define CB_HEADER '0x755585 0x222222'
!define UY_HEADER 28
!define CT_PAGE '0x000000 0xaaaaaa'
!define CB_PAGE '0xffffff 0x111111'
!define CT_SECTION '0x666666 0xeeeeee'
!define CB_SECTION '${CB_PAGE}'
!define UY_SECTION 11 ; Height of a section
!define UY_SECTIONBPAD 2 ; Extra padding on the bottom of section headers
!define UY_TXT 9 ; Height of a normal item
!define UY_TXTBPAD 1 ; Extra padding on the bottom of normal items
!define UX_COLPAD 7 ; Spacing between columns
!define UY_ROW2 104 ; Absolute position of the 2nd row
!define CT_LINK '0x0c6e97 0x0c6e97' ; SYSCLR:HOTLIGHT
!define /Math UX_PAGE 00 + ${UX_COLPAD}
!define /Math UY_PAGE ${UY_HEADER} + 20
!define UX ${UX_PAGE}
!define CB_FOOTERLINE '0xc4c4c4 0x333333'
!define CT_FOOTER '0xbbbbbb 0x444444'

Var UseLightTheme

Function .onGUIInit
ReadRegDWORD $UseLightTheme HKCU "Software\NSIS" "UseLightTheme"
StrCmp $UseLightTheme "" 0 +2
ReadRegDWORD $UseLightTheme HKCU "Software\Microsoft\Windows\CurrentVersion\Themes\Personalize" "AppsUseLightTheme"
StrCmp $UseLightTheme "" 0 +2
StrCpy $UseLightTheme 1 ; Default

StrCmp $UseLightTheme "0" 0 +5
System::Call 'DWMAPI::DwmSetWindowAttribute(p$hWndParent,i20,*i1,i4)i.r0' ; 20H1
IntCmp $0 0 +3 +3
System::Call 'DWMAPI::DwmSetWindowAttribute(p$hWndParent,i19,*i1,i4)i.r0' ; ; 19H1
System::Call 'USER32::SetProp(p$hWndParent,t"UseImmersiveDarkModeColors",i1)' ; 1809
FunctionEnd

!define SetCtlColors "!insertmacro SetCtlColors "
!macro SetCtlColors hWnd ctlig ctdar cblig cbdar
StrCmp $UseLightTheme "0" 0 +3
SetCtlColors ${hWnd} "${ctdar}" ${cbdar}
Goto +2
SetCtlColors ${hWnd} "${ctlig}" ${cblig}
!macroend


Function PageLeave
System::Call 'USER32::GetFocus()p.r0'
System::Call 'USER32::GetDlgCtrlID(pr0)i.r1'
System::Call 'USER32::GetParent(pr0)p.r2'
SendMessage $2 ${WM_COMMAND} $1 $0 ; Handle <ENTER> in dialog by pretending it was a click on the active control
Abort
FunctionEnd

Function PageCreate
GetDlgItem $0 $hWndParent 1
ShowWindow $0 0
GetDlgItem $0 $hWndParent 2
ShowWindow $0 0

System::Call 'USER32::GetClientRect(p$hWndParent,@r0)'
System::Call '*$0(i,i,i.r3,i.r4)'
GetDlgItem $0 $hWndParent ${IDC_CHILDRECT}
System::Call 'USER32::MoveWindow(pr0,i0,i0,ir3,ir4,i0)'

nsDialogs::Create ${IDC_CHILDRECT}
Pop $R9
${SetCtlColors} $R9 ${CT_PAGE} ${CB_PAGE}

!macro StartColumn W
!define /ReDef UY ${UY_PAGE}
!define /ReDef UX_W ${W}
!ifdef UX_INTERNAL_PREV_W
!define /ReDef /Math UX ${UX} + ${UX_INTERNAL_PREV_W}
!define /ReDef /Math UX ${UX} + ${UX_COLPAD}
!define /ReDef UX_INTERNAL_PREV_W ${UX_W}
!else
!define /Math UX_INTERNAL_PREV_W 0 + ${UX_W}
!endif
!macroend
!macro CreateHeader Txt W
!define /ReDef /Math W ${W} + 4 ; Make it slightly wider
${NSD_CreateLabel} ${UX}u ${UY}u ${W}u ${UY_SECTION}u "${Txt}"
Pop $0
${SetCtlColors} $0 ${CT_SECTION} transparent transparent
SendMessage $0 ${WM_SETFONT} ${HF_HEADER} 1
!define /ReDef /Math UY ${UY} + ${UY_SECTION}
!define /ReDef /Math UY ${UY} + ${UY_SECTIONBPAD}
!macroend
!macro CreateControl Class Txt W H
${NSD_Create${Class}} ${UX}u ${UY}u ${W}u ${H}u "${Txt}"
!define /ReDef /Math UY ${UY} + ${H}
!define /ReDef /Math UY ${UY} + ${UY_TXTBPAD}
!macroend
!macro CreateSimpleLinkHelper Txt Url W
!insertmacro CreateControl Link "${Txt}|${Url}" ${W} ${UY_TXT}
!macroend
!macro CreateSimpleLink Txt Url W
!insertmacro CreateSimpleLinkHelper "${Txt}" "${Url}" ${W}
Call ConfigureLink
!macroend


; --- Header ---
!define HF_HEADER $R8
CreateFont ${HF_HEADER} "Arial" ${UY_SECTION} 700

nsDialogs::CreateControl ${__NSD_Label_CLASS} ${__NSD_Label_STYLE} ${__NSD_Label_EXSTYLE} 33u 0 -33u ${UY_HEADER}u ""
Pop $0
${SetCtlColors} $0 0xffffff 0xffffff ${CB_HEADER}

; CCv5 does not paint the background outside of the icon correctly when SS_CENTERIMAGE is used so we have to overlay a small icon on top of the background
nsDialogs::CreateControl ${__NSD_Icon_CLASS} ${__NSD_Icon_STYLE} ${__NSD_Icon_EXSTYLE} 4u 4u 33u ${UY_HEADER}u ""
Pop $0
${SetCtlColors} $0 "" "" ${CB_HEADER}
${NSD_SetIconFromInstaller} $0 $1
nsDialogs::CreateControl ${__NSD_Icon_CLASS} ${__NSD_Icon_STYLE}|${SS_CENTERIMAGE}|${SS_CENTER} ${__NSD_Icon_EXSTYLE} 0 0 33u ${UY_HEADER}u ""
Pop $0
${SetCtlColors} $0 "" "" ${CB_HEADER}

CreateFont $1 "Trebuchet MS" 17
!searchreplace VERSTR "${NSIS_VERSION}" "v" ""
nsDialogs::CreateControl ${__NSD_Label_CLASS} ${__NSD_Label_STYLE}|${SS_CENTERIMAGE}|${SS_ENDELLIPSIS} ${__NSD_Label_EXSTYLE} 34u 1u -34u ${UY_HEADER}u "nullsoft scriptable install system ${VERSTR}"
Pop $0
SetCtlColors $0 0x3A2A42 transparent
SendMessage $0 ${WM_SETFONT} $1 1
nsDialogs::CreateControl ${__NSD_Label_CLASS} ${__NSD_Label_STYLE}|${SS_CENTERIMAGE}|${SS_ENDELLIPSIS} ${__NSD_Label_EXSTYLE} 33u 0 -33u ${UY_HEADER}u "nullsoft scriptable install system ${VERSTR}"
Pop $0
SetCtlColors $0 0xffffff transparent
SendMessage $0 ${WM_SETFONT} $1 1


; --- Page ---
!insertmacro StartColumn 90
!insertmacro CreateHeader "Compiler" ${UX_W}
!insertmacro CreateSimpleLink "Compile NSI scripts" "${PR}\MakeNSISW" ${UX_W}
!insertmacro CreateSimpleLink "Installer based on .ZIP file" "${PR}\bin\Zip2Exe" ${UX_W}


!define /ReDef UY ${UY_ROW2}
!insertmacro CreateHeader "Developer Center" ${UX_W}
!define /ReDef UY_MULTILINE 42
!insertmacro CreateControl Label "Many more examples, tutorials, plug-ins and NSIS-releted software are available at the online Developer Center." ${UX_W} ${UY_MULTILINE}
Pop $0
${SetCtlColors} $0 ${CT_PAGE} ${CB_PAGE}


!insertmacro StartColumn 80
!insertmacro CreateHeader "Documentation" ${UX_W}
!insertmacro CreateSimpleLink "NSIS Users Manual" "${PR}\NSIS.chm|${WWW}/Docs/" ${UX_W}
!insertmacro CreateSimpleLink "Example scripts" "${PR}\Examples|${WWW}/Examples" ${UX_W}
!insertmacro CreateSimpleLink "Modern UI 2" "${PD}\Modern UI 2\Readme.html" ${UX_W}


!define /ReDef UY ${UY_ROW2}
!insertmacro CreateHeader "Online Help" ${UX_W}
!insertmacro CreateSimpleLink "Developer Center" "${WWW}/Developer_Center" ${UX_W}
!insertmacro CreateSimpleLink "FAQ" "${WWW}/FAQ" ${UX_W}
!insertmacro CreateSimpleLink "Forum" "http://forums.winamp.com/forumdisplay.php?forumid=65" ${UX_W}
;"Project Tracker" "http://sourceforge.net/tracker/?group_id=22049"
!insertmacro CreateSimpleLink "Bug Tracker" "http://sourceforge.net/tracker/?group_id=22049&atid=373085" ${UX_W}
!insertmacro CreateSimpleLink "Stackoverflow" "http://stackoverflow.com/questions/tagged/nsis" ${UX_W}
!insertmacro CreateSimpleLink "Chat" "${WWW}/r/Chat" ${UX_W}
;insertmacro CreateSimpleLink "IRC channel" "irc://irc.landoleet.org/nsis" ${UX_W}
;"Pastebin" "http://nsis.pastebin.com/index/1FtyKP89"
;"Search" "http://www.google.com/cse/home?cx=005317984255499820329:c_glv1-6a6a"


!insertmacro StartColumn 130
!insertmacro CreateHeader "Plug-ins" ${UX_W}
!macro CreatePluginLink Name Desc Url
!define /ReDef SAVE_UY ${UY}
!insertmacro CreateSimpleLinkHelper "${Name}" "${Url}" ${UX_W} ; AdjustLinkPair will configure this link
!define /ReDef UY ${SAVE_UY}
!insertmacro CreateControl Label "${Name} - ${Desc}" ${UX_W} ${UY_TXT}
Call AdjustLinkPair
!macroend
!insertmacro CreatePluginLink "AdvSplash" "splash with fade in/out"     "${PD}\AdvSplash\advsplash.txt"
!insertmacro CreatePluginLink "Banner"    "banner with custom text"     "${PD}\Banner\Readme.txt"
!insertmacro CreatePluginLink "BgImage"   "background image"            "${PD}\BgImage\BgImage.txt"
!insertmacro CreatePluginLink "Dialer"    "internet connection"         "${PD}\Dialer\Dialer.txt"
!insertmacro CreatePluginLink "Math"      "math operations"             "${PD}\Math\Math.txt"
!insertmacro CreatePluginLink "nsDialogs" "custom wizard pages"         "${PD}\nsDialogs\Readme.html"
!insertmacro CreatePluginLink "nsExec"    "launch command line tools"   "${PD}\nsExec\nsExec.txt"
!insertmacro CreatePluginLink "NSISdl"    "download files"              "${PD}\NSISdl\Readme.txt"
!insertmacro CreatePluginLink "Splash"    "splash screen"               "${PD}\Splash\splash.txt"
!insertmacro CreatePluginLink "StartMenu" "Start Menu folder selection" "${PD}\StartMenu\Readme.txt"
!insertmacro CreatePluginLink "System"    "Windows API calls"           "${PD}\System\System.html"
!insertmacro CreatePluginLink "VPatch"    "update existing files"       "${PD}\VPatch\Readme.html"


; --- Footer ---
${NSD_CreateLabel} 0 -22u 100% 1 ""
Pop $0
${SetCtlColors} $0 000000 000000 ${CB_FOOTERLINE}

nsDialogs::CreateControl ${__NSD_Label_CLASS} ${__NSD_Label_STYLE}|${SS_CENTERIMAGE}|${SS_NOTIFY} ${__NSD_Label_EXSTYLE} -110u -20u 100% 20u "nsis.sourceforge.net"
Pop $0
${SetCtlColors} $0 ${CT_FOOTER} transparent transparent
SendMessage $0 ${WM_SETFONT} ${HF_HEADER} 1
nsDialogs::SetUserData $0 "https://nsis.sourceforge.io"
${NSD_OnClick} $0 OnLinkClick

nsDialogs::Show
FunctionEnd

Function OnLinkClick
Pop $1 ; HWND
nsDialogs::GetUserData $1
Call SplitPipe
Pop $0 ; First URL in UserData from SplitPipe
StrCpy $3 ""
StrCpy $1 $0 4 ; Copy length of ${PD}
${IfThen} $1 == "${PD}" ${|} StrCpy $3 "${PR}\" ${|}
!ifdef QUIT_ON_EXECUTE
System::Call 'USER32::GetKeyState(i0x11)i.r9' ; VK_CONTROL
!endif
ClearErrors
ExecShell "" "$3$0"
Pop $1 ; ... the rest of SplitPipe ...
${If} $1 != ""  ; ... might contain a fallback location
	StrCpy $0 $1
	StrCpy $3 ""
${ElseIf} $3 != "" ; Local docs path failed, use WWW fallback
	StrCpy $3 0
	slashconvloop:
		StrCpy $2 $0 1 $3
		${If} $2 == "\"
			StrCpy $2 $0 $3
			IntOp $3 $3 + 1
			StrCpy $0 $0 "" $3
			StrCpy $0 "$2/$0"
		${Else}
			IntOp $3 $3 + 1
		${EndIf}
		StrCmp $2 "" 0 slashconvloop
	StrCpy $3 "${WWW}/"
${EndIf}
${If} "$3$1" != ""
${AndIf} ${Errors}
	ExecShell "" "$3$0"
${EndIf}
${If} ${Errors}
	!ifdef QUIT_ON_EXECUTE
	StrCpy $9 0 ; Don't allow close
	!endif
	MessageBox MB_IconStop 'Error: Unable to open "$0"!'
${EndIf}
!ifdef QUIT_ON_EXECUTE
${IfThen} $9 < 0 ${|} SendMessage $hWndParent ${WM_CLOSE} 0 0 ${|}
!endif
FunctionEnd

Function ConfigureLink
Pop $1 ; HWND
${NSD_OnClick} $1 OnLinkClick
${SetCtlColors} $1 ${CT_LINK} ${CB_PAGE}
${NSD_GetText} $1 $4
Push $4
Call SplitPipe
Pop $4
Pop $2
${NSD_SetText} $1 $4
nsDialogs::SetUserData $1 $2
System::Call 'USER32::GetDC(pr1)p.r3'
SendMessage $1 ${WM_GETFONT} 0 0 $5
System::Call 'GDI32::SelectObject(pr3,pr5)p.s'
StrLen $5 $4
System::Call 'GDI32::GetTextExtentPoint32(pr3,tr4,ir5,@r5)'
System::Call '*$5(i.r6)'
System::Call 'GDI32::SelectObject(pr3,ps)'
System::Call 'USER32::ReleaseDC(pr1,pr3)'
System::Call 'USER32::GetWindowRect(pr1,@r3)'
System::Call '*$3(i,i.r5,i,i.r7)'
IntOp $7 $7 - $5
IntOp $6 $6 + 4 ; Padding for focus rect
System::Call 'USER32::SetWindowPos(pr1,p,i,i,ir6,ir7,i0x16)'
FunctionEnd

Function AdjustLinkPair
Pop $2 ; Label
${SetCtlColors} $2 ${CT_PAGE} ${CB_PAGE}
Call ConfigureLink
FunctionEnd

Function SplitPipe
Exch $0
Push $1
Push $2
StrCpy $2 0
findSep:
StrCpy $1 $0 1 $2
IntOp $2 $2 + 1
StrCmp $1 "" +2
StrCmp $1 "|" "" findSep
StrCpy $1 $0 "" $2
IntOp $2 $2 - 1
StrCpy $0 $0 $2
Pop $2
Exch $1
Exch
Exch $0
FunctionEnd

Section
SectionEnd

Page Custom PageCreate PageLeave
!pragma warning disable 8000 ; Page instfiles not used