Name "nsDialogs Example"
OutFile "nsDialogs Example.exe"
Caption "$(^Name)"

Unicode True
XPStyle on
RequestExecutionLevel user

!include nsDialogs.nsh
!include LogicLib.nsh
!include WinCore.nsh ; MAKELONG

LicenseText "All the action takes place on the next page..." "Start"
SubCaption 0 ": Ready?"

Page license
Page custom nsDialogsPage
Page custom LBPage
Page custom RangesPage
Page custom NotifyPage
Page custom RadioPage RadioLeave
!pragma warning disable 8000 ; "Page instfiles not used, no sections will be executed!"

Var BUTTON
Var EDIT
Var CHECKBOX

Function nsDialogsPage
	nsDialogs::Create 1018
	Pop $0

	GetFunctionAddress $0 OnBack
	nsDialogs::OnBack $0

	${NSD_CreateButton} 0 0 100% 12u Test
	Pop $BUTTON
	GetFunctionAddress $0 OnClick
	nsDialogs::OnClick $BUTTON $0

	${NSD_CreateText} 0 35 100% 12u hello
	Pop $EDIT
	GetFunctionAddress $0 OnChange
	nsDialogs::OnChange $EDIT $0
	${NSD_Edit_SetCueBannerText} $EDIT 0 "Type 'hello there' and get a free surprise"

	${NSD_CreateCheckbox} 0 -50 100% 8u Test
	Pop $CHECKBOX
	GetFunctionAddress $0 OnCheckbox
	nsDialogs::OnClick $CHECKBOX $0

	${NSD_CreateLabel} 0 40u 75% 40u "* Type `hello there` above.$\n* Click the button.$\n* Check the checkbox.$\n* Hit the Back button."
	Pop $0

	nsDialogs::Show
FunctionEnd

Function OnClick
	Pop $0 # HWND
	MessageBox MB_OK clicky
FunctionEnd

Function OnChange
	Pop $0 # HWND

	System::Call user32::GetWindowText(p$EDIT,t.r0,i${NSIS_MAX_STRLEN})
	${If} $0 == "hello there"
		MessageBox MB_OK "right back at ya"
	${EndIf}
FunctionEnd

Function OnBack
	MessageBox MB_YESNO "are you sure?" IDYES +2
	Abort
FunctionEnd

Function OnCheckbox
	Pop $0 # HWND
	MessageBox MB_OK "checkbox clicked"
FunctionEnd

!macro BeginControlsTestPage title
	nsDialogs::Create 1018
	Pop $0
	${NSD_SetText} $hWndParent "$(^Name): ${title}"
!macroend

!macro CreateButton x y w h txt var handler data
	${NSD_CreateButton} ${x} ${y} ${w} ${h} "${txt}"
	Pop ${var}
	nsDialogs::SetUserData ${var} ${data}
	${NSD_OnClick} ${var} ${handler}
!macroend


Function LBPage
	!insertmacro BeginControlsTestPage "ListBox"

	${NSD_CreateSortedListBox} 1u 0 -2u 70u ""
	Pop $1
	${NSD_LB_AddString} $1 "Foo"
	${NSD_LB_AddString} $1 "Bar"

	StrCpy $9 1
	${NSD_CreateText} 1u 75u -2u 12u "New item #$9"
	Pop $EDIT
	!insertmacro CreateButton 1u 90u 50u 12u "Add (&Sorted)" $0 LBAction Add
	!insertmacro CreateButton 53u 90u 50u 12u "&Prepend" $0 LBAction Prepend
	!insertmacro CreateButton 105u 90u 50u 12u "&Append" $0 LBAction Append
	!insertmacro CreateButton 160u 90u 50u 12u "&Delete Last" $0 LBAction DL
	!insertmacro CreateButton 215u 90u 50u 12u "&Clear" $0 LBAction Clear

	nsDialogs::Show
FunctionEnd

