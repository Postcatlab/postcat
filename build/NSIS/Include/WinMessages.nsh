/*
_____________________________________________________________________________

                       List of common Windows Messages
_____________________________________________________________________________

 2005 Shengalts Aleksander aka Instructor (Shengalts@mail.ru)


Usage example:
---------------------------------------------------
Name "Output"
OutFile "Output.exe"

!include "WinMessages.nsh"

Section
	FindWindow $0 '#32770' '' $HWNDPARENT
	GetDlgItem $1 $0 1027
	SendMessage $1 ${WM_SETTEXT} 0 'STR:MyText'
SectionEnd
---------------------------------------------------


Prefix  Message category
-------------------------
SW      ShowWindow Commands
CCM     Generic Common Control
BM      Button control
CB      Combo box control
EM      Edit control
LB      List box control
WM      General window
ABM     Application desktop toolbar
DBT     Device
DM      Default push button control
HDM     Header control
LVM     List view control
SB      Status bar window
SBM     Scroll bar control
STM     Static control
TCM     Tab control
PBM     Progress bar
ACM     Animation control
TBM     Track bar
UDM     Up-down control
HKM     Hot key control
IPM     IP address control
NCM     Network address control
-----------------------------------

NOT included messages (WM_USER + X)
-----------------------------------
CBEM    Extended combo box control
CDM     Common dialog box
DL      Drag list box
PGM     Pager control
PSM     Property sheet
RB      Rebar control
TB      Toolbar
TTM     Tooltip control
TVM     Tree-view control
-----------------------------------
*/


!ifndef WINMESSAGES_INCLUDED
!define WINMESSAGES_INCLUDED
!verbose push
!verbose 3

!define _NSIS_DEFAW '!insertmacro _NSIS_DEFAW '
!macro _NSIS_DEFAW d
!ifdef NSIS_UNICODE
!define ${d} "${${d}W}"
!else
!define ${d} "${${d}A}"
!endif
!macroend

!define HWND_BROADCAST      0xFFFF

#ShowWindow Commands#
!define SW_HIDE             0
!define SW_SHOWNORMAL       1
!define SW_NORMAL           1
!define SW_SHOWMINIMIZED    2
!define SW_SHOWMAXIMIZED    3
!define SW_MAXIMIZE         3
!define SW_SHOWNOACTIVATE   4
!define SW_SHOW             5
!define SW_MINIMIZE         6
!define SW_SHOWMINNOACTIVE  7
!define SW_SHOWNA           8
!define SW_RESTORE          9
!define SW_SHOWDEFAULT      10
!define SW_FORCEMINIMIZE    11
!define SW_MAX              11

#Generic Common Control Messages#
!define CCM_FIRST 0x2000
!define /math CCM_SETBKCOLOR       ${CCM_FIRST} + 0x1 ; IE4
!define /math CCM_SETUNICODEFORMAT ${CCM_FIRST} + 0x5 
!define /math CCM_GETUNICODEFORMAT ${CCM_FIRST} + 0x6
!define /math CCM_SETVERSION       ${CCM_FIRST} + 0x7 ; IE5
!define /math CCM_GETVERSION       ${CCM_FIRST} + 0x8
!define /math CCM_SETWINDOWTHEME   ${CCM_FIRST} + 0xB ; WinXP
!define /math CCM_DPISCALE         ${CCM_FIRST} + 0xC
!define WM_USER 0x400

!define CCS_TOP 1
!define CCS_BOTTOM 3
!define CCS_NODIVIDER 64
!define CCS_LEFT 129
!define CCS_RIGHT 131

!define I_IMAGENONE -2

#Button Control Messages#
!define BM_CLICK           0x00F5
!define BM_GETCHECK        0x00F0
!define BM_GETIMAGE        0x00F6
!define BM_GETSTATE        0x00F2
!define BM_SETCHECK        0x00F1
!define BM_SETIMAGE        0x00F7
!define BM_SETSTATE        0x00F3
!define BM_SETSTYLE        0x00F4
!define BCM_SETSHIELD      0x160C ; WinVista + ComCtl32 v6

!define BST_UNCHECKED      0
!define BST_CHECKED        1
!define BST_INDETERMINATE  2
!define BST_PUSHED         4
!define BST_FOCUS          8

#Combo Box Messages#
!define CB_ADDSTRING                0x0143
!define CB_DELETESTRING             0x0144
!define CB_DIR                      0x0145
!define CB_FINDSTRING               0x014C
!define CB_FINDSTRINGEXACT          0x0158
!define CB_GETCOUNT                 0x0146
!define CB_GETCURSEL                0x0147
!define CB_GETDROPPEDCONTROLRECT    0x0152
!define CB_GETDROPPEDSTATE          0x0157
!define CB_GETDROPPEDWIDTH          0x015f
!define CB_GETEDITSEL               0x0140
!define CB_GETEXTENDEDUI            0x0156
!define CB_GETHORIZONTALEXTENT      0x015d
!define CB_GETITEMDATA              0x0150
!define CB_GETITEMHEIGHT            0x0154
!define CB_GETLBTEXT                0x0148
!define CB_GETLBTEXTLEN             0x0149
!define CB_GETLOCALE                0x015A
!define CB_GETTOPINDEX              0x015b
!define CB_INITSTORAGE              0x0161
!define CB_INSERTSTRING             0x014A
!define CB_LIMITTEXT                0x0141
!define CB_MSGMAX                   0x015B  # 0x0162 0x0163
!define CB_MULTIPLEADDSTRING        0x0163
!define CB_RESETCONTENT             0x014B
!define CB_SELECTSTRING             0x014D
!define CB_SETCURSEL                0x014E
!define CB_SETDROPPEDWIDTH          0x0160
!define CB_SETEDITSEL               0x0142
!define CB_SETEXTENDEDUI            0x0155
!define CB_SETHORIZONTALEXTENT      0x015e
!define CB_SETITEMDATA              0x0151
!define CB_SETITEMHEIGHT            0x0153
!define CB_SETLOCALE                0x0159
!define CB_SETTOPINDEX              0x015c
!define CB_SHOWDROPDOWN             0x014F
!define CBM_FIRST                   0x1700 ; Vista+
!define /math CB_SETMINVISIBLE ${CBM_FIRST} + 1
!define /math CB_GETMINVISIBLE ${CBM_FIRST} + 2
!define /math CB_SETCUEBANNER  ${CBM_FIRST} + 3
!define /math CB_GETCUEBANNER  ${CBM_FIRST} + 4

