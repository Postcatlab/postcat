/*

MultiUser.nsh

Installer configuration for multi-user Windows environments

Copyright 2008-2021 Joost Verburg

*/

!ifndef MULTIUSER_INCLUDED
!define MULTIUSER_INCLUDED 20210216
!verbose push 3

;Standard NSIS header files

!ifdef MULTIUSER_MUI
  !include MUI2.nsh
!endif
!include LogicLib.nsh
!include WinVer.nsh
!include FileFunc.nsh

!if ${NSIS_PTR_SIZE} > 4
!define /IfNDef MULTIUSER_MINWIN 0x501
!else
!define /IfNDef MULTIUSER_MINWIN 0x400
!endif

;Variables

Var MultiUser.Privileges
Var MultiUser.InstallMode

;Command line installation mode setting

!ifdef MULTIUSER_INSTALLMODE_COMMANDLINE
  !include StrFunc.nsh
  ${Using:StrFunc} StrStr
  !ifndef MULTIUSER_NOUNINSTALL
    ${Using:StrFunc} UnStrStr
  !endif

  Var MultiUser.Parameters
  Var MultiUser.Result
!endif

;Installation folder stored in registry

!ifdef MULTIUSER_INSTALLMODE_INSTDIR_REGISTRY_KEY & MULTIUSER_INSTALLMODE_INSTDIR_REGISTRY_VALUENAME
  Var MultiUser.InstDir
!endif

!ifdef MULTIUSER_INSTALLMODE_DEFAULT_REGISTRY_KEY & MULTIUSER_INSTALLMODE_DEFAULT_REGISTRY_VALUENAME
  Var MultiUser.DefaultKeyValue
!endif

;Windows Vista UAC setting

!if "${MULTIUSER_EXECUTIONLEVEL}" == Admin
  RequestExecutionLevel admin
  !define MULTIUSER_EXECUTIONLEVEL_ALLUSERS
!else if "${MULTIUSER_EXECUTIONLEVEL}" == Power
  RequestExecutionLevel admin
  !define MULTIUSER_EXECUTIONLEVEL_ALLUSERS
!else if "${MULTIUSER_EXECUTIONLEVEL}" == Highest
  RequestExecutionLevel highest
  !define MULTIUSER_EXECUTIONLEVEL_ALLUSERS
!else
  RequestExecutionLevel user
  !ifndef MULTIUSER_EXECUTIONLEVEL
    !warning "MULTIUSER_EXECUTIONLEVEL not set!"
  !endif
!endif

/*

Install modes

*/

!macro MULTIUSER_INSTALLMODE_ALLUSERS UNINSTALLER_PREFIX UNINSTALLER_FUNCPREFIX

  ;Install mode initialization - per-machine

  ${ifnot} ${IsNT}
  ${orif} $MultiUser.Privileges == "Admin"
  ${orif} $MultiUser.Privileges == "Power"

    StrCpy $MultiUser.InstallMode AllUsers
  
    SetShellVarContext all
  
    !if "${UNINSTALLER_PREFIX}" != UN
      ;Set default installation location for installer
      !ifdef MULTIUSER_INSTALLMODE_INSTDIR
        !ifdef MULTIUSER_USE_PROGRAMFILES64
          StrCpy $INSTDIR "$PROGRAMFILES64\${MULTIUSER_INSTALLMODE_INSTDIR}"
        !else
          StrCpy $INSTDIR "$PROGRAMFILES\${MULTIUSER_INSTALLMODE_INSTDIR}"
        !endif
      !endif
    !endif
  
    !ifdef MULTIUSER_INSTALLMODE_INSTDIR_REGISTRY_KEY & MULTIUSER_INSTALLMODE_INSTDIR_REGISTRY_VALUENAME

      ReadRegStr $MultiUser.InstDir HKLM "${MULTIUSER_INSTALLMODE_INSTDIR_REGISTRY_KEY}" "${MULTIUSER_INSTALLMODE_INSTDIR_REGISTRY_VALUENAME}"
  
      ${if} $MultiUser.InstDir != ""
        StrCpy $INSTDIR $MultiUser.InstDir
      ${endif}

    !endif

    !ifdef MULTIUSER_INSTALLMODE_${UNINSTALLER_PREFIX}FUNCTION
      Call "${MULTIUSER_INSTALLMODE_${UNINSTALLER_PREFIX}FUNCTION}"
    !endif

  ${endif}

!macroend

