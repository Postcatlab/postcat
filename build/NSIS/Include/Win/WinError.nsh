!ifndef __WIN_WINERROR__INC
!define __WIN_WINERROR__INC
!verbose push
!verbose 3

!ifndef __WIN_NOINC_WINERROR
#define NO_ERROR 0
!define ERROR_SUCCESS                 0
!define ERROR_INVALID_FUNCTION        1
!define ERROR_FILE_NOT_FOUND          2
!define ERROR_PATH_NOT_FOUND          3
!define ERROR_TOO_MANY_OPEN_FILES     4
!define ERROR_ACCESS_DENIED           5
!define ERROR_INVALID_HANDLE          6
!define ERROR_ARENA_TRASHED           7
!define ERROR_NOT_ENOUGH_MEMORY       8
!define ERROR_INVALID_BLOCK           9
!define ERROR_BAD_ENVIRONMENT         10
!define ERROR_BAD_FORMAT              11
!define ERROR_INVALID_ACCESS          12
!define ERROR_INVALID_DATA            13
!define ERROR_OUTOFMEMORY             14
!define ERROR_INVALID_DRIVE           15
!define ERROR_CURRENT_DIRECTORY       16
!define ERROR_NOT_SAME_DEVICE         17
!define ERROR_NO_MORE_FILES           18
!define ERROR_WRITE_PROTECT           19
!define ERROR_BAD_UNIT                20
!define ERROR_NOT_READY               21
!define ERROR_BAD_COMMAND             22
!define ERROR_CRC                     23
!define ERROR_BAD_LENGTH              24
!define ERROR_SEEK                    25
!define ERROR_NOT_DOS_DISK            26
!define ERROR_SECTOR_NOT_FOUND        27
!define ERROR_OUT_OF_PAPER            28
!define ERROR_WRITE_FAULT             29
!define ERROR_READ_FAULT              30
!define ERROR_GEN_FAILURE             31
!define ERROR_SHARING_VIOLATION       32
!define ERROR_LOCK_VIOLATION          33
!define ERROR_WRONG_DISK              34
!define ERROR_SHARING_BUFFER_EXCEEDED 36
!define ERROR_HANDLE_EOF              38
!define ERROR_HANDLE_DISK_FULL        39
!define ERROR_NOT_SUPPORTED           50
!define ERROR_CANNOT_MAKE             82 ; "The directory or file cannot be created"
!define ERROR_INVALID_PARAMETER       87
!define ERROR_DISK_FULL               112
!define ERROR_CALL_NOT_IMPLEMENTED    120 ; "This function is not supported on this system"
!define ERROR_INSUFFICIENT_BUFFER     122
!define ERROR_INVALID_NAME            123 ; "The filename, directory name, or volume label syntax is incorrect"
!define ERROR_MOD_NOT_FOUND           126 ; "The specified module could not be found"
!define ERROR_BAD_ARGUMENTS           160
!define ERROR_BAD_PATHNAME            161
!define ERROR_LOCK_FAILED             167 ; "Unable to lock a region of a file"
!define ERROR_BUSY                    170 ; "The requested resource is in use"
!define ERROR_ALREADY_EXISTS          183 ; "Cannot create a file when that file already exists"
!define ERROR_FILENAME_EXCED_RANGE    206 ; "The filename or extension is too long"
!define ERROR_EXE_MACHINE_TYPE_MISMATCH 216 ; "This version of %1 is not compatible with the version of Windows you're running"
!define ERROR_IMAGE_SUBSYSTEM_NOT_PRESENT 308
!define ERROR_DATA_CHECKSUM_ERROR     323
!define ERROR_ELEVATION_REQUIRED      740
!define ERROR_SERVICE_DOES_NOT_EXIST  1060
!define ERROR_NO_MEDIA_IN_DRIVE       1112
!define ERROR_NO_UNICODE_TRANSLATION  1113
!define ERROR_DLL_INIT_FAILED         1114
!define ERROR_SHUTDOWN_IN_PROGRESS    1115
!define ERROR_OLD_WIN_VERSION         1150 ; "The specified program requires a newer version of Windows"
!define ERROR_APP_WRONG_OS            1151 ; "The specified program is not a Windows or MS-DOS program"
!define ERROR_SINGLE_INSTANCE_APP     1152 ; "Cannot start more than one instance of the specified program"
!define ERROR_RMODE_APP               1153 ; "The specified program was written for an earlier version of Windows"
!define ERROR_INVALID_DLL             1154
!define ERROR_NO_ASSOCIATION          1155
!define ERROR_DDE_FAIL                1156
!define ERROR_DLL_NOT_FOUND           1157
!define ERROR_NOT_FOUND               1168 ; "Element not found"
!define ERROR_NO_MATCH                1169  ; "There was no match for the specified key in the index"
!define ERROR_NO_VOLUME_ID            1173
!define ERROR_UNABLE_TO_REMOVE_REPLACED 1175 ; "Unable to remove the file to be replaced"
!define ERROR_UNABLE_TO_MOVE_REPLACEMENT 1176
!define ERROR_UNABLE_TO_MOVE_REPLACEMENT_2 1177
!define ERROR_SHUTDOWN_IS_SCHEDULED   1190
!define ERROR_SHUTDOWN_USERS_LOGGED_ON 1191 ; "The system shutdown cannot be initiated because there are other users logged on to the computer"
!define ERROR_NO_NETWORK              1222
!define ERROR_CANCELLED               1223 ; "The operation was canceled by the user"
!define ERROR_RETRY                   1237
!define ERROR_SERVICE_NOT_FOUND       1243
!define ERROR_NOT_AUTHENTICATED       1244
!define ERROR_UNIDENTIFIED_ERROR      1287
!define ERROR_PRIVILEGE_NOT_HELD      1314
!define ERROR_LOGON_FAILURE           1326 ; "The user name or password is incorrect"
!define ERROR_INTERNAL_ERROR          1359 ; "An internal error occurred"
!define ERROR_FILE_CORRUPT            1392 ; "The file or directory is corrupted and unreadable"
!define ERROR_INVALID_WINDOW_HANDLE   1400 ; "Invalid window handle"
!define ERROR_INVALID_INDEX           1413
!define ERROR_TIMEOUT                 1460
!define ERROR_SYMLINK_NOT_SUPPORTED   1464
!define ERROR_XML_PARSE_ERROR         1465
!define ERROR_RESTART_APPLICATION     1467 ; "This application must be restarted"
!define ERROR_INSTALL_USEREXIT        1602 ; "User cancelled installation"
!define ERROR_INSTALL_FAILURE         1603 ; "Fatal error during installation"
!define ERROR_INSTALL_SUSPEND         1604 ; "Installation suspended, incomplete"
!define ERROR_UNKNOWN_PRODUCT         1605 ; "This action is only valid for products that are currently installed"
!define ERROR_BAD_CONFIGURATION       1610
!define ERROR_INSTALL_SOURCE_ABSENT   1612
!define ERROR_PRODUCT_UNINSTALLED     1614
!define ERROR_INSTALL_ALREADY_RUNNING 1618 ; "Another installation is already in progress. Complete that installation before proceeding with this install."
!define ERROR_INSTALL_PACKAGE_INVALID 1620
!define ERROR_INSTALL_LOG_FAILURE     1622
!define ERROR_INSTALL_LANGUAGE_UNSUPPORTED 1623
!define ERROR_FUNCTION_FAILED         1627
!define ERROR_DATATYPE_MISMATCH       1629
!define ERROR_UNSUPPORTED_TYPE        1630
!define ERROR_INSTALL_TEMP_UNWRITABLE 1632 ; "The Temp folder is on a drive that is full or is inaccessible"
!define ERROR_INSTALL_PLATFORM_UNSUPPORTED 1633 ; "This installation package is not supported by this processor type. Contact your product vendor."
!define ERROR_PRODUCT_VERSION         1638 ; "Another version of this product is already installed"
!define ERROR_SUCCESS_REBOOT_INITIATED 1641 ; "The requested operation completed successfully. The system will be restarted so the changes can take effect."
!define ERROR_INSTALL_REJECTED        1654 ; "The app that you are trying to run is not supported on this version of Windows"
!define ERROR_TAG_NOT_FOUND           2012
!define ERROR_BAD_USERNAME            2202 ; "The user name or group name parameter is invalid"
!define ERROR_SUCCESS_REBOOT_REQUIRED 3010
!define ERROR_SUCCESS_RESTART_REQUIRED 3011
!define ERROR_INSTALL_INVALID_PACKAGE 15602
!define ERROR_INSTALL_OUT_OF_DISK_SPACE 15604
!define ERROR_INSTALL_CANCEL          15608 ; "User cancelled the install request"
!define ERROR_INSTALL_FAILED          15609
!define ERROR_REMOVE_FAILED           15610
!define ERROR_NEEDS_REMEDIATION       15612 ; "The application cannot be started. Try reinstalling the application to fix the problem."

!define SEVERITY_SUCCESS 0
!define SEVERITY_ERROR   1
!define FACILITY_STORAGE 3
!define FACILITY_WIN32 7
!define FACILITY_SECURITY 9
!define FACILITY_SETUPAPI 15
!define FACILITY_SXS 23
!define /IfNDef S_OK    0
!define /IfNDef S_FALSE 1
!define E_UNEXPECTED   0x8000FFFF
!define E_NOTIMPL      0x80004001
!define E_OUTOFMEMORY  0x8007000E
!define E_INVALIDARG   0x80070057
!define E_NOINTERFACE  0x80004002
!define E_POINTER      0x80004003
!define E_HANDLE       0x80070006
!define E_ABORT        0x80004004
!define E_FAIL         0x80004005
!define E_ACCESSDENIED 0x80070005
!define E_PENDING      0x8000000A

!endif /* __WIN_NOINC_WINERROR */

!verbose pop
!endif /* __WIN_WINERROR__INC */
