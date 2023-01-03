!macro customInstall
  DetailPrint "Register postcat URI Handler"
  DeleteRegKey HKCR "postcat"
  WriteRegStr HKCR "postcat" "" "URL:postcat"
  WriteRegStr HKCR "postcat" "URL Protocol" ""
  WriteRegStr HKCR "postcat\shell" "" ""
  WriteRegStr HKCR "postcat\shell\Open" "" ""
  WriteRegStr HKCR "postcat\shell\Open\command" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME} %1"
!macroend