!macro MULTIUSER_INSTALLMODE_CURRENTUSER UNINSTALLER_PREFIX UNINSTALLER_FUNCPREFIX

  ;Install mode initialization - per-user

  !if ${MULTIUSER_MINWIN} < 0x500
  ${if} ${IsNT}
  !endif

    StrCpy $MultiUser.InstallMode CurrentUser
    SetShellVarContext current

    !if "${UNINSTALLER_PREFIX}" != UN
      ;Set default installation location for installer
      !ifdef MULTIUSER_INSTALLMODE_INSTDIR
        !if ${MULTIUSER_MINWIN} < 0x490
        ${if} ${AtLeastWin2000}
        !endif
          GetKnownFolderPath $INSTDIR {5CD7AEE2-2219-4A67-B85D-6C9CE15660CB} ; FOLDERID_UserProgramFiles
          StrCmp $INSTDIR "" 0 +2
          StrCpy $INSTDIR "$LocalAppData\Programs" ; Fallback directory
          StrCpy $INSTDIR "$INSTDIR\${MULTIUSER_INSTALLMODE_INSTDIR}"
        !if ${MULTIUSER_MINWIN} < 0x490
        ${else}
          StrCpy $INSTDIR "$PROGRAMFILES\${MULTIUSER_INSTALLMODE_INSTDIR}"
        ${endif}
        !endif
      !endif
    !endif

    !ifdef MULTIUSER_INSTALLMODE_INSTDIR_REGISTRY_KEY & MULTIUSER_INSTALLMODE_INSTDIR_REGISTRY_VALUENAME
      ReadRegStr $MultiUser.InstDir HKCU "${MULTIUSER_INSTALLMODE_INSTDIR_REGISTRY_KEY}" "${MULTIUSER_INSTALLMODE_INSTDIR_REGISTRY_VALUENAME}"
      ${if} $MultiUser.InstDir != ""
        StrCpy $INSTDIR $MultiUser.InstDir
      ${endif}
    !endif

    !ifdef MULTIUSER_INSTALLMODE_${UNINSTALLER_PREFIX}FUNCTION
      Call "${MULTIUSER_INSTALLMODE_${UNINSTALLER_PREFIX}FUNCTION}"
    !endif

  !if ${MULTIUSER_MINWIN} < 0x500
  ${endif}
  !endif

!macroend

Function MultiUser.InstallMode.AllUsers
  !insertmacro MULTIUSER_INSTALLMODE_ALLUSERS "" ""
FunctionEnd

Function MultiUser.InstallMode.CurrentUser
  !insertmacro MULTIUSER_INSTALLMODE_CURRENTUSER "" ""
FunctionEnd

!ifndef MULTIUSER_NOUNINSTALL

Function un.MultiUser.InstallMode.AllUsers
  !insertmacro MULTIUSER_INSTALLMODE_ALLUSERS UN .un
FunctionEnd

Function un.MultiUser.InstallMode.CurrentUser
  !insertmacro MULTIUSER_INSTALLMODE_CURRENTUSER UN .un
FunctionEnd

!endif

/*

Installer/uninstaller initialization

*/

!macro MULTIUSER_INIT_QUIT UNINSTALLER_FUNCPREFIX

  !ifdef MULTIUSER_INIT_${UNINSTALLER_FUNCPREFIX}FUNCTIONQUIT
    Call "${MULTIUSER_INIT_${UNINSTALLER_FUNCPREFIX}FUNCTIONQUIT}"
  !else
    Quit
  !endif

!macroend

!macro MULTIUSER_INIT_TEXTS UNINSTALLER_PREFIX

  !if "${UNINSTALLER_PREFIX}" == ""
    !define /ReDef MULTIUSER_TMPSTR_CAPTION "$(^SetupCaption)"
  !else
    !define /ReDef MULTIUSER_TMPSTR_CAPTION "$(^Name)"
  !endif

  !define /IfNDef MULTIUSER_INIT_TEXT_ADMINREQUIRED "${MULTIUSER_TMPSTR_CAPTION} requires administrator privileges."
  !define /IfNDef MULTIUSER_INIT_TEXT_POWERREQUIRED "${MULTIUSER_TMPSTR_CAPTION} requires at least Power User privileges."
  !define /IfNDef MULTIUSER_INIT_TEXT_ALLUSERSNOTPOSSIBLE "Your user account does not have sufficient privileges to install $(^Name) for all users of this computer."

  !undef MULTIUSER_TMPSTR_CAPTION

