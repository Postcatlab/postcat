;Language: Italian (1040)
;By SANFACE Software <sanface@sanface.com> v1.67 accents
;Review and update from v1.65 to v1.67 by Alessandro Staltari < staltari (a) geocities.com >
;Review and update from v1.67 to v1.68 by Lorenzo Bevilacqua < meow811@libero.it >

!insertmacro LANGFILE "Italian" = "Italiano" =

!ifdef MUI_WELCOMEPAGE
  ${LangFileString} MUI_TEXT_WELCOME_INFO_TITLE "Installazione di $(^NameDA)"
  ${LangFileString} MUI_TEXT_WELCOME_INFO_TEXT "Questo programma installerà $(^NameDA) nel computer.$\r$\n$\r$\nSi raccomanda di chiudere tutte le altre applicazioni prima di iniziare l'installazione. Questo permetterà al programma di installazione di aggiornare i file di sistema senza dover riavviare il computer.$\r$\n$\r$\n$_CLICK"
!endif

!ifdef MUI_UNWELCOMEPAGE
  ${LangFileString} MUI_UNTEXT_WELCOME_INFO_TITLE "Disinstallazione di $(^NameDA)"
  ${LangFileString} MUI_UNTEXT_WELCOME_INFO_TEXT "Questa programma ti guiderà nella disinstallazione di $(^NameDA).$\r$\n$\r$\nPrima di iniziare la disinstallazione, assicurati che $(^Name) non sia in esecuzione.$\r$\n$\r$\n$_CLICK"
!endif

!ifdef MUI_LICENSEPAGE
  ${LangFileString} MUI_TEXT_LICENSE_TITLE "Accordo di licenza"
  ${LangFileString} MUI_TEXT_LICENSE_SUBTITLE "Leggi le condizioni dell'accordo di licenza prima di installare $(^NameDA)."
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM "Se accetti tutti i termini dell'accordo di licenza, seleziona 'Accetto' per continuare. Per installare $(^NameDA) è necessario accettare i termini dell'accordo di licenza."
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM_CHECKBOX "Se accetti i termini dell'accordo di licenza, seleziona la casella sottostante. Per installare $(^NameDA) è necessario accettare i termini dell'accordo di licenza. $_CLICK"
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM_RADIOBUTTONS "Se accetti i termini dell'accordo di licenza, seleziona la prima opzione sottostante. Per installare $(^NameDA) è necessario accettare i termini della licenza d'uso. $_CLICK"
!endif

!ifdef MUI_UNLICENSEPAGE
  ${LangFileString} MUI_UNTEXT_LICENSE_TITLE "Accordo di licenza"
  ${LangFileString} MUI_UNTEXT_LICENSE_SUBTITLE "Leggi le condizioni dell'accordo di licenza prima di installare $(^NameDA)."
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM "Se accetti tutti i termini dell'accordo di licenza, seleziona 'Accetto' per continuare. Per installare $(^NameDA) è necessario accettare i termini dell'accordo di licenza."
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM_CHECKBOX "Se accetti i termini dell'accordo di licenza, seleziona la casella sottostante. Per installare $(^NameDA) è necessario accettare i termini dell'accordo di licenza. $_CLICK"
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM_RADIOBUTTONS "Se accetti i termini dell'accordo di licenza, seleziona la prima opzione sottostante. Per installare $(^NameDA) è necessario accettare i termini della licenza d'uso. $_CLICK"
!endif

!ifdef MUI_LICENSEPAGE | MUI_UNLICENSEPAGE
  ${LangFileString} MUI_INNERTEXT_LICENSE_TOP "Premi 'PagGiù' per visualizzare il resto dell'accordo di licenza."
!endif

!ifdef MUI_COMPONENTSPAGE
  ${LangFileString} MUI_TEXT_COMPONENTS_TITLE "Selezione componenti"
  ${LangFileString} MUI_TEXT_COMPONENTS_SUBTITLE "Seleziona i componenti di $(^NameDA) da installare."
!endif

!ifdef MUI_UNCOMPONENTSPAGE
  ${LangFileString} MUI_UNTEXT_COMPONENTS_TITLE "Selezione componenti"
  ${LangFileString} MUI_UNTEXT_COMPONENTS_SUBTITLE "Seleziona i componenti di $(^NameDA) da disinstallare."
!endif

!ifdef MUI_COMPONENTSPAGE | MUI_UNCOMPONENTSPAGE
  ${LangFileString} MUI_INNERTEXT_COMPONENTS_DESCRIPTION_TITLE "Descrizione"
  !ifndef NSIS_CONFIG_COMPONENTPAGE_ALTERNATIVE
    ${LangFileString} MUI_INNERTEXT_COMPONENTS_DESCRIPTION_INFO "Posiziona il puntatore del mouse sul componente per visualizzare  la relativa descrizione."
  !else
    ${LangFileString} MUI_INNERTEXT_COMPONENTS_DESCRIPTION_INFO "Seleziona un componente per visualizzare la relativa descrizione."
  !endif
!endif

!ifdef MUI_DIRECTORYPAGE
  ${LangFileString} MUI_TEXT_DIRECTORY_TITLE "Selezione cartella installazione"
  ${LangFileString} MUI_TEXT_DIRECTORY_SUBTITLE "Seleziona la cartella nella quale installare $(^NameDA)."
!endif

!ifdef MUI_UNDIRECTORYPAGE
  ${LangFileString} MUI_UNTEXT_DIRECTORY_TITLE "Selezione cartella da cui disinstallare"
  ${LangFileString} MUI_UNTEXT_DIRECTORY_SUBTITLE "Seleziona la cartella dalla quale disinstallare $(^NameDA)."
