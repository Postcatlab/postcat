;Language: Albanian (1052)
;Translation Besnik Bleta, besnik@programeshqip.org

!insertmacro LANGFILE "Albanian" = "Shqip" =

!ifdef MUI_WELCOMEPAGE
  ${LangFileString} MUI_TEXT_WELCOME_INFO_TITLE "Mirë se vini te Rregullimi i $(^NameDA)"
  ${LangFileString} MUI_TEXT_WELCOME_INFO_TEXT "Ky do t’ju udhëheqë gjatë instalimit të $(^NameDA).$\r$\n$\r$\nKëshillohet që të mbyllni tërë aplikacionet e tjera, para se të nisni Rregullimin. Kjo bën të mundur përditësimin e kartelave të rëndësishme të sistemit pa u dashur të riniset kompjuteri juaj.$\r$\n$\r$\n$_CLICK"
!endif

!ifdef MUI_UNWELCOMEPAGE
  ${LangFileString} MUI_UNTEXT_WELCOME_INFO_TITLE "Mirë se vini te Çinstalimi i $(^NameDA)"
  ${LangFileString} MUI_UNTEXT_WELCOME_INFO_TEXT "Ky do t’ju udhëheqë gjatë çinstalimit të $(^NameDA).$\r$\n$\r$\nPara nisjes së çinstalimit, sigurohuni se $(^NameDA) s’është duke xhiruar.$\r$\n$\r$\n$_CLICK"
!endif

!ifdef MUI_LICENSEPAGE
  ${LangFileString} MUI_TEXT_LICENSE_TITLE "Marrëveshje Licence"
  ${LangFileString} MUI_TEXT_LICENSE_SUBTITLE "Ju lutemi, para se të instaloni $(^NameDA), shqyrtoni kushtet e licencës."
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM "Nëse i pranoni kushtet e marrëveshjes, klikoni Pajtohem, që të vazhdohet. Që të instalohet $(^NameDA), duhet të pranoni marrëveshjen."
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM_CHECKBOX "Nëse pranoni kushtet e marrëveshjes, klikoni kutizën më poshtë. Që të instalohet $(^NameDA), duhet të pranoni marrëveshjen. $_CLICK"
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM_RADIOBUTTONS "Nëse pranoni kushtet e marrëveshjes, përzgjidhni më poshtë mundësinë e parë. Që të instalohet $(^NameDA), duhet të pranoni marrëveshjen. $_CLICK"
!endif

!ifdef MUI_UNLICENSEPAGE
  ${LangFileString} MUI_UNTEXT_LICENSE_TITLE "Marrëveshje Licence"
  ${LangFileString} MUI_UNTEXT_LICENSE_SUBTITLE "Ju lutemi, para çinstalimit të $(^NameDA), shqyrtoni kushtet e licencës."
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM "Nëse i pranoni kushtet e marrëveshjes, klikoni Pajtohem, që të vazhdohet. Që të çinstalohet $(^NameDA), duhet të pranoni marrëveshjen."
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM_CHECKBOX "Nëse pranoni kushtet e marrëveshjes, klikoni kutizën më poshtë. Që të çinstalohet $(^NameDA), duhet të pranoni marrëveshjen. $_CLICK"
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM_RADIOBUTTONS "Nëse pranoni kushtet e marrëveshjes, përzgjidhni mundësinë e parë më poshtë. Që të çinstalohet $(^NameDA), duhet të pranoni marrëveshjen. $_CLICK"
!endif

!ifdef MUI_LICENSEPAGE | MUI_UNLICENSEPAGE
  ${LangFileString} MUI_INNERTEXT_LICENSE_TOP "Për të parë pjesën e mbetur të marrëveshjes, shtypni tastin Page Down."
!endif

