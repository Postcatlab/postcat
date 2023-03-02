!verbose push 3
!ifndef INTEGRATION_INCLUDED
!define INTEGRATION_INCLUDED 1

!include "Util.nsh"


!define NotifyShell_AssocChanged `System::Call 'SHELL32::SHChangeNotify(i0x8000000,i0,p0,p0)'` ; Notify the shell with SHCNE_ASSOCCHANGED


!define UnpinShortcut "!insertmacro UnpinShortcut "
!macro UnpinShortcut lnkpath
Push "${lnkpath}"
${CallArtificialFunction} UnpinShortcut_Implementation
!macroend
!macro UnpinShortcut_Implementation
!include "LogicLib.nsh"
!include "Win\COM.nsh"
Exch $0
Push $1
!insertmacro ComHlpr_CreateInProcInstance ${CLSID_StartMenuPin} ${IID_IStartMenuPinnedList} r1 ""
${If} $1 P<> 0
    System::Call 'SHELL32::SHCreateItemFromParsingName(wr0,p0,g"${IID_IShellItem}",*p0r0)'
    ${If} $0 P<> 0
        ${IStartMenuPinnedList::RemoveFromList} $1 '(r0)'
        ${IUnknown::Release} $0 ""
    ${EndIf}
    ${IUnknown::Release} $1 ""
!ifdef NSIS_IX86 | NSIS_AMD64
${Else}
  !insertmacro ComHlpr_CreateInProcInstance ${CLSID_StartMenuPin} "{ec35e37a-6579-4f3c-93cd-6e62c4ef7636}" r1 ""
  ${If} $1 P<> 0
    ExecShellWait /INVOKEIDLIST "unpin" $0 ; WinXP
    ${IUnknown::Release} $1 ""
  ${EndIf}
!endif
${EndIf}
Pop $1
Pop $0
!macroend


!endif #!INCLUDED
!verbose pop
