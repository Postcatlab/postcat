;Language: Belarusian (1059)
;Translated by PrydesparBLR [ prydespar@outlook.com.by ]

!insertmacro LANGFILE "Belarusian" = "Беларуская" "Bielaruskaja" ; Biełaruskaja

!ifdef MUI_WELCOMEPAGE
  ${LangFileString} MUI_TEXT_WELCOME_INFO_TITLE "Вас вiтае ўсталёўшчык $(^NameDA)"
  ${LangFileString} MUI_TEXT_WELCOME_INFO_TEXT "Гэта праграма ўсталюе $(^NameDA) на Ваш камп'ютар.$\r$\n$\r$\nПерад усталяваннем прапануем закрыць усе праграмы, якія выконваюцца на дадзены момант. Гэта дапаможа ўсталёўшчыку абнавіць сістэмныя файлы без перазапуску камп'ютара.$\r$\n$\r$\n$_CLICK"
!endif

!ifdef MUI_UNWELCOMEPAGE
  ${LangFileString} MUI_UNTEXT_WELCOME_INFO_TITLE "Вы вырашылі выдаліць $(^NameDA)"
  ${LangFileString} MUI_UNTEXT_WELCOME_INFO_TEXT "Гэта праграма выдаліць $(^NameDA) з Вашага камп'ютара.$\r$\n$\r$\nПерад выдаленнем пераканайцеся ў тым, што праграма $(^NameDA) не запушчана.$\r$\n$\r$\n$_CLICK"
!endif

!ifdef MUI_LICENSEPAGE
  ${LangFileString} MUI_TEXT_LICENSE_TITLE "Лiцензiйнае пагадненне"
  ${LangFileString} MUI_TEXT_LICENSE_SUBTITLE "Калі ласка, прачытайце ўмовы Ліцэнзійнага пагаднення перад усталяваннем $(^NameDA)."
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM "Калi Вы прымаеце ўмовы Лiцензiйнага пагаднення, націсніце кнопку $\"Прыняць$\". Гэта неабходна для ўсталявання праграмы."
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM_CHECKBOX "Калi Вы прымаеце ўмовы Лiцензiйнага пагаднення, націсніце на сцяжок ніжэй. Гэта неабходна для ўсталявання праграмы. $_CLICK"
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM_RADIOBUTTONS "Калi Вы прымаеце ўмовы Ліцэнзійнага пагаднення, выберыце першы варыянт з прапанаваных ніжэй. Гэта неабходна для ўсталявання праграмы. $_CLICK"
!endif

!ifdef MUI_UNLICENSEPAGE
  ${LangFileString} MUI_UNTEXT_LICENSE_TITLE "Ліцэнзійнае пагадненне"
  ${LangFileString} MUI_UNTEXT_LICENSE_SUBTITLE "Калі ласка, прачытайце ўмовы Ліцэнзійнага пагаднення перад выдаленнем $(^NameDA)."
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM "Калі Вы прымаеце ўмовы Ліцэнзійнага пагаднення, націсніце кнопку $\"Прыняць$\". Гэта неабходна для выдалення праграмы. $_CLICK"
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM_CHECKBOX "Калі Вы прымаеце ўмовы Ліцэнзійнага пагаднення, націсніце на сцяжок ніжэй. Гэта неабходна для выдалення праграмы. $_CLICK"
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM_RADIOBUTTONS "Калі Вы прымаеце ўмовы Ліцэнзійнага пагаднення, выберыце першы варыянт з прапанаваных ніжэй. Гэта неабходна для выдалення праграмы. $_CLICK"
!endif

!ifdef MUI_LICENSEPAGE | MUI_UNLICENSEPAGE
  ${LangFileString} MUI_INNERTEXT_LICENSE_TOP "Выкарыстоўвайце кнопкi $\"PageUp$\" i $\"PageDown$\" для перамяшчэння па тэксце."
!endif