!ifdef MUI_COMPONENTSPAGE
  ${LangFileString} MUI_TEXT_COMPONENTS_TITLE "Përzgjidhni Përbërës"
  ${LangFileString} MUI_TEXT_COMPONENTS_SUBTITLE "Zgjidhni cilat anë të $(^NameDA) doni të instalohen."
!endif

!ifdef MUI_UNCOMPONENTSPAGE
  ${LangFileString} MUI_UNTEXT_COMPONENTS_TITLE "Zgjidhni Përbërës"
  ${LangFileString} MUI_UNTEXT_COMPONENTS_SUBTITLE "Zgjidhni cilat anë të $(^NameDA) doni të çinstalohen."
!endif

!ifdef MUI_COMPONENTSPAGE | MUI_UNCOMPONENTSPAGE
  ${LangFileString} MUI_INNERTEXT_COMPONENTS_DESCRIPTION_TITLE "Përshkrim"
  !ifndef NSIS_CONFIG_COMPONENTPAGE_ALTERNATIVE
    ${LangFileString} MUI_INNERTEXT_COMPONENTS_DESCRIPTION_INFO "Për të parë përshkrimin e një përbërësi, vendosni kursorin përsipër tij."
  !else
    #FIXME:MUI_INNERTEXT_COMPONENTS_DESCRIPTION_INFO
  !endif
!endif

!ifdef MUI_DIRECTORYPAGE
  ${LangFileString} MUI_TEXT_DIRECTORY_TITLE "Zgjidhni Vend Instalimi"
  ${LangFileString} MUI_TEXT_DIRECTORY_SUBTITLE "Zgjidhni dosjen tek e cila të instalohet $(^NameDA)."
!endif

!ifdef MUI_UNDIRECTORYPAGE
  ${LangFileString} MUI_UNTEXT_DIRECTORY_TITLE "Zgjidhni Vend Çinstalimi"
  ${LangFileString} MUI_UNTEXT_DIRECTORY_SUBTITLE "Zgjidhni dosjen prej së cilës të çinstalohet $(^NameDA)."
!endif

!ifdef MUI_INSTFILESPAGE
  ${LangFileString} MUI_TEXT_INSTALLING_TITLE "Po instalohet"
  ${LangFileString} MUI_TEXT_INSTALLING_SUBTITLE "Ju lutemi, prisni, ndërkohë që $(^NameDA) instalohet."
  ${LangFileString} MUI_TEXT_FINISH_TITLE "Instalim i Plotësuar"
  ${LangFileString} MUI_TEXT_FINISH_SUBTITLE "Rregullimi u plotësua me sukses."
  ${LangFileString} MUI_TEXT_ABORT_TITLE "Instalimi u Ndërpre"
  ${LangFileString} MUI_TEXT_ABORT_SUBTITLE "Rregullimi s’u plotësua me sukses."
!endif

!ifdef MUI_UNINSTFILESPAGE
  ${LangFileString} MUI_UNTEXT_UNINSTALLING_TITLE "Çinstalim"
  ${LangFileString} MUI_UNTEXT_UNINSTALLING_SUBTITLE "Ju lutemi, prisni, ndërsa $(^NameDA) çinstalohet."
  ${LangFileString} MUI_UNTEXT_FINISH_TITLE "Çinstalim i Plotë"
  ${LangFileString} MUI_UNTEXT_FINISH_SUBTITLE "Çinstalimi u plotësua me sukses."
  ${LangFileString} MUI_UNTEXT_ABORT_TITLE "Çinstalimi u Ndërpre"
  ${LangFileString} MUI_UNTEXT_ABORT_SUBTITLE "Çinstalimi s’u plotësua me sukses."
!endif

!ifdef MUI_FINISHPAGE
  ${LangFileString} MUI_TEXT_FINISH_INFO_TITLE "Po plotësohet Rregullimi i $(^NameDA)"
  ${LangFileString} MUI_TEXT_FINISH_INFO_TEXT "$(^NameDA) u instalua në kompjuterin tuaj.$\r$\n$\r$\nPër mbylljen e procesit, klikoni Përfundoje."
  ${LangFileString} MUI_TEXT_FINISH_INFO_REBOOT "Që të mund të plotësohet instalimi i $(^NameDA), kompjuteri juaj duhet të riniset. Doni të riniset tani?"
