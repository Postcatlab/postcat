; ---------------------
;      WinVer.nsh
; ---------------------
;
; LogicLib extensions for handling Windows versions and service packs.
;
; IsNT checks if the installer is running on Windows NT family (NT4, 2000, XP, etc.)
;
;   ${If} ${IsNT}
;     DetailPrint "Running on NT. Installing Unicode enabled application."
;   ${Else}
;     DetailPrint "Not running on NT. Installing ANSI application."
;   ${EndIf}
;
; IsServerOS checks if the installer is running on a server version of Windows (2000, 2003, 2008, etc.)
; IsDomainController checks if the server is a domain controller
;
; AtLeastWin<version> checks if the installer is running on Windows version at least as specified.
; IsWin<version> checks if the installer is running on Windows version exactly as specified.
; AtMostWin<version> checks if the installer is running on Windows version at most as specified.
; AtLeastBuild <number> checks if the installer is running on a Windows version with a minimum build number.
; AtMostBuild <number> checks if the installer is running on a Windows version with a maximum build number.
; AtLeastWaaS <name> and AtMostWaaS <name> checks Windows 10 "friendly names" against the build number.
;
; <version> can be replaced with the following values:
;
;   95
;   98
;   ME
;
;   NT4
;   2000
;   XP
;   2003
;   Vista
;   2008
;   7
;   2008R2
;   8
;   2012
;   8.1
;   2012R2
;   10
;
;   Note: Windows 8.1 and later will be detected as Windows 8 unless ManifestSupportedOS is set correctly!
;
; AtLeastServicePack checks if the installer is running on Windows service pack version at least as specified.
; IsServicePack checks if the installer is running on Windows service pack version exactly as specified.
; AtMostServicePack checks if the installer is running on Windows service version pack at most as specified.
;
; Usage examples:
;
;   ${If} ${IsNT}
;   DetailPrint "Running on NT family."
;   DetailPrint "Surely not running on 95, 98 or ME."
;   ${AndIf} ${AtLeastWinNT4}
;     DetailPrint "Running on NT4 or better. Could even be 2003."
;   ${EndIf}
;
;   ${If} ${AtLeastWinXP}
;     DetailPrint "Running on XP or better."
;   ${EndIf}
;
;   ${If} ${IsWin2000}
;     DetailPrint "Running on 2000."
;   ${EndIf}
;
;   ${If} ${IsWin2000}
;   ${AndIf} ${AtLeastServicePack} 3
;   ${OrIf} ${AtLeastWinXP}
;     DetailPrint "Running Win2000 SP3 or above"
;   ${EndIf}
;
;   ${If} ${AtMostWinXP}
;     DetailPrint "Running on XP or older. Surely not running on Vista. Maybe 98, or even 95."
;   ${EndIf}
;
; Warning:
;
;   Windows 95 and NT both use the same version number. To avoid getting NT4 misidentified
;   as Windows 95 and vice-versa or 98 as a version higher than NT4, always use IsNT to
;   check if running on the NT family.
;
;     ${If} ${AtLeastWin95}
;     ${AndIf} ${AtMostWinME}
;       DetailPrint "Running 95, 98 or ME."
;       DetailPrint "Actually, maybe it's NT4?"
;       ${If} ${IsNT}
;         DetailPrint "Yes, it's NT4! oops..."
;       ${Else}
;         DetailPrint "Nope, not NT4. phew..."
;       ${EndIf}
;     ${EndIf}
;
;
; Other useful extensions are:
;
;    * IsWin2003R2
;    * IsStarterEdition
;    * OSHasMediaCenter
;    * OSHasTabletSupport
;

!verbose push
!verbose 3

!ifndef ___WINVER__NSH___
!define ___WINVER__NSH___

!include LogicLib.nsh
!include Util.nsh

# masks for our variables

