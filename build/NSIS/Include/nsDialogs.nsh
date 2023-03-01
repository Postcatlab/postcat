/*

nsDialogs.nsh
Header file for creating custom installer pages with nsDialogs

*/

!ifndef NSDIALOGS_INCLUDED
!verbose push 2
!define NSDIALOGS_INCLUDED
!verbose 3

!include LogicLib.nsh
!include WinMessages.nsh

!define /ifndef WS_EX_DLGMODALFRAME  0x00000001
!define /ifndef WS_EX_NOPARENTNOTIFY 0x00000004
!define /ifndef WS_EX_TOPMOST        0x00000008
!define /ifndef WS_EX_ACCEPTFILES    0x00000010
!define /ifndef WS_EX_TRANSPARENT    0x00000020
!define /ifndef WS_EX_MDICHILD       0x00000040
!define /ifndef WS_EX_TOOLWINDOW     0x00000080
!define /ifndef WS_EX_WINDOWEDGE     0x00000100
!define /ifndef WS_EX_CLIENTEDGE     0x00000200
!define /ifndef WS_EX_CONTEXTHELP    0x00000400
!define /ifndef WS_EX_RIGHT          0x00001000
!define /ifndef WS_EX_LEFT           0x00000000
!define /ifndef WS_EX_RTLREADING     0x00002000
!define /ifndef WS_EX_LTRREADING     0x00000000
!define /ifndef WS_EX_LEFTSCROLLBAR  0x00004000
!define /ifndef WS_EX_RIGHTSCROLLBAR 0x00000000
!define /ifndef WS_EX_CONTROLPARENT  0x00010000
!define /ifndef WS_EX_STATICEDGE     0x00020000
!define /ifndef WS_EX_APPWINDOW      0x00040000

!define /ifndef WS_CHILD             0x40000000
!define /ifndef WS_VISIBLE           0x10000000
!define /ifndef WS_DISABLED          0x08000000
!define /ifndef WS_CLIPSIBLINGS      0x04000000
!define /ifndef WS_CLIPCHILDREN      0x02000000
!define /ifndef WS_MAXIMIZE          0x01000000
!define /ifndef WS_BORDER            0x00800000
!define /ifndef WS_VSCROLL           0x00200000
!define /ifndef WS_HSCROLL           0x00100000
!define /ifndef WS_GROUP             0x00020000
!define /ifndef WS_MINIMIZEBOX       0x00020000
!define /ifndef WS_MAXIMIZEBOX       0x00010000
!define /ifndef WS_TABSTOP           0x00010000

!define ES_LEFT              0x00000000
!define ES_CENTER            0x00000001
!define ES_RIGHT             0x00000002
!define ES_MULTILINE         0x00000004
!define ES_UPPERCASE         0x00000008
!define ES_LOWERCASE         0x00000010
!define ES_PASSWORD          0x00000020
!define ES_AUTOVSCROLL       0x00000040
!define ES_AUTOHSCROLL       0x00000080
!define ES_NOHIDESEL         0x00000100
!define ES_OEMCONVERT        0x00000400
!define ES_READONLY          0x00000800
!define ES_WANTRETURN        0x00001000
!define ES_NUMBER            0x00002000
!define ES_SAVESEL           0x00008000

!define SS_LEFT              0x00000000
!define SS_CENTER            0x00000001
!define SS_RIGHT             0x00000002
!define SS_ICON              0x00000003
!define SS_BLACKRECT         0x00000004
!define SS_GRAYRECT          0x00000005
!define SS_WHITERECT         0x00000006
!define SS_BLACKFRAME        0x00000007
!define SS_GRAYFRAME         0x00000008
!define SS_WHITEFRAME        0x00000009
!define SS_USERITEM          0x0000000A
!define SS_SIMPLE            0x0000000B
!define SS_LEFTNOWORDWRAP    0x0000000C
!define SS_OWNERDRAW         0x0000000D
!define SS_BITMAP            0x0000000E
!define SS_ENHMETAFILE       0x0000000F
!define SS_ETCHEDHORZ        0x00000010
!define SS_ETCHEDVERT        0x00000011
!define SS_ETCHEDFRAME       0x00000012
!define SS_TYPEMASK          0x0000001F
!define SS_REALSIZECONTROL   0x00000040
!define SS_NOPREFIX          0x00000080
!define SS_NOTIFY            0x00000100
!define SS_CENTERIMAGE       0x00000200
!define SS_RIGHTJUST         0x00000400
!define SS_REALSIZEIMAGE     0x00000800
!define SS_SUNKEN            0x00001000
!define SS_EDITCONTROL       0x00002000
!define SS_ENDELLIPSIS       0x00004000
!define SS_PATHELLIPSIS      0x00008000
!define SS_WORDELLIPSIS      0x0000C000
!define SS_ELLIPSISMASK      0x0000C000

!define BS_PUSHBUTTON        0x00000000
!define BS_DEFPUSHBUTTON     0x00000001
!define BS_CHECKBOX          0x00000002
!define BS_AUTOCHECKBOX      0x00000003
!define BS_RADIOBUTTON       0x00000004
!define BS_3STATE            0x00000005
!define BS_AUTO3STATE        0x00000006
!define BS_GROUPBOX          0x00000007
!define BS_USERBUTTON        0x00000008
!define BS_AUTORADIOBUTTON   0x00000009
!define BS_PUSHBOX           0x0000000A
!define BS_OWNERDRAW         0x0000000B
!define BS_TYPEMASK          0x0000000F
!define BS_LEFTTEXT          0x00000020
!define BS_TEXT              0x00000000
!define BS_ICON              0x00000040
!define BS_BITMAP            0x00000080
!define BS_LEFT              0x00000100
!define BS_RIGHT             0x00000200
!define BS_CENTER            0x00000300
!define BS_TOP               0x00000400
!define BS_BOTTOM            0x00000800
!define BS_VCENTER           0x00000C00
!define BS_PUSHLIKE          0x00001000
!define BS_MULTILINE         0x00002000
!define BS_NOTIFY            0x00004000
!define BS_FLAT              0x00008000
!define BS_RIGHTBUTTON       ${BS_LEFTTEXT}

!define CBS_SIMPLE            0x0001
!define CBS_DROPDOWN          0x0002
!define CBS_DROPDOWNLIST      0x0003
!define CBS_OWNERDRAWFIXED    0x0010
!define CBS_OWNERDRAWVARIABLE 0x0020
!define CBS_AUTOHSCROLL       0x0040
!define CBS_OEMCONVERT        0x0080
!define CBS_SORT              0x0100
!define CBS_HASSTRINGS        0x0200
!define CBS_NOINTEGRALHEIGHT  0x0400
!define CBS_DISABLENOSCROLL   0x0800
!define CBS_UPPERCASE         0x2000
!define CBS_LOWERCASE         0x4000

!define LBS_NOTIFY            0x0001
!define LBS_SORT              0x0002
!define LBS_NOREDRAW          0x0004
!define LBS_MULTIPLESEL       0x0008
!define LBS_OWNERDRAWFIXED    0x0010
!define LBS_OWNERDRAWVARIABLE 0x0020
!define LBS_HASSTRINGS        0x0040
!define LBS_USETABSTOPS       0x0080
!define LBS_NOINTEGRALHEIGHT  0x0100
!define LBS_MULTICOLUMN       0x0200
!define LBS_WANTKEYBOARDINPUT 0x0400
!define LBS_EXTENDEDSEL       0x0800
!define LBS_DISABLENOSCROLL   0x1000
!define LBS_NODATA            0x2000
!define LBS_NOSEL             0x4000
!define LBS_COMBOBOX          0x8000

!define ACS_CENTER      0x0001
!define ACS_TRANSPARENT 0x0002 ;  The parent of the animation control must not have the WS_CLIPCHILDREN style
!define ACS_AUTOPLAY    0x0004
!define ACS_TIMER       0x0008 ; < CC6

!define TBS_AUTOTICKS        0x0001
!define TBS_VERT             0x0002
!define TBS_HORZ             0x0000
!define TBS_TOP              0x0004
!define TBS_BOTTOM           0x0000
!define TBS_LEFT             0x0004
!define TBS_RIGHT            0x0000
!define TBS_BOTH             0x0008
!define TBS_NOTICKS          0x0010
!define TBS_ENABLESELRANGE   0x0020
!define TBS_FIXEDLENGTH      0x0040
!define TBS_NOTHUMB          0x0080
!define TBS_TOOLTIPS         0x0100 ; IE3
!define TBS_REVERSED         0x0200 ; IE5
!define TBS_DOWNISLEFT       0x0400 ; _WIN32_IE >= 0x0501
!define TBS_NOTIFYBEFOREMOVE 0x0800 ; IE6?
!define TBS_TRANSPARENTBKGND 0x1000 ; Vista