!define CB_ERR                      -1

#Edit Control Messages#
!define EM_CANUNDO              0x00C6
!define EM_CHARFROMPOS          0x00D7
!define EM_EMPTYUNDOBUFFER      0x00CD
!define EM_FMTLINES             0x00C8
!define EM_GETFIRSTVISIBLELINE  0x00CE
!define EM_GETHANDLE            0x00BD
!define EM_GETIMESTATUS         0x00D9
!define EM_GETLIMITTEXT         0x00D5
!define EM_GETLINE              0x00C4
!define EM_GETLINECOUNT         0x00BA
!define EM_GETMARGINS           0x00D4
!define EM_GETMODIFY            0x00B8
!define EM_GETPASSWORDCHAR      0x00D2
!define EM_GETRECT              0x00B2
!define EM_GETSEL               0x00B0
!define EM_GETTHUMB             0x00BE
!define EM_GETWORDBREAKPROC     0x00D1
!define EM_LIMITTEXT            0x00C5
!define EM_LINEFROMCHAR         0x00C9
!define EM_LINEINDEX            0x00BB
!define EM_LINELENGTH           0x00C1
!define EM_LINESCROLL           0x00B6
!define EM_POSFROMCHAR          0x00D6
!define EM_REPLACESEL           0x00C2
!define EM_SCROLL               0x00B5
!define EM_SCROLLCARET          0x00B7
!define EM_SETHANDLE            0x00BC
!define EM_SETIMESTATUS         0x00D8
!define EM_SETLIMITTEXT         0x00C5  # Same as EM_LIMITTEXT
!define EM_SETMARGINS           0x00D3
!define EM_SETMODIFY            0x00B9
!define EM_SETPASSWORDCHAR      0x00CC
!define EM_SETREADONLY          0x00CF
!define EM_SETRECT              0x00B3
!define EM_SETRECTNP            0x00B4
!define EM_SETSEL               0x00B1
!define EM_SETTABSTOPS          0x00CB
!define EM_SETWORDBREAKPROC     0x00D0
!define EM_UNDO                 0x00C7
!define ECM_FIRST               0x1500 ; CC6+
!define /math EM_SETCUEBANNER ${ECM_FIRST} + 1

#RichEdit Messages#
!define /math EM_EXGETSEL        ${WM_USER} + 52
!define /math EM_EXLIMITTEXT     ${WM_USER} + 53
!define /math EM_EXLINEFROMCHAR  ${WM_USER} + 54
!define /math EM_GETEVENTMASK    ${WM_USER} + 59
!define /math EM_GETOLEINTERFACE ${WM_USER} + 60
!define /math EM_HIDESELECTION   ${WM_USER} + 63
!define /math EM_SETBKGNDCOLOR   ${WM_USER} + 67
!define /math EM_SETEVENTMASK    ${WM_USER} + 69
!define /math EM_STREAMIN        ${WM_USER} + 73
!define /math EM_STREAMOUT       ${WM_USER} + 74
!define /math EM_GETTEXTRANGE    ${WM_USER} + 75
!define /math EM_SETOPTIONS      ${WM_USER} + 77
!define /math EM_GETOPTIONS      ${WM_USER} + 78
!define /math EM_SETUNDOLIMIT    ${WM_USER} + 82 ; v2+
!define /math EM_AUTOURLDETECT   ${WM_USER} + 91
!define /Math EM_SETTEXTEX       ${WM_USER} + 97 ; v3+
!define /math EM_SETEDITSTYLE    ${WM_USER} + 204
!define /math EM_SETFONTSIZE     ${WM_USER} + 223

!define EN_MSGFILTER 0x0700
!define EN_SELCHANGE 0x0702
!define EN_LINK      0x070b

!define ENM_NONE         0x00000000
!define ENM_CHANGE       0x00000001
!define ENM_UPDATE       0x00000002
!define ENM_SCROLL       0x00000004
!define ENM_SCROLLEVENTS 0x00000008
!define ENM_KEYEVENTS    0x00010000
!define ENM_MOUSEEVENTS  0x00020000
!define ENM_SELCHANGE    0x00080000
!define ENM_LINK         0x04000000 ; v2+

