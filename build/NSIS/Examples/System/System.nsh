; Some useful functions, structures, constants
; 
; (c) brainsucker, 2002
; (r) BSForce

!verbose push 3
!ifndef System.NSH.Included
!define System.NSH.Included

!include WinCore.nsh

; ------------- Functions --------------

; LRESULT CALLBACK WndProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam);
!define sysWNDPROC "(p.s, i.s, p.s, p.s) pss"

; LRESULT DefWindowProc(HWND hWnd, UINT Msg, WPARAM wParam, LPARAM lParam);
!define sysDefWindowProc "user32::DefWindowProc(p, i, p, p) p"

!define sysMessageBox "user32::MessageBox(p, t, t, i) i"

!define sysMessageBeep "user32::MessageBeep(i) i"

!define sysMessageBoxIndirect 'user32::MessageBoxIndirect(p) i'

; HMODULE GetModuleHandle(LPCTSTR lpModuleName); 
!define sysGetModuleHandle "kernel32::GetModuleHandle(t) i"

; HMODULE LoadLibrary(LPCTSTR lpFileName);
!define sysLoadLibrary "kernel32::LoadLibrary(t) p"

; BOOL FreeLibrary(HMODULE hModule);
!define sysFreeLibrary "kernel32::FreeLibrary(p) i"

; HCURSOR LoadCursor(HINSTANCE hInstance, LPCTSTR lpCursorName);
!define sysLoadCursor "user32::LoadCursor(p, t) p"

; ATOM RegisterClass(CONST WNDCLASS *lpWndClass);
!define sysRegisterClass "user32::RegisterClass(p) i"

; HANDLE LoadImage(HINSTANCE hinst, LPCTSTR lpszName, UINT uType,
;       int cxDesired, int cyDesired, UINT fuLoad);
!define sysLoadImage "user32::LoadImage(p, t, i, i, i, i) p"

; BOOL PlaySound(LPCSTR pszSound, HMODULE hmod, DWORD fdwSound);
!define sysPlaySound "winmm.dll::PlaySound(t, p, i) i"

; HWND CreateWindowEx(DWORD dwExStyle, LPCTSTR lpClassName, LPCTSTR lpWindowName,
;       DWORD dwStyle, int x, int y, int nWidth, int nHeight, HWND hWndParent,
;       HMENU hMenu, HINSTANCE hInstance, LPVOID lpParam);
!define sysCreateWindowEx "user32::CreateWindowEx(i, t, t, i, i, i, i, i, p, p, p, p) p"

; BOOL IsWindow(HWND hWnd);
!define sysIsWindow "user32::IsWindow(p) i"

; LONG SetWindowLong(HWND hWnd, int nIndex, LONG dwNewLong);
!define sysSetWindowLong "user32::SetWindowLong(p, i, p) p"

; BOOL SetWindowPos(HWND hWnd, HWND hWndInsertAfter, int X, int Y, int cx, int cy, UINT uFlags);
!define sysSetWindowPos "user32::SetWindowPos(p, p, i, i, i, i, i) i"

; BOOL ShowWindow(HWND hWnd, int nCmdShow);
!define sysShowWindow "user32::ShowWindow(p, i) i"

; BOOL DestroyWindow(HWND hWnd);
!define sysDestroyWindow "user32::DestroyWindow(p) i"

; BOOL GetClientRect(HWND hWnd, LPRECT lpRect);
!define sysGetClientRect "user32::GetClientRect(p, p) i"

; BOOL GetMessage(LPMSG lpMsg, HWND hWnd, UINT wMsgFilterMin, UINT wMsgFilterMax);
!define sysGetMessage "user32::GetMessage(p, p, i, i) i"

; LRESULT DispatchMessage(CONST MSG *lpmsg);
!define sysDispatchMessage "user32::DispatchMessage(p) p"

; BOOL DeleteObject(HGDIOBJ hObject);
!define sysDeleteObject "gdi32::DeleteObject(p) i"

