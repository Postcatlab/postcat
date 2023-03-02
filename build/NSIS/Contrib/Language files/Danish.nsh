;Language: Danish (1030)
;By Claus Futtrup, scootergrisen

!insertmacro LANGFILE "Danish" = "Dansk" =

!ifdef MUI_WELCOMEPAGE
  ${LangFileString} MUI_TEXT_WELCOME_INFO_TITLE "Velkommen til installationsguiden for $(^NameDA)"
  ${LangFileString} MUI_TEXT_WELCOME_INFO_TEXT "Denne guide hjælper dig gennem installationen af $(^NameDA).$\r$\n$\r$\nDet anbefales, at du lukker alle kørende programmer inden start af installationsguiden. Det gør det muligt at opdatere de nødvendige systemfiler uden at skulle genstarte din computer.$\r$\n$\r$\n$_CLICK"
!endif

!ifdef MUI_UNWELCOMEPAGE
  ${LangFileString} MUI_UNTEXT_WELCOME_INFO_TITLE "Velkommen til $(^NameDA) afinstallationsguiden"
  ${LangFileString} MUI_UNTEXT_WELCOME_INFO_TEXT "Denne guide hjælper dig gennem afinstallationen af $(^NameDA).$\r$\n$\r$\nFør start af afinstallationen skal du være sikker på at $(^NameDA) ikke kører.$\r$\n$\r$\n$_CLICK"
!endif

!ifdef MUI_LICENSEPAGE
  ${LangFileString} MUI_TEXT_LICENSE_TITLE "Licensaftale"
  ${LangFileString} MUI_TEXT_LICENSE_SUBTITLE "Læs venligst licensaftalen før installationen af $(^NameDA)."
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM "Hvis du accepterer vilkårene i aftalen, skal du klikke på Jeg accepterer for at fortsætte. Du skal acceptere aftalen for at installere $(^NameDA)."
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM_CHECKBOX "Hvis du accepterer vilkårene i aftalen, skal du klikke på afkrydsningsfeltet nedenfor. Du skal acceptere aftalen for at installere $(^NameDA). $_CLICK"
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM_RADIOBUTTONS "Hvis du accepterer vilkårene i aftalen, skal du vælge den første valgmulighed nedenfor. Du skal acceptere aftalen for at installere $(^NameDA). $_CLICK"
!endif

!ifdef MUI_UNLICENSEPAGE
  ${LangFileString} MUI_UNTEXT_LICENSE_TITLE "Licensaftale"
  ${LangFileString} MUI_UNTEXT_LICENSE_SUBTITLE "Læs venligst licensaftalen før afinstallationen af $(^NameDA)."
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM "Hvis du accepterer vilkårene i aftalen, skal du klikke på Jeg accepterer for at fortsætte. Du skal acceptere aftalen for at afinstallere $(^NameDA)."
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM_CHECKBOX "Hvis du accepterer vilkårene i aftalen, skal du klikke på afkrydsningsfeltet nedenfor. Du skal acceptere aftalen for at afinstallere $(^NameDA). $_CLICK"
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM_RADIOBUTTONS "Hvis du accepterer vilkårene i aftalen, skal du vælge den første valgmulighed nedenfor. Du skal acceptere aftalen for at afinstallere $(^NameDA). $_CLICK"
!endif

!ifdef MUI_LICENSEPAGE | MUI_UNLICENSEPAGE
  ${LangFileString} MUI_INNERTEXT_LICENSE_TOP "Tryk på Page Down for at se resten af aftalen."
!endif

!ifdef MUI_COMPONENTSPAGE
  ${LangFileString} MUI_TEXT_COMPONENTS_TITLE "Vælg komponenter"
  ${LangFileString} MUI_TEXT_COMPONENTS_SUBTITLE "Vælg hvilke faciliteter af $(^NameDA) du vil installere."
!endif

!ifdef MUI_UNCOMPONENTSPAGE
  ${LangFileString} MUI_UNTEXT_COMPONENTS_TITLE "Vælg komponenter"
  ${LangFileString} MUI_UNTEXT_COMPONENTS_SUBTITLE "Vælg hvilke faciliteter af $(^NameDA) du vil afinstallere."
!endif

!ifdef MUI_COMPONENTSPAGE | MUI_UNCOMPONENTSPAGE
  ${LangFileString} MUI_INNERTEXT_COMPONENTS_DESCRIPTION_TITLE "Beskrivelse"
  !ifndef NSIS_CONFIG_COMPONENTPAGE_ALTERNATIVE
    ${LangFileString} MUI_INNERTEXT_COMPONENTS_DESCRIPTION_INFO "Placer musemarkøren over en komponent for at se dens beskrivelse."
  !else
    ${LangFileString} MUI_INNERTEXT_COMPONENTS_DESCRIPTION_INFO "Vælg en komponent for at se dens beskrivelse."
  !endif
!endif

!ifdef MUI_DIRECTORYPAGE
  ${LangFileString} MUI_TEXT_DIRECTORY_TITLE "Vælg installationsmappe"
  ${LangFileString} MUI_TEXT_DIRECTORY_SUBTITLE "Vælg den mappe hvori du vil installere $(^NameDA)."
!endif

!ifdef MUI_UNDIRECTORYPAGE
  ${LangFileString} MUI_UNTEXT_DIRECTORY_TITLE "Vælg afinstallationsmappe"
  ${LangFileString} MUI_UNTEXT_DIRECTORY_SUBTITLE "Vælg den mappe hvorfra du vil afinstallere $(^NameDA)."