!macroend

!macro MULTIUSER_INIT_CHECKS UNINSTALLER_PREFIX UNINSTALLER_FUNCPREFIX

  ;Installer initialization - check privileges and set install mode

  !insertmacro MULTIUSER_INIT_TEXTS "${UNINSTALLER_PREFIX}"

  UserInfo::GetAccountType
  Pop $MultiUser.Privileges

  !if ${MULTIUSER_MINWIN} < 0x500
  ${if} ${IsNT}
  !endif

    ;Check privileges

    !if "${MULTIUSER_EXECUTIONLEVEL}" == Admin

      ${if} $MultiUser.Privileges != "Admin"
        MessageBox MB_OK|MB_ICONSTOP "${MULTIUSER_INIT_TEXT_ADMINREQUIRED}"
        !insertmacro MULTIUSER_INIT_QUIT "${UNINSTALLER_FUNCPREFIX}"
      ${endif}

    !else if "${MULTIUSER_EXECUTIONLEVEL}" == Power

      ${if} $MultiUser.Privileges != "Power"
      ${andif} $MultiUser.Privileges != "Admin"
        ${if} ${AtMostWinXP}
           MessageBox MB_OK|MB_ICONSTOP "${MULTIUSER_INIT_TEXT_POWERREQUIRED}"
        ${else}
           MessageBox MB_OK|MB_ICONSTOP "${MULTIUSER_INIT_TEXT_ADMINREQUIRED}"
        ${endif}        
        !insertmacro MULTIUSER_INIT_QUIT "${UNINSTALLER_FUNCPREFIX}"
      ${endif}

    !endif

    !ifdef MULTIUSER_EXECUTIONLEVEL_ALLUSERS

      ;Default to per-machine installation if possible

      ${if} $MultiUser.Privileges == "Admin"
      ${orif} $MultiUser.Privileges == "Power"
        !ifndef MULTIUSER_INSTALLMODE_DEFAULT_CURRENTUSER
          Call ${UNINSTALLER_FUNCPREFIX}MultiUser.InstallMode.AllUsers
        !else
          Call ${UNINSTALLER_FUNCPREFIX}MultiUser.InstallMode.CurrentUser
        !endif

        !ifdef MULTIUSER_INSTALLMODE_DEFAULT_REGISTRY_KEY & MULTIUSER_INSTALLMODE_DEFAULT_REGISTRY_VALUENAME

          ;Set installation mode to setting from a previous installation

          !ifndef MULTIUSER_INSTALLMODE_DEFAULT_CURRENTUSER
            ReadRegStr $MultiUser.DefaultKeyValue HKLM "${MULTIUSER_INSTALLMODE_DEFAULT_REGISTRY_KEY}" "${MULTIUSER_INSTALLMODE_DEFAULT_REGISTRY_VALUENAME}"
            ${if} $MultiUser.DefaultKeyValue == ""
              ReadRegStr $MultiUser.DefaultKeyValue HKCU "${MULTIUSER_INSTALLMODE_DEFAULT_REGISTRY_KEY}" "${MULTIUSER_INSTALLMODE_DEFAULT_REGISTRY_VALUENAME}"
              ${if} $MultiUser.DefaultKeyValue != ""
                Call ${UNINSTALLER_FUNCPREFIX}MultiUser.InstallMode.CurrentUser
              ${endif}
            ${endif}
          !else
            ReadRegStr $MultiUser.DefaultKeyValue HKCU "${MULTIUSER_INSTALLMODE_DEFAULT_REGISTRY_KEY}" "${MULTIUSER_INSTALLMODE_DEFAULT_REGISTRY_VALUENAME}"
            ${if} $MultiUser.DefaultKeyValue == ""
              ReadRegStr $MultiUser.DefaultKeyValue HKLM "${MULTIUSER_INSTALLMODE_DEFAULT_REGISTRY_KEY}" "${MULTIUSER_INSTALLMODE_DEFAULT_REGISTRY_VALUENAME}"
              ${if} $MultiUser.DefaultKeyValue != ""
                Call ${UNINSTALLER_FUNCPREFIX}MultiUser.InstallMode.AllUsers
              ${endif}
            ${endif}
          !endif

        !endif

      ${else}
        Call ${UNINSTALLER_FUNCPREFIX}MultiUser.InstallMode.CurrentUser
      ${endif}

    !else

      Call ${UNINSTALLER_FUNCPREFIX}MultiUser.InstallMode.CurrentUser

    !endif

    !ifdef MULTIUSER_INSTALLMODE_COMMANDLINE

      ;Check for install mode setting on command line

      ${${UNINSTALLER_FUNCPREFIX}GetParameters} $MultiUser.Parameters

      ${${UNINSTALLER_PREFIX}StrStr} $MultiUser.Result $MultiUser.Parameters "/CurrentUser"

      ${if} $MultiUser.Result != ""
        Call ${UNINSTALLER_FUNCPREFIX}MultiUser.InstallMode.CurrentUser
      ${endif}

      ${${UNINSTALLER_PREFIX}StrStr} $MultiUser.Result $MultiUser.Parameters "/AllUsers"

      ${if} $MultiUser.Result != ""
        ${if} $MultiUser.Privileges == "Admin"
        ${orif} $MultiUser.Privileges == "Power"
          Call ${UNINSTALLER_FUNCPREFIX}MultiUser.InstallMode.AllUsers
        ${else}
          MessageBox MB_OK|MB_ICONSTOP "${MULTIUSER_INIT_TEXT_ALLUSERSNOTPOSSIBLE}"
          !insertmacro MULTIUSER_INIT_QUIT "${UNINSTALLER_FUNCPREFIX}"
        ${endif}
      ${endif}

    !endif

  !if ${MULTIUSER_MINWIN} < 0x500
  ${else}

    ;Not running Windows NT, per-user installation not supported
    Call ${UNINSTALLER_FUNCPREFIX}MultiUser.InstallMode.AllUsers

  ${endif}
  !endif