!define _WINVER_VERXBIT  0x00000001 ; Used to boost $__WINVERV
!define _WINVER_MASKVMAJ 0x7F000000 ; $__WINVERV mask
!define _WINVER_MASKVMIN 0x00FF0000 ; $__WINVERV mask
!define _WINVER_NTMASK   0x7FFFFFFF ; $__WINVERV mask used by AtMost/AtLeast
!define _WINVER_NTBIT    0x80000000 ; $__WINVERV bit used by Is and $__WINVERSP bit used by IsNT
!define _WINVER_NTSRVBIT 0x40000000 ; $__WINVERSP bit for !VER_NT_WORKSTATION
!define _WINVER_NTDCBIT  0x20000000 ; $__WINVERSP bit for VER_NT_DOMAIN_CONTROLLER
!define _WINVER_MASKVBLD 0x0000FFFF ; $__WINVERSP mask for OS build number
!define _WINVER_MASKSP   0x000F0000 ; $__WINVERSP mask for OS service pack

# possible variable values for different versions

!define WINVER_95_NT     0x04000000 ;4.00.0950
!define WINVER_95        0x04000000 ;4.00.0950
!define WINVER_98_NT     0x040a0000 ;4.10.1998
!define WINVER_98        0x040a0000 ;4.10.1998
;define WINVER_98SE      0x040a0000 ;4.10.2222
!define WINVER_ME_NT     0x045a0000 ;4.90.3000
!define WINVER_ME        0x045a0000 ;4.90.3000
;define WINVER_NT3.51               ;3.51.1057
!define WINVER_NT4_NT    0x84000000 ;4.00.1381
!define WINVER_NT4       0x04000000 ;4.00.1381
!define WINVER_2000_NT   0x85000000 ;5.00.2195
!define WINVER_2000      0x05000000 ;5.00.2195
!define WINVER_XP_NT     0x85010000 ;5.01.2600
!define WINVER_XP        0x05010000 ;5.01.2600
;define WINVER_XP64                 ;5.02.3790
!define WINVER_2003_NT   0x85020000 ;5.02.3790
!define WINVER_2003      0x05020000 ;5.02.3790
!define WINVER_VISTA_NT  0x86000000 ;6.00.6000
!define WINVER_VISTA     0x06000000 ;6.00.6000
!define WINVER_2008_NT   0x86000001 ;6.00.6001
!define WINVER_2008      0x06000001 ;6.00.6001
!define WINVER_7_NT      0x86010000 ;6.01.7600
!define WINVER_7         0x06010000 ;6.01.7600
!define WINVER_2008R2_NT 0x86010001 ;6.01.7600
!define WINVER_2008R2    0x06010001 ;6.01.7600
!define WINVER_8_NT      0x86020000 ;6.02.9200
!define WINVER_8         0x06020000 ;6.02.9200
!define WINVER_2012_NT   0x86020001 ;6.02.9200
!define WINVER_2012      0x06020001 ;6.02.9200
!define WINVER_8.1_NT    0x86030000 ;6.03.9600
!define WINVER_8.1       0x06030000 ;6.03.9600
!define WINVER_2012R2_NT 0x86030001 ;6.03.9600
!define WINVER_2012R2    0x06030001 ;6.03.9600
!define WINVER_10_NT     0x8A000000 ;10.0.10240
!define WINVER_10        0x0A000000 ;10.0.10240
!define WINVER_2016_NT   0x8A000001 ;10.0.14393
!define WINVER_2016      0x0A000001 ;10.0.14393


# use this to make all nt > 9x

!ifdef WINVER_NT4_OVER_W95
  !define /redef /math WINVER_NT4 ${WINVER_NT4} | ${_WINVER_VERXBIT}
!endif

# some definitions from header files

!define OSVERSIONINFOW_SIZE   276
!define OSVERSIONINFOEXW_SIZE 284
!define OSVERSIONINFOA_SIZE   148
!define OSVERSIONINFOEXA_SIZE 156
!define /ifndef VER_PLATFORM_WIN32_NT 2
!define /ifndef VER_NT_WORKSTATION       1
!define /ifndef VER_NT_DOMAIN_CONTROLLER 2
!define /ifndef VER_NT_SERVER            3

!define SM_TABLETPC    86
!define SM_MEDIACENTER 87
!define SM_STARTER     88
!define SM_SERVERR2    89

# variable declaration

!macro __WinVer_DeclareVars

  !ifndef __WINVER_VARS_DECLARED

    !define __WINVER_VARS_DECLARED

    Var /GLOBAL __WINVERV
    Var /GLOBAL __WINVERSP

  !endif