; int GetObject(HGDIOBJ hgdiobj, int cbBuffer, LPVOID lpvObject);
!define sysGetObject "gdi32::GetObject(p, i, p) i"

; HGDIOBJ SelectObject(HDC hdc, HGDIOBJ hgdiobj);
!define sysSelectObject "gdi32::SelectObject(p, p) p"

; HDC CreateCompatibleDC(HDC hdc);
!define sysCreateCompatibleDC "gdi32::CreateCompatibleDC(p) p"

; BOOL DeleteDC(HDC hdc);
!define sysDeleteDC "gdi32::DeleteDC(p) i"

; BOOL BitBlt(HDC hdcDest, int nXDest, int nYDest, int nWidth, int nHeight, 
;       HDC hdcSrc, int nXSrc, int nYSrc, DWORD dwRop);
!define sysBitBlt "gdi32::BitBlt(p, i, i, i, i, p, i, i, i) i"

; proposed by abgandar
; int AddFontResource(LPCTSTR lpszFilename);
!define sysAddFontResource "gdi32::AddFontResource(t) i"

; HDC BeginPaint(HWND hwnd, LPPAINTSTRUCT lpPaint);
!define sysBeginPaint "user32::BeginPaint(p, p) p"

; BOOL EndPaint(HWND hWnd, CONST PAINTSTRUCT *lpPaint);
!define sysEndPaint "user32::EndPaint(p, p) i"

; BOOL SystemParametersInfo(UINT uiAction, UINT uiParam, PVOID pvParam, UINT fWinIni);
!define sysSystemParametersInfo "user32::SystemParametersInfo(i, i, p, i) i"

; UINT_PTR SetTimer(HWND hWnd, UINT_PTR nIDEvent, UINT uElapse, TIMERPROC lpTimerFunc);
!define sysSetTimer "user32::SetTimer(p, p, i, k) i"

; DWORD GetLogicalDriveStrings(DWORD nBufferLength, LPTSTR LpBuffer);
!define sysGetLogicalDriveStrings 'kernel32::GetLogicalDriveStrings(i, p) i'

!define sysGetDiskFreeSpaceEx 'kernel32::GetDiskFreeSpaceEx(t, *l, *l, *l) i'

; UINT GetDriveType(LPCTSTR lpRootPathName);
!define sysGetDriveType 'kernel32::GetDriveType(t) i'

; HANDLE FindFirstFile(LPCTSTR lpFileName,LPWIN32_FIND_DATA lpFindFileData);
!define sysFindFirstFile 'kernel32::FindFirstFile(t, p) p'

; BOOL FindClose(HANDLE hFindFile);
!define sysFindClose 'kernel32::FindClose(p) i'

; BOOL FileTimeToSystemTime(CONST FILETIME *lpFileTime, 
; LPSYSTEMTIME lpSystemTime);
!define sysFileTimeToSystemTime 'kernel32::FileTimeToSystemTime(*l, p) i'

; BOOL FileTimeToLocalFileTime(
;       CONST FILETIME *lpFileTime, 
;       LPFILETIME lpLocalFileTime);
!define sysFileTimeToLocalFileTime 'kernel32::FileTimeToLocalFileTime(*l, *l) i'

; BOOL SystemTimeToTzSpecificLocalTime(LPTIME_ZONE_INFORMATION lpTimeZone, 
; LPSYSTEMTIME lpUniversalTime, LPSYSTEMTIME lpLocalTime);
!define sysSystemTimeToTzSpecificLocalTime 'kernel32::SystemTimeToTzSpecificLocalTime(p, p, p) i'

!define syslstrlen 'kernel32::lstrlen(t) i'

; int wsprintf(LPTSTR lpOut, LPCTSTR lpFmt, ...);
!define syswsprintf "user32::wsprintf(t, t) i ? c" 

; ------------- Structures --------------