!macroend

!macro MULTIUSER_INIT
  !verbose push 3
  !ifdef __UNINSTALL__
    !insertmacro MULTIUSER_UNINIT
  !else
    !insertmacro MULTIUSER_INIT_CHECKS "" ""
  !endif
  !verbose pop
!macroend

!ifndef MULTIUSER_NOUNINSTALL
!macro MULTIUSER_UNINIT
  !verbose push 3
  !insertmacro MULTIUSER_INIT_CHECKS Un un.
  !verbose pop
!macroend
!endif

/*

Mode selection page

*/

!macro MULTIUSER_PAGE_FUNCTION_CUSTOM TYPE
  !ifmacrodef MUI_PAGE_FUNCTION_CUSTOM
    !insertmacro MUI_PAGE_FUNCTION_CUSTOM "${TYPE}"
  !endif
  !ifdef MULTIUSER_PAGE_CUSTOMFUNCTION_${TYPE}
    Call "${MULTIUSER_PAGE_CUSTOMFUNCTION_${TYPE}}"
    !undef MULTIUSER_PAGE_CUSTOMFUNCTION_${TYPE}
  !endif
!macroend

!macro MULTIUSER_INSTALLMODEPAGE_INTERFACE

  !ifndef MULTIUSER_INSTALLMODEPAGE_INTERFACE
    !define MULTIUSER_INSTALLMODEPAGE_INTERFACE
    Var MultiUser.InstallModePage

    Var MultiUser.InstallModePage.Text

    Var MultiUser.InstallModePage.AllUsers
    Var MultiUser.InstallModePage.CurrentUser

  !endif

!macroend

!macro MULTIUSER_PAGEDECLARATION_INSTALLMODE UNPREFIX UNIQUEID

  !define /ReDef MULTIUSER_${UNPREFIX}INSTALLMODEPAGE "" ; Unlock strings in the language file(s)
  !insertmacro MULTIUSER_INSTALLMODEPAGE_INTERFACE

  !define /IfNDef MULTIUSER_INSTALLMODEPAGE_TEXT_TOP "$(MULTIUSER_INNERTEXT_INSTALLMODE_TOP)"
  !define /IfNDef MULTIUSER_INSTALLMODEPAGE_TEXT_ALLUSERS "$(MULTIUSER_INNERTEXT_INSTALLMODE_ALLUSERS)"
  !define /IfNDef MULTIUSER_INSTALLMODEPAGE_TEXT_CURRENTUSER "$(MULTIUSER_INNERTEXT_INSTALLMODE_CURRENTUSER)"

  PageEx custom

    PageCallbacks MultiUser.InstallModePre_${UNIQUEID} MultiUser.InstallModeLeave_${UNIQUEID}

    !define /IfNDef MULTIUSER_INSTALLMODEPAGE_CAPTION " "
    Caption "${MULTIUSER_INSTALLMODEPAGE_CAPTION}"

  PageExEnd

  !insertmacro MULTIUSER_FUNCTION_INSTALLMODEPAGE MultiUser.InstallModePre_${UNIQUEID} MultiUser.InstallModeLeave_${UNIQUEID}

  !undef MULTIUSER_INSTALLMODEPAGE_TEXT_TOP
  !undef MULTIUSER_INSTALLMODEPAGE_TEXT_ALLUSERS
  !undef MULTIUSER_INSTALLMODEPAGE_TEXT_CURRENTUSER

