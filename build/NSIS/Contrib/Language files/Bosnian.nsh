﻿;Language: Bosnian (5146)
;By Salih Čavkić, cavkic@skynet.be

!insertmacro LANGFILE "Bosnian" = "Bosanski" =

!ifdef MUI_WELCOMEPAGE
  ${LangFileString} MUI_TEXT_WELCOME_INFO_TITLE "Dobrodošli u program za instalaciju $(^NameDA)"
  ${LangFileString} MUI_TEXT_WELCOME_INFO_TEXT "Ovaj program će instalirati $(^NameDA) na Vaš sistem. $\r$\n$\r$\nPreporučujemo da neizostavno zatvorite sve druge otvorene programe prije nego što definitivno započnete sa instaliranjem. To će omogućiti bolju nadogradnju određenih sistemskih datoteka bez potrebe da Vaš računar ponovo startujete. Instaliranje programa možete prekinuti pritiskom na dugme 'Odustani'.$\r$\n$\r$\n$_CLICK"
!endif

!ifdef MUI_UNWELCOMEPAGE
  ${LangFileString} MUI_UNTEXT_WELCOME_INFO_TITLE "Dobrodošli u postupak uklanjanja programa $(^NameDA)"
  ${LangFileString} MUI_UNTEXT_WELCOME_INFO_TEXT "Ovaj će Vas vodič provesti kroz postupak uklanjanja programa $(^NameDA).$\r$\n$\r$\nPrije samog početka, molim zatvorite program $(^NameDA) ukoliko je slučajno otvoren.$\r$\n$\r$\n$_CLICK"
!endif

!ifdef MUI_LICENSEPAGE
  ${LangFileString} MUI_TEXT_LICENSE_TITLE "Licencni ugovor"
  ${LangFileString} MUI_TEXT_LICENSE_SUBTITLE "Molim pročitajte licencni ugovor $(^NameDA) prije instalacije programa."
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM "Ako prihvatate uslove licence, odaberite 'Prihvatam' za nastavak. Morate prihvatiti licencu za instalaciju programa $(^NameDA)."
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM_CHECKBOX "Ako prihvatate uslove licence, označite donji kvadratić. Morate prihvatiti licencu za instalaciju programa $(^NameDA). $_CLICK"
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM_RADIOBUTTONS "Ako prihvatate uslove licence, odaberite prvu donju opciju. Morate prihvatiti licencu za instalaciju programa $(^NameDA). $_CLICK"
!endif

!ifdef MUI_UNLICENSEPAGE
  ${LangFileString} MUI_UNTEXT_LICENSE_TITLE "Licencni ugovor o pravu korištenja"
  ${LangFileString} MUI_UNTEXT_LICENSE_SUBTITLE "Molim pročitajte licencu prije uklanjanja programa $(^NameDA)."
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM "Ako prihvatate uslove licence, odaberite 'Prihvatam' za nastavak. Morate prihvatiti licencu za uklanjanje programa $(^NameDA)."
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM_CHECKBOX "Ako prihvatate uslove licence, označite donji kvadratić. Morate prihvatiti licencu za uklanjanje programa $(^NameDA). $_CLICK"
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM_RADIOBUTTONS "Ako prihvatate uslove licence, odaberite prvu donju opciju. Morate prihvatiti licencu za uklanjanje programa $(^NameDA). $_CLICK"
!endif

!ifdef MUI_LICENSEPAGE | MUI_UNLICENSEPAGE
  ${LangFileString} MUI_INNERTEXT_LICENSE_TOP "Pritisnite 'Page Down' na tastaturi za ostatak licence."
!endif

!ifdef MUI_COMPONENTSPAGE
  ${LangFileString} MUI_TEXT_COMPONENTS_TITLE "Izbor komponenti za instalaciju"
  ${LangFileString} MUI_TEXT_COMPONENTS_SUBTITLE "Izaberite komponente programa $(^NameDA) koje želite instalirati."
!endif

!ifdef MUI_UNCOMPONENTSPAGE
  ${LangFileString} MUI_UNTEXT_COMPONENTS_TITLE "Izbor komponenti za uklanjanje"
  ${LangFileString} MUI_UNTEXT_COMPONENTS_SUBTITLE "Izaberite komponente programa $(^NameDA) koje želite ukloniti."
!endif

!ifdef MUI_COMPONENTSPAGE | MUI_UNCOMPONENTSPAGE
  ${LangFileString} MUI_INNERTEXT_COMPONENTS_DESCRIPTION_TITLE "Opis"
  !ifndef NSIS_CONFIG_COMPONENTPAGE_ALTERNATIVE
    ${LangFileString} MUI_INNERTEXT_COMPONENTS_DESCRIPTION_INFO "Postavite kursor od miša iznad komponente da biste vidjeli njezin opis."
  !else
    ${LangFileString} MUI_INNERTEXT_COMPONENTS_DESCRIPTION_INFO "Selektirajte jednu komponentu da vidite njezin opis."
  !endif
!endif

!ifdef MUI_DIRECTORYPAGE
  ${LangFileString} MUI_TEXT_DIRECTORY_TITLE "Odaberite odredište za instalaciju"
  ${LangFileString} MUI_TEXT_DIRECTORY_SUBTITLE "Odaberite mapu u koju želite instalirati program $(^NameDA)."