; typedef struct _WNDCLASS { 
;               UINT       style; 
;               WNDPROC    lpfnWndProc; 
;               int        cbClsExtra; 
;               int        cbWndExtra; 
;               HINSTANCE  hInstance; 
;               HICON      hIcon; 
;               HCURSOR    hCursor; 
;               HBRUSH     hbrBackground;
;               LPCTSTR    lpszMenuName; 
;               LPCTSTR    lpszClassName; 
; } WNDCLASS, *PWNDCLASS; 
!define stWNDCLASS "(i, k, i, i, p, p, p, p, t, t) p"

; typedef struct tagMSG {
;   HWND   hwnd; 
;   UINT   message; 
;   WPARAM wParam; 
;   LPARAM lParam; 
;   DWORD  time; 
;   POINT  pt;  -> will be presented as two separate px and py
; } MSG, *PMSG;
!define stMSG "(p, i, p, p, i, i, i) p"

; typedef struct tagBITMAP {
;   LONG   bmType; 
;   LONG   bmWidth; 
;   LONG   bmHeight; 
;   LONG   bmWidthBytes; 
;   WORD   bmPlanes; 
;   WORD   bmBitsPixel; 
;   LPVOID bmBits; 
; } BITMAP, *PBITMAP; 
!define stBITMAP "(i, i, i, i, i, i, p) p"

; typedef struct _RECT { 
;   LONG left; 
;   LONG top; 
;   LONG right; 
;   LONG bottom; 
; } RECT, *PRECT; 
!define stRECT "(i, i, i, i) p"

; typedef struct tagPAINTSTRUCT { 
;   HDC  hdc; 
;   BOOL fErase; 
;   RECT rcPaint; (rcl, rct, rcr, rcb)
;   BOOL fRestore; 
;   BOOL fIncUpdate; 
;   BYTE rgbReserved[32]; 
; } PAINTSTRUCT, *PPAINTSTRUCT; 
!define stPAINTSTRUCT "(p, i, i, i, i, i, i, i, &v32) p"

; typedef struct { 
;  UINT      cbSize; 
;  HWND      hwndOwner; 
;  HINSTANCE hInstance; 
;  LPCTSTR   lpszText; 
;  LPCTSTR   lpszCaption; 
;  DWORD     dwStyle; 
;  LPCTSTR   lpszIcon; 
;  DWORD_PTR dwContextHelpId; 
;  MSGBOXCALLBACK lpfnMsgBoxCallback; 
;  DWORD     dwLanguageId; 
; } MSGBOXPARAMS, *PMSGBOXPARAMS; 
!define stMSGBOXPARAMS '(&l4, p, p, t, t, i, t, p, k, i) p'

; typedef struct _SYSTEMTIME { 
;    WORD wYear; 
;    WORD wMonth; 
;    WORD wDayOfWeek; 
;    WORD wDay; 
;    WORD wHour; 
;    WORD wMinute; 
;    WORD wSecond; 
;    WORD wMilliseconds; 
; } SYSTEMTIME, *PSYSTEMTIME; 
!define stSYSTEMTIME '(&i2, &i2, &i2, &i2, &i2, &i2, &i2, &i2) p'

; Maximal windows path
!define /ifndef MAX_PATH 260

; typedef struct _WIN32_FIND_DATA {
;  DWORD    dwFileAttributes; 
;  FILETIME ftCreationTime; 
;  FILETIME ftLastAccessTime; 
;  FILETIME ftLastWriteTime; 
;  DWORD    nFileSizeHigh; 
;  DWORD    nFileSizeLow; 
;  DWORD    dwReserved0; 
;  DWORD    dwReserved1; 
;  TCHAR    cFileName[ MAX_PATH ]; 
;  TCHAR    cAlternateFileName[ 14 ]; 
; } WIN32_FIND_DATA, *PWIN32_FIND_DATA; 
!define stWIN32_FIND_DATA '(i, l, l, l, i, i, i, i, &t${MAX_PATH}, &t14) p'

; ------------- Constants --------------

; == Other ==
!define /ifndef INVALID_HANDLE_VALUE -1