!ifdef MUI_COMPONENTSPAGE
  ${LangFileString} MUI_TEXT_COMPONENTS_TITLE "Кампаненты праграмы, якая ўсталёўваецца"
  ${LangFileString} MUI_TEXT_COMPONENTS_SUBTITLE "Выберыце кампаненты $(^NameDA), якія Вы жадаеце ўсталяваць."
!endif

!ifdef MUI_UNCOMPONENTSPAGE
  ${LangFileString} MUI_UNTEXT_COMPONENTS_TITLE "Кампаненты праграмы"
  ${LangFileString} MUI_UNTEXT_COMPONENTS_SUBTITLE "Выберыце кампаненты $(^NameDA), якія Вы жадаеце выдаліць."
!endif

!ifdef MUI_COMPONENTSPAGE | MUI_UNCOMPONENTSPAGE
  ${LangFileString} MUI_INNERTEXT_COMPONENTS_DESCRIPTION_TITLE "Апісанне"
  !ifndef NSIS_CONFIG_COMPONENTPAGE_ALTERNATIVE
    ${LangFileString} MUI_INNERTEXT_COMPONENTS_DESCRIPTION_INFO "Перамясціце курсор мышы на назву кампанента, каб прачытаць яго апісанне."
  !else
    ${LangFileString} MUI_INNERTEXT_COMPONENTS_DESCRIPTION_INFO "Выберыце кампанент, каб прачытаць яго апісанне."
  !endif
!endif

!ifdef MUI_DIRECTORYPAGE
  ${LangFileString} MUI_TEXT_DIRECTORY_TITLE "Выбар папкі для ўсталявання"
  ${LangFileString} MUI_TEXT_DIRECTORY_SUBTITLE "Выберыце папку, у якую патрэбна ўсталяваць $(^NameDA)."
!endif

!ifdef MUI_UNDIRECTORYPAGE
  ${LangFileString} MUI_UNTEXT_DIRECTORY_TITLE "Выбар папкі для выдалення"
  ${LangFileString} MUI_UNTEXT_DIRECTORY_SUBTITLE "Выберыце папку, з якой патрэбна выдаліць $(^NameDA)."
!endif

!ifdef MUI_INSTFILESPAGE
  ${LangFileString} MUI_TEXT_INSTALLING_TITLE "Капіяванне файлаў"
  ${LangFileString} MUI_TEXT_INSTALLING_SUBTITLE "Пачакайце, калі ласка, выконваецца капіяванне файлаў $(^NameDA) на Ваш камп'ютар..."
  ${LangFileString} MUI_TEXT_FINISH_TITLE "Усталяванне завершана"
  ${LangFileString} MUI_TEXT_FINISH_SUBTITLE "Усталяванне паспяхова завершана."
  ${LangFileString} MUI_TEXT_ABORT_TITLE "Усталяванне перарвана"
  ${LangFileString} MUI_TEXT_ABORT_SUBTITLE "Усталяванне не завершана."
!endif

!ifdef MUI_UNINSTFILESPAGE
  ${LangFileString} MUI_UNTEXT_UNINSTALLING_TITLE "Выдаленне"
  ${LangFileString} MUI_UNTEXT_UNINSTALLING_SUBTITLE "Пачакайце, калі ласка, выконваецца выдаленне файлаў $(^NameDA) з Вашага камп'ютара..."
  ${LangFileString} MUI_UNTEXT_FINISH_TITLE "Выдаленне завершана"
  ${LangFileString} MUI_UNTEXT_FINISH_SUBTITLE "Выдаленне праграмы паспяхова завершана."
  ${LangFileString} MUI_UNTEXT_ABORT_TITLE "Выдаленне перарвана"
  ${LangFileString} MUI_UNTEXT_ABORT_SUBTITLE "Выдаленне выканана не поўнасцю."
!endif

