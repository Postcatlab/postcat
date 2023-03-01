!ifndef __WIN_PROPKEY__INC
!define __WIN_PROPKEY__INC
!verbose push
!verbose 3 


/**************************************************
WTypes.h
**************************************************/
;NOTE: This list is incomplete
!define VT_EMPTY     0
!define VT_NULL      1
!define VT_I2        2
!define VT_I4        3
!define VT_BSTR      8
!define VT_BOOL      11
!define VT_I1        16
!define VT_UI1       17
!define VT_UI2       18
!define VT_UI4       19
!define VT_I8        20
!define VT_UI8       21
!define VT_INT       22
!define VT_UINT      23
!define VT_HRESULT   25
!define VT_PTR       26
!define VT_SAFEARRAY 27
!define VT_LPSTR     30 ; SHStrDupA
!define VT_LPWSTR    31 ; SHStrDupW
!define VT_FILETIME  64
!define VT_STREAM    66
!define VT_CLSID     72 ; Pointer to CoTaskMem allocated GUID
!define VT_TYPEMASK 0xFFF
!define VT_VECTOR  0x1000
!define VT_ARRAY   0x2000
!define VT_BYREF   0x4000

!define /ifndef VARIANT_TRUE -1
!define /ifndef VARIANT_FALSE 0

!define SYSSIZEOF_PROPERTYKEY 20
!define SYSSTRUCT_PROPERTYKEY (&g16,&i4) ;System.dll is buggy when it comes to g and forces us to specify the size

!define STGC_DEFAULT 0
!define STGC_OVERWRITE 1
!define STGC_ONLYIFCURRENT 2
!define STGC_DANGEROUSLYCOMMITMERELYTODISKCACHE 4
!define STGC_CONSOLIDATE 8


/**************************************************
OAIdl.h
**************************************************/
!if "${NSIS_PTR_SIZE}" > 4
!define SYSSIZEOF_VARIANT 24
!define SYSSTRUCT_VARIANT (&i2,&i6,&i8,&i8)
!else
!define SYSSIZEOF_VARIANT 16
!define SYSSTRUCT_VARIANT (&i2,&i6,&i8)
!endif


/**************************************************
PropIdl.h
**************************************************/
!if "${NSIS_PTR_SIZE}" > 4
!define SYSSIZEOF_PROPVARIANT 24
!define SYSSTRUCT_PROPVARIANT (&i2,&i6,&i8,&i8)
!else
!define SYSSIZEOF_PROPVARIANT 16
!define SYSSTRUCT_PROPVARIANT (&i2,&i6,&i8)
!endif

!define PRSPEC_LPWSTR 0
!define PRSPEC_PROPID 1
!define SYSSTRUCT_PROPSPEC (p,p)