!endif

!ifdef MUI_UNFINISHPAGE
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_TITLE "Po plotësohet Çinstalimi i $(^NameDA)"
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_TEXT "$(^NameDA) u çinstalua prej kompjuterit tuaj.$\r$\n$\r$\nPër mbylljen e procesit, klikoni Përfundoje."
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_REBOOT "Kompjuteri juaj duhet të riniset, që të mund të plotësohet çinstalimi i $(^NameDA). Doni të riniset tani?"
!endif

!ifdef MUI_FINISHPAGE | MUI_UNFINISHPAGE
  ${LangFileString} MUI_TEXT_FINISH_REBOOTNOW "Rinise tani"
  ${LangFileString} MUI_TEXT_FINISH_REBOOTLATER "Dua ta rinis dorazi më vonë"
  ${LangFileString} MUI_TEXT_FINISH_RUN "&Nis $(^NameDA)"
  ${LangFileString} MUI_TEXT_FINISH_SHOWREADME "&Shfaq Readme"
  ${LangFileString} MUI_BUTTONTEXT_FINISH "&Përfundoje"  
!endif

!ifdef MUI_STARTMENUPAGE
  ${LangFileString} MUI_TEXT_STARTMENU_TITLE "Zgjidhni Dosje Menuje Start"
  ${LangFileString} MUI_TEXT_STARTMENU_SUBTITLE "Zgjidhni një dosje Menuje Start për shkurtore $(^NameDA)."
  ${LangFileString} MUI_INNERTEXT_STARTMENU_TOP "Përzgjidhni dosjen e Menusë Start në të cilën do të donit të krijohen shkurtoret për programin. Mundeni edhe të jepni një emër për të krijuar një dosje të re."
  ${LangFileString} MUI_INNERTEXT_STARTMENU_CHECKBOX "Mos krijo shkurtore"
!endif

!ifdef MUI_UNCONFIRMPAGE
  ${LangFileString} MUI_UNTEXT_CONFIRM_TITLE "Çinstalo $(^NameDA)"
  ${LangFileString} MUI_UNTEXT_CONFIRM_SUBTITLE "Hiqeni $(^NameDA) prej kompjuterit tuaj."
!endif

!ifdef MUI_ABORTWARNING
  ${LangFileString} MUI_TEXT_ABORTWARNING "Jeni i sigurt se doni të dilet nga Rregullimi i $(^Name)?"
!endif

!ifdef MUI_UNABORTWARNING
  ${LangFileString} MUI_UNTEXT_ABORTWARNING "Jeni i sigurt se doni të dilet nga Çinstalimi i $(^Name)?"
!endif

!ifdef MULTIUSER_INSTALLMODEPAGE
  ${LangFileString} MULTIUSER_TEXT_INSTALLMODE_TITLE "Zgjidhni Përdorues"
  ${LangFileString} MULTIUSER_TEXT_INSTALLMODE_SUBTITLE "Zgjidhni për cilët përdorues doni të instalohet $(^NameDA)."
  ${LangFileString} MULTIUSER_INNERTEXT_INSTALLMODE_TOP "Përzgjidhni nëse doni të instalohet $(^NameDA) vetëm për veten tuaj apo për tërë përdoruesit e këtij kompjuteri. $(^ClickNext)"
  ${LangFileString} MULTIUSER_INNERTEXT_INSTALLMODE_ALLUSERS "Instaloje për këdo në këtë kompjuter"
  ${LangFileString} MULTIUSER_INNERTEXT_INSTALLMODE_CURRENTUSER "Instaloje vetëm për mua"
!endif