!macroend

!macro __WinVer_Optimize
!ifndef __WINVER_NOOPTIMIZE
!if "${NSIS_CHAR_SIZE}" > 1
!define /ReDef AtMostWin95 '"" LogicLib_AlwaysFalse ""'
!define /ReDef AtMostWin98 '"" LogicLib_AlwaysFalse ""'
!define /ReDef AtMostWinME '"" LogicLib_AlwaysFalse ""'
!define /ReDef IsWin95 '"" LogicLib_AlwaysFalse ""'
!define /ReDef IsWin98 '"" LogicLib_AlwaysFalse ""'
!define /ReDef IsWinME '"" LogicLib_AlwaysFalse ""'
!endif
!if "${NSIS_PTR_SIZE}" > 4
!define /ReDef AtMostWin95 '"" LogicLib_AlwaysFalse ""'
!define /ReDef AtMostWin98 '"" LogicLib_AlwaysFalse ""'
!define /ReDef AtMostWinME '"" LogicLib_AlwaysFalse ""'
!define /ReDef AtMostWinNT4 '"" LogicLib_AlwaysFalse ""'
!define /ReDef IsWin95 '"" LogicLib_AlwaysFalse ""'
!define /ReDef IsWin98 '"" LogicLib_AlwaysFalse ""'
!define /ReDef IsWinME '"" LogicLib_AlwaysFalse ""'
!define /ReDef IsWinNT4 '"" LogicLib_AlwaysFalse ""'
!define /ReDef AtLeastWin95 '"" LogicLib_AlwaysTrue ""'
!define /ReDef AtLeastWin98 '"" LogicLib_AlwaysTrue ""'
!define /ReDef AtLeastWinME '"" LogicLib_AlwaysTrue ""'
!define /ReDef AtLeastWinNT4 '"" LogicLib_AlwaysTrue ""'
!define /ReDef AtLeastWin2000 '"" LogicLib_AlwaysTrue ""'
!endif
!ifdef NSIS_ARM | NSIS_ARM32 | NSIS_ARMNT | NSIS_ARM64
!define /ReDef AtMostWin2000 '"" LogicLib_AlwaysFalse ""'
!define /ReDef AtMostWinXP '"" LogicLib_AlwaysFalse ""'
!define /ReDef AtMostWin2003 '"" LogicLib_AlwaysFalse ""'
!define /ReDef AtMostWinVista '"" LogicLib_AlwaysFalse ""'
!define /ReDef AtMostWin7 '"" LogicLib_AlwaysFalse ""'
!define /ReDef IsWin95 '"" LogicLib_AlwaysFalse ""'
!define /ReDef IsWin98 '"" LogicLib_AlwaysFalse ""'
!define /ReDef IsWinME '"" LogicLib_AlwaysFalse ""'
!define /ReDef IsWinNT4 '"" LogicLib_AlwaysFalse ""'
!define /ReDef IsWin2000 '"" LogicLib_AlwaysFalse ""'
!define /ReDef IsWinXP '"" LogicLib_AlwaysFalse ""'
!define /ReDef IsWin2003 '"" LogicLib_AlwaysFalse ""'
!define /ReDef IsWinVista '"" LogicLib_AlwaysFalse ""'
!define /ReDef IsWin2008 '"" LogicLib_AlwaysFalse ""'
!define /ReDef IsWin7 '"" LogicLib_AlwaysFalse ""'
!define /ReDef IsWin2008R2 '"" LogicLib_AlwaysFalse ""'
!define /ReDef AtLeastWin95 '"" LogicLib_AlwaysTrue ""'
!define /ReDef AtLeastWin98 '"" LogicLib_AlwaysTrue ""'
!define /ReDef AtLeastWinME '"" LogicLib_AlwaysTrue ""'
!define /ReDef AtLeastWinNT4 '"" LogicLib_AlwaysTrue ""'
!define /ReDef AtLeastWin2000 '"" LogicLib_AlwaysTrue ""'
!define /ReDef AtLeastWinXP '"" LogicLib_AlwaysTrue ""'
!define /ReDef AtLeastWin2003 '"" LogicLib_AlwaysTrue ""'
!define /ReDef AtLeastWinVista '"" LogicLib_AlwaysTrue ""'
!define /ReDef AtLeastWin2008 '"" LogicLib_AlwaysTrue ""'
!define /ReDef AtLeastWin7 '"" LogicLib_AlwaysTrue ""'
!define /ReDef AtLeastWin2008R2 '"" LogicLib_AlwaysTrue ""'
!define /ReDef AtLeastWin8 '"" LogicLib_AlwaysTrue ""'
!endif
!endif
!macroend

