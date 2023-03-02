;Language: 'Chinese (Traditional)' (1028)
;Translator: Kii Ali <kiiali@cpatch.org>, <kiiali@ms1.url.com.tw>, <kiiali@pchome.com.tw>
;Translator: Walter Cheuk <wwycheuk@gmail.com>
;Revision date: 2017-03-17

!insertmacro LANGFILE "TradChinese" "Chinese (Traditional)" "中文(繁體)" "Hanyu (Fantizi)"

!ifdef MUI_WELCOMEPAGE
  ${LangFileString} MUI_TEXT_WELCOME_INFO_TITLE "歡迎使用 $(^NameDA) 安裝精靈"
  ${LangFileString} MUI_TEXT_WELCOME_INFO_TEXT "本精靈會引導您完成安裝 $(^NameDA)。$\r$\n$\r$\n在開始安裝之前，建議先關閉其他所有應用程式。這將允許安裝程式更新相關的系統檔案，而不需要重新啟動電腦。$\r$\n$\r$\n$_CLICK"
!endif

!ifdef MUI_UNWELCOMEPAGE
  ${LangFileString} MUI_UNTEXT_WELCOME_INFO_TITLE "歡迎使用 $(^NameDA) 解除安裝精靈"
  ${LangFileString} MUI_UNTEXT_WELCOME_INFO_TEXT "本精靈會引導您解除安裝 $(^NameDA)。$\r$\n$\r$\n在開始解除安裝之前，請確認 $(^NameDA) 並未有執行。$\r$\n$\r$\n$_CLICK"
!endif

!ifdef MUI_LICENSEPAGE
  ${LangFileString} MUI_TEXT_LICENSE_TITLE "授權協議"
  ${LangFileString} MUI_TEXT_LICENSE_SUBTITLE "在安裝 $(^NameDA) 之前，請檢閱授權條款。"
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM "如果接受協議的條款，按 [我同意(A)] 繼續安裝。必須要接受協議才能安裝 $(^NameDA) 。"
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM_CHECKBOX "如果接受協議的條款，按下方的勾選框。必須要接受協議才能安裝 $(^NameDA)。$_CLICK"
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM_RADIOBUTTONS "如果接受協議中的條款，選擇下方第一個選項。必須要接受協議才能安裝 $(^NameDA)。$_CLICK"
!endif

!ifdef MUI_UNLICENSEPAGE
  ${LangFileString} MUI_UNTEXT_LICENSE_TITLE "授權協議"
  ${LangFileString} MUI_UNTEXT_LICENSE_SUBTITLE "在解除安裝 $(^NameDA) 之前，請檢閱授權條款。"
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM "如果接受協議的條款，按 [我同意(A)] 繼續解除安裝。如果選取 [取消] ，安裝程式會關閉。必須要接受協議才能解除安裝 $(^NameDA) 。"
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM_CHECKBOX "如果接受協議的條款，按下方的勾選框。必須要接受協議才能解除安裝 $(^NameDA)。$_CLICK"
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM_RADIOBUTTONS "如果接受協議的條款，選擇下方第一個選項。必須要接受協議才能解除安裝 $(^NameDA)。$_CLICK"
!endif

!ifdef MUI_LICENSEPAGE | MUI_UNLICENSEPAGE
  ${LangFileString} MUI_INNERTEXT_LICENSE_TOP "檢閱協議的其餘部分，按 [PgDn] 往下捲動頁面。"
!endif

!ifdef MUI_COMPONENTSPAGE
  ${LangFileString} MUI_TEXT_COMPONENTS_TITLE "選擇元件"
  ${LangFileString} MUI_TEXT_COMPONENTS_SUBTITLE "選擇想要安裝 $(^NameDA) 的功能。"
!endif

!ifdef MUI_UNCOMPONENTSPAGE
  ${LangFileString} MUI_UNTEXT_COMPONENTS_TITLE "選取元件"
  ${LangFileString} MUI_UNTEXT_COMPONENTS_SUBTITLE "選取 $(^NameDA) 當中想要解除的功能。"
!endif

!ifdef MUI_COMPONENTSPAGE | MUI_UNCOMPONENTSPAGE
  ${LangFileString} MUI_INNERTEXT_COMPONENTS_DESCRIPTION_TITLE "說明"
  !ifndef NSIS_CONFIG_COMPONENTPAGE_ALTERNATIVE
    ${LangFileString} MUI_INNERTEXT_COMPONENTS_DESCRIPTION_INFO "將滑鼠指標停懸到元件之上，即可見到其說明。"
  !else
    ${LangFileString} MUI_INNERTEXT_COMPONENTS_DESCRIPTION_INFO "選取元件，即可見到其說明。"
  !endif
!endif

!ifdef MUI_DIRECTORYPAGE
  ${LangFileString} MUI_TEXT_DIRECTORY_TITLE "選取安裝位置"
  ${LangFileString} MUI_TEXT_DIRECTORY_SUBTITLE "選取 $(^NameDA) 要安裝的資料夾。"
!endif

!ifdef MUI_UNDIRECTORYPAGE
  ${LangFileString} MUI_UNTEXT_DIRECTORY_TITLE "選取解除安裝位置"
  ${LangFileString} MUI_UNTEXT_DIRECTORY_SUBTITLE "選取 $(^NameDA) 要解除安裝的資料夾。"
