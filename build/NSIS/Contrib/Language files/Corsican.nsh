/*
** Language: Corsican (1155)
** Traduzzione corsa da Patriccollu di Santa Maria è Sichè - <Patrick.Santa-Maria(AT)laposte.net>
** ISO 639-1: co
** ISO 639-2: cos
*/

!insertmacro LANGFILE "Corsican" "Corsican" "Corsu" "Corsu"

!ifdef MUI_WELCOMEPAGE
  ${LangFileString} MUI_TEXT_WELCOME_INFO_TITLE "Benvenuta in l’assistente d’installazione di $(^NameDA)m"
  ${LangFileString} MUI_TEXT_WELCOME_INFO_TEXT "L’assistente d’installazione hà da aiutavvi à installà $(^NameDA).$\r$\n$\r$\nHè ricumandatu di chjode tutte l’altre appiecazioni nanzu di avvià st’assistente. Quessu permetterà di mudificà i schedarii di u sistema senza riavvià l’urdinatore.$\r$\n$\r$\n$_CLICK"
!endif

!ifdef MUI_UNWELCOMEPAGE
  ${LangFileString} MUI_UNTEXT_WELCOME_INFO_TITLE "Benvenuta in l’assistente di disinstallazione di $(^NameDA)"
  ${LangFileString} MUI_UNTEXT_WELCOME_INFO_TEXT "L’assistente hà da aiutavvi à disinstallà $(^NameDA).$\r$\n$\r$\nNanzu di principià a disinstallazione, ci vole à assicurassi chì $(^NameDA) ùn sia micca in funzione.$\r$\n$\r$\n$_CLICK"
!endif

!ifdef MUI_LICENSEPAGE
  ${LangFileString} MUI_TEXT_LICENSE_TITLE "Cuntrattu di licenza"
  ${LangFileString} MUI_TEXT_LICENSE_SUBTITLE "Ci vole à leghje i termini di a licenza nanzu d’installà $(^NameDA)."
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM "S’è voi site d’accunsentu cù i termini di u cuntrattu, sciglite Accunsentu per cuntinuà. Ci vole à accettà u cuntrattu per installà $(^NameDA)."
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM_CHECKBOX "S’è voi site d’accunsentu cù i termini di u cuntrattu, sciglite a casella inghjò. Ci vole à accettà u cuntrattu per installà $(^NameDA). $_CLICK"
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM_RADIOBUTTONS "S’è voi site d’accunsentu cù i termini di u cuntrattu, sciglite a prima ozzione inghjò. Ci vole à accettà u cuntrattu per installà $(^NameDA). $_CLICK"
!endif

!ifdef MUI_UNLICENSEPAGE
  ${LangFileString} MUI_UNTEXT_LICENSE_TITLE "Cuntrattu di licenza"
  ${LangFileString} MUI_UNTEXT_LICENSE_SUBTITLE "Ci vole à leghje i termini di a licenza nanzu di disinstallà $(^NameDA)."
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM "S’è voi site d’accunsentu cù i termini di u cuntrattu, sciglite Accunsentu per cuntinuà. Ci vole à accettà u cuntrattu per disinstallà $(^NameDA)."
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM_CHECKBOX "S’è voi site d’accunsentu cù i termini di u cuntrattu, sciglite a casella inghjò. Ci vole à accettà u cuntrattu per disinstallà $(^NameDA). $_CLICK"
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM_RADIOBUTTONS "S’è voi site d’accunsentu cù i termini di u cuntrattu, sciglite a prima ozzione inghjò. Ci vole à accettà u cuntrattu per disinstallà $(^NameDA). $_CLICK"
!endif

!ifdef MUI_LICENSEPAGE | MUI_UNLICENSEPAGE
  ${LangFileString} MUI_INNERTEXT_LICENSE_TOP "Sciglite Pagina Seguente per fighjà a seguita di u ducumentu."
!endif

