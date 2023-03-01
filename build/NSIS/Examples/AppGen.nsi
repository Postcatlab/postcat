/*
Note: This is not a installer example script, it's a script for a simple application used by some of the other examples.
*/

!define /math ARCBITS ${NSIS_PTR_SIZE} * 8
Name "${NAME}"
!define /IfNDef OUTFILE ""
OutFile "${OUTFILE}"
Unicode True
!define /IfNDef REL User
RequestExecutionLevel ${REL}
XPStyle On
ManifestDPIAware True
AutoCloseWindow True
BrandingText " "
Caption "$(^Name) (${ARCBITS}-bit)"
MiscButtonText " " " " "E&xit" " "
LicenseBkColor /windows

!ifdef COMPANY
!ifndef NOPEVI
!define /IfNDef VER 1.2.3.4
VIProductVersion ${VER}
VIAddVersionKey /LANG=0 "FileVersion" "${VER}"
VIAddVersionKey /LANG=0 "CompanyName" "${COMPANY}"
VIAddVersionKey /LANG=0 "LegalCopyright" "${U+00A9} ${COMPANY}"
VIAddVersionKey /LANG=0 "FileDescription" "${NAME}"
!endif
!endif

!include WinMessages.nsh
!include LogicLib.nsh

PageEx License
	Caption " "
	LicenseText "$ExeFile$\n$ExePath" "E&xit"
	PageCallbacks "" OnShow
PageExEnd
Page InstFiles


Function .onInit
!ifdef AUMI
System::Call 'SHELL32::SetCurrentProcessExplicitAppUserModelID(ws)' "${AUMI}"
!endif
FunctionEnd


Function OnShow
FindWindow $0 "#32770" "" $hWndParent
GetDlgItem $R9 $0 0x3E8

!ifdef MSG
SendMessage $R9 ${EM_REPLACESEL} "" "STR:${MSG}$\r$\n$\r$\n"
!endif

!ifdef TMPLDATA
${IfNot} ${FileExists} "$AppData\${NAME}\*"
  ; Copy template data from the shared source to this users profile
  CreateDirectory "$AppData\${NAME}"
  CopyFiles /Silent "${TMPLDATA}\*" "$AppData\${NAME}"
${EndIf}
ReadIniStr $2 "$AppData\${NAME}\Data.ini" Example Count
IntOp $2 $2 + 1
WriteIniStr "$AppData\${NAME}\Data.ini" Example Count $2
SendMessage $R9 ${EM_REPLACESEL} "" "STR:Launch Count=$2$\r$\n$\r$\n"
!endif

SendMessage $R9 ${EM_REPLACESEL} "" "STR:CmdLine=$CmdLine$\r$\n"
ReadEnvStr $2 "USERNAME"
SendMessage $R9 ${EM_REPLACESEL} "" "STR:%USERNAME%=$2$\r$\n"
ReadEnvStr $2 "__COMPAT_LAYER"
StrCmp $2 "" +2
SendMessage $R9 ${EM_REPLACESEL} "" "STR:Compatibility=$2$\r$\n"
FunctionEnd

Section
SectionEnd