# lazy initialization macro

!define /IfNDef __WinVer_GWV GetWinVer

!macro __WinVer_InitVars_NEW
  !insertmacro __WinVer_DeclareVars
  !insertmacro __WinVer_Optimize

  # only calculate version once
  StrCmp $__WINVERV "" _winver_noveryet
    Return
  _winver_noveryet:

  Push $0
  ${__WinVer_GWV} $0 Product
  ${__WinVer_GWV} $__WINVERV NTDDIMajMin
  IntOp $__WINVERV $__WINVERV << 16 ; _WINVER_MASKVMAJ & _WINVER_MASKVMIN
  IntOp $__WINVERSP $0 & 2
  IntOp $__WINVERSP $__WINVERSP << 29 ; _WINVER_NTSRVBIT & _WINVER_NTDCBIT
  !ifndef NSIS_ARM64
  IntCmp $__WINVERSP 0 notServer
    IntCmpU 0x06000000 $__WINVERV "" "" not2008 ; ${If} $__WINVERV U>= 0x06000000
    IntCmpU 0x09000000 $__WINVERV not2008 not2008 "" ; ${AndIf} $__WINVERV U< 0x09000000
      IntOp $__WINVERV $__WINVERV | ${_WINVER_VERXBIT} ; Extra bit so Server 2008 comes after Vista SP1 that has the same minor version, same for Win7 vs 2008R2
    not2008:
  Goto endServer
  notServer:
    IntCmp $__WINVERV 0x05020000 "" notXP64 notXP64
      StrCpy $__WINVERV 0x05010000 ; Change XP 64-bit from 5.2 to 5.1 so it's still XP
    notXP64:
  endServer:
  !endif

  IntCmp $0 0 notNT
!if "${NSIS_PTR_SIZE}" <= 4
!ifdef WINVER_NT4_OVER_W95
    IntCmp $__WINVERV 0x04000000 "" nt4eq95 nt4eq95
      IntOp $__WINVERV $__WINVERV | ${_WINVER_VERXBIT} ; change NT 4.0.reserved.0 to 4.0.reserved.1
    nt4eq95:
!endif
!endif
    IntOp $__WINVERSP $__WINVERSP | ${_WINVER_NTBIT} ; _WINVER_NTBIT
    IntOp $__WINVERV $__WINVERV | ${_WINVER_NTBIT}  ; _WINVER_NTBIT
  notNT:

  ${__WinVer_GWV} $0 Build
  IntOp $__WINVERSP $__WINVERSP | $0 ; _WINVER_MASKVBLD
  ${__WinVer_GWV} $0 ServicePack
  IntOp $0 $0 << 16
  IntOp $__WINVERSP $__WINVERSP | $0 ; _WINVER_MASKSP
  Pop $0
!macroend

!ifmacrondef __WinVer_Call_GetVersionEx

  !macro __WinVer_Call_GetVersionEx STRUCT_SIZE

    System::Call '*$0(i ${STRUCT_SIZE})'
    System::Call kernel32::GetVersionEx(pr0)i.r3

  !macroend

!endif