#Listbox Messages#
!define LB_ADDFILE              0x0196
!define LB_ADDSTRING            0x0180
!define LB_DELETESTRING         0x0182
!define LB_DIR                  0x018D
!define LB_FINDSTRING           0x018F
!define LB_FINDSTRINGEXACT      0x01A2
!define LB_GETANCHORINDEX       0x019D
!define LB_GETCARETINDEX        0x019F
!define LB_GETCOUNT             0x018B
!define LB_GETCURSEL            0x0188
!define LB_GETHORIZONTALEXTENT  0x0193
!define LB_GETITEMDATA          0x0199
!define LB_GETITEMHEIGHT        0x01A1
!define LB_GETITEMRECT          0x0198
!define LB_GETLOCALE            0x01A6
!define LB_GETSEL               0x0187
!define LB_GETSELCOUNT          0x0190
!define LB_GETSELITEMS          0x0191
!define LB_GETTEXT              0x0189
!define LB_GETTEXTLEN           0x018A
!define LB_GETTOPINDEX          0x018E
!define LB_INITSTORAGE          0x01A8
!define LB_INSERTSTRING         0x0181
!define LB_ITEMFROMPOINT        0x01A9
!define LB_MSGMAX               0x01A8  # 0x01B0 0x01B1
!define LB_MULTIPLEADDSTRING    0x01B1
!define LB_RESETCONTENT         0x0184
!define LB_SELECTSTRING         0x018C
!define LB_SELITEMRANGE         0x019B
!define LB_SELITEMRANGEEX       0x0183
!define LB_SETANCHORINDEX       0x019C
!define LB_SETCARETINDEX        0x019E
!define LB_SETCOLUMNWIDTH       0x0195
!define LB_SETCOUNT             0x01A7
!define LB_SETCURSEL            0x0186
!define LB_SETHORIZONTALEXTENT  0x0194
!define LB_SETITEMDATA          0x019A
!define LB_SETITEMHEIGHT        0x01A0
!define LB_SETLOCALE            0x01A5
!define LB_SETSEL               0x0185
!define LB_SETTABSTOPS          0x0192
!define LB_SETTOPINDEX          0x0197

!define LB_ERR                  -1

