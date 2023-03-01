;Language: Japanese (1041)
; 1st translation by Dnanako Dnanako (2002, r1537), 2nd update by Takahiro Yoshimura (2003, r2489) <takahiro_y@monolithworks.co.jp>, 3rd update by maboroshin (July 2020)

!insertmacro LANGFILE "Japanese" = "日本語" "Nihongo"

!ifdef MUI_WELCOMEPAGE
  ${LangFileString} MUI_TEXT_WELCOME_INFO_TITLE "$(^NameDA) セットアップへようこそ"
  ${LangFileString} MUI_TEXT_WELCOME_INFO_TEXT "セットアップは、$(^NameDA) のインストールをご案内します。$\r$\n$\r$\nセットアップを開始する前に、他のすべてのアプリケーションを終了することを推奨します。これによってセットアップがコンピュータを再起動せずに、システム ファイルを更新することができるようになります。$\r$\n$\r$\n$_CLICK"
!endif

!ifdef MUI_UNWELCOMEPAGE
  ${LangFileString} MUI_UNTEXT_WELCOME_INFO_TITLE "$(^NameDA) アンインストールへようこそ"
  ${LangFileString} MUI_UNTEXT_WELCOME_INFO_TEXT "セットアップは、$(^NameDA) のアンインストールをご案内します。$\r$\n$\r$\nアンインストールを開始する前に、$(^NameDA) が起動していないことを確認して下さい。$\r$\n$\r$\n$_CLICK"
!endif

!ifdef MUI_LICENSEPAGE
  ${LangFileString} MUI_TEXT_LICENSE_TITLE "使用許諾契約"
  ${LangFileString} MUI_TEXT_LICENSE_SUBTITLE "$(^NameDA) をインストールする前に、ライセンス条件を確認してください。"
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM "契約のすべての条件に同意するなら、「同意する」 を選択しインストールを続行します。$(^NameDA) をインストールするには、契約に同意する必要があります。"
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM_CHECKBOX "契約のすべての条件に同意するなら、下のチェックボックスをクリックしてください。$(^NameDA) をインストールするには、契約に同意する必要があります。 $_CLICK"
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM_RADIOBUTTONS "契約のすべての条件に同意するなら、下に表示されているオプションのうち、最初のものを選択してください。$(^NameDA) をインストールするには、契約に同意する必要があります。 $_CLICK"
!endif

!ifdef MUI_UNLICENSEPAGE
  ${LangFileString} MUI_UNTEXT_LICENSE_TITLE "使用許諾契約"
  ${LangFileString} MUI_UNTEXT_LICENSE_SUBTITLE "$(^NameDA) をアンインストールする前に、ライセンス条件を確認してください。"
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM "契約のすべての条件に同意するなら、「同意する」 を選択しアンインストールを続行します。$(^NameDA) をアンインストールするには、契約に同意する必要があります。"
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM_CHECKBOX "契約のすべての条件に同意するなら、下のチェックボックスをクリックしてください。$(^NameDA) をアンインストールするには、契約に同意する必要があります。 $_CLICK"
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM_RADIOBUTTONS "契約のすべての条件に同意するなら、下の選択肢から最初のものを選択してください。$(^NameDA) をアンインストールするには、契約に同意する必要があります。 $_CLICK"
!endif

!ifdef MUI_LICENSEPAGE | MUI_UNLICENSEPAGE
  ${LangFileString} MUI_INNERTEXT_LICENSE_TOP "[Page Down] を押し契約をすべてお読みください。"
!endif

!ifdef MUI_COMPONENTSPAGE
  ${LangFileString} MUI_TEXT_COMPONENTS_TITLE "構成要素の選択"
  ${LangFileString} MUI_TEXT_COMPONENTS_SUBTITLE "インストールしたい $(^NameDA) の機能を選択してください。"
!endif

!ifdef MUI_UNCOMPONENTSPAGE
  ${LangFileString} MUI_UNTEXT_COMPONENTS_TITLE "構成要素の選択"
  ${LangFileString} MUI_UNTEXT_COMPONENTS_SUBTITLE "アンインストールしたい $(^NameDA) の機能を選択してください。"
!endif

!ifdef MUI_COMPONENTSPAGE | MUI_UNCOMPONENTSPAGE
  ${LangFileString} MUI_INNERTEXT_COMPONENTS_DESCRIPTION_TITLE "説明"
  !ifndef NSIS_CONFIG_COMPONENTPAGE_ALTERNATIVE
    ${LangFileString} MUI_INNERTEXT_COMPONENTS_DESCRIPTION_INFO "構成要素にマウス カーソルを載せると、説明が表示されます。"
  !else
    ${LangFileString} MUI_INNERTEXT_COMPONENTS_DESCRIPTION_INFO "構成要素を選択すると、説明が表示されます。"
  !endif
!endif

!ifdef MUI_DIRECTORYPAGE
  ${LangFileString} MUI_TEXT_DIRECTORY_TITLE "インストール先の選択"
  ${LangFileString} MUI_TEXT_DIRECTORY_SUBTITLE "$(^NameDA) をインストールするフォルダを選択してください。"
!endif

!ifdef MUI_UNDIRECTORYPAGE
  ${LangFileString} MUI_UNTEXT_DIRECTORY_TITLE "アンインストール元の選択"
  ${LangFileString} MUI_UNTEXT_DIRECTORY_SUBTITLE "$(^NameDA) をアンインストールするフォルダを選択してください。"