!macro __WinVer_InitVars_OLD
  # variables
  !insertmacro __WinVer_DeclareVars
  !insertmacro __WinVer_Optimize

  # only calculate version once
  StrCmp $__WINVERV "" _winver_noveryet
    Return
  _winver_noveryet:

  # push used registers on the stack
  Push $0
  Push $1 ;maj
  Push $2 ;min
  Push $3 ;bld
  Push $R0 ;temp

  # a plugin call will lock the Unicode mode, it is now safe to set the struct size
  !ifdef NSIS_UNICODE
  !define /redef OSVERSIONINFO_SIZE ${OSVERSIONINFOW_SIZE}
  !define /redef OSVERSIONINFOEX_SIZE ${OSVERSIONINFOEXW_SIZE}
  !else
  !define /redef OSVERSIONINFO_SIZE ${OSVERSIONINFOA_SIZE}
  !define /redef OSVERSIONINFOEX_SIZE ${OSVERSIONINFOEXA_SIZE}
  !endif

  # allocate memory
  System::Call '*(&i${OSVERSIONINFOEX_SIZE})p.r0'

  # use OSVERSIONINFOEX
  !insertmacro __WinVer_Call_GetVersionEx ${OSVERSIONINFOEX_SIZE}

  IntCmp $3 0 "" _winver_ex _winver_ex
    # OSVERSIONINFOEX not allowed (Win9x or NT4 w/SP < 6), use OSVERSIONINFO
    !insertmacro __WinVer_Call_GetVersionEx ${OSVERSIONINFO_SIZE}
  _winver_ex:

  # get results from struct
  System::Call '*$0(i.s,i.r1,i.r2,i.r3,i.s,&t128.s,&i2.s,&i2,&i2,&i1.s,&i1)'

  # free struct
  System::Free $0

  # win9x has major and minor info in high word of dwBuildNumber - remove it
  IntOp $3 $3 & 0xFFFF

  # get dwOSVersionInfoSize
  Pop $R0

  # get dwPlatformId
  Pop $0

  # NT?
  IntCmp $0 ${VER_PLATFORM_WIN32_NT} "" _winver_notnt _winver_notnt
    IntOp $__WINVERSP $__WINVERSP | ${_WINVER_NTBIT}
    IntOp $__WINVERV  $__WINVERV  | ${_WINVER_NTBIT}
  _winver_notnt:
!ifndef NSIS_UNICODE
!if "${NSIS_PTR_SIZE}" <= 4
  # get service pack information
  IntCmp $0 ${VER_PLATFORM_WIN32_NT} _winver_nt "" _winver_nt  # win9x

    # get szCSDVersion
    Pop $0

    # copy second char
    StrCpy $0 $0 1 1

    # discard invalid wServicePackMajor and wProductType
    Pop $R0
    Pop $R0

    # switch
    StrCmp $0 'A' "" +3
      StrCpy $0 1
      Goto _winver_sp_done
    StrCmp $0 'B' "" +3
      StrCpy $0 2
      Goto _winver_sp_done
    StrCmp $0 'C' "" +3
      StrCpy $0 3
      Goto _winver_sp_done
    StrCpy $0 0
    Goto _winver_sp_done

  _winver_nt: # nt
!endif #~ 32-bit
!endif #~ ANSI
    IntCmp $R0 ${OSVERSIONINFOEX_SIZE} "" _winver_sp_noex _winver_sp_noex

      # discard szCSDVersion
      Pop $0

      # get wProductType
      Exch
      Pop $0

      # is server?
      IntCmp $0 ${VER_NT_WORKSTATION} _winver_nt_notsrv
        IntOp $__WINVERSP $__WINVERSP | ${_WINVER_NTSRVBIT}
        IntCmp $0 ${VER_NT_DOMAIN_CONTROLLER} "" _winver_nt_notdc _winver_nt_notdc
          IntOp $__WINVERSP $__WINVERSP | ${_WINVER_NTDCBIT}
        _winver_nt_notdc:
      _winver_nt_notsrv:

      # get wServicePackMajor
      Pop $0

      # done with sp
      Goto _winver_sp_done

    _winver_sp_noex: # OSVERSIONINFO, not OSVERSIONINFOEX

      ####  TODO
      ## For IsServerOS to support < NT4SP6, we need to check the registry
      ## here to see if we are a server and/or DC

      # get szCSDVersion
      Pop $0

      # discard invalid wServicePackMajor and wProductType
      Pop $R0
      Pop $R0

      # get service pack number from text
      StrCpy $R0 $0 13
      StrCmp $R0 "Service Pack " "" +3
        StrCpy $0 $0 "" 13 # cut "Service Pack "
        Goto +2
        StrCpy $0 0 # no service pack

!ifdef WINVER_NT4_OVER_W95
      IntOp $__WINVERV $__WINVERV | ${_WINVER_VERXBIT} ; change NT 4.0.reserved.0 to 4.0.reserved.1