!ifdef MUI_COMPONENTSPAGE
  ${LangFileString} MUI_TEXT_COMPONENTS_TITLE "Sciglite i cumpunenti"
  ${LangFileString} MUI_TEXT_COMPONENTS_SUBTITLE "Sciglite e funzioni di $(^NameDA) chì voi vulete installà."
!endif

!ifdef MUI_UNCOMPONENTSPAGE
  ${LangFileString} MUI_UNTEXT_COMPONENTS_TITLE "Sciglite i cumpunenti"
  ${LangFileString} MUI_UNTEXT_COMPONENTS_SUBTITLE "Sciglite e funzioni di $(^NameDA) chì voi vulete disinstallà."
!endif

!ifdef MUI_COMPONENTSPAGE | MUI_UNCOMPONENTSPAGE
  ${LangFileString} MUI_INNERTEXT_COMPONENTS_DESCRIPTION_TITLE "Discrizzione"
  !ifndef NSIS_CONFIG_COMPONENTPAGE_ALTERNATIVE
    ${LangFileString} MUI_INNERTEXT_COMPONENTS_DESCRIPTION_INFO "Piazzà u topu nant’à un cumpunentu per fighjà a so discrizzione."
  !else
    ${LangFileString} MUI_INNERTEXT_COMPONENTS_DESCRIPTION_INFO "Selezziunà un cumpunentu per fighjà a so discrizzione."
  !endif
!endif

!ifdef MUI_DIRECTORYPAGE
  ${LangFileString} MUI_TEXT_DIRECTORY_TITLE "Sciglite u cartulare d’installazione"
  ${LangFileString} MUI_TEXT_DIRECTORY_SUBTITLE "Sciglite u cartulare induve installà $(^NameDA)."
!endif

!ifdef MUI_UNDIRECTORYPAGE
  ${LangFileString} MUI_UNTEXT_DIRECTORY_TITLE "Sciglite u cartulare di disinstallazione"
  ${LangFileString} MUI_UNTEXT_DIRECTORY_SUBTITLE "Sciglite u cartulare di disinstallazione di $(^NameDA)."
!endif

!ifdef MUI_INSTFILESPAGE
  ${LangFileString} MUI_TEXT_INSTALLING_TITLE "Installazione in corsu"
  ${LangFileString} MUI_TEXT_INSTALLING_SUBTITLE "Aspettate per piacè chì $(^NameDA) sia installatu."
  ${LangFileString} MUI_TEXT_FINISH_TITLE "Installazione compia"
  ${LangFileString} MUI_TEXT_FINISH_SUBTITLE "L’installazione hè compia bè."
  ${LangFileString} MUI_TEXT_ABORT_TITLE "Installazione interrotta"
  ${LangFileString} MUI_TEXT_ABORT_SUBTITLE "L’installazione ùn hè micca compia bè."
!endif

!ifdef MUI_UNINSTFILESPAGE
  ${LangFileString} MUI_UNTEXT_UNINSTALLING_TITLE "Disinstallazione in corsu"
  ${LangFileString} MUI_UNTEXT_UNINSTALLING_SUBTITLE "Aspettate per piacè chì $(^NameDA) sia disinstallatu."
  ${LangFileString} MUI_UNTEXT_FINISH_TITLE "Disinstallazione compia"
  ${LangFileString} MUI_UNTEXT_FINISH_SUBTITLE "A disinstallazione hè compia bè."
  ${LangFileString} MUI_UNTEXT_ABORT_TITLE "Disinstallazione interrotta"
  ${LangFileString} MUI_UNTEXT_ABORT_SUBTITLE "A disinstallazione ùn hè micca compia bè."
!endif

!ifdef MUI_FINISHPAGE
  ${LangFileString} MUI_TEXT_FINISH_INFO_TITLE "Fine d’installazione di $(^NameDA)"
  ${LangFileString} MUI_TEXT_FINISH_INFO_TEXT "$(^NameDA) hè statu installatu nant’à l’urdinatore.$\r$\n$\r$\nSciglite Piantà per chjode l’assistente."
  ${LangFileString} MUI_TEXT_FINISH_INFO_REBOOT "L’urdinatore deve esse piantatu è rilanciatu per compie l’installazione di $(^NameDA). Vulete piantalu è rilancialu avà ?"