; == Sounds ==

!define SND_SYNC            0x0000  
!define SND_ASYNC           0x0001  
!define SND_NODEFAULT       0x0002  
!define SND_MEMORY          0x0004  
!define SND_LOOP            0x0008  
!define SND_NOSTOP          0x0010  

!define SND_NOWAIT      0x00002000
!define SND_ALIAS       0x00010000 
!define SND_ALIAS_ID    0x00110000 
!define SND_FILENAME    0x00020000
!define SND_RESOURCE    0x00040004 
!define SND_PURGE           0x0040  
!define SND_APPLICATION     0x0080  

; == Windows ==

!define /ifndef WS_OVERLAPPED       0x00000000
!define /ifndef WS_POPUP            0x80000000
!define /ifndef WS_CHILD            0x40000000
!define /ifndef WS_MINIMIZE         0x20000000
!define /ifndef WS_VISIBLE          0x10000000
!define /ifndef WS_DISABLED         0x08000000
!define /ifndef WS_CLIPSIBLINGS     0x04000000
!define /ifndef WS_CLIPCHILDREN     0x02000000
!define /ifndef WS_MAXIMIZE         0x01000000
!define /ifndef WS_CAPTION          0x00C00000
!define /ifndef WS_BORDER           0x00800000
!define /ifndef WS_DLGFRAME         0x00400000
!define /ifndef WS_VSCROLL          0x00200000
!define /ifndef WS_HSCROLL          0x00100000
!define /ifndef WS_SYSMENU          0x00080000
!define /ifndef WS_THICKFRAME       0x00040000
!define /ifndef WS_GROUP            0x00020000
!define /ifndef WS_TABSTOP          0x00010000
!define /ifndef WS_MINIMIZEBOX      0x00020000
!define /ifndef WS_MAXIMIZEBOX      0x00010000
!define /ifndef WS_TILED            ${WS_OVERLAPPED}
!define /ifndef WS_ICONIC           ${WS_MINIMIZE}
!define /ifndef WS_SIZEBOX          ${WS_THICKFRAME}
!define /ifndef WS_OVERLAPPEDWINDOW 0x00CF0000
!define /ifndef WS_TILEDWINDOW      ${WS_OVERLAPPEDWINDOW}
!define /ifndef WS_POPUPWINDOW      0x80880000
!define /ifndef WS_CHILDWINDOW      ${WS_CHILD}
!define /ifndef WS_EX_DLGMODALFRAME     0x00000001
!define /ifndef WS_EX_NOPARENTNOTIFY    0x00000004
!define /ifndef WS_EX_TOPMOST           0x00000008
!define /ifndef WS_EX_ACCEPTFILES       0x00000010
!define /ifndef WS_EX_TRANSPARENT       0x00000020
!define /ifndef WS_EX_MDICHILD          0x00000040
!define /ifndef WS_EX_TOOLWINDOW        0x00000080
!define /ifndef WS_EX_WINDOWEDGE        0x00000100
!define /ifndef WS_EX_CLIENTEDGE        0x00000200
!define /ifndef WS_EX_CONTEXTHELP       0x00000400
!define /ifndef WS_EX_RIGHT             0x00001000
!define /ifndef WS_EX_LEFT              0x00000000
!define /ifndef WS_EX_RTLREADING        0x00002000
!define /ifndef WS_EX_LTRREADING        0x00000000
!define /ifndef WS_EX_LEFTSCROLLBAR     0x00004000
!define /ifndef WS_EX_RIGHTSCROLLBAR    0x00000000
!define /ifndef WS_EX_CONTROLPARENT     0x00010000
!define /ifndef WS_EX_STATICEDGE        0x00020000
!define /ifndef WS_EX_APPWINDOW         0x00040000
!define /ifndef WS_EX_OVERLAPPEDWINDOW  0x00000300
!define /ifndef WS_EX_PALETTEWINDOW     0x00000188
!define /ifndef WS_EX_LAYERED           0x00080000
!define /ifndef WS_EX_NOINHERITLAYOUT   0x00100000 
!define /ifndef WS_EX_LAYOUTRTL         0x00400000 
!define /ifndef WS_EX_COMPOSITED        0x02000000
!define /ifndef WS_EX_NOACTIVATE        0x08000000