#Window Messages#
!define WM_ACTIVATE                     0x0006
!define WM_ACTIVATEAPP                  0x001C
!define WM_AFXFIRST                     0x0360
!define WM_AFXLAST                      0x037F
!define WM_APP                          0x8000
!define WM_APPCOMMAND                   0x0319
!define WM_ASKCBFORMATNAME              0x030C
!define WM_CANCELJOURNAL                0x004B
!define WM_CANCELMODE                   0x001F
!define WM_CAPTURECHANGED               0x0215
!define WM_CHANGECBCHAIN                0x030D
!define WM_CHANGEUISTATE                0x0127
!define WM_CHAR                         0x0102
!define WM_CHARTOITEM                   0x002F
!define WM_CHILDACTIVATE                0x0022
!define WM_CLEAR                        0x0303
!define WM_CLOSE                        0x0010
!define WM_COMMAND                      0x0111
!define WM_COMMNOTIFY                   0x0044  # no longer suported
!define WM_COMPACTING                   0x0041
!define WM_COMPAREITEM                  0x0039
!define WM_CONTEXTMENU                  0x007B
!define WM_CONVERTREQUESTEX             0x108
!define WM_COPY                         0x0301
!define WM_COPYDATA                     0x004A
!define WM_CREATE                       0x0001
!define WM_CTLCOLOR                     0x0019
!define WM_CTLCOLORBTN                  0x0135
!define WM_CTLCOLORDLG                  0x0136
!define WM_CTLCOLOREDIT                 0x0133
!define WM_CTLCOLORLISTBOX              0x0134
!define WM_CTLCOLORMSGBOX               0x0132
!define WM_CTLCOLORSCROLLBAR            0x0137
!define WM_CTLCOLORSTATIC               0x0138
!define WM_CUT                          0x0300
!define WM_DDE_FIRST                    0x3E0
!define WM_DEADCHAR                     0x0103
!define WM_DELETEITEM                   0x002D
!define WM_DESTROY                      0x0002
!define WM_DESTROYCLIPBOARD             0x0307
!define WM_DEVICECHANGE                 0x0219
!define WM_DEVMODECHANGE                0x001B
!define WM_DISPLAYCHANGE                0x007E
!define WM_DRAWCLIPBOARD                0x0308
!define WM_DRAWITEM                     0x002B
!define WM_DROPFILES                    0x0233
!define WM_ENABLE                       0x000A
!define WM_ENDSESSION                   0x0016
!define WM_ENTERIDLE                    0x0121
!define WM_ENTERMENULOOP                0x0211
!define WM_ENTERSIZEMOVE                0x0231
!define WM_ERASEBKGND                   0x0014
!define WM_EXITMENULOOP                 0x0212
!define WM_EXITSIZEMOVE                 0x0232
!define WM_FONTCHANGE                   0x001D
!define WM_GETDLGCODE                   0x0087
!define WM_GETFONT                      0x0031
!define WM_GETHOTKEY                    0x0033
!define WM_GETICON                      0x007F
!define WM_GETMINMAXINFO                0x0024
!define WM_GETOBJECT                    0x003D
!define WM_GETTEXT                      0x000D
!define WM_GETTEXTLENGTH                0x000E
!define WM_HANDHELDFIRST                0x0358
!define WM_HANDHELDLAST                 0x035F
!define WM_HELP                         0x0053
!define WM_HOTKEY                       0x0312
!define WM_HSCROLL                      0x0114
!define WM_HSCROLLCLIPBOARD             0x030E
!define WM_ICONERASEBKGND               0x0027
!define WM_IME_CHAR                     0x0286
!define WM_IME_COMPOSITION              0x010F
!define WM_IME_COMPOSITIONFULL          0x0284
!define WM_IME_CONTROL                  0x0283
!define WM_IME_ENDCOMPOSITION           0x010E
!define WM_IME_KEYDOWN                  0x0290
!define WM_IME_KEYLAST                  0x010F
!define WM_IME_KEYUP                    0x0291
!define WM_IME_NOTIFY                   0x0282
!define WM_IME_REQUEST                  0x0288
!define WM_IME_SELECT                   0x0285
!define WM_IME_SETCONTEXT               0x0281
!define WM_IME_STARTCOMPOSITION         0x010D
!define WM_INITDIALOG                   0x0110
!define WM_INITMENU                     0x0116
!define WM_INITMENUPOPUP                0x0117
!define WM_INPUT                        0x00FF
!define WM_INPUTLANGCHANGE              0x0051
!define WM_INPUTLANGCHANGEREQUEST       0x0050
!define WM_KEYDOWN                      0x0100
!define WM_KEYFIRST                     0x0100
!define WM_KEYLAST                      0x0108
!define WM_KEYUP                        0x0101
!define WM_KILLFOCUS                    0x0008
!define WM_LBUTTONDBLCLK                0x0203
!define WM_LBUTTONDOWN                  0x0201
!define WM_LBUTTONUP                    0x0202
!define WM_MBUTTONDBLCLK                0x0209
!define WM_MBUTTONDOWN                  0x0207
!define WM_MBUTTONUP                    0x0208
!define WM_MDIACTIVATE                  0x0222
!define WM_MDICASCADE                   0x0227
!define WM_MDICREATE                    0x0220
!define WM_MDIDESTROY                   0x0221
!define WM_MDIGETACTIVE                 0x0229
!define WM_MDIICONARRANGE               0x0228
!define WM_MDIMAXIMIZE                  0x0225
!define WM_MDINEXT                      0x0224
!define WM_MDIREFRESHMENU               0x0234
!define WM_MDIRESTORE                   0x0223
!define WM_MDISETMENU                   0x0230
!define WM_MDITILE                      0x0226
!define WM_MEASUREITEM                  0x002C
!define WM_MENUCHAR                     0x0120
!define WM_MENUCOMMAND                  0x0126
!define WM_MENUDRAG                     0x0123
!define WM_MENUGETOBJECT                0x0124
!define WM_MENURBUTTONUP                0x0122
!define WM_MENUSELECT                   0x011F
!define WM_MOUSEACTIVATE                0x0021
!define WM_MOUSEFIRST                   0x0200
!define WM_MOUSEHOVER                   0x02A1
!define WM_MOUSELAST                    0x0209  # 0x020A 0x020D
!define WM_MOUSELEAVE                   0x02A3
!define WM_MOUSEMOVE                    0x0200
!define WM_MOUSEWHEEL                   0x020A
!define WM_MOVE                         0x0003
!define WM_MOVING                       0x0216
!define WM_NCACTIVATE                   0x0086
!define WM_NCCALCSIZE                   0x0083
!define WM_NCCREATE                     0x0081
!define WM_NCDESTROY                    0x0082
!define WM_NCHITTEST                    0x0084
!define WM_NCLBUTTONDBLCLK              0x00A3
!define WM_NCLBUTTONDOWN                0x00A1
!define WM_NCLBUTTONUP                  0x00A2
!define WM_NCMBUTTONDBLCLK              0x00A9
!define WM_NCMBUTTONDOWN                0x00A7
!define WM_NCMBUTTONUP                  0x00A8
!define WM_NCMOUSEHOVER                 0x02A0
!define WM_NCMOUSELEAVE                 0x02A2
!define WM_NCMOUSEMOVE                  0x00A0
!define WM_NCPAINT                      0x0085
!define WM_NCRBUTTONDBLCLK              0x00A6
!define WM_NCRBUTTONDOWN                0x00A4
!define WM_NCRBUTTONUP                  0x00A5
!define WM_NCXBUTTONDBLCLK              0x00AD
!define WM_NCXBUTTONDOWN                0x00AB
!define WM_NCXBUTTONUP                  0x00AC
!define WM_NEXTDLGCTL                   0x0028
!define WM_NEXTMENU                     0x0213
!define WM_NOTIFY                       0x004E
!define WM_NOTIFYFORMAT                 0x0055
!define WM_NULL                         0x0000
!define WM_PAINT                        0x000F
!define WM_PAINTCLIPBOARD               0x0309
!define WM_PAINTICON                    0x0026
!define WM_PALETTECHANGED               0x0311
!define WM_PALETTEISCHANGING            0x0310
!define WM_PARENTNOTIFY                 0x0210
!define WM_PASTE                        0x0302
!define WM_PENWINFIRST                  0x0380
!define WM_PENWINLAST                   0x038F
!define WM_POWER                        0x0048
!define WM_POWERBROADCAST               0x0218
!define WM_PRINT                        0x0317
!define WM_PRINTCLIENT                  0x0318
!define WM_QUERYDRAGICON                0x0037
!define WM_QUERYENDSESSION              0x0011
!define WM_QUERYNEWPALETTE              0x030F
!define WM_QUERYOPEN                    0x0013
!define WM_QUERYUISTATE                 0x0129
!define WM_QUEUESYNC                    0x0023
!define WM_QUIT                         0x0012
!define WM_RBUTTONDBLCLK                0x0206
!define WM_RBUTTONDOWN                  0x0204
!define WM_RBUTTONUP                    0x0205
!define WM_RASDIALEVENT                 0xCCCD
!define WM_RENDERALLFORMATS             0x0306
!define WM_RENDERFORMAT                 0x0305
!define WM_SETCURSOR                    0x0020
!define WM_SETFOCUS                     0x0007
!define WM_SETFONT                      0x0030
!define WM_SETHOTKEY                    0x0032
!define WM_SETICON                      0x0080
!define WM_SETREDRAW                    0x000B
!define WM_SETTEXT                      0x000C
!define WM_SETTINGCHANGE                0x001A  # Same as WM_WININICHANGE
!define WM_SHOWWINDOW                   0x0018
!define WM_SIZE                         0x0005
!define WM_SIZECLIPBOARD                0x030B
!define WM_SIZING                       0x0214
!define WM_SPOOLERSTATUS                0x002A
!define WM_STYLECHANGED                 0x007D
!define WM_STYLECHANGING                0x007C
!define WM_SYNCPAINT                    0x0088
!define WM_SYSCHAR                      0x0106
!define WM_SYSCOLORCHANGE               0x0015
!define WM_SYSCOMMAND                   0x0112
!define WM_SYSDEADCHAR                  0x0107
!define WM_SYSKEYDOWN                   0x0104
!define WM_SYSKEYUP                     0x0105
!define WM_TABLET_FIRST                 0x02C0
!define WM_TABLET_LAST                  0x02DF
!define WM_THEMECHANGED                 0x031A
!define WM_TCARD                        0x0052
!define WM_TIMECHANGE                   0x001E
!define WM_TIMER                        0x0113
!define WM_UNDO                         0x0304
!define WM_UNICHAR                      0x0109
!define WM_UNINITMENUPOPUP              0x0125
!define WM_UPDATEUISTATE                0x0128
!define WM_USERCHANGED                  0x0054
!define WM_VKEYTOITEM                   0x002E
!define WM_VSCROLL                      0x0115
!define WM_VSCROLLCLIPBOARD             0x030A
!define WM_WINDOWPOSCHANGED             0x0047
!define WM_WINDOWPOSCHANGING            0x0046
!define WM_WININICHANGE                 0x001A
!define WM_WTSSESSION_CHANGE            0x02B1
!define WM_XBUTTONDBLCLK                0x020D
!define WM_XBUTTONDOWN                  0x020B
!define WM_XBUTTONUP                    0x020C


