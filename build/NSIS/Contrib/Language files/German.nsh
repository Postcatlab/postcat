﻿;Language: German (1031)
;By L.King, changes by K. Windszus, R. Bisswanger, M. Simmack, D. Weiß, Frederik Schwarzer & S. Stange

!insertmacro LANGFILE "German" = "Deutsch" =

!ifdef MUI_WELCOMEPAGE
  ${LangFileString} MUI_TEXT_WELCOME_INFO_TITLE "Willkommen zur Installation$\r$\nvon $(^NameDA)"
  ${LangFileString} MUI_TEXT_WELCOME_INFO_TEXT "Dieser Assistent wird Sie durch die Installation von $(^NameDA) begleiten.$\r$\n$\r$\nEs wird empfohlen, vor der Installation alle anderen Programme zu schließen, damit bestimmte Systemdateien ohne Neustart ersetzt werden können.$\r$\n$\r$\n$_CLICK"
!endif

!ifdef MUI_UNWELCOMEPAGE
  ${LangFileString} MUI_UNTEXT_WELCOME_INFO_TITLE "Willkommen zur Deinstallation$\r$\nvon $(^NameDA)"
  ${LangFileString} MUI_UNTEXT_WELCOME_INFO_TEXT "Dieser Assistent wird Sie durch die Deinstallation von $(^NameDA) begleiten.$\r$\n$\r$\nBitte beenden Sie $(^NameDA), bevor Sie mit der Deinstallation fortfahren.$\r$\n$\r$\n$_CLICK"
!endif

!ifdef MUI_LICENSEPAGE
  ${LangFileString} MUI_TEXT_LICENSE_TITLE "Lizenzabkommen"
  ${LangFileString} MUI_TEXT_LICENSE_SUBTITLE "Bitte lesen Sie die Lizenzbedingungen durch, bevor Sie mit der Installation fortfahren."
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM "Falls Sie alle Bedingungen des Abkommens akzeptieren, klicken Sie auf Annehmen. Sie müssen die Lizenzvereinbarungen anerkennen, um $(^NameDA) installieren zu können."
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM_CHECKBOX "Falls Sie alle Bedingungen des Abkommens akzeptieren, aktivieren Sie das Kästchen. Sie müssen die Lizenzvereinbarungen anerkennen, um $(^NameDA) installieren zu können. $_CLICK"
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM_RADIOBUTTONS "Falls Sie alle Bedingungen des Abkommens akzeptieren, wählen Sie unten die entsprechende Option. Sie müssen die Lizenzvereinbarungen anerkennen, um $(^NameDA) installieren zu können. $_CLICK"
!endif

!ifdef MUI_UNLICENSEPAGE
  ${LangFileString} MUI_UNTEXT_LICENSE_TITLE "Lizenzabkommen"
  ${LangFileString} MUI_UNTEXT_LICENSE_SUBTITLE "Bitte lesen Sie die Lizenzbedingungen durch, bevor Sie mit der Deinstallation von $(^NameDA) fortfahren."
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM "Falls Sie alle Bedingungen des Abkommens akzeptieren, klicken Sie auf Annehmen. Sie müssen die Lizenzvereinbarungen anerkennen, um $(^NameDA) deinstallieren zu können."
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM_CHECKBOX "Falls Sie alle Bedingungen des Abkommens akzeptieren, aktivieren Sie das Kästchen. Sie müssen die Lizenzvereinbarungen anerkennen, um $(^NameDA) deinstallieren zu können. $_CLICK"
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM_RADIOBUTTONS "Falls Sie alle Bedingungen des Abkommens akzeptieren, wählen Sie unten die entsprechende Option. Sie müssen die Lizenzvereinbarungen anerkennen, um $(^NameDA) deinstallieren zu können. $_CLICK"
!endif

!ifdef MUI_LICENSEPAGE | MUI_UNLICENSEPAGE
  ${LangFileString} MUI_INNERTEXT_LICENSE_TOP "Drücken Sie die BILD-AB-Taste, um den Rest des Abkommens zu lesen."
!endif