!macroend

!macro MULTIUSER_PAGE_INSTALLMODE

  !verbose push 3

  !ifndef MULTIUSER_EXECUTIONLEVEL_ALLUSERS
    !error "A mixed-mode installation requires MULTIUSER_EXECUTIONLEVEL to be set to Admin, Power or Highest."
  !endif

  !ifmacrodef MUI_PAGE_INIT
    !insertmacro MUI_PAGE_INIT
  !endif
  !insertmacro MULTIUSER_PAGEDECLARATION_INSTALLMODE "" ${__COUNTER__}

  !verbose pop

!macroend

!macro MULTIUSER_FUNCTION_INSTALLMODEPAGE PRE LEAVE

  !include nsDialogs.nsh

  Function "${PRE}"

    !if ${MULTIUSER_MINWIN} < 0x500
    ${ifnot} ${IsNT}
      Abort
    ${endif}
    !endif

    ${if} $MultiUser.Privileges != "Power"
    ${andif} $MultiUser.Privileges != "Admin"
      Abort
    ${endif}

    !insertmacro MULTIUSER_PAGE_FUNCTION_CUSTOM PRE
    !ifmacrodef MUI_HEADER_TEXT_PAGE
      !insertmacro MUI_HEADER_TEXT_PAGE $(MULTIUSER_TEXT_INSTALLMODE_TITLE) $(MULTIUSER_TEXT_INSTALLMODE_SUBTITLE)
    !endif

    nsDialogs::Create 1018
    Pop $MultiUser.InstallModePage

    ${NSD_CreateLabel} 0 2u 100% 42u "${MULTIUSER_INSTALLMODEPAGE_TEXT_TOP}"
    Pop $MultiUser.InstallModePage.Text

    ${NSD_CreateRadioButton} 15u 50u -15u 10u "${MULTIUSER_INSTALLMODEPAGE_TEXT_ALLUSERS}"
    Pop $MultiUser.InstallModePage.AllUsers

    !ifdef MULTIUSER_INSTALLMODEPAGE_SHOWUSERNAME
    !ifdef NOSYSTEMCALLS
    ReadEnvStr $0 USERNAME
    !else
    System::Call 'ADVAPI32::GetUserName(t""r0,*i${NSIS_MAX_STRLEN})'
    !endif
    StrCmp $0 "" +2
      StrCpy $0 " ($0)"
    ${NSD_CreateRadioButton} 15u 70u -15u 10u "${MULTIUSER_INSTALLMODEPAGE_TEXT_CURRENTUSER}$0"
    !else
    ${NSD_CreateRadioButton} 15u 70u -15u 10u "${MULTIUSER_INSTALLMODEPAGE_TEXT_CURRENTUSER}"
    !endif
    Pop $MultiUser.InstallModePage.CurrentUser

    ${if} $MultiUser.InstallMode == "AllUsers"
      SendMessage $MultiUser.InstallModePage.AllUsers ${BM_SETCHECK} ${BST_CHECKED} 0
    ${else}
      SendMessage $MultiUser.InstallModePage.CurrentUser ${BM_SETCHECK} ${BST_CHECKED} 0
    ${endif}

    !insertmacro MULTIUSER_PAGE_FUNCTION_CUSTOM SHOW
    nsDialogs::Show
    !insertmacro MULTIUSER_PAGE_FUNCTION_CUSTOM DESTROYED

  FunctionEnd

  Function "${LEAVE}"
     SendMessage $MultiUser.InstallModePage.AllUsers ${BM_GETCHECK} 0 0 $0

     ${if} $0 = ${BST_CHECKED}
        Call MultiUser.InstallMode.AllUsers
     ${else}
        Call MultiUser.InstallMode.CurrentUser
     ${endif}

    !insertmacro MULTIUSER_PAGE_FUNCTION_CUSTOM LEAVE
  FunctionEnd

!macroend


!verbose pop
!endif