#Application desktop toolbar#
!define ABM_ACTIVATE         0x00000006  # lParam == TRUE/FALSE means activate/deactivate
!define ABM_GETAUTOHIDEBAR   0x00000007
!define ABM_GETSTATE         0x00000004
!define ABM_GETTASKBARPOS    0x00000005
!define ABM_NEW              0x00000000
!define ABM_QUERYPOS         0x00000002
!define ABM_REMOVE           0x00000001
!define ABM_SETAUTOHIDEBAR   0x00000008  # This can fail, you MUST check the result
!define ABM_SETPOS           0x00000003
!define ABM_WINDOWPOSCHANGED 0x0000009

#Device#
!define DBT_APPYBEGIN                   0x0000
!define DBT_APPYEND                     0x0001
!define DBT_CONFIGCHANGECANCELED        0x0019
!define DBT_CONFIGCHANGED               0x0018
!define DBT_CONFIGMGAPI32               0x0022
!define DBT_CONFIGMGPRIVATE             0x7FFF
!define DBT_CUSTOMEVENT                 0x8006  # User-defined event
!define DBT_DEVICEARRIVAL               0x8000  # System detected a new device
!define DBT_DEVICEQUERYREMOVE           0x8001  # Wants to remove, may fail
!define DBT_DEVICEQUERYREMOVEFAILED     0x8002  # Removal aborted
!define DBT_DEVICEREMOVECOMPLETE        0x8004  # Device is gone
!define DBT_DEVICEREMOVEPENDING         0x8003  # About to remove, still avail.
!define DBT_DEVICETYPESPECIFIC          0x8005  # Type specific event
!define DBT_DEVNODES_CHANGED            0x0007
!define DBT_DEVTYP_DEVICEINTERFACE      0x00000005  # Device interface class
!define DBT_DEVTYP_DEVNODE              0x00000001  # Devnode number
!define DBT_DEVTYP_HANDLE               0x00000006  # File system handle
!define DBT_DEVTYP_NET                  0x00000004  # Network resource
!define DBT_DEVTYP_OEM                  0x00000000  # Oem-defined device type
!define DBT_DEVTYP_PORT                 0x00000003  # Serial, parallel
!define DBT_DEVTYP_VOLUME               0x00000002  # Logical volume
!define DBT_LOW_DISK_SPACE              0x0048
!define DBT_MONITORCHANGE               0x001B
!define DBT_NO_DISK_SPACE               0x0047
!define DBT_QUERYCHANGECONFIG           0x0017
!define DBT_SHELLLOGGEDON               0x0020
!define DBT_USERDEFINED                 0xFFFF
!define DBT_VOLLOCKLOCKFAILED           0x8043
!define DBT_VOLLOCKLOCKRELEASED         0x8045
!define DBT_VOLLOCKLOCKTAKEN            0x8042
!define DBT_VOLLOCKQUERYLOCK            0x8041
!define DBT_VOLLOCKQUERYUNLOCK          0x8044
!define DBT_VOLLOCKUNLOCKFAILED         0x8046
!define DBT_VPOWERDAPI                  0x8100  # VPOWERD API for Win95
!define DBT_VXDINITCOMPLETE             0x0023

#Default push button control#
!define DM_BITSPERPEL       0x00040000
!define DM_COLLATE          0x00008000
!define DM_COLOR            0x00000800
!define DM_COPIES           0x00000100
!define DM_DEFAULTSOURCE    0x00000200
!define DM_DISPLAYFLAGS     0x00200000
!define DM_DISPLAYFREQUENCY 0x00400000
!define DM_DITHERTYPE       0x04000000
!define DM_DUPLEX           0x00001000
!define DM_FORMNAME         0x00010000
!define DM_GRAYSCALE        0x00000001  # This flag is no longer valid
!define DM_ICMINTENT        0x01000000
!define DM_ICMMETHOD        0x00800000
!define DM_INTERLACED       0x00000002  # This flag is no longer valid
!define DM_LOGPIXELS        0x00020000
!define DM_MEDIATYPE        0x02000000
!define DM_NUP              0x00000040
!define DM_ORIENTATION      0x00000001
!define DM_PANNINGHEIGHT    0x10000000
!define DM_PANNINGWIDTH     0x08000000
!define DM_PAPERLENGTH      0x00000004
!define DM_PAPERSIZE        0x00000002
!define DM_PAPERWIDTH       0x00000008
!define DM_PELSHEIGHT       0x00100000
!define DM_PELSWIDTH        0x00080000
!define DM_POSITION         0x00000020
!define DM_PRINTQUALITY     0x00000400
!define DM_SCALE            0x00000010
!define DM_SPECVERSION      0x0320       # 0x0400 0x0401
!define DM_TTOPTION         0x00004000
!define DM_YRESOLUTION      0x00002000