; == System Parameters Info ==

!define SPI_GETWORKAREA             0x0030

; == Window swap ==

!define SWP_NOSIZE          0x0001
!define SWP_NOMOVE          0x0002
!define SWP_NOZORDER        0x0004
!define SWP_NOREDRAW        0x0008
!define SWP_NOACTIVATE      0x0010
!define SWP_FRAMECHANGED    0x0020  
!define SWP_SHOWWINDOW      0x0040
!define SWP_HIDEWINDOW      0x0080
!define SWP_NOCOPYBITS      0x0100
!define SWP_NOOWNERZORDER   0x0200  
!define SWP_NOSENDCHANGING  0x0400  

!define SWP_DRAWFRAME       ${SWP_FRAMECHANGED}
!define SWP_NOREPOSITION    ${SWP_NOOWNERZORDER}
!define SWP_DEFERERASE      0x2000
!define SWP_ASYNCWINDOWPOS  0x4000

; == Bit Copy ==

!define SRCCOPY             0x00CC0020 
!define SRCPAINT            0x00EE0086 
!define SRCAND              0x008800C6 
!define SRCINVERT           0x00660046 
!define SRCERASE            0x00440328 
!define NOTSRCCOPY          0x00330008 
!define NOTSRCERASE         0x001100A6 
!define MERGECOPY           0x00C000CA 
!define MERGEPAINT          0x00BB0226 
!define PATCOPY             0x00F00021 
!define PATPAINT            0x00FB0A09 
!define PATINVERT           0x005A0049 
!define DSTINVERT           0x00550009 
!define BLACKNESS           0x00000042 
!define WHITENESS           0x00FF0062 

; == Message Box ==

!define MB_OK                       0x00000000
!define MB_OKCANCEL                 0x00000001
!define MB_ABORTRETRYIGNORE         0x00000002
!define MB_YESNOCANCEL              0x00000003
!define MB_YESNO                    0x00000004
!define MB_RETRYCANCEL              0x00000005
!define MB_CANCELTRYCONTINUE        0x00000006
!define MB_ICONHAND                 0x00000010
!define MB_ICONQUESTION             0x00000020
!define MB_ICONEXCLAMATION          0x00000030
!define MB_ICONASTERISK             0x00000040
!define MB_USERICON                 0x00000080
!define MB_ICONWARNING              ${MB_ICONEXCLAMATION}
!define MB_ICONERROR                ${MB_ICONHAND}

!define MB_ICONINFORMATION          ${MB_ICONASTERISK}
!define MB_ICONSTOP                 ${MB_ICONHAND}

!define MB_DEFBUTTON1               0x00000000
!define MB_DEFBUTTON2               0x00000100
!define MB_DEFBUTTON3               0x00000200
!define MB_DEFBUTTON4               0x00000300

!define MB_APPLMODAL                0x00000000
!define MB_SYSTEMMODAL              0x00001000
!define MB_TASKMODAL                0x00002000
!define MB_HELP                     0x00004000

!define MB_NOFOCUS                  0x00008000
!define MB_SETFOREGROUND            0x00010000
!define MB_DEFAULT_DESKTOP_ONLY     0x00020000

!define MB_TOPMOST                  0x00040000
!define MB_RIGHT                    0x00080000
!define MB_RTLREADING               0x00100000


; == Callbacks ==

!macro SINGLE_CALLBACK CHKN RES INDEX FUNC
CheckCB_${CHKN}:
        Pop ${RES}
        StrCmp ${RES} "callback${INDEX}" 0 ExitCB_${CHKN}
        Call ${FUNC}
        Goto CheckCB_${CHKN}
ExitCB_${CHKN}:
!macroend

!endif
!verbose pop