!endif

!ifdef MUI_UNDIRECTORYPAGE
  ${LangFileString} MUI_UNTEXT_DIRECTORY_TITLE "Izaberite polazište za uklanjanje"
  ${LangFileString} MUI_UNTEXT_DIRECTORY_SUBTITLE "Selektirajte mapu iz koje želite ukloniti program $(^NameDA)."
!endif

!ifdef MUI_INSTFILESPAGE
  ${LangFileString} MUI_TEXT_INSTALLING_TITLE "Instaliranje"
  ${LangFileString} MUI_TEXT_INSTALLING_SUBTITLE "Molim pričekajte na završetak instalacije programa $(^NameDA)."
  ${LangFileString} MUI_TEXT_FINISH_TITLE "Kraj instalacije"
  ${LangFileString} MUI_TEXT_FINISH_SUBTITLE "Instalacija je u potpunosti uspješno završila."
  ${LangFileString} MUI_TEXT_ABORT_TITLE "Instalacija je prekinuta"
  ${LangFileString} MUI_TEXT_ABORT_SUBTITLE "Instalacija nije završila uspješno."
!endif

!ifdef MUI_UNINSTFILESPAGE
  ${LangFileString} MUI_UNTEXT_UNINSTALLING_TITLE "Uklanjanje"
  ${LangFileString} MUI_UNTEXT_UNINSTALLING_SUBTITLE "Molim Vas pričekajte da vodič završi uklanjanje $(^NameDA) programa."
  ${LangFileString} MUI_UNTEXT_FINISH_TITLE "Uklanjanje je završeno"
  ${LangFileString} MUI_UNTEXT_FINISH_SUBTITLE "Uklanjanje je u potpunosti završilo uspješno."
  ${LangFileString} MUI_UNTEXT_ABORT_TITLE "Uklanjanje je prekinuto"
  ${LangFileString} MUI_UNTEXT_ABORT_SUBTITLE "Uklanjanje nije završilo uspješno."
!endif

!ifdef MUI_FINISHPAGE
  ${LangFileString} MUI_TEXT_FINISH_INFO_TITLE "Dovršavanje instalacije programa $(^NameDA)"
  ${LangFileString} MUI_TEXT_FINISH_INFO_TEXT "Program $(^NameDA) je instaliran na Vaše računar.$\r$\n$\r$\nPritisnite dugme 'Kraj' za završetak."
  ${LangFileString} MUI_TEXT_FINISH_INFO_REBOOT "Računar treba ponovno startovati za dovršavanje instalacije programa $(^NameDA). Želite li to učiniti sada?"
!endif

!ifdef MUI_UNFINISHPAGE
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_TITLE "Završetak uklanjanja programa $(^NameDA) sa Vašeg sistema."
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_TEXT "Program $(^NameDA) je uklonjen sa Vašeg računara.$\r$\n$\r$\nPritisnite dugme 'Kraj' za zatvaranje ovog prozora."
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_REBOOT "Vaš računar trebate ponovno startovati da dovršite uklanjanje programa $(^NameDA). Želite li da odmah sad ponovo startujete računar?"
!endif

!ifdef MUI_FINISHPAGE | MUI_UNFINISHPAGE
  ${LangFileString} MUI_TEXT_FINISH_REBOOTNOW "Startuj računar odmah sad"
  ${LangFileString} MUI_TEXT_FINISH_REBOOTLATER "Ponovno ću pokrenuti računar kasnije"
  ${LangFileString} MUI_TEXT_FINISH_RUN "&Pokreni program $(^NameDA)"
  ${LangFileString} MUI_TEXT_FINISH_SHOWREADME "Prikaži datoteku &Readme"
  ${LangFileString} MUI_BUTTONTEXT_FINISH "&Kraj"  
!endif

!ifdef MUI_STARTMENUPAGE
  ${LangFileString} MUI_TEXT_STARTMENU_TITLE "Izbor mape u Start meniju"
  ${LangFileString} MUI_TEXT_STARTMENU_SUBTITLE "Izaberite ime za programsku mapu unutar Start menija."
  ${LangFileString} MUI_INNERTEXT_STARTMENU_TOP "Izaberite jednu mapu u Start meniju u kojoj želite da se kreiraju prečice programa. Možete također unijeti ime za novu mapu ili selektirati već postojeću."
  ${LangFileString} MUI_INNERTEXT_STARTMENU_CHECKBOX "Nemojte praviti prečice"
!endif

!ifdef MUI_UNCONFIRMPAGE
  ${LangFileString} MUI_UNTEXT_CONFIRM_TITLE "Uklanjanje programa $(^NameDA)"
  ${LangFileString} MUI_UNTEXT_CONFIRM_SUBTITLE "Program $(^NameDA) će biti uklonjen sa Vašeg računara."
!endif

!ifdef MUI_ABORTWARNING
  ${LangFileString} MUI_TEXT_ABORTWARNING "Jeste li sigurni da želite prekinuti instalaciju programa $(^Name)?"
!endif

!ifdef MUI_UNABORTWARNING
  ${LangFileString} MUI_UNTEXT_ABORTWARNING "Jeste li sigurni da želite prekinuti uklanjanje $(^Name) programa?"
!endif