#Header control#
!define HDM_FIRST           0x1200

#List view control#
!define LVS_SINGLESEL           4
!define LVS_SHOWSELALWAYS       8
!define LVS_SORTASCENDING    0x10
!define LVS_SORTDESCENDING   0x20
!define LVS_SHAREIMAGELISTS  0x40
!define LVS_EDITLABELS      0x200
!define LVS_NOSCROLL       0x2000
!define LVS_NOCOLUMNHEADER 0x4000
!define LVS_NOSORTHEADER   0x8000
!define LVS_ICON      0
!define LVS_REPORT    1
!define LVS_SMALLICON 2
!define LVS_LIST      3
!define LVS_EX_CHECKBOXES         4
!define LVS_EX_FULLROWSELECT   0x20
!define LVS_EX_INFOTIP        0x400
!define LVS_EX_LABELTIP      0x4000
!define LVS_EX_DOUBLEBUFFER 0x10000
!define LVIF_TEXT  1
!define LVIF_IMAGE 2
!define LVIF_PARAM 4
!define LVIF_STATE 8
!define LVIS_STATEIMAGEMASK 0xF000
!define LVCF_FMT     1
!define LVCF_WIDTH   2
!define LVCF_TEXT    4
!define LVCF_SUBITEM 8
!define SYSSTRUCT_LVITEM_V1 (i,i,i,i,&i${NSIS_PTR_SIZE},t,i,i,p)
!define SYSSTRUCT_LVITEM_V2 (i,i,i,i,&i${NSIS_PTR_SIZE},t,i,i,p,i)           ; IE3
!define SYSSTRUCT_LVITEM_V3 (i,i,i,i,&i${NSIS_PTR_SIZE},t,i,i,p,i,i,i,i)     ; WinXP + ComCtl32 v6
!define SYSSTRUCT_LVITEM_V4 (i,i,i,i,&i${NSIS_PTR_SIZE},t,i,i,p,i,i,i,i,i,i) ; WinVista + ComCtl32 v6
!define LVSCW_AUTOSIZE -1
!define LVSCW_AUTOSIZE_USEHEADER -2
!define LVM_FIRST                          0x00001000
!define /math LVM_GETIMAGELIST             ${LVM_FIRST} +  2
!define /math LVM_SETIMAGELIST             ${LVM_FIRST} +  3
!define /math LVM_GETITEMCOUNT             ${LVM_FIRST} +  4
!define /math LVM_GETITEMA                 ${LVM_FIRST} +  5
!define /math LVM_SETITEMA                 ${LVM_FIRST} +  6
!define /math LVM_INSERTITEMA              ${LVM_FIRST} +  7
!define /math LVM_DELETEITEM               ${LVM_FIRST} +  8
!define /math LVM_DELETEALLITEMS           ${LVM_FIRST} +  9
!define /math LVM_INSERTCOLUMNA            ${LVM_FIRST} + 27
!define /math LVM_SETCOLUMNWIDTH           ${LVM_FIRST} + 30
!define /math LVM_SETITEMSTATE             ${LVM_FIRST} + 43
!define /math LVM_GETITEMSTATE             ${LVM_FIRST} + 44
!define /math LVM_GETITEMTEXTA             ${LVM_FIRST} + 45
!define /math LVM_SETITEMTEXTA             ${LVM_FIRST} + 46
!define /math LVM_SETITEMCOUNT             ${LVM_FIRST} + 47
!define /math LVM_SORTITEMS                ${LVM_FIRST} + 48
!define /math LVM_SETEXTENDEDLISTVIEWSTYLE ${LVM_FIRST} + 54
!define /math LVM_GETEXTENDEDLISTVIEWSTYLE ${LVM_FIRST} + 55
!define /math LVM_GETITEMW                 ${LVM_FIRST} + 75
!define /math LVM_SETITEMW                 ${LVM_FIRST} + 76
!define /math LVM_INSERTITEMW              ${LVM_FIRST} + 77
!define /math LVM_INSERTCOLUMNW            ${LVM_FIRST} + 97
!define /math LVM_GETITEMTEXTW             ${LVM_FIRST} + 115
!define /math LVM_SETITEMTEXTW             ${LVM_FIRST} + 116
!define /math LVM_SETSELECTEDCOLUMN        ${LVM_FIRST} + 140
${_NSIS_DEFAW} LVM_GETITEM
${_NSIS_DEFAW} LVM_SETITEM
${_NSIS_DEFAW} LVM_INSERTITEM
${_NSIS_DEFAW} LVM_INSERTCOLUMN
${_NSIS_DEFAW} LVM_GETITEMTEXT
${_NSIS_DEFAW} LVM_SETITEMTEXT

#Status bar window#
!define SB_SIMPLEID 0x00ff

#Scroll bar control#
!define SBM_ENABLE_ARROWS           0x00E4  # Not in win3.1
!define SBM_GETPOS                  0x00E1  # Not in win3.1
!define SBM_GETRANGE                0x00E3  # Not in win3.1
!define SBM_GETSCROLLINFO           0x00EA
!define SBM_SETPOS                  0x00E0  # Not in win3.1
!define SBM_SETRANGE                0x00E2  # Not in win3.1
!define SBM_SETRANGEREDRAW          0x00E6  # Not in win3.1
!define SBM_SETSCROLLINFO           0x00E9

#Static control#
!define STM_SETICON                 0x0170
!define STM_GETICON                 0x0171
!define STM_SETIMAGE                0x0172
!define STM_GETIMAGE                0x0173
!define STM_MSGMAX                  0x0174