!define UDS_WRAP        0x0001
!define UDS_SETBUDDYINT 0x0002
!define UDS_ALIGNRIGHT  0x0004
!define UDS_ALIGNLEFT   0x0008
!define UDS_AUTOBUDDY   0x0010
!define UDS_ARROWKEYS   0x0020
!define UDS_HORZ        0x0040
!define UDS_NOTHOUSANDS 0x0080
!define UDS_HOTTRACK    0x0100 ; 98+

!define MCS_DAYSTATE        0x0001
!define MCS_MULTISELECT     0x0002
!define MCS_WEEKNUMBERS     0x0004
!define MCS_NOTODAYCIRCLE   0x0008
!define MCS_NOTODAY         0x0010 ; IE4+?
!define MCS_NOTRAILINGDATES  0x0040 ; Vista+
!define MCS_SHORTDAYSOFWEEK  0x0080 ; Vista+
!define MCS_NOSELCHANGEONNAV 0x0100 ; Vista+

!define DTS_UPDOWN          0x01
!define DTS_SHOWNONE        0x02
!define DTS_SHORTDATEFORMAT 0x00
!define DTS_LONGDATEFORMAT  0x04
!define DTS_SHORTDATECENTURYFORMAT 0x0C
!define DTS_TIMEFORMAT      0x09
!define DTS_APPCANPARSE     0x10
!define DTS_RIGHTALIGN      0x20

!define /ifndef LR_DEFAULTCOLOR     0x0000
!define /ifndef LR_MONOCHROME       0x0001
!define /ifndef LR_COLOR            0x0002
!define /ifndef LR_COPYRETURNORG    0x0004
!define /ifndef LR_COPYDELETEORG    0x0008
!define /ifndef LR_LOADFROMFILE     0x0010
!define /ifndef LR_LOADTRANSPARENT  0x0020
!define /ifndef LR_DEFAULTSIZE      0x0040
!define /ifndef LR_VGACOLOR         0x0080
!define /ifndef LR_LOADMAP3DCOLORS  0x1000
!define /ifndef LR_CREATEDIBSECTION 0x2000
!define /ifndef LR_COPYFROMRESOURCE 0x4000
!define /ifndef LR_SHARED           0x8000

!define /ifndef IMAGE_BITMAP        0
!define /ifndef IMAGE_ICON          1
!define /ifndef IMAGE_CURSOR        2
!define /ifndef IMAGE_ENHMETAFILE   3

!define /ifndef GWL_STYLE           -16
!define /ifndef GWL_EXSTYLE         -20

#define /ifndef ICC_LISTVIEW_CLASSES 0x0001 ; SysListView32 and SysHeader32
#define /ifndef ICC_TREEVIEW_CLASSES 0x0002 ; SysTabControl32 and tooltips_class32
#define /ifndef ICC_BAR_CLASSES      0x0004 ; ToolbarWindow32, msctls_statusbar32, msctls_trackbar32 and tooltips_class32
#define /ifndef ICC_TAB_CLASSES      0x0008 ; SysTabControl32 and tooltips_class32
#define /ifndef ICC_UPDOWN_CLASS     0x0010 ; msctls_updown32
#define /ifndef ICC_PROGRESS_CLASS   0x0020 ; msctls_progress32
#define /ifndef ICC_HOTKEY_CLASS     0x0040 ; msctls_hotkey32
#define /ifndef ICC_ANIMATE_CLASS    0x0080 ; SysAnimate32
#define /ifndef ICC_WIN95_CLASSES    0x00FF
!define /ifndef ICC_DATE_CLASSES     0x0100 ; CC4.70+ (NT4+/IE3.1+/Win95 OSR2) SysDateTimePick32, SysMonthCal32 and CC6.10+(Vista+) DropDown
!define /ifndef ICC_USEREX_CLASSES   0x0200 ; CC4.??+ (NT4+/IE3.?+/Win95 OSR2) ComboBoxEx32
!define /ifndef ICC_COOL_CLASSES     0x0400 ; CC4.70+ (NT4+/IE3.1+/Win95 OSR2) ReBarWindow32
!define /ifndef ICC_INTERNET_CLASSES 0x0800 ; CC4.71+ (IE4+) SysIPAddress32
!define /ifndef ICC_PAGESCROLLER_CLASS 0x1000 ; CC4.71+ (IE4+) SysPager
!define /ifndef ICC_NATIVEFNTCTL_CLASS 0x2000 ; CC4.71+ (IE4+) NativeFontCtl
!define /ifndef ICC_STANDARD_CLASSES 0x4000 ; WinXP+ Button, Static, Edit, ListBox, ComboBox, ComboLBox, ScrollBar and ReaderModeCtl
!define /ifndef ICC_LINK_CLASS       0x8000 ; WinXP+ SysLink


!define DEFAULT_STYLES ${WS_CHILD}|${WS_VISIBLE}|${WS_CLIPSIBLINGS}

!define __NSD_HLine_CLASS STATIC
!define __NSD_HLine_STYLE ${DEFAULT_STYLES}|${SS_ETCHEDHORZ}|${SS_SUNKEN}
!define __NSD_HLine_EXSTYLE ${WS_EX_TRANSPARENT}

!define __NSD_VLine_CLASS STATIC
!define __NSD_VLine_STYLE ${DEFAULT_STYLES}|${SS_ETCHEDVERT}|${SS_SUNKEN}
!define __NSD_VLine_EXSTYLE ${WS_EX_TRANSPARENT}

!define __NSD_Label_CLASS STATIC
!define __NSD_Label_STYLE ${DEFAULT_STYLES}|${SS_NOTIFY}
!define __NSD_Label_EXSTYLE ${WS_EX_TRANSPARENT}

!define __NSD_Icon_CLASS STATIC
!define __NSD_Icon_STYLE ${DEFAULT_STYLES}|${SS_ICON}|${SS_NOTIFY}
!define __NSD_Icon_EXSTYLE 0

!define __NSD_Bitmap_CLASS STATIC
!define __NSD_Bitmap_STYLE ${DEFAULT_STYLES}|${SS_BITMAP}|${SS_NOTIFY}
!define __NSD_Bitmap_EXSTYLE 0

!define __NSD_BrowseButton_CLASS BUTTON
!define __NSD_BrowseButton_STYLE ${DEFAULT_STYLES}|${WS_TABSTOP}
!define __NSD_BrowseButton_EXSTYLE 0

!define __NSD_Link_CLASS LINK
!define __NSD_Link_STYLE ${DEFAULT_STYLES}|${WS_TABSTOP}|${BS_OWNERDRAW}
!define __NSD_Link_EXSTYLE 0

!define __NSD_Button_CLASS BUTTON
!define __NSD_Button_STYLE ${DEFAULT_STYLES}|${WS_TABSTOP}
!define __NSD_Button_EXSTYLE 0

!define __NSD_GroupBox_CLASS BUTTON
!define __NSD_GroupBox_STYLE ${DEFAULT_STYLES}|${BS_GROUPBOX}
!define __NSD_GroupBox_EXSTYLE ${WS_EX_TRANSPARENT}

!define __NSD_CheckBox_CLASS BUTTON
!define __NSD_CheckBox_STYLE ${DEFAULT_STYLES}|${WS_TABSTOP}|${BS_TEXT}|${BS_VCENTER}|${BS_AUTOCHECKBOX}|${BS_MULTILINE}
!define __NSD_CheckBox_EXSTYLE 0

!define __NSD_RadioButton_CLASS BUTTON
!define __NSD_RadioButton_STYLE ${DEFAULT_STYLES}|${WS_TABSTOP}|${BS_TEXT}|${BS_VCENTER}|${BS_AUTORADIOBUTTON}|${BS_MULTILINE}
!define __NSD_RadioButton_EXSTYLE 0

!define __NSD_FirstRadioButton_CLASS ${__NSD_RadioButton_CLASS}
!define __NSD_FirstRadioButton_STYLE ${DEFAULT_STYLES}|${WS_TABSTOP}|${WS_GROUP}|${BS_TEXT}|${BS_VCENTER}|${BS_AUTORADIOBUTTON}|${BS_MULTILINE}
!define __NSD_FirstRadioButton_EXSTYLE ${__NSD_RadioButton_EXSTYLE}