!ifdef MUI_COMPONENTSPAGE
  ${LangFileString} MUI_TEXT_COMPONENTS_TITLE "Komponenten auswählen"
  ${LangFileString} MUI_TEXT_COMPONENTS_SUBTITLE "Wählen Sie die Komponenten aus, die Sie installieren möchten."
!endif

!ifdef MUI_UNCOMPONENTSPAGE
  ${LangFileString} MUI_UNTEXT_COMPONENTS_TITLE "Komponenten auswählen"
  ${LangFileString} MUI_UNTEXT_COMPONENTS_SUBTITLE "Wählen Sie die Komponenten aus, die Sie entfernen möchten."
!endif

!ifdef MUI_COMPONENTSPAGE | MUI_UNCOMPONENTSPAGE
  ${LangFileString} MUI_INNERTEXT_COMPONENTS_DESCRIPTION_TITLE "Beschreibung"
  !ifndef NSIS_CONFIG_COMPONENTPAGE_ALTERNATIVE
    ${LangFileString} MUI_INNERTEXT_COMPONENTS_DESCRIPTION_INFO "Bewegen Sie den Mauszeiger über eine Komponente, um die Beschreibung zu lesen."
  !else
    ${LangFileString} MUI_INNERTEXT_COMPONENTS_DESCRIPTION_INFO "Wählen Sie eine Komponente, um die Beschreibung zu lesen."
  !endif
!endif

!ifdef MUI_DIRECTORYPAGE
  ${LangFileString} MUI_TEXT_DIRECTORY_TITLE "Zielverzeichnis auswählen"
  ${LangFileString} MUI_TEXT_DIRECTORY_SUBTITLE "Wählen Sie das Verzeichnis aus, in das $(^NameDA) installiert werden soll."
!endif

!ifdef MUI_UNDIRECTORYPAGE
  ${LangFileString} MUI_UNTEXT_DIRECTORY_TITLE "Verzeichnis für Deinstallation auswählen"
  ${LangFileString} MUI_UNTEXT_DIRECTORY_SUBTITLE "Wählen Sie das Verzeichnis aus, aus dem $(^NameDA) entfernt werden soll."
!endif

!ifdef MUI_INSTFILESPAGE
  ${LangFileString} MUI_TEXT_INSTALLING_TITLE "Wird installiert ..."
  ${LangFileString} MUI_TEXT_INSTALLING_SUBTITLE "Bitte warten Sie, während $(^NameDA) installiert wird."
  ${LangFileString} MUI_TEXT_FINISH_TITLE "Die Installation ist vollständig"
  ${LangFileString} MUI_TEXT_FINISH_SUBTITLE "Die Installation wurde erfolgreich abgeschlossen."
  ${LangFileString} MUI_TEXT_ABORT_TITLE "Abbruch der Installation"
  ${LangFileString} MUI_TEXT_ABORT_SUBTITLE "Die Installation wurde nicht vollständig abgeschlossen."
!endif

!ifdef MUI_UNINSTFILESPAGE
  ${LangFileString} MUI_UNTEXT_UNINSTALLING_TITLE "Wird deinstalliert ..."
  ${LangFileString} MUI_UNTEXT_UNINSTALLING_SUBTITLE "Bitte warten Sie, während $(^NameDA) entfernt wird."
  ${LangFileString} MUI_UNTEXT_FINISH_TITLE "Die Deinstallation ist vollständig"
  ${LangFileString} MUI_UNTEXT_FINISH_SUBTITLE "Die Deinstallation wurde erfolgreich abgeschlossen."
  ${LangFileString} MUI_UNTEXT_ABORT_TITLE "Abbruch der Deinstallation"
  ${LangFileString} MUI_UNTEXT_ABORT_SUBTITLE "Die Deinstallation wurde nicht vollständig abgeschlossen."
!endif