#Tab control#
!define TCS_SCROLLOPPOSITE 0x0001
!define TCIF_TEXT  1
!define TCIF_PARAM 8
!define SYSSTRUCT_TCITEM (i,i,&i${NSIS_PTR_SIZE},t,i,i,p)
!define TCM_FIRST             0x1300
!define /math TCM_INSERTITEMA ${TCM_FIRST} + 7
!define /math TCM_GETCURSEL   ${TCM_FIRST} + 11
!define /math TCM_ADJUSTRECT  ${TCM_FIRST} + 40
!define /math TCM_INSERTITEMW ${TCM_FIRST} + 62
!define TCN_SELCHANGE   -551
!define TCN_SELCHANGING -552
${_NSIS_DEFAW} TCM_INSERTITEM

#Progress bar control#
!define PBM_SETRANGE    0x401
!define PBM_SETPOS      0x402
!define PBM_DELTAPOS    0x403
!define PBM_SETSTEP     0x404
!define PBM_STEPIT      0x405
!define PBM_SETRANGE32  0x406 ; IE3 + ComCtl32 v4.70
!define PBM_GETRANGE    0x407
!define PBM_GETPOS      0x408
!define PBM_SETBARCOLOR 0x409 ; IE4 + ComCtl32 v4.71
!define PBM_SETBKCOLOR  ${CCM_SETBKCOLOR}
!define PBM_SETMARQUEE  0x40A ; WinXP + ComCtl32 v6
!define PBM_GETSTEP     0x40D ; WinVista
!define PBM_GETBKCOLOR  0x40E
!define PBM_GETBARCOLOR 0x40F
!define PBM_SETSTATE    0x410
!define PBM_GETSTATE    0x411

!define PBST_NORMAL 1
!define PBST_ERROR  2
!define PBST_PAUSED 3

#Animation control#
!define /math ACM_OPENA ${WM_USER} + 100
!define /math ACM_PLAY  ${WM_USER} + 101
!define /math ACM_STOP  ${WM_USER} + 102
!define /math ACM_OPENW ${WM_USER} + 103
${_NSIS_DEFAW} ACM_OPEN

#TrackBar control#
!define /math TBM_GETPOS         ${WM_USER} + 0
!define /math TBM_GETRANGEMIN    ${WM_USER} + 1
!define /math TBM_GETRANGEMAX    ${WM_USER} + 2
!define /math TBM_GETTIC         ${WM_USER} + 3
!define /math TBM_SETTIC         ${WM_USER} + 4
!define /math TBM_SETPOS         ${WM_USER} + 5
!define /math TBM_SETRANGE       ${WM_USER} + 6
!define /math TBM_SETRANGEMIN    ${WM_USER} + 7
!define /math TBM_SETRANGEMAX    ${WM_USER} + 8
!define /math TBM_CLEARTICS      ${WM_USER} + 9
!define /math TBM_SETSEL         ${WM_USER} + 10
!define /math TBM_SETSELSTART    ${WM_USER} + 11
!define /math TBM_SETSELEND      ${WM_USER} + 12
!define /math TBM_GETPTICS       ${WM_USER} + 14
!define /math TBM_GETTICPOS      ${WM_USER} + 15
!define /math TBM_GETNUMTICS     ${WM_USER} + 16
!define /math TBM_GETSELSTART    ${WM_USER} + 17
!define /math TBM_GETSELEND      ${WM_USER} + 18
!define /math TBM_CLEARSEL       ${WM_USER} + 19
!define /math TBM_SETTICFREQ     ${WM_USER} + 20 ; TBS_AUTOTICKS required
!define /math TBM_SETPAGESIZE    ${WM_USER} + 21
!define /math TBM_GETPAGESIZE    ${WM_USER} + 22
!define /math TBM_SETLINESIZE    ${WM_USER} + 23
!define /math TBM_GETLINESIZE    ${WM_USER} + 24
!define /math TBM_GETTHUMBRECT   ${WM_USER} + 25
!define /math TBM_GETCHANNELRECT ${WM_USER} + 26
!define /math TBM_SETTHUMBLENGTH ${WM_USER} + 27
!define /math TBM_GETTHUMBLENGTH ${WM_USER} + 28
!define /math TBM_SETTOOLTIPS    ${WM_USER} + 29 ; IE3
!define /math TBM_GETTOOLTIPS    ${WM_USER} + 30 ; IE3
!define /math TBM_SETTIPSIDE     ${WM_USER} + 31 ; IE3
!define /math TBM_SETBUDDY       ${WM_USER} + 32 ; IE3
!define /math TBM_GETBUDDY       ${WM_USER} + 33 ; IE3
!define TBM_SETUNICODEFORMAT     ${CCM_SETUNICODEFORMAT} ; IE4
!define TBM_GETUNICODEFORMAT     ${CCM_GETUNICODEFORMAT} ; IE4
!define /math TBM_SETPOSNOTIFY   ${WM_USER} + 34 ; 7?

#UpDown controls#
!define /math UDM_SETRANGE   ${WM_USER} + 101
!define /math UDM_GETRANGE   ${WM_USER} + 102
!define /math UDM_SETPOS     ${WM_USER} + 103
!define /math UDM_GETPOS     ${WM_USER} + 104
!define /math UDM_SETBUDDY   ${WM_USER} + 105
!define /math UDM_GETBUDDY   ${WM_USER} + 106
!define /math UDM_SETACCEL   ${WM_USER} + 107
!define /math UDM_GETACCEL   ${WM_USER} + 108
!define /math UDM_SETBASE    ${WM_USER} + 109
!define /math UDM_GETBASE    ${WM_USER} + 110
!define /math UDM_SETRANGE32 ${WM_USER} + 111 ; IE4
!define /math UDM_GETRANGE32 ${WM_USER} + 112 ; IE4
!define UDM_SETUNICODEFORMAT ${CCM_SETUNICODEFORMAT} ; IE4
!define UDM_GETUNICODEFORMAT ${CCM_GETUNICODEFORMAT} ; IE4
!define /math UDM_SETPOS32   ${WM_USER} + 113 ; IE5
!define /math UDM_GETPOS32   ${WM_USER} + 114 ; IE5