!define __NSD_AdditionalRadioButton_CLASS ${__NSD_RadioButton_CLASS}
!define __NSD_AdditionalRadioButton_STYLE ${DEFAULT_STYLES}|${BS_TEXT}|${BS_VCENTER}|${BS_AUTORADIOBUTTON}|${BS_MULTILINE}
!define __NSD_AdditionalRadioButton_EXSTYLE ${__NSD_RadioButton_EXSTYLE}

!define __NSD_Text_CLASS EDIT
!define __NSD_Text_STYLE ${DEFAULT_STYLES}|${WS_TABSTOP}|${ES_AUTOHSCROLL}
!define __NSD_Text_EXSTYLE ${WS_EX_WINDOWEDGE}|${WS_EX_CLIENTEDGE}

!define __NSD_MLText_CLASS EDIT
!define __NSD_MLText_STYLE ${DEFAULT_STYLES}|${WS_TABSTOP}|${ES_AUTOHSCROLL}|${ES_AUTOVSCROLL}|${ES_MULTILINE}|${ES_WANTRETURN}|${WS_HSCROLL}|${WS_VSCROLL}
!define __NSD_MLText_EXSTYLE ${WS_EX_WINDOWEDGE}|${WS_EX_CLIENTEDGE}

!define __NSD_Password_CLASS EDIT
!define __NSD_Password_STYLE ${DEFAULT_STYLES}|${WS_TABSTOP}|${ES_AUTOHSCROLL}|${ES_PASSWORD}
!define __NSD_Password_EXSTYLE ${WS_EX_WINDOWEDGE}|${WS_EX_CLIENTEDGE}

!define __NSD_Number_CLASS EDIT
!define __NSD_Number_STYLE ${DEFAULT_STYLES}|${WS_TABSTOP}|${ES_AUTOHSCROLL}|${ES_NUMBER}
!define __NSD_Number_EXSTYLE ${WS_EX_WINDOWEDGE}|${WS_EX_CLIENTEDGE}

!define __NSD_FileRequest_CLASS EDIT
!define __NSD_FileRequest_STYLE ${DEFAULT_STYLES}|${WS_TABSTOP}|${ES_AUTOHSCROLL}
!define __NSD_FileRequest_EXSTYLE ${WS_EX_WINDOWEDGE}|${WS_EX_CLIENTEDGE}

!define __NSD_DirRequest_CLASS EDIT
!define __NSD_DirRequest_STYLE ${DEFAULT_STYLES}|${WS_TABSTOP}|${ES_AUTOHSCROLL}
!define __NSD_DirRequest_EXSTYLE ${WS_EX_WINDOWEDGE}|${WS_EX_CLIENTEDGE}

!define __NSD_RichEdit_CLASS_10  "RICHEDIT"    ; 1.0 (Riched32.dll) Win95/NT4
!define __NSD_RichEdit_CLASS_20A "RICHEDIT20A" ; 2.0 (Riched20.dll) Win98/NT4 (NSIS makes sure this is registered even on Windows 95)
!define __NSD_RichEdit_CLASS_20W "RICHEDIT20W"
!define __NSD_RichEdit_CLASS_41W "RICHEDIT50W" ; 4.1 (MsftEdit.DLL) WinXP.SP1
!ifdef NSIS_UNICODE
!define /ifndef __NSD_RichEdit_CLASS ${__NSD_RichEdit_CLASS_20W}
!else
!define /ifndef __NSD_RichEdit_CLASS ${__NSD_RichEdit_CLASS_20A}
!endif
!define __NSD_RichEdit_STYLE ${DEFAULT_STYLES}|${WS_TABSTOP}|${ES_AUTOHSCROLL}|${ES_AUTOVSCROLL}|${ES_MULTILINE}|${ES_WANTRETURN}|${ES_SAVESEL}|${WS_HSCROLL}|${WS_VSCROLL}
!define __NSD_RichEdit_EXSTYLE ${WS_EX_WINDOWEDGE}|${WS_EX_CLIENTEDGE}

!define __NSD_ComboBox_CLASS COMBOBOX
!define __NSD_ComboBox_STYLE ${DEFAULT_STYLES}|${WS_TABSTOP}|${WS_VSCROLL}|${WS_CLIPCHILDREN}|${CBS_AUTOHSCROLL}|${CBS_HASSTRINGS}|${CBS_DROPDOWN}
!define __NSD_ComboBox_EXSTYLE ${WS_EX_WINDOWEDGE}|${WS_EX_CLIENTEDGE}

!define __NSD_DropList_CLASS COMBOBOX
!define __NSD_DropList_STYLE ${DEFAULT_STYLES}|${WS_TABSTOP}|${WS_VSCROLL}|${WS_CLIPCHILDREN}|${CBS_AUTOHSCROLL}|${CBS_HASSTRINGS}|${CBS_DROPDOWNLIST}
!define __NSD_DropList_EXSTYLE ${WS_EX_WINDOWEDGE}|${WS_EX_CLIENTEDGE}

!define __NSD_ListBox_CLASS LISTBOX
!define __NSD_ListBox_STYLE ${DEFAULT_STYLES}|${WS_TABSTOP}|${WS_VSCROLL}|${LBS_DISABLENOSCROLL}|${LBS_HASSTRINGS}|${LBS_NOINTEGRALHEIGHT}|${LBS_NOTIFY}
!define __NSD_ListBox_EXSTYLE ${WS_EX_WINDOWEDGE}|${WS_EX_CLIENTEDGE}

!define __NSD_SortedListBox_CLASS LISTBOX
!define __NSD_SortedListBox_STYLE ${__NSD_ListBox_STYLE}|${LBS_SORT}
!define __NSD_SortedListBox_EXSTYLE ${__NSD_ListBox_EXSTYLE}

!define __NSD_ProgressBar_CLASS msctls_progress32
!define __NSD_ProgressBar_STYLE ${DEFAULT_STYLES}
!define __NSD_ProgressBar_EXSTYLE ${WS_EX_WINDOWEDGE}|${WS_EX_CLIENTEDGE}

!define __NSD_Animation_CLASS SysAnimate32
!define __NSD_Animation_STYLE ${DEFAULT_STYLES}|${ACS_TRANSPARENT}|${ACS_AUTOPLAY}
!define __NSD_Animation_EXSTYLE 0

!define __NSD_HTrackBar_CLASS msctls_trackbar32
!define __NSD_HTrackBar_STYLE ${DEFAULT_STYLES}|${TBS_HORZ}|${TBS_AUTOTICKS}|${TBS_TOOLTIPS}
!define __NSD_HTrackBar_EXSTYLE 0

!define __NSD_VTrackBar_CLASS msctls_trackbar32
!define __NSD_VTrackBar_STYLE ${DEFAULT_STYLES}|${TBS_VERT}|${TBS_AUTOTICKS}|${TBS_TOOLTIPS}
!define __NSD_VTrackBar_EXSTYLE 0

!define __NSD_UpDown_CLASS msctls_updown32
!define __NSD_UpDown_STYLE ${DEFAULT_STYLES}|${UDS_SETBUDDYINT}|${UDS_ARROWKEYS}|${UDS_NOTHOUSANDS}|${UDS_ALIGNRIGHT}
!define __NSD_UpDown_EXSTYLE 0

!define __NSD_AutoUpDown_CLASS msctls_updown32
!define __NSD_AutoUpDown_STYLE ${__NSD_UpDown_STYLE}|${UDS_AUTOBUDDY}
!define __NSD_AutoUpDown_EXSTYLE ${__NSD_UpDown_EXSTYLE}

!define __NSD_HotKey_CLASS msctls_hotkey32
!define __NSD_HotKey_STYLE ${DEFAULT_STYLES}
!define __NSD_HotKey_EXSTYLE ${WS_EX_WINDOWEDGE}|${WS_EX_CLIENTEDGE}

!define __NSD_Calendar_CLASS SysMonthCal32
!define __NSD_Calendar_STYLE ${DEFAULT_STYLES}|${WS_TABSTOP}
!define __NSD_Calendar_EXSTYLE 0

!define __NSD_DatePicker_CLASS SysDateTimePick32
!define __NSD_DatePicker_STYLE ${DEFAULT_STYLES}|${WS_TABSTOP}
!define __NSD_DatePicker_EXSTYLE ${WS_EX_WINDOWEDGE}|${WS_EX_CLIENTEDGE}

!define __NSD_TimePicker_CLASS SysDateTimePick32
!define __NSD_TimePicker_STYLE ${DEFAULT_STYLES}|${WS_TABSTOP}|${DTS_TIMEFORMAT}
!define __NSD_TimePicker_EXSTYLE ${WS_EX_WINDOWEDGE}|${WS_EX_CLIENTEDGE}