!endif

  _winver_sp_done:

  # store service pack
  IntOp $0 $0 << 16
  IntOp $__WINVERSP $__WINVERSP | $0

  ### now for the version

  # is server?
  IntOp $0 $__WINVERSP & ${_WINVER_NTSRVBIT}

  # windows xp x64?
  IntCmp $0 0 "" _winver_not_xp_x64 _winver_not_xp_x64 # not server
  IntCmp $1 5 "" _winver_not_xp_x64 _winver_not_xp_x64 # maj 5
  IntCmp $2 2 "" _winver_not_xp_x64 _winver_not_xp_x64 # min 2
    # change XP x64 from 5.2 to 5.1 so it's still XP
    StrCpy $2 1
  _winver_not_xp_x64:

  # server 2008?
  IntCmp $0 0 _winver_not_ntserver # server
  IntCmp 6 $1 "" "" _winver_not_ntserver # maj 6
    # extra bit so Server 2008 comes after Vista SP1 that has the same minor version, same for Win7 vs 2008R2
    IntOp $__WINVERV $__WINVERV | ${_WINVER_VERXBIT}
  _winver_not_ntserver:

  # pack version
  IntOp $1 $1 << 24 # VerMajor
  IntOp $__WINVERV $__WINVERV | $1
  IntOp $0 $2 << 16
  IntOp $__WINVERV $__WINVERV | $0 # VerMinor
  IntOp $__WINVERSP $__WINVERSP | $3 # VerBuild

  # restore registers
  Pop $R0
  Pop $3
  Pop $2
  Pop $1
  Pop $0

!macroend

!macro __WinVer_InitVars
  !ifndef WinVer_v3_7
  !insertmacro __WinVer_InitVars_NEW
  !else
  !insertmacro __WinVer_InitVars_OLD
  !endif
!macroend

# version comparison LogicLib macros

!macro _WinVerAtLeast _a _b _t _f
  !insertmacro _LOGICLIB_TEMP
  ${CallArtificialFunction} __WinVer_InitVars
  IntOp $_LOGICLIB_TEMP $__WINVERV & ${_WINVER_NTMASK}
  !insertmacro _>= $_LOGICLIB_TEMP `${_b}` `${_t}` `${_f}`
!macroend
!macro _WinVerIs _a _b _t _f
  ${CallArtificialFunction} __WinVer_InitVars
  !insertmacro _= $__WINVERV `${_b}` `${_t}` `${_f}`
!macroend
!macro _WinVerAtMost _a _b _t _f
  !insertmacro _LOGICLIB_TEMP
  ${CallArtificialFunction} __WinVer_InitVars
  IntOp $_LOGICLIB_TEMP $__WINVERV & ${_WINVER_NTMASK}
  !insertmacro _<= $_LOGICLIB_TEMP `${_b}` `${_t}` `${_f}`
!macroend

!macro __WinVer_DefineOSTest Test OS Suffix
  !define ${Test}Win${OS} `"" WinVer${Test} ${WINVER_${OS}${Suffix}}`
!macroend

!macro __WinVer_DefineOSTests Test Suffix
  !insertmacro __WinVer_DefineOSTest ${Test} 95     '${Suffix}'
  !insertmacro __WinVer_DefineOSTest ${Test} 98     '${Suffix}'
  !insertmacro __WinVer_DefineOSTest ${Test} ME     '${Suffix}'
  !insertmacro __WinVer_DefineOSTest ${Test} NT4    '${Suffix}'
  !insertmacro __WinVer_DefineOSTest ${Test} 2000   '${Suffix}'
  !insertmacro __WinVer_DefineOSTest ${Test} XP     '${Suffix}'
  !insertmacro __WinVer_DefineOSTest ${Test} 2003   '${Suffix}'
  !insertmacro __WinVer_DefineOSTest ${Test} VISTA  '${Suffix}'
  !insertmacro __WinVer_DefineOSTest ${Test} 2008   '${Suffix}'
  !insertmacro __WinVer_DefineOSTest ${Test} 7      '${Suffix}'
  !insertmacro __WinVer_DefineOSTest ${Test} 2008R2 '${Suffix}'
  !insertmacro __WinVer_DefineOSTest ${Test} 8      '${Suffix}'
  !insertmacro __WinVer_DefineOSTest ${Test} 2012   '${Suffix}'
  !insertmacro __WinVer_DefineOSTest ${Test} 8.1    '${Suffix}'
  !insertmacro __WinVer_DefineOSTest ${Test} 2012R2 '${Suffix}'
  !insertmacro __WinVer_DefineOSTest ${Test} 10     '${Suffix}'
  !insertmacro __WinVer_DefineOSTest ${Test} 2016   '${Suffix}'