!endif

!ifdef MUI_INSTFILESPAGE
  ${LangFileString} MUI_TEXT_INSTALLING_TITLE "Installerer"
  ${LangFileString} MUI_TEXT_INSTALLING_SUBTITLE "Vent venligst mens $(^NameDA) bliver installeret."
  ${LangFileString} MUI_TEXT_FINISH_TITLE "Installation gennemført"
  ${LangFileString} MUI_TEXT_FINISH_SUBTITLE "Installationsguiden blev gennemført."
  ${LangFileString} MUI_TEXT_ABORT_TITLE "Installation afbrudt"
  ${LangFileString} MUI_TEXT_ABORT_SUBTITLE "Installationsguiden blev ikke gennemført."
!endif

!ifdef MUI_UNINSTFILESPAGE
  ${LangFileString} MUI_UNTEXT_UNINSTALLING_TITLE "Afinstallerer"
  ${LangFileString} MUI_UNTEXT_UNINSTALLING_SUBTITLE "Vent venligst mens $(^NameDA) bliver afinstalleret."
  ${LangFileString} MUI_UNTEXT_FINISH_TITLE "Afinstallation gennemført"
  ${LangFileString} MUI_UNTEXT_FINISH_SUBTITLE "Afinstallationen blev gennemført."
  ${LangFileString} MUI_UNTEXT_ABORT_TITLE "Afinstallation afbrudt"
  ${LangFileString} MUI_UNTEXT_ABORT_SUBTITLE "Afinstallationen blev ikke gennemført."
!endif

!ifdef MUI_FINISHPAGE
  ${LangFileString} MUI_TEXT_FINISH_INFO_TITLE "Gennemfører $(^NameDA) installationsguiden"
  ${LangFileString} MUI_TEXT_FINISH_INFO_TEXT "$(^NameDA) er blevet installeret på din computer.$\r$\n$\r$\nTryk på Afslut for at lukke installationsguiden."
  ${LangFileString} MUI_TEXT_FINISH_INFO_REBOOT "Din computer skal genstartes for at gennemføre installationen af $(^NameDA). Vil du genstarte nu?"
!endif

!ifdef MUI_UNFINISHPAGE
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_TITLE "Gennemfører $(^NameDA) afinstallationsguiden"
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_TEXT "$(^NameDA) er blevet afinstalleret fra din computer.$\r$\n$\r$\nTryk på Afslut for at lukke installationsguiden."
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_REBOOT "Din computer skal genstartes for at gennemføre afinstallationen af $(^NameDA). Vil du genstarte nu?"
!endif

!ifdef MUI_FINISHPAGE | MUI_UNFINISHPAGE
  ${LangFileString} MUI_TEXT_FINISH_REBOOTNOW "Genstart nu"
  ${LangFileString} MUI_TEXT_FINISH_REBOOTLATER "Jeg genstarter selv på et senere tidspunkt"
  ${LangFileString} MUI_TEXT_FINISH_RUN "&Kør $(^NameDA)"
  ${LangFileString} MUI_TEXT_FINISH_SHOWREADME "&Vis Readme"
  ${LangFileString} MUI_BUTTONTEXT_FINISH "&Afslut"  
!endif

!ifdef MUI_STARTMENUPAGE
  ${LangFileString} MUI_TEXT_STARTMENU_TITLE "Vælg mappe i menuen Start"
  ${LangFileString} MUI_TEXT_STARTMENU_SUBTITLE "Vælg en mappe i menuen Start til programmets genveje."
  ${LangFileString} MUI_INNERTEXT_STARTMENU_TOP "Vælg mappe i menuen Start hvori du vil oprette programmets genveje. Du kan også skrive et navn for at oprette en ny mappe."
  ${LangFileString} MUI_INNERTEXT_STARTMENU_CHECKBOX "Opret ikke genveje"
!endif

!ifdef MUI_UNCONFIRMPAGE
  ${LangFileString} MUI_UNTEXT_CONFIRM_TITLE "Afinstaller $(^NameDA)"
  ${LangFileString} MUI_UNTEXT_CONFIRM_SUBTITLE "Slet $(^NameDA) fra din computer."
!endif

!ifdef MUI_ABORTWARNING
  ${LangFileString} MUI_TEXT_ABORTWARNING "Er du sikker på, at du vil afslutte installationen af $(^Name)?"
!endif

!ifdef MUI_UNABORTWARNING
  ${LangFileString} MUI_UNTEXT_ABORTWARNING "Er du sikker på, at du vil afslutte afinstallationen af $(^Name)?"
!endif

!ifdef MULTIUSER_INSTALLMODEPAGE
  ${LangFileString} MULTIUSER_TEXT_INSTALLMODE_TITLE "Vælg brugere"
  ${LangFileString} MULTIUSER_TEXT_INSTALLMODE_SUBTITLE "Vælg de brugere som skal have installeret $(^NameDA)."
  ${LangFileString} MULTIUSER_INNERTEXT_INSTALLMODE_TOP "Vælg hvorvidt du vil installere $(^NameDA) kun for dig selv eller for alle brugere på denne computer. $(^ClickNext)"
  ${LangFileString} MULTIUSER_INNERTEXT_INSTALLMODE_ALLUSERS "Installer for alle som bruger denne computer"
  ${LangFileString} MULTIUSER_INNERTEXT_INSTALLMODE_CURRENTUSER "Installer kun for mig"
!endif