!define __NSD_IPAddress_CLASS SysIPAddress32 ; IE4+/CC4.71+
!define __NSD_IPAddress_STYLE ${DEFAULT_STYLES}|${WS_TABSTOP}
!define __NSD_IPAddress_EXSTYLE 0

!define __NSD_NetAddress_CLASS msctls_netaddress ; Vista+
!define __NSD_NetAddress_STYLE ${DEFAULT_STYLES}|${WS_TABSTOP}
!define __NSD_NetAddress_EXSTYLE ${WS_EX_WINDOWEDGE}|${WS_EX_CLIENTEDGE}


!macro __NSD_DefineControl NAME
	!define NSD_Create${NAME} "nsDialogs::CreateControl ${__NSD_${Name}_CLASS} ${__NSD_${Name}_STYLE} ${__NSD_${Name}_EXSTYLE}"
!macroend
!insertmacro __NSD_DefineControl HLine
!insertmacro __NSD_DefineControl VLine
!insertmacro __NSD_DefineControl Label
!insertmacro __NSD_DefineControl Icon
!insertmacro __NSD_DefineControl Bitmap
!insertmacro __NSD_DefineControl BrowseButton
!insertmacro __NSD_DefineControl Link
!insertmacro __NSD_DefineControl Button
!insertmacro __NSD_DefineControl GroupBox
!insertmacro __NSD_DefineControl CheckBox
!insertmacro __NSD_DefineControl RadioButton
!insertmacro __NSD_DefineControl FirstRadioButton
!insertmacro __NSD_DefineControl AdditionalRadioButton
!insertmacro __NSD_DefineControl Text
!insertmacro __NSD_DefineControl MLText
!insertmacro __NSD_DefineControl Password
!insertmacro __NSD_DefineControl Number
!insertmacro __NSD_DefineControl FileRequest
!insertmacro __NSD_DefineControl DirRequest
!insertmacro __NSD_DefineControl RichEdit
!insertmacro __NSD_DefineControl ComboBox
!insertmacro __NSD_DefineControl DropList
!insertmacro __NSD_DefineControl ListBox
!insertmacro __NSD_DefineControl SortedListBox
!insertmacro __NSD_DefineControl ProgressBar
!insertmacro __NSD_DefineControl Animation
!insertmacro __NSD_DefineControl HTrackBar
!insertmacro __NSD_DefineControl VTrackBar
!insertmacro __NSD_DefineControl UpDown
!insertmacro __NSD_DefineControl AutoUpDown
!insertmacro __NSD_DefineControl HotKey
!insertmacro __NSD_DefineControl Calendar
!insertmacro __NSD_DefineControl DatePicker
!insertmacro __NSD_DefineControl TimePicker
!insertmacro __NSD_DefineControl IPAddress
!insertmacro __NSD_DefineControl NetAddress


!macro __NSD_OnControlEvent EVENT HWND FUNCTION
	Push $0
	Push $1

	StrCpy $1 "${HWND}"

	GetFunctionAddress $0 "${FUNCTION}"
	nsDialogs::On${EVENT} $1 $0

	Pop $1
	Pop $0
!macroend

!macro __NSD_DefineControlCallback EVENT
	!define NSD_On${EVENT} `!insertmacro __NSD_OnControlEvent ${EVENT} `
!macroend

!macro __NSD_OnDialogEvent EVENT FUNCTION
	Push $0

	GetFunctionAddress $0 "${FUNCTION}"
	nsDialogs::On${EVENT} $0

	Pop $0
!macroend

!macro __NSD_DefineDialogCallback EVENT
	!define NSD_On${EVENT} `!insertmacro __NSD_OnDialogEvent ${EVENT} `
!macroend
!insertmacro __NSD_DefineControlCallback Click
!insertmacro __NSD_DefineControlCallback Change
!insertmacro __NSD_DefineControlCallback Notify
!insertmacro __NSD_DefineDialogCallback Back

!define NSD_Return "!insertmacro NSD_Return "
!macro NSD_Return val
StrCpy $_OUTDIR ${val}
SetSilent silent
Return
!macroend


!define __NSD_MkCtlCmd "!insertmacro __NSD_MkCtlCmd "
!macro __NSD_MkCtlCmd msg wp lp hCtl
SendMessage ${hCtl} ${${msg}} ${wp} ${lp}
!macroend
!define __NSD_MkCtlCmd_WP "!insertmacro __NSD_MkCtlCmd_WP "
!macro __NSD_MkCtlCmd_WP msg lp hCtl wp
SendMessage ${hCtl} ${${msg}} ${wp} ${lp}
!macroend
!define __NSD_MkCtlCmd_LP "!insertmacro __NSD_MkCtlCmd_LP "
!macro __NSD_MkCtlCmd_LP msg wp hCtl lp
SendMessage ${hCtl} ${${msg}} ${wp} ${lp}
!macroend
!define __NSD_MkCtlCmd_WPLP "!insertmacro __NSD_MkCtlCmd_WPLP "
!macro __NSD_MkCtlCmd_WPLP msg hCtl wp lp
SendMessage ${hCtl} ${${msg}} ${wp} ${lp}
!macroend
!define __NSD_MkCtlCmd_RV "!insertmacro __NSD_MkCtlCmd_RV "
!macro __NSD_MkCtlCmd_RV msg wp lp hCtl VAR
SendMessage ${hCtl} ${${msg}} ${wp} ${lp} ${VAR}
!macroend


!define NSD_InitCommonControlsEx "!insertmacro __NSD_InitCommonControlsEx "
!macro __NSD_InitCommonControlsEx ICC
!pragma warning push
!pragma warning disable 7070 ; Invalid number
!if ${ICC} <> 0
!define /ReDef /IntFmt NSD_InitCommonControlsEx_TEMP "0x%X" ${ICC}
System::Call 'COMCTL32::InitCommonControlsEx(*l${NSD_InitCommonControlsEx_TEMP}00000008)'
!undef NSD_InitCommonControlsEx_TEMP
!else
System::Int64Op ${ICC} << 32
System::Int64Op 8 | 
System::Call 'COMCTL32::InitCommonControlsEx(*ls)' ; INITCOMMONCONTROLSEX as UINT64
!endif
!pragma warning pop
!macroend
!define NSD_InitCommonControl_IPAddress `${NSD_InitCommonControlsEx} ${ICC_INTERNET_CLASSES}`
!define NSD_InitCommonControl_NetAddress `System::Call SHELL32::InitNetworkAddressControl()i`
!define NSD_InitCommonControl_SysLink `${NSD_InitCommonControlsEx} ${ICC_LINK_CLASS}`


!define NSD_CreateTimer `!insertmacro _NSD_CreateTimer `
!macro _NSD_CreateTimer FUNCTION INTERVAL
	Push $0

	GetFunctionAddress $0 "${FUNCTION}"
	nsDialogs::CreateTimer $0 "${INTERVAL}"

	Pop $0
!macroend


!define NSD_KillTimer `!insertmacro _NSD_KillTimer `
!macro _NSD_KillTimer FUNCTION
	Push $0

	GetFunctionAddress $0 "${FUNCTION}"
	nsDialogs::KillTimer $0

	Pop $0
!macroend


!define NSD_AddStyle "!insertmacro _NSD_GWLAddFlags ${GWL_STYLE} "
!define NSD_AddExStyle "!insertmacro _NSD_GWLAddFlags ${GWL_EXSTYLE} "
!macro _NSD_GWLAddFlags GWL HWND DATA
	System::Call "user32::GetWindowLong(p${HWND},i${GWL})p.s"
	System::Int64Op "${DATA}" |
	System::Call "user32::SetWindowLong(p${HWND},p${GWL},ps)"
!macroend

!define NSD_RemoveStyle "!insertmacro _NSD_GWLRemoveFlags ${GWL_STYLE} " 
!define NSD_RemoveExStyle "!insertmacro _NSD_GWLRemoveFlags ${GWL_EXSTYLE} "
!macro _NSD_GWLRemoveFlags GWL HWND DATA
System::Call "user32::GetWindowLong(p${HWND},i${GWL})p.s"
System::Int64Op "${DATA}" ~ & ; Perform ~ and prepare the stack for &
System::Int64Op ; Perform &
System::Call "user32::SetWindowLong(p${HWND},i${GWL},ps)"
!macroend 