/**************************************************
Propkey.h
**************************************************/
!define PKEY_AppUserModel_RelaunchCommand             '"{9F4C2855-9F79-4B39-A8D0-E1D42DE1D5F3}",2' ; VT_LPWSTR (SHGetPropertyStoreForWindow)
!define PKEY_AppUserModel_RelaunchIconResource        '"{9F4C2855-9F79-4B39-A8D0-E1D42DE1D5F3}",3' ; VT_LPWSTR (SHGetPropertyStoreForWindow, optional. Path to icon or module, with resource ID or index.)
!define PKEY_AppUserModel_RelaunchDisplayNameResource '"{9F4C2855-9F79-4B39-A8D0-E1D42DE1D5F3}",4' ; VT_LPWSTR (SHGetPropertyStoreForWindow. @ style indirect resource string or a plain string.)
!define PKEY_AppUserModel_ID                          '"{9F4C2855-9F79-4B39-A8D0-E1D42DE1D5F3}",5' ; VT_LPWSTR
!define PKEY_AppUserModel_IsDestListSeparator         '"{9F4C2855-9F79-4B39-A8D0-E1D42DE1D5F3}",6' ; VT_BOOL
!define PKEY_AppUserModel_ExcludeFromShowInNewInstall '"{9F4C2855-9F79-4B39-A8D0-E1D42DE1D5F3}",8' ; VT_BOOL
!define PKEY_AppUserModel_PreventPinning              '"{9F4C2855-9F79-4B39-A8D0-E1D42DE1D5F3}",9' ; VT_BOOL
!define PKEY_AppUserModel_IsDualMode '"{9F4C2855-9F79-4B39-A8D0-E1D42DE1D5F3}",11' ; [Eight+] VT_BOOL
!define APPUSERMODEL_STARTPINOPTION_NOPINONINSTALL 1
!define APPUSERMODEL_STARTPINOPTION_USERPINNED 2
!define PKEY_AppUserModel_StartPinOption '"{9F4C2855-9F79-4B39-A8D0-E1D42DE1D5F3}",12' ; [Eight+] VT_UI4
!define PKEY_AppUserModel_ToastActivatorCLSID '"{9F4C2855-9F79-4B39-A8D0-E1D42DE1D5F3}",26' ; [10FU1507+] VT_CLSID
!define PKEY_EdgeGesture_DisableTouchWhenFullscreen '"{32CE38B2-2C9A-41B1-9BC5-B3784394AA44}",2' ; [Eight+] VT_BOOL (SHGetPropertyStoreForWindow)


/**************************************************
ShlGuid.h & ShlObj.h
**************************************************/
!define FMTID_Intshcut {000214A0-0000-0000-C000-000000000046}
!define PID_IS_URL 2 ; VT_LPWSTR
!define PID_IS_HOTKEY 6 ; VT_UI2
!define PID_IS_ICONINDEX 8 ; VT_I4
!define PID_IS_ICONFILE 9 ; VT_LPWSTR
!define PKEY_Intshcut_Url '"${FMTID_Intshcut}",${PID_IS_URL}' ; Undocumented
!define FMTID_InternetSite {000214A1-0000-0000-C000-000000000046}
!define PID_INTSITE_LASTVISIT 4 ; VT_FILETIME
!define PID_INTSITE_VISITCOUNT 6 ; VT_UI4


/**************************************************
Helper macros
**************************************************/
!define V_GetVT '!insertmacro V_GetVT '
!macro V_GetVT pPV sysdst
System::Call '*${pPV}(&i2.${sysdst})'
!macroend
!define V_SetVT '!insertmacro V_SetVT '
!macro V_SetVT pPV syssrc
System::Call '*${pPV}(&i2 ${syssrc})'
!macroend
!macro V_GetHelper sysvaltyp pPV sysdst
System::Call '*${pPV}(l,${sysvaltyp}.${sysdst})'
!macroend
!macro V_GenericSetHelper sysvaltyp pPV VT syssrc
!if "${VT}" != "" ; Setting the VT is optional
  System::Call '*${pPV}(&i2 ${VT},&i6,${sysvaltyp}${syssrc})'
!else
  System::Call '*${pPV}(l,${sysvaltyp}${syssrc})'
!endif
!macroend
!macro V_SpecificSetHelper VT sysvaltyp pPV syssrc
System::Call '*${pPV}(&i2 ${VT},&i6,${sysvaltyp}${syssrc})'
!macroend
!macro Make_V_GetterSetter name sysvaltyp setsep
!define V_Get${name} '!insertmacro V_GetHelper "${sysvaltyp}" '
!ifdef VT_${name}
  !define V_Set${name} '!insertmacro V_SpecificSetHelper ${VT_${name}} "${sysvaltyp}${setsep}" '
!else
  !define V_Set${name} '!insertmacro V_GenericSetHelper "${sysvaltyp}${setsep}" '