!endif

!ifdef MUI_INSTFILESPAGE
  ${LangFileString} MUI_TEXT_INSTALLING_TITLE "Installazione"
  ${LangFileString} MUI_TEXT_INSTALLING_SUBTITLE "Attendi il completamento dell'installazione di $(^NameDA)."
  ${LangFileString} MUI_TEXT_FINISH_TITLE "Installazione completata"
  ${LangFileString} MUI_TEXT_FINISH_SUBTITLE "L'installazione è stata completata correttamente."
  ${LangFileString} MUI_TEXT_ABORT_TITLE "Installazione interrotta"
  ${LangFileString} MUI_TEXT_ABORT_SUBTITLE "L'installazione non è stata completata correttamente."
!endif

!ifdef MUI_UNINSTFILESPAGE
  ${LangFileString} MUI_UNTEXT_UNINSTALLING_TITLE "Disinstallazione"
  ${LangFileString} MUI_UNTEXT_UNINSTALLING_SUBTITLE "Attendi il completamento della disinstallazione di $(^NameDA)."
  ${LangFileString} MUI_UNTEXT_FINISH_TITLE "Disinstallazione completata"
  ${LangFileString} MUI_UNTEXT_FINISH_SUBTITLE "La disinstallazione è stata completata correttamente."
  ${LangFileString} MUI_UNTEXT_ABORT_TITLE "Disinstallazione interrotta"
  ${LangFileString} MUI_UNTEXT_ABORT_SUBTITLE "La disintallazione non è stata completata correttamente."
!endif

!ifdef MUI_FINISHPAGE
  ${LangFileString} MUI_TEXT_FINISH_INFO_TITLE "Installazione di $(^NameDA) completata."
  ${LangFileString} MUI_TEXT_FINISH_INFO_TEXT "$(^NameDA) è stato installato.$\r$\n$\r$\nScegli 'Chiudi' per chiudere il programma di installazione."
  ${LangFileString} MUI_TEXT_FINISH_INFO_REBOOT "Per completare l'installazione di $(^NameDA) il computer deve essere riavviato. Vuoi riavviarlo ora?"
!endif

!ifdef MUI_UNFINISHPAGE
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_TITLE "Disinstallazione di $(^NameDA) completata."
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_TEXT "$(^NameDA) è stato disinstallato.$\r$\n$\r$\nSeleziona 'Chiudi' per chiudere questa procedura."  
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_REBOOT "Per completare la disinstallazione di $(^NameDA) il computer deve essere riavviato. Vuoi riavviarlo ora?"
!endif

!ifdef MUI_FINISHPAGE | MUI_UNFINISHPAGE
  ${LangFileString} MUI_TEXT_FINISH_REBOOTNOW "Riavvia ora"
  ${LangFileString} MUI_TEXT_FINISH_REBOOTLATER "Preferisco riavviarlo manualmente più tardi"
  ${LangFileString} MUI_TEXT_FINISH_RUN "Esegui $(^NameDA)"
  ${LangFileString} MUI_TEXT_FINISH_SHOWREADME "Visualizza il file Readme"
  ${LangFileString} MUI_BUTTONTEXT_FINISH "&Chiudi"
!endif

!ifdef MUI_STARTMENUPAGE
  ${LangFileString} MUI_TEXT_STARTMENU_TITLE "Selezione cartella menu Start"
  ${LangFileString} MUI_TEXT_STARTMENU_SUBTITLE "Seleziona la cartella del menu Start in cui creare i collegamenti del programma."
  ${LangFileString} MUI_INNERTEXT_STARTMENU_TOP "Seleziona la cartella del menu Start in cui verranno creati i collegamenti del programma. È possibile inserire un nome per creare una nuova cartella."
  ${LangFileString} MUI_INNERTEXT_STARTMENU_CHECKBOX "Non creare i collegamenti del programma."
!endif

!ifdef MUI_UNCONFIRMPAGE
  ${LangFileString} MUI_UNTEXT_CONFIRM_TITLE "Disinstallazione"
  ${LangFileString} MUI_UNTEXT_CONFIRM_SUBTITLE "Disinstalla il programma $(^NameDA)."
!endif

!ifdef MUI_ABORTWARNING
  ${LangFileString} MUI_TEXT_ABORTWARNING "Sei sicuro di voler interrompere l'installazione di $(^Name) ?"
!endif

!ifdef MUI_UNABORTWARNING
  ${LangFileString} MUI_UNTEXT_ABORTWARNING "Sei sicuro di voler interrompere la disinstallazione di $(^Name)?"
!endif

!ifdef MULTIUSER_INSTALLMODEPAGE
  ${LangFileString} MULTIUSER_TEXT_INSTALLMODE_TITLE "Configurazione profilo utenti"
  ${LangFileString} MULTIUSER_TEXT_INSTALLMODE_SUBTITLE "Seleziona per quali utenti vuoi installare $(^NameDA)."
  ${LangFileString} MULTIUSER_INNERTEXT_INSTALLMODE_TOP "Seleziona se vuoi installare $(^NameDA) solo per questo utente o per tutti gli utenti di questo sistema. $(^ClickNext)"
  ${LangFileString} MULTIUSER_INNERTEXT_INSTALLMODE_ALLUSERS "Installazione per tutti gli utenti"
  ${LangFileString} MULTIUSER_INNERTEXT_INSTALLMODE_CURRENTUSER "Installazione per il singolo utente"
!endif