!define NSD_GetStyle "!insertmacro _NSD_GWLGetFlags ${GWL_STYLE} "
!define NSD_GetExStyle "!insertmacro _NSD_GWLGetFlags ${GWL_EXSTYLE} "
!macro _NSD_GWLGetFlags GWL HWND RET
System::Call "user32::GetWindowLong(p${HWND},i${GWL})p.s"
Pop ${RET}
!macroend

!macro __NSD_GetStyleBit GWL BIT HWND RET
!insertmacro _NSD_GWLGetFlags ${GWL} ${HWND} ${RET}
IntOp ${RET} ${RET} & ${BIT}
!macroend


!define NSD_SetFocus `!insertmacro __NSD_SetFocus `
!macro __NSD_SetFocus HWND
	System::Call "user32::SetFocus(p${HWND})"
!macroend


!define NSD_GetText "!insertmacro __NSD_GetText "
!macro __NSD_GetText CONTROL VAR
	System::Call user32::GetWindowText(p${CONTROL},t.s,i${NSIS_MAX_STRLEN})
	Pop ${VAR}
!macroend


!define NSD_SetText "!insertmacro __NSD_SetText "
!macro __NSD_SetText CONTROL TEXT
	SendMessage ${CONTROL} ${WM_SETTEXT} 0 `STR:${TEXT}`
!macroend


### Edit ###

!define NSD_Edit_GetTextLimit `${__NSD_MkCtlCmd_RV} EM_GETLIMITTEXT 0 0 `
!define NSD_Edit_SetTextLimit `${__NSD_MkCtlCmd_WP} EM_SETLIMITTEXT 0 `
!define NSD_Edit_SetPasswordChar `${__NSD_MkCtlCmd_WP} EM_SETPASSWORDCHAR 0 `
!define NSD_Edit_GetReadOnly `!insertmacro __NSD_GetStyleBit ${GWL_STYLE} ${ES_READONLY} ` ; Non-zero if read-only
!define NSD_Edit_SetReadOnly `${__NSD_MkCtlCmd_WP} EM_SETREADONLY 0 ` ; Toggles the ES_READONLY style
!define NSD_Edit_GetModify `${__NSD_MkCtlCmd_RV} EM_GETMODIFY 0 0 `
!define NSD_Edit_SetModify `${__NSD_MkCtlCmd_WP} EM_SETMODIFY 0 `
!define NSD_Edit_EmptyUndoBuffer `${__NSD_MkCtlCmd} EM_EMPTYUNDOBUFFER 0 0 `
!define NSD_Edit_CanUndo `${__NSD_MkCtlCmd_RV} EM_CANUNDO 0 0 `
!define NSD_Edit_ScrollCaret `${__NSD_MkCtlCmd} EM_SCROLLCARET 0 0 `
!define NSD_Edit_LineScroll `${__NSD_MkCtlCmd_WPLP} EM_LINESCROLL `
!define NSD_Edit_SetSel `${__NSD_MkCtlCmd_WPLP} EM_SETSEL ` ; WP:Start LP:End

!define NSD_Edit_SetCueBannerText "!insertmacro __NSD_Edit_SetCueBannerText " ; CC6+
!macro __NSD_Edit_SetCueBannerText CONTROL SHOWWHENFOCUSED TEXT
!if ${NSIS_CHAR_SIZE} > 1
	SendMessage ${CONTROL} ${EM_SETCUEBANNER} ${SHOWWHENFOCUSED} `STR:${TEXT}`
!else
	System::Call 'USER32::SendMessage(p${CONTROL},i${EM_SETCUEBANNER},p${SHOWWHENFOCUSED},ws)' `${TEXT}` ; Must be PWSTR
!endif
!macroend

!define NSD_Edit_GetLineCount `${__NSD_MkCtlCmd_RV} EM_GETLINECOUNT 0 0 `
!define NSD_Edit_GetLine "!insertmacro __NSD_Edit_GetLine "
!macro __NSD_Edit_GetLine CONTROL LINEINDEX OUTPUT
	System::Call '*(&i2 ${NSIS_MAX_STRLEN},&t${NSIS_MAX_STRLEN})p.s'
	System::Call 'USER32::SendMessage(p${CONTROL},i${EM_GETLINE},p${LINEINDEX},pss)'
	System::Call 'KERNEL32::lstrcpyn(t.s,pss,i${NSIS_MAX_STRLEN})'
	Pop ${OUTPUT}
	System::Free
!macroend

!define NSD_SetTextLimit `${NSD_Edit_SetTextLimit} ` ; Legacy alias


### RichEdit ###

!define NSD_RichEd_SetTextLimit `${__NSD_MkCtlCmd_LP} EM_EXLIMITTEXT 0 `
!define NSD_RichEd_GetEventMask `${__NSD_MkCtlCmd_RV} EM_GETEVENTMASK 0 0 `
!define NSD_RichEd_SetEventMask `${__NSD_MkCtlCmd_LP} EM_SETEVENTMASK 0 ` ; LP:ENM_*
!define NSD_RichEd_SetSystemBackgroundColor `${__NSD_MkCtlCmd} EM_SETBKGNDCOLOR 1 0 ` ; COLOR_WINDOW
!define NSD_RichEd_SetCustomBackgroundColor `${__NSD_MkCtlCmd_LP} EM_SETBKGNDCOLOR 0 ` ; LP:COLORREF
!define NSD_RichEd_SetHideSelection `${__NSD_MkCtlCmd_WP} EM_HIDESELECTION 0 ` ; WP(BOOL):HideSelWithoutFocus (Toggles ES_NOHIDESEL & TXTBIT_HIDESELECTION)


### CheckBox ###

!define NSD_GetState `!insertmacro __NSD_GetState `
!macro __NSD_GetState CONTROL VAR
	SendMessage ${CONTROL} ${BM_GETCHECK} 0 0 ${VAR}
!macroend


!define NSD_SetState `!insertmacro __NSD_SetState `
!macro __NSD_SetState CONTROL STATE
	SendMessage ${CONTROL} ${BM_SETCHECK} ${STATE} 0
!macroend

!define NSD_Check `!insertmacro __NSD_Check `
!macro __NSD_Check CONTROL
	${NSD_SetState} ${CONTROL} ${BST_CHECKED}
!macroend


!define NSD_Uncheck `!insertmacro __NSD_Uncheck `
!macro __NSD_Uncheck CONTROL
	${NSD_SetState} ${CONTROL} ${BST_UNCHECKED}
!macroend

!define NSD_GetChecked `!insertmacro __NSD_GetState `
!define NSD_SetChecked `!insertmacro __NSD_SetState `


### ComboBox ###

!define NSD_CB_AddString "!insertmacro _NSD_CB_AddString "
!macro _NSD_CB_AddString CONTROL STRING
	SendMessage ${CONTROL} ${CB_ADDSTRING} 0 `STR:${STRING}`
!macroend


!define NSD_CB_InsertString "!insertmacro _NSD_CB_InsertString "
!macro _NSD_CB_InsertString CONTROL INDEX STRING
SendMessage ${CONTROL} ${CB_INSERTSTRING} ${INDEX} `STR:${STRING}`
!macroend

!define NSD_CB_PrependString "!insertmacro _NSD_CB_PrependString "
!macro _NSD_CB_PrependString CONTROL STRING
SendMessage ${CONTROL} ${CB_INSERTSTRING} 0 `STR:${STRING}`
!macroend

!define NSD_CB_AppendString "!insertmacro _NSD_CB_AppendString "
!macro _NSD_CB_AppendString CONTROL STRING
SendMessage ${CONTROL} ${CB_INSERTSTRING} -1 `STR:${STRING}`
!macroend


!define NSD_CB_SelectString "!insertmacro _NSD_CB_SelectString "
!macro _NSD_CB_SelectString CONTROL STRING
	SendMessage ${CONTROL} ${CB_SELECTSTRING} -1 `STR:${STRING}`
!macroend


!define NSD_CB_GetSelectionIndex `!insertmacro __NSD_CB_GetSelectionIndex `
!macro __NSD_CB_GetSelectionIndex CONTROL VAR
	SendMessage ${CONTROL} ${CB_GETCURSEL} 0 0 ${VAR}
!macroend


!define NSD_CB_SetSelectionIndex `!insertmacro __NSD_CB_SetSelectionIndex `
!macro __NSD_CB_SetSelectionIndex CONTROL INDEX
	SendMessage ${CONTROL} ${CB_SETCURSEL} ${INDEX} 0
!macroend