!ifdef MUI_FINISHPAGE
  ${LangFileString} MUI_TEXT_FINISH_INFO_TITLE "Заканчэнне ўсталявання $(^NameDA)"
  ${LangFileString} MUI_TEXT_FINISH_INFO_TEXT "Усталяванне $(^NameDA) выканана.$\r$\n$\r$\nНацісніце кнопку $\"Гатова$\", каб выйсці."
  ${LangFileString} MUI_TEXT_FINISH_INFO_REBOOT "Каб завершыць усталяванне $(^NameDA), неабходна перазапусціць камп'ютар. Ці жадаеце Вы зрабіць гэта зараз?"
!endif

!ifdef MUI_UNFINISHPAGE
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_TITLE "Заканчэнне выдалення $(^NameDA)"
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_TEXT "Выдаленне $(^NameDA) з Вашага камп'ютара выканана.$\r$\n$\r$\nНацісніце кнопку $\"Гатова$\"каб выйсці."
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_REBOOT "Каб завершыць выдаленне  $(^NameDA), неабходна перазапусціць камп'ютар. Ці жадаеце Вы зрабіць гэта зараз?"
!endif

!ifdef MUI_FINISHPAGE | MUI_UNFINISHPAGE
  ${LangFileString} MUI_TEXT_FINISH_REBOOTNOW "Так, перазапусціць камп'ютар зараз"
  ${LangFileString} MUI_TEXT_FINISH_REBOOTLATER "Не, перазапусціць камп'ютар пазней"
  ${LangFileString} MUI_TEXT_FINISH_RUN "&Запусціць $(^NameDA)"
  ${LangFileString} MUI_TEXT_FINISH_SHOWREADME "&Паказаць інфармацыю аб праграме"
  ${LangFileString} MUI_BUTTONTEXT_FINISH "&Гатова"  
!endif

!ifdef MUI_STARTMENUPAGE
  ${LangFileString} MUI_TEXT_STARTMENU_TITLE "Папка ў меню $\"Пуск$\""
  ${LangFileString} MUI_TEXT_STARTMENU_SUBTITLE "Выберыце папку ў меню $\"Пуск$\" для размяшчэння ярлыкоў праграмы."
  ${LangFileString} MUI_INNERTEXT_STARTMENU_TOP "Выберыце папку ў меню $\"Пуск$\", куды будуць змешчаны ярлыкі праграмы. Вы таксама можаце ўвесці іншае імя папкі."
  ${LangFileString} MUI_INNERTEXT_STARTMENU_CHECKBOX "Не ствараць ярлыкі"
!endif

!ifdef MUI_UNCONFIRMPAGE
  ${LangFileString} MUI_UNTEXT_CONFIRM_TITLE "Выдаленне $(^NameDA)"
  ${LangFileString} MUI_UNTEXT_CONFIRM_SUBTITLE "Выдаленне $(^NameDA) з Вашага камп'ютара."
!endif

!ifdef MUI_ABORTWARNING
  ${LangFileString} MUI_TEXT_ABORTWARNING "Вы сапраўды жадаеце скасаваць усталяванне $(^Name)?"
!endif

!ifdef MUI_UNABORTWARNING
  ${LangFileString} MUI_UNTEXT_ABORTWARNING "Вы сапраўды жадаеце скасаваць выдаленне $(^Name)?"
!endif

!ifdef MULTIUSER_INSTALLMODEPAGE
  ${LangFileString} MULTIUSER_TEXT_INSTALLMODE_TITLE "Выбраць карыстальнікаў"
  ${LangFileString} MULTIUSER_TEXT_INSTALLMODE_SUBTITLE "Выберыце, для якіх карыстальнікаў Вы хочаце усталяваць $(^NameDA)."
  ${LangFileString} MULTIUSER_INNERTEXT_INSTALLMODE_TOP "Выберыце, ўсталёўваць $(^NameDA) толькі для сябе або для ўсіх карыстальнікаў гэтага камп'ютара. $(^ClickNext)"
  ${LangFileString} MULTIUSER_INNERTEXT_INSTALLMODE_ALLUSERS "Усталяваць для ўсіх карыстальнікаў"
  ${LangFileString} MULTIUSER_INNERTEXT_INSTALLMODE_CURRENTUSER "Усталяваць толькі для бягучага карыстальніка"
!endif
