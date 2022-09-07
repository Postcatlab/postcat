!macro customInstall
  DetailPrint "Register eoapi URI Handler"
  DeleteRegKey HKCR "eoapi"
  WriteRegStr HKCR "eoapi" "" "URL:eoapi"
  WriteRegStr HKCR "eoapi" "URL Protocol" ""
  WriteRegStr HKCR "eoapi\shell" "" ""
  WriteRegStr HKCR "eoapi\shell\Open" "" ""
  WriteRegStr HKCR "eoapi\shell\Open\command" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME} %1"
!macroend