!define NSD_CB_GetItemData `!insertmacro __NSD_CB_GetItemData `
!macro __NSD_CB_GetItemData CONTROL INDEX VAR
SendMessage ${CONTROL} ${CB_GETITEMDATA} ${INDEX} 0 ${VAR}
!macroend
!define NSD_CB_SetItemData `${__NSD_MkCtlCmd_WPLP} CB_SETITEMDATA ` ; Index Data


!define NSD_CB_DelItem `${__NSD_MkCtlCmd_WP} CB_DELETESTRING 0 `
!define NSD_CB_LimitText `${__NSD_MkCtlCmd_WP} CB_LIMITTEXT 0 `
!define /IfNDef NSD_CB_Clear `${__NSD_MkCtlCmd} CB_RESETCONTENT 0 0 `
!define /IfNDef NSD_CB_GetCount `${__NSD_MkCtlCmd_RV} CB_GETCOUNT 0 0 `
!ifndef NSD_CB_DelString
!define NSD_CB_DelString `!insertmacro __NSD_CB_DelString `
!macro __NSD_CB_DelString CONTROL STRING
	System::Call 'USER32::SendMessage(p${CONTROL},i${CB_FINDSTRINGEXACT},p-1,ts)p.s' `${STRING}`
	System::Call 'USER32::SendMessage(p${CONTROL},i${CB_DELETESTRING},ps,p0)'
!macroend
!endif
;define /IfNDef NSD_CB_GetSelection


### ListBox ###

!define NSD_LB_AddString "!insertmacro _NSD_LB_AddString "
!macro _NSD_LB_AddString CONTROL STRING
	SendMessage ${CONTROL} ${LB_ADDSTRING} 0 `STR:${STRING}`
!macroend


!define NSD_LB_InsertString "!insertmacro _NSD_LB_InsertString "
!macro _NSD_LB_InsertString CONTROL INDEX STRING
SendMessage ${CONTROL} ${LB_INSERTSTRING} ${INDEX} `STR:${STRING}`
!macroend

!define NSD_LB_PrependString "!insertmacro _NSD_LB_PrependString "
!macro _NSD_LB_PrependString CONTROL STRING
SendMessage ${CONTROL} ${LB_INSERTSTRING} 0 `STR:${STRING}`
!macroend

!define NSD_LB_AppendString "!insertmacro _NSD_LB_AppendString "
!macro _NSD_LB_AppendString CONTROL STRING
SendMessage ${CONTROL} ${LB_INSERTSTRING} -1 `STR:${STRING}`
!macroend


!define NSD_LB_DelString `!insertmacro __NSD_LB_DelString `
!macro __NSD_LB_DelString CONTROL STRING
	System::Call 'USER32::SendMessage(p${CONTROL},i${LB_FINDSTRINGEXACT},p-1,ts)p.s' `${STRING}`
	System::Call 'USER32::SendMessage(p${CONTROL},i${LB_DELETESTRING},ps,p0)'
!macroend


!define NSD_LB_DelItem "!insertmacro __NSD_LB_DelItem "
!macro __NSD_LB_DelItem CONTROL INDEX
	SendMessage ${CONTROL} ${LB_DELETESTRING} ${INDEX} 0
!macroend


!define NSD_LB_Clear `${__NSD_MkCtlCmd} LB_RESETCONTENT 0 0 `


!define NSD_LB_GetCount `!insertmacro __NSD_LB_GetCount `
!macro __NSD_LB_GetCount CONTROL VAR
	SendMessage ${CONTROL} ${LB_GETCOUNT} 0 0 ${VAR}
!macroend


!define NSD_LB_SelectString "!insertmacro _NSD_LB_SelectString "
!macro _NSD_LB_SelectString CONTROL STRING
	SendMessage ${CONTROL} ${LB_SELECTSTRING} -1 `STR:${STRING}`
!macroend


!define NSD_LB_GetSelection `!insertmacro __NSD_LB_GetSelection `
!macro __NSD_LB_GetSelection CONTROL VAR
	SendMessage ${CONTROL} ${LB_GETCURSEL} 0 0 ${VAR}
	System::Call 'user32::SendMessage(p ${CONTROL}, i ${LB_GETTEXT}, p ${VAR}, t .s)'
	Pop ${VAR}
!macroend


!define NSD_LB_GetSelectionIndex `!insertmacro __NSD_LB_GetSelectionIndex `
!macro __NSD_LB_GetSelectionIndex CONTROL VAR
	SendMessage ${CONTROL} ${LB_GETCURSEL} 0 0 ${VAR}
!macroend


!define NSD_LB_SetSelectionIndex `!insertmacro __NSD_LB_SetSelectionIndex `
!macro __NSD_LB_SetSelectionIndex CONTROL INDEX
	SendMessage ${CONTROL} ${LB_SETCURSEL} ${INDEX} 0
!macroend


!define NSD_LB_GetSelectionCount `!insertmacro __NSD_LB_GetSelectionCount `
!macro __NSD_LB_GetSelectionCount CONTROL VAR
	SendMessage ${CONTROL} ${LB_GETSELCOUNT} 0 0 ${VAR}
!macroend


!define NSD_LB_GetItemText `!insertmacro __NSD_LB_GetItemText `
!macro __NSD_LB_GetItemText CONTROL INDEX VAR
	System::Call 'user32::SendMessage(p${CONTROL}, i${LB_GETTEXT}, p${INDEX}, t.s)'
	Pop ${VAR}
!macroend


!define NSD_LB_GetItemData `!insertmacro __NSD_LB_GetItemData `
!macro __NSD_LB_GetItemData CONTROL INDEX VAR
SendMessage ${CONTROL} ${LB_GETITEMDATA} ${INDEX} 0 ${VAR}
!macroend
!define NSD_LB_SetItemData `${__NSD_MkCtlCmd_WPLP} LB_SETITEMDATA ` ; Index Data


!define NSD_LB_FindStringPrefix `!insertmacro __NSD_LB_FindStringPrefix `
!macro __NSD_LB_FindStringPrefix CONTROL STRING VAR
	SendMessage ${CONTROL} ${LB_FINDSTRING} -1 `STR:${STRING}` ${VAR}
!macroend


!define NSD_LB_FindStringExact `!insertmacro __NSD_LB_FindStringExact `
!macro __NSD_LB_FindStringExact CONTROL STRING VAR
	SendMessage ${CONTROL} ${LB_FINDSTRINGEXACT} -1 `STR:${STRING}` ${VAR}
!macroend


### ProgressBar ###

!define NSD_ProgressBar_SetPos `${__NSD_MkCtlCmd_WP} PBM_SETPOS 0 `
!define NSD_ProgressBar_SetStep `${__NSD_MkCtlCmd_WP} PBM_SETSTEP 0 `
!define NSD_ProgressBar_StepIt `${__NSD_MkCtlCmd} PBM_STEPIT 0 0 `
!define NSD_ProgressBar_AdvanceBy `${__NSD_MkCtlCmd_WP} PBM_DELTAPOS 0 `
!define NSD_ProgressBar_SetPackedRange `${__NSD_MkCtlCmd_LP} PBM_SETRANGE 0 ` ; LP(DWORD):MAKELONG(min,max)
!define NSD_ProgressBar_SetRange32 `${__NSD_MkCtlCmd_WPLP} PBM_SETRANGE32 ` ; [IE3+] WP:min LP:max
!define NSD_ProgressBar_GetPos `${__NSD_MkCtlCmd_RV} PBM_GETPOS 0 0 ` ; [IE3+]


### Animation ###

!define NSD_Anim_Close `${__NSD_MkCtlCmd} ACM_OPEN 0 0 `
!define NSD_Anim_Play `${__NSD_MkCtlCmd} ACM_PLAY -1 0xFFFF0000 `
!define NSD_Anim_PlayLoops `${__NSD_MkCtlCmd_WP} ACM_PLAY 0xFFFF0000 ` ; WP(UINT16):LoopCount
!define NSD_Anim_Stop `${__NSD_MkCtlCmd} ACM_STOP 0 0 `
!define NSD_Anim_IsPlaying `${__NSD_MkCtlCmd_RV} ACM_ISPLAYING 0 0 `

!define NSD_Anim_OpenFile `!insertmacro __NSD_Anim_OpenFile `
!macro __NSD_Anim_OpenFile CONTROL PATH
	SendMessage ${CONTROL} ${ACM_OPEN} 0 "STR:${PATH}"
!macroend

!define NSD_Anim_OpenResource `!insertmacro __NSD_Anim_OpenResource `
!macro __NSD_Anim_OpenResource CONTROL HINSTANCE_CC471 RESID
	SendMessage ${CONTROL} ${ACM_OPEN} "${HINSTANCE_CC471}" "${RESID}"