!macroend

!insertmacro __WinVer_DefineOSTests AtLeast ""
!insertmacro __WinVer_DefineOSTests Is _NT
!insertmacro __WinVer_DefineOSTests AtMost ""

# version feature LogicLib macros

!macro __WinVer_LL_IsBitSet _v _b _t _f
  !insertmacro _LOGICLIB_TEMP
  ${CallArtificialFunction} __WinVer_InitVars
  IntOp $_LOGICLIB_TEMP ${_v} & ${_b}
  !insertmacro _!= $_LOGICLIB_TEMP 0 `${_t}` `${_f}`
!macroend

!define IsNT `$__WINVERSP _WinVer_LL_IsBitSet ${_WINVER_NTBIT}`
!define IsServerOS `$__WINVERSP _WinVer_LL_IsBitSet ${_WINVER_NTSRVBIT}`
!define IsDomainController `$__WINVERSP _WinVer_LL_IsBitSet ${_WINVER_NTDCBIT}`

# service pack macros

!macro _WinVer_GetServicePackLevel OUTVAR
  !ifndef WinVer_v3_7
  ${__WinVer_GWV} ${OUTVAR} ServicePack
  !else
  ${CallArtificialFunction} __WinVer_InitVars
  IntOp ${OUTVAR} $__WINVERSP & ${_WINVER_MASKSP}
  IntOp ${OUTVAR} ${OUTVAR} >> 16
  !endif
!macroend
!define WinVerGetServicePackLevel '!insertmacro _WinVer_GetServicePackLevel '

!macro _AtLeastServicePack _a _b _t _f
  !insertmacro _LOGICLIB_TEMP
  ${WinVerGetServicePackLevel} $_LOGICLIB_TEMP
  !insertmacro _>= $_LOGICLIB_TEMP `${_b}` `${_t}` `${_f}`
!macroend
!define AtLeastServicePack `"" AtLeastServicePack`

!macro _AtMostServicePack _a _b _t _f
  !insertmacro _LOGICLIB_TEMP
  ${WinVerGetServicePackLevel} $_LOGICLIB_TEMP
  !insertmacro _<= $_LOGICLIB_TEMP `${_b}` `${_t}` `${_f}`
!macroend
!define AtMostServicePack `"" AtMostServicePack`

!macro _IsServicePack _a _b _t _f
  !insertmacro _LOGICLIB_TEMP
  ${WinVerGetServicePackLevel} $_LOGICLIB_TEMP
  !insertmacro _= $_LOGICLIB_TEMP `${_b}` `${_t}` `${_f}`
!macroend
!define IsServicePack `"" IsServicePack`

# special feature LogicLib macros

!macro _WinVer_SysMetricCheck m _b _t _f
  !insertmacro _LOGICLIB_TEMP
  System::Call user32::GetSystemMetrics(i${m})i.s
  pop $_LOGICLIB_TEMP
  !insertmacro _!= $_LOGICLIB_TEMP 0 `${_t}` `${_f}`
!macroend

!define IsWin2003R2        `${SM_SERVERR2}    WinVer_SysMetricCheck ""`
!define IsStarterEdition   `${SM_STARTER}     WinVer_SysMetricCheck ""`
!define OSHasMediaCenter   `${SM_MEDIACENTER} WinVer_SysMetricCheck ""`
!define OSHasTabletSupport `${SM_TABLETPC}    WinVer_SysMetricCheck ""`
!define IsSafeBootMode     `67                WinVer_SysMetricCheck ""`

# version retrieval macros