#HotKey control#
!define /math HKM_SETHOTKEY ${WM_USER} + 1
!define /math HKM_GETHOTKEY ${WM_USER} + 2
!define /math HKM_SETRULES  ${WM_USER} + 3
!define /IfNDef HOTKEYF_SHIFT   0x01
!define /IfNDef HOTKEYF_CONTROL 0x02
!define /IfNDef HOTKEYF_ALT     0x04
!define /IfNDef HOTKEYF_EXT     0x08
!define HKCOMB_NONE 0x01
!define HKCOMB_S    0x02
!define HKCOMB_C    0x04
!define HKCOMB_A    0x08
!define HKCOMB_SC   0x10
!define HKCOMB_SA   0x20
!define HKCOMB_CA   0x40
!define HKCOMB_SCA  0x80

#IPAddress control#
!define /math IPM_CLEARADDRESS ${WM_USER} + 100
!define /math IPM_SETADDRESS   ${WM_USER} + 101
!define /math IPM_GETADDRESS   ${WM_USER} + 102
!define /math IPM_SETRANGE     ${WM_USER} + 103
!define /math IPM_SETFOCUS     ${WM_USER} + 104
!define /math IPM_ISBLANK      ${WM_USER} + 105

#NetworkAddress control#
!define /math NCM_GETADDRESS ${WM_USER} + 1 ; Vista+
!define /math NCM_SETALLOWTYPE ${WM_USER} + 2
!define /math NCM_GETALLOWTYPE ${WM_USER} + 3
!define /math NCM_DISPLAYERRORTIP ${WM_USER} + 4

#Month calendar control#
!define MCM_FIRST 0x1000
!define /math MCM_GETCURSEL       ${MCM_FIRST} + 1
!define /math MCM_SETCURSEL       ${MCM_FIRST} + 2
!define /math MCM_GETMAXSELCOUNT  ${MCM_FIRST} + 3
!define /math MCM_SETMAXSELCOUNT  ${MCM_FIRST} + 4
!define /math MCM_GETSELRANGE     ${MCM_FIRST} + 5
!define /math MCM_SETSELRANGE     ${MCM_FIRST} + 6
!define /math MCM_GETMONTHRANGE   ${MCM_FIRST} + 7
!define /math MCM_SETDAYSTATE     ${MCM_FIRST} + 8
!define /math MCM_GETMINREQRECT   ${MCM_FIRST} + 9
!define /math MCM_SETCOLOR            ${MCM_FIRST} + 10
!define /math MCM_GETCOLOR            ${MCM_FIRST} + 11
!define /math MCM_SETTODAY    ${MCM_FIRST} + 12
!define /math MCM_GETTODAY    ${MCM_FIRST} + 13
!define /math MCM_HITTEST          ${MCM_FIRST} + 14
!define /math MCM_SETFIRSTDAYOFWEEK ${MCM_FIRST} + 15
!define /math MCM_GETFIRSTDAYOFWEEK ${MCM_FIRST} + 16
!define /math MCM_GETRANGE ${MCM_FIRST} + 17
!define /math MCM_SETRANGE ${MCM_FIRST} + 18
!define /math MCM_GETMONTHDELTA ${MCM_FIRST} + 19
!define /math MCM_SETMONTHDELTA ${MCM_FIRST} + 20
!define /math MCM_GETMAXTODAYWIDTH ${MCM_FIRST} + 21
!define MCM_SETUNICODEFORMAT ${CCM_SETUNICODEFORMAT} ; IE4+
!define MCM_GETUNICODEFORMAT ${CCM_SETUNICODEFORMAT} ; IE4+
!define /math MCM_GETCURRENTVIEW ${MCM_FIRST} + 22 ; Vista+
!define /math MCM_GETCALENDARCOUNT ${MCM_FIRST} + 23
!define /math MCM_GETCALENDARGRIDINFO ${MCM_FIRST} + 24
!define /math MCM_GETCALID ${MCM_FIRST} + 27
!define /math MCM_SETCALID ${MCM_FIRST} + 28
!define /math MCM_SIZERECTTOMIN ${MCM_FIRST} + 29
!define /math MCM_SETCALENDARBORDER ${MCM_FIRST} + 30
!define /math MCM_GETCALENDARBORDER ${MCM_FIRST} + 31
!define /math MCM_SETCURRENTVIEW ${MCM_FIRST} + 32
!define MCN_SELCHANGE   -749
!define MCN_GETDAYSTATE -747
!define MCN_SELECT      -746
!define MCN_VIEWCHANGE  -750 ; Vista+?

#DateTime control#
!define DTM_FIRST 0x1000
!define /math DTM_GETSYSTEMTIME ${DTM_FIRST} + 1
!define /math DTM_SETSYSTEMTIME ${DTM_FIRST} + 2
!define /math DTM_SETFORMATA ${DTM_FIRST} + 5
!define /math DTM_SETFORMATW ${DTM_FIRST} + 50
${_NSIS_DEFAW} DTM_SETFORMAT
!define /math DTM_GETMONTHCAL ${DTM_FIRST} + 8
!define /math DTM_SETMCFONT ${DTM_FIRST} + 9 ; IE4+?
!define /math DTM_GETMCFONT ${DTM_FIRST} + 10 ; IE4+?
!define /math DTM_SETMCSTYLE ${DTM_FIRST} + 11 ; Vista+?
!define /math DTM_GETMCSTYLE ${DTM_FIRST} + 12 ; Vista+?
!define /math DTM_CLOSEMONTHCAL ${DTM_FIRST} + 13 ; Vista+?
!define DTN_DATETIMECHANGE -759
!define /IfNDef GDT_ERROR -1
!define /IfNDef GDT_VALID 0
!define /IfNDef GDT_NONE 1

!verbose pop
!endif