!macroend


### TrackBar ###

!define NSD_TrackBar_GetPos `${__NSD_MkCtlCmd_RV} TBM_GETPOS 0 0 `
!define NSD_TrackBar_SetPos `${__NSD_MkCtlCmd_LP} TBM_SETPOS 1 `
!define NSD_TrackBar_SetRangeMin `${__NSD_MkCtlCmd_LP} TBM_SETRANGEMIN 1 `
!define NSD_TrackBar_SetRangeMax `${__NSD_MkCtlCmd_LP} TBM_SETRANGEMAX 1 `
!define NSD_TrackBar_GetLineSize `${__NSD_MkCtlCmd_RV} TBM_GETLINESIZE 0 0 `
!define NSD_TrackBar_SetLineSize `${__NSD_MkCtlCmd_LP} TBM_SETLINESIZE 0 `
!define NSD_TrackBar_GetPageSize `${__NSD_MkCtlCmd_RV} TBM_GETPAGESIZE 0 0 `
!define NSD_TrackBar_SetPageSize `${__NSD_MkCtlCmd_LP} TBM_SETPAGESIZE 0 `
!define NSD_TrackBar_ClearTics `${__NSD_MkCtlCmd} TBM_CLEARTICS 0 0 `
!define NSD_TrackBar_GetNumTics `${__NSD_MkCtlCmd_RV} TBM_GETNUMTICS 0 0 `
!define NSD_TrackBar_SetTic `${__NSD_MkCtlCmd_LP} TBM_SETTIC 0 `
!define NSD_TrackBar_SetTicFreq `${__NSD_MkCtlCmd_WP} TBM_SETTICFREQ 0 `
!define NSD_TrackBar_GetThumbLength `${__NSD_MkCtlCmd_RV} TBM_GETTHUMBLENGTH 0 0 `
!define NSD_TrackBar_SetBuddy `${__NSD_MkCtlCmd_WPLP} TBM_SETBUDDY ` ; WP(BOOL):Left/Right LP:HWND


### UpDown ###

!define NSD_UD_SetBuddy `${__NSD_MkCtlCmd_WP} UDM_SETBUDDY 0 `
!define NSD_UD_GetPos `${__NSD_MkCtlCmd_RV} UDM_GETPOS 0 0 `
!define NSD_UD_SetPos `${__NSD_MkCtlCmd_LP} UDM_SETPOS 0 `
!define NSD_UD_GetPackedRange `${__NSD_MkCtlCmd_RV} UDM_GETRANGE 0 0 `
!define NSD_UD_SetPackedRange `${__NSD_MkCtlCmd_LP} UDM_SETRANGE 0 ` ; LP(DWORD):MAKELONG(min,max)
!define NSD_UD_GetPos32 `${__NSD_MkCtlCmd_RV} UDM_GETPOS32 0 0 `
!define NSD_UD_SetPos32 `${__NSD_MkCtlCmd_LP} UDM_SETPOS32 0 `
!define NSD_UD_SetRange32 `${__NSD_MkCtlCmd_WPLP} UDM_SETRANGE32 ` ; WP(INT32):min LP(INT32):max

!define NSD_UD_GetRange32 `!insertmacro __NSD_UD_GetRange32 `
!macro __NSD_UD_GetRange32 CONTROL OUTLO OUTHI
	System::Call 'USER32::SendMessage(p${CONTROL},i${UDM_GETRANGE32},*i.s,*i.s)'
	Pop ${OUTLO}
	Pop ${OUTHI}
!macroend

!define NSD_UD_SetStaticRange `!insertmacro __NSD_UD_SetStaticRange `
!macro __NSD_UD_SetStaticRange CONTROL MI MA
	!define /redef /math MI ${MI} << 16
	!define /redef /math MA ${MA} & 0xffff
	!define /redef /math MA ${MI} | ${MA}
	SendMessage ${CONTROL} ${UDM_SETRANGE} 0 ${MA}
!macroend


### HotKey ###

!define NSD_HK_GetHotKey `${__NSD_MkCtlCmd_RV} HKM_GETHOTKEY 0 0 ` ; RV(WORD):MAKEWORD(VK,HOTKEYF)
!define NSD_HK_SetHotKey `${__NSD_MkCtlCmd_WP} HKM_SETHOTKEY 0 `
!define NSD_HK_SetRules `${__NSD_MkCtlCmd_WPLP} HKM_SETRULES `


### IP Address ###

!define NSD_IPAddress_Clear `${__NSD_MkCtlCmd} IPM_CLEARADDRESS 0 0 `
!define NSD_IPAddress_SetPackedIPv4 `${__NSD_MkCtlCmd_LP} IPM_SETADDRESS 0 `
!define NSD_IPAddress_IsBlank `${__NSD_MkCtlCmd_RV} IPM_ISBLANK 0 0 `

!define NSD_IPAddress_GetPackedIPv4 `!insertmacro __NSD_IPAddress_GetPackedIPv4 `
!macro __NSD_IPAddress_GetPackedIPv4 CONTROL VAR
System::Call 'USER32::SendMessage(p${CONTROL},i${IPM_GETADDRESS},p0,*i0s)'
Pop ${VAR}
!macroend


### Date ###
!define NSD_Date_GetDateFields `!insertmacro __NSD_Date_GetDateFields `
!macro __NSD_Date_GetDateFields CONTROL
Push $0
System::Call 'USER32::SendMessage(p${CONTROL},i${DTM_GETSYSTEMTIME},p0,@r0)'
System::Call '*$0(&i2.s,&i2.s,&i2,&i2.s)'
Exch 3
Pop $0
!macroend

!define NSD_Time_GetTimeFields `!insertmacro __NSD_Time_GetTimeFields `
!macro __NSD_Time_GetTimeFields CONTROL
Push $0
System::Call 'USER32::SendMessage(p${CONTROL},i${DTM_GETSYSTEMTIME},p0,@r0)'
System::Call '*$0(&i2,&i2,&i2,&i2,&i2.s,&i2.s,&i2.s)'
Exch 3
Pop $0
Exch
!macroend


### Static ###

!macro __NSD_LoadAndSetImage _LIHINSTMODE _IMGTYPE _LIHINSTSRC _LIFLAGS CONTROL IMAGE HANDLE
	!if "${_LIHINSTMODE}" == "exeresource"
		LoadAndSetImage /EXERESOURCE /STRINGID "${CONTROL}" ${_IMGTYPE} ${_LIFLAGS} "${IMAGE}" ${HANDLE}
	!else #if "${_LIHINSTMODE}" == "file"
		LoadAndSetImage /STRINGID "${CONTROL}" ${_IMGTYPE} ${_LIFLAGS} "${IMAGE}" ${HANDLE}
	!endif
!macroend

!macro __NSD_SetIconFromExeResource CONTROL IMAGE HANDLE
	LoadAndSetImage /EXERESOURCE /STRINGID "${CONTROL}" ${IMAGE_ICON} ${LR_DEFAULTSIZE} "${IMAGE}" ${HANDLE}
!macroend

!macro __NSD_SetIconFromInstaller CONTROL HANDLE
	LoadAndSetImage /EXERESOURCE "${CONTROL}" ${IMAGE_ICON} ${LR_DEFAULTSIZE} 103 ${HANDLE}
!macroend

!define NSD_SetImage `!insertmacro __NSD_LoadAndSetImage file ${IMAGE_BITMAP} 0 "${LR_LOADFROMFILE}" `
!define NSD_SetBitmap `${NSD_SetImage} `

!define NSD_SetIcon `!insertmacro __NSD_LoadAndSetImage file ${IMAGE_ICON} 0 "${LR_LOADFROMFILE}|${LR_DEFAULTSIZE}" `
!define NSD_SetIconFromExeResource `!insertmacro __NSD_SetIconFromExeResource `
!define NSD_SetIconFromInstaller `!insertmacro __NSD_SetIconFromInstaller `


!define NSD_SetStretchedImage `!insertmacro __NSD_SetStretchedImage `
!define NSD_SetStretchedBitmap `!insertmacro __NSD_SetStretchedImage `
!macro __NSD_SetStretchedImage CONTROL IMAGE HANDLE
	LoadAndSetImage /STRINGID /RESIZETOFIT "${CONTROL}" ${IMAGE_BITMAP} ${LR_LOADFROMFILE} "${IMAGE}" ${HANDLE}
!macroend