!endif

!ifdef MUI_INSTFILESPAGE
  ${LangFileString} MUI_TEXT_INSTALLING_TITLE "安裝"
  ${LangFileString} MUI_TEXT_INSTALLING_SUBTITLE "$(^NameDA) 正在安裝，請稍候。"
  ${LangFileString} MUI_TEXT_FINISH_TITLE "完成安裝"
  ${LangFileString} MUI_TEXT_FINISH_SUBTITLE "安裝已完成。"
  ${LangFileString} MUI_TEXT_ABORT_TITLE "已中止安裝"
  ${LangFileString} MUI_TEXT_ABORT_SUBTITLE "安裝並未完成。"
!endif

!ifdef MUI_UNINSTFILESPAGE
  ${LangFileString} MUI_UNTEXT_UNINSTALLING_TITLE "解除安裝"
  ${LangFileString} MUI_UNTEXT_UNINSTALLING_SUBTITLE "$(^NameDA) 正在解除安裝，請稍候。"
  ${LangFileString} MUI_UNTEXT_FINISH_TITLE "完成解除安裝"
  ${LangFileString} MUI_UNTEXT_FINISH_SUBTITLE "解除安裝已完成。"
  ${LangFileString} MUI_UNTEXT_ABORT_TITLE "已中止解除安裝"
  ${LangFileString} MUI_UNTEXT_ABORT_SUBTITLE "解除安裝並未完成。"
!endif

!ifdef MUI_FINISHPAGE
  ${LangFileString} MUI_TEXT_FINISH_INFO_TITLE "即將完成安裝 $(^NameDA)"
  ${LangFileString} MUI_TEXT_FINISH_INFO_TEXT "已在電腦安裝 $(^NameDA) 。$\r$\n按 [完成(F)] 關閉安裝程式。"
  ${LangFileString} MUI_TEXT_FINISH_INFO_REBOOT "電腦需要重新開機，才能完成安裝 $(^NameDA) 。要馬上重新開機嗎？"
!endif

!ifdef MUI_UNFINISHPAGE
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_TITLE "即將完成解除安裝 $(^NameDA)"
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_TEXT "已自電腦解除安裝 $(^NameDA) 。$\r$\n$\r$\n按 [完成(F)] 關閉安裝程式。"
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_REBOOT "電腦需要重新開機，才能完成解除安裝 $(^NameDA) 。要馬上重新開機嗎？"
!endif

!ifdef MUI_FINISHPAGE | MUI_UNFINISHPAGE
  ${LangFileString} MUI_TEXT_FINISH_REBOOTNOW "是，馬上重新開機(&Y)"
  ${LangFileString} MUI_TEXT_FINISH_REBOOTLATER "否，我稍後再自行重新開機(&N)"
  ${LangFileString} MUI_TEXT_FINISH_RUN "執行 $(^NameDA)(&R)"
  ${LangFileString} MUI_TEXT_FINISH_SHOWREADME "顯示「讀我檔案」(&S)"
  ${LangFileString} MUI_BUTTONTEXT_FINISH "完成(&F)"  
!endif

!ifdef MUI_STARTMENUPAGE
  ${LangFileString} MUI_TEXT_STARTMENU_TITLE "選擇「開始功能表」資料夾"
  ${LangFileString} MUI_TEXT_STARTMENU_SUBTITLE "選擇「開始功能表」資料夾，用於程式的捷徑。"
  ${LangFileString} MUI_INNERTEXT_STARTMENU_TOP "選擇「開始功能表」資料夾，以便建立程式的捷徑。你也可以輸入名稱，建立新資料夾。"
  ${LangFileString} MUI_INNERTEXT_STARTMENU_CHECKBOX "不要建立捷徑(&N)"
!endif

!ifdef MUI_UNCONFIRMPAGE
  ${LangFileString} MUI_UNTEXT_CONFIRM_TITLE "解除安裝 $(^NameDA)"
  ${LangFileString} MUI_UNTEXT_CONFIRM_SUBTITLE "自電腦解除安裝 $(^NameDA) 。"
!endif

!ifdef MUI_ABORTWARNING
  ${LangFileString} MUI_TEXT_ABORTWARNING "確定要結束 $(^Name) 的安裝程式嗎？"
!endif

!ifdef MUI_UNABORTWARNING
  ${LangFileString} MUI_UNTEXT_ABORTWARNING "確定要結束 $(^Name) 的解除安裝程式嗎？"
!endif

!ifdef MULTIUSER_INSTALLMODEPAGE
  ${LangFileString} MULTIUSER_TEXT_INSTALLMODE_TITLE "選擇使用者"
  ${LangFileString} MULTIUSER_TEXT_INSTALLMODE_SUBTITLE "選擇要將 $(^NameDA) 安裝給哪位使用者。"
  ${LangFileString} MULTIUSER_INNERTEXT_INSTALLMODE_TOP "選擇僅將 $(^NameDA) 安裝給自己使用，還是此電腦的所有使用者皆可使用。 $(^ClickNext)"
  ${LangFileString} MULTIUSER_INNERTEXT_INSTALLMODE_ALLUSERS "安裝給此電腦的所有使用者"
  ${LangFileString} MULTIUSER_INNERTEXT_INSTALLMODE_CURRENTUSER "僅安裝給自己"
!endif