!endif

!ifdef MUI_INSTFILESPAGE
  ${LangFileString} MUI_TEXT_INSTALLING_TITLE "インストール"
  ${LangFileString} MUI_TEXT_INSTALLING_SUBTITLE "$(^NameDA) をインストール中です。お待ちください。"
  ${LangFileString} MUI_TEXT_FINISH_TITLE "インストールの完了"
  ${LangFileString} MUI_TEXT_FINISH_SUBTITLE "インストールに成功しました。"
  ${LangFileString} MUI_TEXT_ABORT_TITLE "インストールの中止"
  ${LangFileString} MUI_TEXT_ABORT_SUBTITLE "セットアップは正常に完了しませんでした。"
!endif

!ifdef MUI_UNINSTFILESPAGE
  ${LangFileString} MUI_UNTEXT_UNINSTALLING_TITLE "アンインストール"
  ${LangFileString} MUI_UNTEXT_UNINSTALLING_SUBTITLE "$(^NameDA) をアンインストール中です。お待ちください。"
  ${LangFileString} MUI_UNTEXT_FINISH_TITLE "アンインストールの完了"
  ${LangFileString} MUI_UNTEXT_FINISH_SUBTITLE "アンインストールに成功しました。"
  ${LangFileString} MUI_UNTEXT_ABORT_TITLE "アンインストールの中止"
  ${LangFileString} MUI_UNTEXT_ABORT_SUBTITLE "アンインストールは正常に完了しませんでした。"
!endif

!ifdef MUI_FINISHPAGE
  ${LangFileString} MUI_TEXT_FINISH_INFO_TITLE "$(^NameDA) セットアップの完了"
  ${LangFileString} MUI_TEXT_FINISH_INFO_TEXT "$(^NameDA) は、このコンピュータにインストールされました。$\r$\n$\r$\n「完了」をクリックしセットアップを閉じます。"
  ${LangFileString} MUI_TEXT_FINISH_INFO_REBOOT "$(^NameDA) のインストールを完了するには、このコンピュータを再起動する必要があります。今すぐ再起動しますか？"
!endif

!ifdef MUI_UNFINISHPAGE
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_TITLE "$(^NameDA) アンインストールの完了"
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_TEXT "$(^NameDA) は、このコンピュータからアンインストールされました。$\r$\n$\r$\n「完了」をクリックしセットアップを閉じます。"
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_REBOOT "$(^NameDA) のアンインストールを完了するには、このコンピュータを再起動する必要があります。今すぐ再起動しますか？"
!endif

!ifdef MUI_FINISHPAGE | MUI_UNFINISHPAGE
  ${LangFileString} MUI_TEXT_FINISH_REBOOTNOW "今すぐ再起動"
  ${LangFileString} MUI_TEXT_FINISH_REBOOTLATER "後で手動で再起動"
  ${LangFileString} MUI_TEXT_FINISH_RUN "$(^NameDA) を実行(&R)"
  ${LangFileString} MUI_TEXT_FINISH_SHOWREADME "Readme を表示(&S)"
  ${LangFileString} MUI_BUTTONTEXT_FINISH "完了(&F)"
!endif

!ifdef MUI_STARTMENUPAGE
  ${LangFileString} MUI_TEXT_STARTMENU_TITLE "スタートメニューのフォルダの選択"
  ${LangFileString} MUI_TEXT_STARTMENU_SUBTITLE "$(^NameDA) のショートカットを作成するスタートメニューのフォルダを選択してください。"
  ${LangFileString} MUI_INNERTEXT_STARTMENU_TOP "このプログラムのショートカットを作成したいスタートメニューのフォルダを選択してください。また、新規フォルダの名前を入力することもできます。"
  ${LangFileString} MUI_INNERTEXT_STARTMENU_CHECKBOX "ショートカットを作成しない"
!endif

!ifdef MUI_UNCONFIRMPAGE
  ${LangFileString} MUI_UNTEXT_CONFIRM_TITLE "$(^NameDA) のアンインストール"
  ${LangFileString} MUI_UNTEXT_CONFIRM_SUBTITLE "$(^NameDA) をこのコンピュータから削除します。"
!endif

!ifdef MUI_ABORTWARNING
  ${LangFileString} MUI_TEXT_ABORTWARNING "$(^Name) セットアップを中止しますか？"
!endif

!ifdef MUI_UNABORTWARNING
  ${LangFileString} MUI_UNTEXT_ABORTWARNING "$(^Name) アンインストールを中止しますか？"
!endif

!ifdef MULTIUSER_INSTALLMODEPAGE
  ${LangFileString} MULTIUSER_TEXT_INSTALLMODE_TITLE "ユーザーの選択"
  ${LangFileString} MULTIUSER_TEXT_INSTALLMODE_SUBTITLE "どのユーザーのために $(^NameDA) をインストールするか選択してください。"
  ${LangFileString} MULTIUSER_INNERTEXT_INSTALLMODE_TOP "$(^NameDA) を自分自身のためだけにインストールするのか、このコンピューターのすべてのユーザーにインストールするのか選択してください。$(^ClickNext)"
  ${LangFileString} MULTIUSER_INNERTEXT_INSTALLMODE_ALLUSERS "このコンピューターを使用する全員にインストール"
  ${LangFileString} MULTIUSER_INNERTEXT_INSTALLMODE_CURRENTUSER "自分にのみインストール"
!endif