!endif
!macroend
!insertmacro Make_V_GetterSetter Int8 "&i1" " "  ; Generic
!insertmacro Make_V_GetterSetter Int16 "&i2" " " ; Generic
!insertmacro Make_V_GetterSetter Int32 "i" ""    ; Generic
!insertmacro Make_V_GetterSetter Int64 "l" ""    ; Generic
!insertmacro Make_V_GetterSetter Pointer "p" ""  ; Generic
!insertmacro Make_V_GetterSetter I4 "i" " "
!insertmacro Make_V_GetterSetter BOOL "&i2" " "
!insertmacro Make_V_GetterSetter FILETIME "l" ""

!macro VariantInit pV
${V_SetVT} ${pV} ${VT_EMPTY}
!macroend
!macro VariantClear pV
System::Call 'OLEAUT32::#9(p${pV})'
!macroend
!macro VariantCopy pDstV pSrcV sysretHR
System::Call 'OLEAUT32::#10(p${pDstV},p${pSrcV})i.${sysretHR}' ; (Frees the destination variant before it copies the source)
!macroend
!macro VariantCopyInd pDstV pSrcV sysretHR
System::Call 'OLEAUT32::#11(p${pDstV},p${pSrcV})i.${sysretHR}' ; (Frees the destination variant before it copies the source)
!macroend
!macro VariantChangeType pDstV pSrcV Flags VT sysretHR
System::Call 'OLEAUT32::#12(p${pDstV},p${pSrcV},i${Flags},i${VT})i.${sysretHR}' ; (Might free the destination on success)
!macroend


!macro PropVariantClear pPV
System::Call 'OLE32::PropVariantClear(p${pPV})' ; WinNT4.SP0+, Win98+, IE4+
!macroend
!macro PropVariantCopy pDstPV pSrcPV sysretHR
System::Call 'OLE32::PropVariantCopy(p${pDstPV},p${pSrcPV})i.${sysretHR}' ; WinNT4.SP0+, Win98+, IE4+ (Does NOT free the destination before it copies the source)
!macroend
!macro PropVariantChangeType pDstPV pSrcPV VT sysretHR
!ifdef NSIS_ARM | NSIS_ARM32 | NSIS_ARMNT | NSIS_ARM64
  System::Call 'PROPSYS::PropVariantChangeType(p${pDstPV},p${pSrcPV},i0,i${VT})i.${sysretHR}'
!else
  Push "${VT}"
  Push ${pSrcPV}
  Push ${pDstPV}
  !include Util.nsh
  ${CallArtificialFunction} TryPropVariantChangeType
  System::Call 'KERNEL32::SetLastError(is${sysretHR})' ; A hack to move the result from the stack to somewhere with System variable syntax
!endif
!macroend
!macro TryPropVariantChangeType
System::Store S
System::Call 'PROPSYS::PropVariantChangeType(psr1,psr2,i0,isr3)i.r0' ; Vista+ (Source and destination cannot be the same address)
StrCmp $0 error "" done
System::Call 'OLE32::PropVariantChangeType(pr1,pr2,i0,i0,ir3})i.r0' ; 2000+ (Source and destination cannot be the same address)
!if ${NSIS_PTR_SIZE} < 8
  StrCmp $0 error "" done
  !insertmacro VariantChangeType $1 $2 0 $3 r0 ; This is not really correct but there is no PROPVARIANT support on these platforms. Might free the destination!
!endif
done:
Push $0
System::Store L
!macroend


!macro IPropertyStorage_ReadPropById pPS ID pPV sysoutHR
System::Call '*(p${PRSPEC_PROPID},p${ID})p.s'
${IPropertyStorage::ReadMultiple} ${pPS} '(1,pss,p${pPV})${sysoutHR}'
System::Free
!macroend

!macro IPropertyStorage_WritePropById pPS ID pPV sysoutHR
System::Call '*(p${PRSPEC_PROPID},p${ID})p.s'
${IPropertyStorage::WriteMultiple} ${pPS} '(1,pss,p${pPV},2)${sysoutHR}'
System::Free
!macroend


!verbose pop
!endif /* __WIN_PROPKEY__INC */
