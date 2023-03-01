;Language: Tatar (1092)
;Translation by Bulat Azat uly [bulat_ibrahim@mail.ru]

!insertmacro LANGFILE "Tatar" = "Татарча" "Tatarcha"

!ifdef MUI_WELCOMEPAGE
  ${LangFileString} MUI_TEXT_WELCOME_INFO_TITLE "$(^NameDA) урнаштыручыга рәхим итегез"
  ${LangFileString} MUI_TEXT_WELCOME_INFO_TEXT "Бу программа $(^NameDA) программасын санагыгызга урнаштырыр.$\r$\n$\r$\nУрнаштыру алдыннан бөтен ачык кушымталарны ябарга тәкъдим ителә. Бу урнаштыру программасына система файлларын санакны сүндереп кабызмыйча яңартырга мөмкинлек бирә.$\r$\n$\r$\n$_CLICK"
!endif

!ifdef MUI_UNWELCOMEPAGE
  ${LangFileString} MUI_UNTEXT_WELCOME_INFO_TITLE "$(^NameDA) бетерүчегә рәхим итегез"
  ${LangFileString} MUI_UNTEXT_WELCOME_INFO_TEXT "Бу программа $(^NameDA) программасын санагыгыздан бетерер.$\r$\n$\r$\nДәвам итү алдыннан $(^NameDA) җибәрелмәгәнлеген тикшерегез.$\r$\n$\r$\n$_CLICK"
!endif

!ifdef MUI_LICENSEPAGE
  ${LangFileString} MUI_TEXT_LICENSE_TITLE "Лицензия килешүе"
  ${LangFileString} MUI_TEXT_LICENSE_SUBTITLE "$(^NameDA) урнаштыру алдыннан лицензия килешүе белән танышыгыз."
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM "Килешү шартларын кабул итсәгез, $\"Кабул итәм$\" төймәсенә басыгыз. $(^NameDA) урнаштыру өчен, килешүне кабул итәргә кирәк."
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM_CHECKBOX "Килешү шартларын кабул итсәгез, түбәндә билге куегыз. $(^NameDA) урнаштыру өчен, килешүне кабул итәргә кирәк. $_CLICK"
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM_RADIOBUTTONS "Килешү шартларын кабул итсәгез, түбәндәге вариантлардан беренчесен сайлагыз. $(^NameDA) урнаштыру өчен, килешүне кабул итәргә кирәк. $_CLICK"
!endif

!ifdef MUI_UNLICENSEPAGE
  ${LangFileString} MUI_UNTEXT_LICENSE_TITLE "Лицензия килешүе"
  ${LangFileString} MUI_UNTEXT_LICENSE_SUBTITLE "$(^NameDA) бетерү алдыннан лицензия килешүе белән танышыгыз."
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM "Килешү шартларын кабул итсәгез, $\"Кабул итәм$\" төймәсенә басыгыз. $(^NameDA) бетерү өчен, килешүне кабул итәргә кирәк."
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM_CHECKBOX "Килешү шартларын кабул итсәгез, түбәндә билге куегыз. $(^NameDA) бетерү өчен, килешүне кабул итәргә кирәк. $_CLICK"
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM_RADIOBUTTONS "Килешү шартларын кабул итсәгез, түбәндәге вариантлардан беренчесен сайлагыз. $(^NameDA) бетерү өчен, килешүне кабул итәргә кирәк. $_CLICK"
!endif

!ifdef MUI_LICENSEPAGE | MUI_UNLICENSEPAGE
  ${LangFileString} MUI_INNERTEXT_LICENSE_TOP "Текст буенча күчү өчен, $\"PageUp$\" һәм $\"PageDown$\" төймәләренә басыгыз."
!endif

!ifdef MUI_COMPONENTSPAGE
  ${LangFileString} MUI_TEXT_COMPONENTS_TITLE "Урнаштырылучы программаның компонентлары"
  ${LangFileString} MUI_TEXT_COMPONENTS_SUBTITLE "Урнаштырырга теләгән $(^NameDA) компонентларын сайлагыз."