Function LBAction
	Pop $0
	nsDialogs::GetUserData $0
	Pop $0
	${NSD_GetText} $EDIT $8

	${Select} $0
	${Case} "Add"
		${NSD_LB_AddString} $1 $8
	${Case} "Prepend"
		${NSD_LB_PrependString} $1 $8
	${Case} "Append"
		${NSD_LB_AppendString} $1 $8
	${Case} "DL"
		${NSD_LB_GetCount} $1 $8
		${If} $8 U> 0
			IntOp $8 $8 - 1
			${NSD_LB_DelItem} $1 $8
		${EndIf}
		Return
	${Case} "Clear"
		${NSD_LB_Clear} $1
        Return
	${EndSelect}

	IntOp $9 $9 + 1
	${NSD_SetText} $EDIT "New item #$9"
FunctionEnd


Function RangesPage
	!insertmacro BeginControlsTestPage "Ranges"

	${NSD_CreateHTrackBar} 1 0 -2 20u ""
	Pop $1
	${NSD_TrackBar_SetRangeMax} $1 10
	${NSD_TrackBar_SetTicFreq} $1 1
	${NSD_TrackBar_SetPos} $1 3

	StrCpy $9 20 ; Progress pos
	${NSD_CreateProgressBar} 1 25u -2 8u ""
	Pop $2
	${NSD_CreateTimer} RangesTimer 1000

	${NSD_CreateNumber} 1 40u 50u 12u "42"
	Pop $3
	${NSD_CreateUpDown} 0 0 0 0 ""
	Pop $4
	${NSD_UD_SetBuddy} $4 $3
	${MAKELONG} $5 $0 50 0 ; 0..50
	${NSD_UD_SetPackedRange} $4 $5

	nsDialogs::Show
FunctionEnd

Function RangesTimer
	IntOp $9 $9 + 5
	${IfThen} $9 > 100 ${|} StrCpy $9 0 ${|}
	${NSD_ProgressBar_SetPos} $2 $9
FunctionEnd


Function NotifyPage
	!insertmacro BeginControlsTestPage "WM_NOTIFY"

	nsDialogs::CreateControl "${__NSD_RichEdit_CLASS_20A}" "${__NSD_RichEdit_STYLE}" "${__NSD_RichEdit_EXSTYLE}" 1 1 -2 50u "" ; Forcing ANSI control, see forums.winamp.com/showthread.php?p=3169999
	Pop $9
	${NSD_OnNotify} $9 OnNotify
	IntOp $8 ${ENM_LINK} | ${ENM_KEYEVENTS}
	${NSD_RichEd_SetEventMask} $9 $8
	SendMessage $9 ${EM_AUTOURLDETECT} 1 0
	${NSD_SetText} $9 "{\rtf1\ansi{\fonttbl\f0\fswiss Helvetica;}\f0\pard http://nsis.sf.net\par {\b Click the link!}\par\par Type something and I will block every other character...}"

	${NSD_InitCommonControlsEx} ${ICC_DATE_CLASSES}
	${NSD_CreateDatePicker} 1% 55u 48% 12u ""
	Pop $1
	${NSD_OnNotify} $1 onDateTimeNotify
	${NSD_CreateLabel} 51% 56u 48% 12u "Change the date..."
	Pop $9

	/*
	${NSD_CreateCalendar} 1% 23% 150u 90u ""
	Pop $1
	${NSD_AddStyle} $1 ${MCS_NOTODAY}
	System::Call 'USER32::SendMessage(p$1, i${MCM_GETMINREQRECT}, p0, @r2)'
	System::Call '*$2(i,i,i.r2,i.r3)'
	#System::Call 'USER32::SendMessage(p$1, i${MCM_GETMAXTODAYWIDTH}, p0, *i0r4)'
	#${IfThen} $4 > $2 ${|} StrCpy $2 $4 ${|}
	System::Call 'USER32::SetWindowPos(p$1,p0,i,i,ir2,ir3,i0x16)'
	*/

	nsDialogs::Show