!define NSD_FreeImage `!insertmacro __NSD_FreeImage `
!define NSD_FreeBitmap `${NSD_FreeImage} `
!macro __NSD_FreeImage IMAGE
	${If} ${IMAGE} P<> 0
		System::Call gdi32::DeleteObject(ps) ${IMAGE}
	${EndIf}
!macroend


!define NSD_FreeIcon `!insertmacro __NSD_FreeIcon `
!macro __NSD_FreeIcon IMAGE
	System::Call user32::DestroyIcon(ps) ${IMAGE}
!macroend


!define NSD_ClearImage `!insertmacro __NSD_ClearImage ${IMAGE_BITMAP} `
!define NSD_ClearBitmap `${NSD_ClearImage} `
!define NSD_ClearIcon  `!insertmacro __NSD_ClearImage ${IMAGE_ICON } `
!macro __NSD_ClearImage _IMGTYPE CONTROL
	SendMessage ${CONTROL} ${STM_SETIMAGE} ${_IMGTYPE} 0
!macroend


### INI ###

!define /IfNDef NSD_Debug `System::Call kernel32::OutputDebugString(ts)`

!macro __NSD_ControlCase TYPE
	${Case} ${TYPE}
		${NSD_Create${TYPE}} $R3u $R4u $R5u $R6u $R7
		Pop $R9
		${Break}
!macroend

!macro __NSD_ControlCaseEx TYPE
	${Case} ${TYPE}
		Call ${TYPE}
		${Break}
!macroend

!macro NSD_FUNCTION_INIFILE
	!insertmacro NSD_INIFILE ""
!macroend

!macro NSD_UNFUNCTION_INIFILE
	!insertmacro NSD_INIFILE un.
!macroend

!macro NSD_INIFILE UNINSTALLER_FUNCPREFIX

	;Functions to create dialogs based on old InstallOptions INI files

	Function ${UNINSTALLER_FUNCPREFIX}CreateDialogFromINI

		# $0 = ini

		ReadINIStr $R0 $0 Settings RECT
		${If} $R0 == ""
			StrCpy $R0 1018
		${EndIf}

		nsDialogs::Create $R0
		Pop $R9

		ReadINIStr $R0 $0 Settings RTL
		nsDialogs::SetRTL $R0

		ReadINIStr $R0 $0 Settings NumFields

		${NSD_Debug} "NumFields = $R0"

		${For} $R1 1 $R0
			${NSD_Debug} "Creating field $R1"
			ReadINIStr $R2 $0 "Field $R1" Type
			${NSD_Debug} "  Type = $R2"
			ReadINIStr $R3 $0 "Field $R1" Left
			${NSD_Debug} "  Left = $R3"
			ReadINIStr $R4 $0 "Field $R1" Top
			${NSD_Debug} "  Top = $R4"
			ReadINIStr $R5 $0 "Field $R1" Right
			${NSD_Debug} "  Right = $R5"
			ReadINIStr $R6 $0 "Field $R1" Bottom
			${NSD_Debug} "  Bottom = $R6"
			IntOp $R5 $R5 - $R3
			${NSD_Debug} "  Width = $R5"
			IntOp $R6 $R6 - $R4
			${NSD_Debug} "  Height = $R6"
			ReadINIStr $R7 $0 "Field $R1" Text
			${NSD_Debug} "  Text = $R7"
			${Switch} $R2
				!insertmacro __NSD_ControlCase   HLine
				!insertmacro __NSD_ControlCase   VLine
				!insertmacro __NSD_ControlCase   Label
				!insertmacro __NSD_ControlCase   Icon
				!insertmacro __NSD_ControlCase   Bitmap
				!insertmacro __NSD_ControlCaseEx Link
				!insertmacro __NSD_ControlCase   Button
				!insertmacro __NSD_ControlCase   GroupBox
				!insertmacro __NSD_ControlCase   CheckBox
				!insertmacro __NSD_ControlCase   RadioButton
				!insertmacro __NSD_ControlCase   Text
				!insertmacro __NSD_ControlCase   Password
				!insertmacro __NSD_ControlCaseEx FileRequest
				!insertmacro __NSD_ControlCaseEx DirRequest
				!insertmacro __NSD_ControlCase   ComboBox
				!insertmacro __NSD_ControlCase   DropList
				!insertmacro __NSD_ControlCase   ListBox
			${EndSwitch}

			WriteINIStr $0 "Field $R1" HWND $R9
		${Next}

		nsDialogs::Show

	FunctionEnd

	Function ${UNINSTALLER_FUNCPREFIX}UpdateINIState

		${NSD_Debug} "Updating INI state"

		ReadINIStr $R0 $0 Settings NumFields

		${NSD_Debug} "NumField = $R0"

		${For} $R1 1 $R0
			ReadINIStr $R2 $0 "Field $R1" HWND
			ReadINIStr $R3 $0 "Field $R1" "Type"
			${Switch} $R3
				${Case} "CheckBox"
				${Case} "RadioButton"
					${NSD_Debug} "  HWND = $R2"
					${NSD_GetState} $R2 $R2
					${NSD_Debug} "  Window selection = $R2"
				${Break}
				${CaseElse}
					${NSD_Debug} "  HWND = $R2"
					${NSD_GetText} $R2 $R2
					${NSD_Debug} "  Window text = $R2"
				${Break}
			${EndSwitch}
			WriteINIStr $0 "Field $R1" STATE $R2
		${Next}

	FunctionEnd

	Function ${UNINSTALLER_FUNCPREFIX}FileRequest

		IntOp $R5 $R5 - 15
		IntOp $R8 $R3 + $R5

		${NSD_CreateBrowseButton} $R8u $R4u 15u $R6u ...
		Pop $R8

		nsDialogs::SetUserData $R8 $R1 # remember field id

		WriteINIStr $0 "Field $R1" HWND2 $R8

		${NSD_OnClick} $R8 ${UNINSTALLER_FUNCPREFIX}OnFileBrowseButton

		ReadINIStr $R9 $0 "Field $R1" State

		${NSD_CreateFileRequest} $R3u $R4u $R5u $R6u $R9
		Pop $R9

	FunctionEnd

	Function ${UNINSTALLER_FUNCPREFIX}DirRequest

		IntOp $R5 $R5 - 15
		IntOp $R8 $R3 + $R5

		${NSD_CreateBrowseButton} $R8u $R4u 15u $R6u ...
		Pop $R8

		nsDialogs::SetUserData $R8 $R1 # remember field id

		WriteINIStr $0 "Field $R1" HWND2 $R8

		${NSD_OnClick} $R8 ${UNINSTALLER_FUNCPREFIX}OnDirBrowseButton

		ReadINIStr $R9 $0 "Field $R1" State

		${NSD_CreateFileRequest} $R3u $R4u $R5u $R6u $R9
		Pop $R9

	FunctionEnd

	Function ${UNINSTALLER_FUNCPREFIX}OnFileBrowseButton

		Pop $R0

		nsDialogs::GetUserData $R0
		Pop $R1

		ReadINIStr $R2 $0 "Field $R1" HWND
		ReadINIStr $R4 $0 "Field $R1" Filter

		${NSD_GetText} $R2 $R3

		nsDialogs::SelectFileDialog save $R3 $R4
		Pop $R3

		${If} $R3 != ""
			SendMessage $R2 ${WM_SETTEXT} 0 STR:$R3
		${EndIf}

	FunctionEnd

	Function ${UNINSTALLER_FUNCPREFIX}OnDirBrowseButton

		Pop $R0

		nsDialogs::GetUserData $R0
		Pop $R1

		ReadINIStr $R2 $0 "Field $R1" HWND
		ReadINIStr $R3 $0 "Field $R1" Text

		${NSD_GetText} $R2 $R4

		nsDialogs::SelectFolderDialog $R3 $R4
		Pop $R3

		${If} $R3 != error
			SendMessage $R2 ${WM_SETTEXT} 0 STR:$R3
		${EndIf}

	FunctionEnd

	Function ${UNINSTALLER_FUNCPREFIX}Link

		${NSD_CreateLink} $R3u $R4u $R5u $R6u $R7
		Pop $R9

		nsDialogs::SetUserData $R9 $R1 # remember field id

		${NSD_OnClick} $R9 ${UNINSTALLER_FUNCPREFIX}OnLink

	FunctionEnd

	Function ${UNINSTALLER_FUNCPREFIX}OnLink

		Pop $R0

		nsDialogs::GetUserData $R0
		Pop $R1

		ReadINIStr $R1 $0 "Field $R1" STATE

		ExecShell "" $R1

	FunctionEnd

!macroend

!verbose pop
!endif