!endif

!ifdef MUI_UNCOMPONENTSPAGE
  ${LangFileString} MUI_UNTEXT_COMPONENTS_TITLE "Программа компонентлары"
  ${LangFileString} MUI_UNTEXT_COMPONENTS_SUBTITLE "Бетерергә теләгән $(^NameDA) компонентларын сайлагыз."
!endif

!ifdef MUI_COMPONENTSPAGE | MUI_UNCOMPONENTSPAGE
  ${LangFileString} MUI_INNERTEXT_COMPONENTS_DESCRIPTION_TITLE "Тасвирлама"
  !ifndef NSIS_CONFIG_COMPONENTPAGE_ALTERNATIVE
    ${LangFileString} MUI_INNERTEXT_COMPONENTS_DESCRIPTION_INFO "Компонентның тасвирламасын уку өчен, аның исеменә тычкан курсорын китерегез."
  !else
    ${LangFileString} MUI_INNERTEXT_COMPONENTS_DESCRIPTION_INFO "Компонентның тасвирламасын уку өчен, аны билгеләгез."
  !endif
!endif

!ifdef MUI_DIRECTORYPAGE
  ${LangFileString} MUI_TEXT_DIRECTORY_TITLE "Урнаштыру папкасын сайлау"
  ${LangFileString} MUI_TEXT_DIRECTORY_SUBTITLE "$(^NameDA) урнаштыру өчен папка сайлагыз."
!endif

!ifdef MUI_UNDIRECTORYPAGE
  ${LangFileString} MUI_UNTEXT_DIRECTORY_TITLE "Бетерү папкасын сайлау"
  ${LangFileString} MUI_UNTEXT_DIRECTORY_SUBTITLE "$(^NameDA) бетерергә кирәк булган папканы сайлагыз."
!endif

!ifdef MUI_INSTFILESPAGE
  ${LangFileString} MUI_TEXT_INSTALLING_TITLE "Файлларны күчермәләү"
  ${LangFileString} MUI_TEXT_INSTALLING_SUBTITLE "$(^NameDA) файллары күчермәләнә, көтегез..."
  ${LangFileString} MUI_TEXT_FINISH_TITLE "Урнаштыру тәмамланды"
  ${LangFileString} MUI_TEXT_FINISH_SUBTITLE "Урнаштыру уңышлы тәмамланды."
  ${LangFileString} MUI_TEXT_ABORT_TITLE "Урнаштыру туктатылды"
  ${LangFileString} MUI_TEXT_ABORT_SUBTITLE "Урнаштыру уңышсыз тәмамланды."
!endif

!ifdef MUI_UNINSTFILESPAGE
  ${LangFileString} MUI_UNTEXT_UNINSTALLING_TITLE "Бетерү"
  ${LangFileString} MUI_UNTEXT_UNINSTALLING_SUBTITLE "$(^NameDA) файллары бетерелә, көтегез..."
  ${LangFileString} MUI_UNTEXT_FINISH_TITLE "Бетерү тәмамланды"
  ${LangFileString} MUI_UNTEXT_FINISH_SUBTITLE "Программаны бетерү уңышлы тәмамланды."
  ${LangFileString} MUI_UNTEXT_ABORT_TITLE "Бетерү туктатылды"
  ${LangFileString} MUI_UNTEXT_ABORT_SUBTITLE "Бетерү тулысынча башкарылмады."
!endif

!ifdef MUI_FINISHPAGE
  ${LangFileString} MUI_TEXT_FINISH_INFO_TITLE "$(^NameDA) урнаштыручы эшен тәмамлау"
  ${LangFileString} MUI_TEXT_FINISH_INFO_TEXT "$(^NameDA) санагыгызга урнаштырылды.$\r$\n$\r$\nУрнаштыру программасыннан чыгу өчен $\"Тәмам$\" төймәсенә басыгыз."
  ${LangFileString} MUI_TEXT_FINISH_INFO_REBOOT "$(^NameDA) урнаштыруын тәмамлау өчен, санакны сүндереп кабызырга кирәк. Аны хәзер башкарыргамы?"