FunctionEnd

Function OnNotify
	Pop $1 ; HWND
	Pop $2 ; Code
	Pop $3 ; NMHDR*
	${If} $2 = ${EN_LINK}
		System::Call '*$3(p,p,p,p.r2,p,p,i.r4,i.r5)' ; Extract from ENLINK*
		${IfThen} $2 <> ${WM_LBUTTONDOWN} ${|} Return ${|}
		IntOp $2 $5 - $4
		System::Call '*(ir4,ir5,l,&t$2,i)p.r2' ; Create TEXTRANGE and a text buffer
		${If} $2 P<> 0
			IntPtrOp $3 $2 + 16 ; Find buffer
			System::Call '*$2(i,i,p$3)' ; Set buffer in TEXTRANGE
			SendMessage $1 ${EM_GETTEXTRANGE} "" $2 $4
			${If} $4 <> 0
				System::Call 'SHELL32::ShellExecute(p$hWndParent, p0, pr3, p0, p0, i 1)'
			${EndIf}
			System::Free $2
		${EndIf}
	${ElseIf} $2 = ${EN_MSGFILTER}
		Var /Global Toggle
		System::Call '*$3(p,i,i,i.r4)' ; MSGFILTER->msg
		${If} $4 = ${WM_CHAR}
			IntOp $Toggle $Toggle ^ 1
			${If} $Toggle & 1
				${NSD_Return} 1
			${EndIf}
		${EndIf}
	${EndIf}
FunctionEnd

Function onDateTimeNotify
Pop $1 ; HWND
Pop $2 ; Code
Pop $3 ; NMHDR*
${If} $2 = ${DTN_DATETIMECHANGE}
	System::Call 'USER32::SendMessage(p$1, i${DTM_GETSYSTEMTIME}, p0, @r3)i.r0'
	${If} $0 = ${GDT_VALID}
		System::Call '*$3(&i2.R1, &i2.R2, &i2, &i2.R3, &i2, &i2, &i2, &i2)' ; SYSTEMTIME
		StrCpy $0 "$R1/$R2/$R3"
	${Else}
		StrCpy $0 "N/A"
	${EndIf}
	${NSD_SetText} $9 $0
${EndIf}
FunctionEnd


Function RadioPage
	!insertmacro BeginControlsTestPage "Radio buttons"

	; Group 1
	${NSD_CreateFirstRadioButton} 4u 0 40% 6% "NPR"
	Pop $1
	${NSD_OnClick} $1 onStationChanged
	${NSD_CreateAdditionalRadioButton} 4u 12% 40% 6% "BBC"
	Pop $2
	${NSD_OnClick} $2 onStationChanged
	${NSD_CreateLabel} 4u 30u 80% 12u ""
	Pop $3

	; Group 2
	${NSD_CreateFirstRadioButton} 4u 50u 50% 12u "FM"
	Pop $4
	${NSD_CreateAdditionalRadioButton} 4u 64u 50% 12u "AM"
	Pop $5

	SendMessage $4 ${BM_CLICK} "" "" ; Must select a default
	SendMessage $2 ${BM_CLICK} "" "" ; Must select a default
	nsDialogs::Show
FunctionEnd

Function onStationChanged
Pop $0
${NSD_GetText} $0 $0
${If} $0 == "NPR"
	${NSD_SetText} $3 "America, f*(# yeah!"
${Else}
	${NSD_SetText} $3 "Keep Calm and Carry On"
${EndIf}
FunctionEnd

Function RadioLeave
${NSD_GetChecked} $5 $0
${If} $0 <> 0
	MessageBox MB_YESNO "Are you sure you want to keep living in the past?" IDYES +2
		Abort
${EndIf}
FunctionEnd

Section
SectionEnd