!endif

!ifdef MUI_UNFINISHPAGE
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_TITLE "Fine di disinstallazione di $(^NameDA)"
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_TEXT "$(^NameDA) hè statu disinstallatu da l’urdinatore.$\r$\n$\r$\nSciglite Piantà per chjode l’assistente."
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_REBOOT "L’urdinatore deve esse piantatu è rilanciatu per compie a disinstallazione di $(^NameDA). Vulete piantalu è rilancialu avà ?"
!endif

!ifdef MUI_FINISHPAGE | MUI_UNFINISHPAGE
  ${LangFileString} MUI_TEXT_FINISH_REBOOTNOW "Rilancià subitu"
  ${LangFileString} MUI_TEXT_FINISH_REBOOTLATER "Vogliu fallu dopu dapermè"
  ${LangFileString} MUI_TEXT_FINISH_RUN "&Eseguisce $(^NameDA)"
  ${LangFileString} MUI_TEXT_FINISH_SHOWREADME "&Affissà u schedariu LisezMoi/Readme"
  ${LangFileString} MUI_BUTTONTEXT_FINISH "&Piantà"
!endif

!ifdef MUI_STARTMENUPAGE
  ${LangFileString} MUI_TEXT_STARTMENU_TITLE "Sciglite un cartulare in u listinu « Démarrer »"
  ${LangFileString} MUI_TEXT_STARTMENU_SUBTITLE "Sciglite un cartulare in u listinu « Démarrer » per l’accurtatoghjii di $(^NameDA)."
  ${LangFileString} MUI_INNERTEXT_STARTMENU_TOP "Sciglite un cartulare in u listinu « Démarrer » induve l’accurtatoghjii di u prugramma seranu creati. Pudete dinù scrive un nome per creà un novu cartulare."
  ${LangFileString} MUI_INNERTEXT_STARTMENU_CHECKBOX "Ùn creà micca d’accurtatoghji"
!endif

!ifdef MUI_UNCONFIRMPAGE
  ${LangFileString} MUI_UNTEXT_CONFIRM_TITLE "Disinstallà $(^NameDA)"
  ${LangFileString} MUI_UNTEXT_CONFIRM_SUBTITLE "Caccià $(^NameDA) da l’urdinatore."
!endif

!ifdef MUI_ABORTWARNING
  ${LangFileString} MUI_TEXT_ABORTWARNING "Site sicuru di vulè chità l’assistente d’installazione di $(^Name) ?"
!endif

!ifdef MUI_UNABORTWARNING
  ${LangFileString} MUI_UNTEXT_ABORTWARNING "Site sicuru di vulè chità l’assistente di disinstallazione di $(^Name) ?"
!endif

!ifdef MULTIUSER_INSTALLMODEPAGE
  ${LangFileString} MULTIUSER_TEXT_INSTALLMODE_TITLE "Scelta di l’utilizatori"
  ${LangFileString} MULTIUSER_TEXT_INSTALLMODE_SUBTITLE "Sciglite l’utilizatori chì puderanu impiegà $(^NameDA)."
  ${LangFileString} MULTIUSER_INNERTEXT_INSTALLMODE_TOP "Selezziunà s’èllu ci vole à installà $(^NameDA) solu per voi o per tutti l’utilizatori di l’urdinatore. $(^ClickNext)"
  ${LangFileString} MULTIUSER_INNERTEXT_INSTALLMODE_ALLUSERS "Installà per tutti l’utilizatori di l’urdinatore"
  ${LangFileString} MULTIUSER_INNERTEXT_INSTALLMODE_CURRENTUSER "Installà solu per mè"
!endif