!ifdef MUI_FINISHPAGE
  ${LangFileString} MUI_TEXT_FINISH_INFO_TITLE "Die Installation von $(^NameDA) wird abgeschlossen"
  ${LangFileString} MUI_TEXT_FINISH_INFO_TEXT "$(^NameDA) wurde auf Ihrem Computer installiert.$\r$\n$\r$\nKlicken Sie auf Fertigstellen, um den Installationsassistenten zu schließen."
  ${LangFileString} MUI_TEXT_FINISH_INFO_REBOOT "Windows muss neu gestartet werden, um die Installation von $(^NameDA) zu vervollständigen. Möchten Sie Windows jetzt neu starten?"
!endif

!ifdef MUI_UNFINISHPAGE
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_TITLE "Die Deinstallation von $(^NameDA) wird abgeschlossen"
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_TEXT "$(^NameDA) ist von Ihrem Computer entfernt worden.$\r$\n$\r$\nKlicken Sie auf Fertigstellen, um den Assistenten zu schließen."
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_REBOOT "Windows muss neu gestartet werden, um die Deinstallation von $(^NameDA) zu vervollständigen. Möchten Sie Windows jetzt neu starten?"
!endif

!ifdef MUI_FINISHPAGE | MUI_UNFINISHPAGE
  ${LangFileString} MUI_TEXT_FINISH_REBOOTNOW "Jetzt neu starten"
  ${LangFileString} MUI_TEXT_FINISH_REBOOTLATER "Windows später selbst neu starten"
  ${LangFileString} MUI_TEXT_FINISH_RUN "$(^NameDA) ausführen"
  ${LangFileString} MUI_TEXT_FINISH_SHOWREADME "Liesmich-Datei anzeigen"
  ${LangFileString} MUI_BUTTONTEXT_FINISH "&Fertigstellen"
!endif

!ifdef MUI_STARTMENUPAGE
  ${LangFileString} MUI_TEXT_STARTMENU_TITLE "Startmenü-Ordner bestimmen"
  ${LangFileString} MUI_TEXT_STARTMENU_SUBTITLE "Bestimmen Sie einen Startmenü-Ordner für die Programmverknüpfungen."
  ${LangFileString} MUI_INNERTEXT_STARTMENU_TOP "Wählen Sie den Startmenü-Ordner für die Programmverknüpfungen aus. Falls Sie einen neuen Ordner erstellen möchten, geben Sie dessen Namen ein."
  ${LangFileString} MUI_INNERTEXT_STARTMENU_CHECKBOX "Keine Verknüpfungen erstellen"
!endif

!ifdef MUI_UNCONFIRMPAGE
  ${LangFileString} MUI_UNTEXT_CONFIRM_TITLE "Deinstallation von $(^NameDA)"
  ${LangFileString} MUI_UNTEXT_CONFIRM_SUBTITLE "$(^NameDA) wird von Ihrem Computer entfernt."
!endif

!ifdef MUI_ABORTWARNING
  ${LangFileString} MUI_TEXT_ABORTWARNING "Sind Sie sicher, dass Sie die Installation von $(^Name) abbrechen möchten?"
!endif

!ifdef MUI_UNABORTWARNING
  ${LangFileString} MUI_UNTEXT_ABORTWARNING "Sind Sie sicher, dass Sie die Deinstallation von $(^Name) abbrechen möchten?"
!endif

!ifdef MULTIUSER_INSTALLMODEPAGE
  ${LangFileString} MULTIUSER_TEXT_INSTALLMODE_TITLE "Benutzer auswählen"
  ${LangFileString} MULTIUSER_TEXT_INSTALLMODE_SUBTITLE "Wählen Sie die Benutzer aus, für die Sie $(^NameDA) installieren möchten."
  ${LangFileString} MULTIUSER_INNERTEXT_INSTALLMODE_TOP "Wählen Sie aus, ob Sie $(^NameDA) nur für den eigenen Gebrauch oder für die Nutzung durch alle Benutzer dieses Systems installieren möchten. $(^ClickNext)"
  ${LangFileString} MULTIUSER_INNERTEXT_INSTALLMODE_ALLUSERS "Installation für alle Benutzer dieses Computers"
  ${LangFileString} MULTIUSER_INNERTEXT_INSTALLMODE_CURRENTUSER "Installation nur für mich"
!endif