!endif

!ifdef MUI_UNFINISHPAGE
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_TITLE "$(^NameDA) бетерүче эшен тәмамлау"
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_TEXT "$(^NameDA) санагыгыздан бетерелде.$\r$\n$\r$\nБетерү программасыннан чыгу өчен $\"Тәмам$\" төймәсенә басыгыз."
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_REBOOT "$(^NameDA) бетерүен тәмамлау өчен, санакны сүндереп кабызырга кирәк. Аны хәзер башкарыргамы?"
!endif

!ifdef MUI_FINISHPAGE | MUI_UNFINISHPAGE
  ${LangFileString} MUI_TEXT_FINISH_REBOOTNOW "Әйе, санакны хәзер сүндереп кабызырга"
  ${LangFileString} MUI_TEXT_FINISH_REBOOTLATER "Юк, мин соңрак сүндереп кабызырмын"
  ${LangFileString} MUI_TEXT_FINISH_RUN "$(^NameDA) программасын җибәр&ергә"
  ${LangFileString} MUI_TEXT_FINISH_SHOWREADME "&ReadMe файлын күрсәтергә"
  ${LangFileString} MUI_BUTTONTEXT_FINISH "&Тәмам"  
!endif

!ifdef MUI_STARTMENUPAGE
  ${LangFileString} MUI_TEXT_STARTMENU_TITLE "$\"Башлау$\" менюсында папка"
  ${LangFileString} MUI_TEXT_STARTMENU_SUBTITLE "$\"Башлау$\" менюсында программа сылтамаларын урнаштыру өчен папка сайлагыз."
  ${LangFileString} MUI_INNERTEXT_STARTMENU_TOP "$\"Башлау$\" менюсында программа сылтамалары урнаштырылачак папканы сайлагыз. Шулай ук папкага башка исем бирә аласыз."
  ${LangFileString} MUI_INNERTEXT_STARTMENU_CHECKBOX "Сылтамалар ясамаска"
!endif

!ifdef MUI_UNCONFIRMPAGE
  ${LangFileString} MUI_UNTEXT_CONFIRM_TITLE "$(^NameDA) бетерү"
  ${LangFileString} MUI_UNTEXT_CONFIRM_SUBTITLE "Санактан $(^NameDA) бетерү."
!endif

!ifdef MUI_ABORTWARNING
  ${LangFileString} MUI_TEXT_ABORTWARNING "Чыннан да $(^Name) урнаштыруын туктатыргамы?"
!endif

!ifdef MUI_UNABORTWARNING
  ${LangFileString} MUI_UNTEXT_ABORTWARNING "Чыннан да $(^Name) бетерүен туктатыргамы?"
!endif

!ifdef MULTIUSER_INSTALLMODEPAGE
  ${LangFileString} MULTIUSER_TEXT_INSTALLMODE_TITLE "Урнаштыру режимы"
  ${LangFileString} MULTIUSER_TEXT_INSTALLMODE_SUBTITLE "Кайсы кулланучылар өчен $(^NameDA) урнаштырырга телисез, сайлагыз."
  ${LangFileString} MULTIUSER_INNERTEXT_INSTALLMODE_TOP "$(^NameDA) программасын үзегезгә генә яки бөтен кулланучылар өчен дә урнаштырачагыгызны сайлагыз. $(^ClickNext)"
  ${LangFileString} MULTIUSER_INNERTEXT_INSTALLMODE_ALLUSERS "Бөтен кулланучылар өчен урнаштырырга"
  ${LangFileString} MULTIUSER_INNERTEXT_INSTALLMODE_CURRENTUSER "Минем өчен генә урнаштырырга"
!endif