!macro __WinVer_GetVer var rshift mask outvar
  ${CallArtificialFunction} __WinVer_InitVars
  !if "${mask}" != ""
    IntOp ${outvar} ${var} & ${mask}
    !if "${rshift}" != ""
      IntOp ${outvar} ${outvar} >> ${rshift}
    !endif
  !else
    IntOp ${outvar} ${var} >> ${rshift}
  !endif
!macroend

!define WinVerGetMajor '!insertmacro __WinVer_GetVer $__WINVERV  24 ${_WINVER_MASKVMAJ}'
!define WinVerGetMinor '!insertmacro __WinVer_GetVer $__WINVERV  16 ${_WINVER_MASKVMIN}'
!ifndef WinVer_v3_7
!macro __WinVer_GetVerBuild outvar
  ${__WinVer_GWV} ${outvar} Build
!macroend
!define WinVerGetBuild '!insertmacro __WinVer_GetVerBuild '
!else
!define WinVerGetBuild '!insertmacro __WinVer_GetVer $__WINVERSP "" ${_WINVER_MASKVBLD}'
!endif

!macro _WinVer_BuildNumCheck op num _t _f
  !insertmacro _LOGICLIB_TEMP
  ${WinVerGetBuild} $_LOGICLIB_TEMP
  !insertmacro _${op} $_LOGICLIB_TEMP ${num} `${_t}` `${_f}`
!macroend
!define AtLeastBuild `U>= WinVer_BuildNumCheck `
!define AtMostBuild `U<= WinVer_BuildNumCheck `

# Windows as a Service macros

!macro WinVer_WaaS id build fu codename marketingname
  !if "${id}" == ${fu}
    !define WinVer_WaaS_Build ${build}
  !else if "${id}" == "${codename}"
    !define WinVer_WaaS_Build ${build}
  !else if "${id}" == "${marketingname}"
    !define WinVer_WaaS_Build ${build}
  !endif
!macroend

!macro _WinVer_WaaS op id _t _f
  !insertmacro WinVer_WaaS "${id}" 10240 1507 "Threshold"   "RTM" ; 10240.16384
  !insertmacro WinVer_WaaS "${id}" 10586 1511 "Threshold 2" "November Update" ; 10586.0?
  !insertmacro WinVer_WaaS "${id}" 14393 1607 "Redstone"    "Anniversary Update" ; 14393.10
  !insertmacro WinVer_WaaS "${id}" 15063 1703 "Redstone 2"  "Creators Update" ; 15063.13
  !insertmacro WinVer_WaaS "${id}" 16299 1709 "Redstone 3"  "Fall Creators Update" ; 16299.19
  !insertmacro WinVer_WaaS "${id}" 17134 1803 "Redstone 4"  "April 2018 Update" ; 17134.1
  !insertmacro WinVer_WaaS "${id}" 17763 1809 "Redstone 5"  "October 2018 Update" ; 17763.1
  !insertmacro WinVer_WaaS "${id}" 18362 1903 "19H1"        "May 2019 Update" ; 18362.116
  !insertmacro WinVer_WaaS "${id}" 18363 1909 "19H2"        "November 2019 Update" ; 18363.418
  !insertmacro WinVer_WaaS "${id}" 19041 2004 "20H1"        "May 2020 Update" ; 19041.264?
  !insertmacro WinVer_WaaS "${id}" 19042 20H2 "20H2"        "October 2020 Update" ; 19042.572? A.K.A. 2009
  !insertmacro WinVer_WaaS "${id}" 19043 21H1 "21H1"        "May 2021 Update" ; 19043.928

  !ifmacrodef WinVerExternal_WaaS_MapToBuild
    !insertmacro WinVerExternal_WaaS_MapToBuild ${op} "${id}" WinVer_WaaS_Build
  !endif
  !define /IfNDef WinVer_WaaS_Build 0
  !if "${WinVer_WaaS_Build}" <= 9600
    !error 'WinVer: Unknown WaaS name: ${id}'
  !endif
  !insertmacro _WinVer_BuildNumCheck ${op} ${WinVer_WaaS_Build} `${_t}` `${_f}`
  !undef WinVer_WaaS_Build
!macroend

!define AtLeastWaaS `U>= WinVer_WaaS `
!define AtMostWaaS `U<= WinVer_WaaS `

!endif # !___WINVER__NSH___

!verbose pop
