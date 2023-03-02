;Language: Mongolian (1104)
;By Bayarsaikhan Enkhtaivan

!insertmacro LANGFILE "Mongolian" "Mongolian (Cyrillic)" "Монгол Кирилл" "Mongol kirill"

!ifdef MUI_WELCOMEPAGE
  ${LangFileString} MUI_TEXT_WELCOME_INFO_TITLE "$(^NameDA) Суулгацад тавтай морил"
  ${LangFileString} MUI_TEXT_WELCOME_INFO_TEXT "$(^NameDA) суулгацын илбэчинг та шууд ашиглаж болно.$\r$\n$\r$\nҮүнийг суулгахын өмнө бусад бүх програмуудаа хаахыг зөвлөж байна. Системийн файлуудыг шинэчилбэл компьютерээ дахин ачаалахгүй байх боломжтой.$\r$\n$\r$\n$_CLICK"
!endif

!ifdef MUI_UNWELCOMEPAGE
  ${LangFileString} MUI_UNTEXT_WELCOME_INFO_TITLE "$(^NameDA) Суулгацыг устгах илбэчинд тавтай морил"
  ${LangFileString} MUI_UNTEXT_WELCOME_INFO_TEXT "$(^NameDA) устгацын илбэчинг та шууд ашиглаж болно.$\r$\n$\r$\nУстгахын өмнө $(^NameDA) нь ажиллаагүй эсэхийг шалга.$\r$\n$\r$\n$_CLICK"
!endif

!ifdef MUI_LICENSEPAGE
  ${LangFileString} MUI_TEXT_LICENSE_TITLE "Лицензийн зөвшөөрөл"
  ${LangFileString} MUI_TEXT_LICENSE_SUBTITLE "$(^NameDA)-ыг суулгахынхаа өмнө зөвшилцлийн зүйлүүдийг уншина уу."
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM "Хэрэв зөвшилцлийн зүйлсийг зөвшөөрч байвал, Зөвшөөрлөө товчийг даран үргэлжлүүлнэ үү. $(^NameDA)-ыг суулгахын тулд заавал зөвшөөрөх шаардлагатай."
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM_CHECKBOX "Хэрэв зөвшилцлийн зүйлсийг зөвшөөрч байвал, Зөвлөх хайрцгийг даран үргэлжлүүлнэ үү. $(^NameDA)-ыг суулгахын тулд заавал зөвшөөрөх шаардлагатай. $_CLICK"
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM_RADIOBUTTONS "Хэрэв зөвшилцлийн зүйлсийг зөвшөөрч байвал, доорхоос эхнийг нь сонгон үргэлжлүүлнэ үү. $(^NameDA)-ыг суулгахын тулд заавал зөвшөөрөх шаардлагатай. $_CLICK"
!endif

!ifdef MUI_UNLICENSEPAGE
  ${LangFileString} MUI_UNTEXT_LICENSE_TITLE "Лицензийн зөвшөөрөл"
  ${LangFileString} MUI_UNTEXT_LICENSE_SUBTITLE "$(^NameDA) устгахын өмнө зөвшилцлийн зүйлсийг уншина уу."
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM "Хэрэв зөвшилцлийн зүйлсийг зөвшөөрч байвал, Зөвшөөрлөө товчийг даран үргэлжлүүлнэ үү. $(^NameDA)-ыг устгахын тулд заавал зөвшөөрөх шаардлагатай."
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM_CHECKBOX "Хэрэв зөвшилцлийн зүйлсийг зөвшөөрч байвал, Зөвлөх хайрцгийг даран үргэлжлүүлнэ үү. $(^NameDA)-ыг устгахын тулд заавал зөвшөөрөх шаардлагатай. $_CLICK"
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM_RADIOBUTTONS "Хэрэв зөвшилцлийн зүйлсийг зөвшөөрч байвал, доорхоос эхнийг нь сонгон үргэлжлүүлнэ үү. $(^NameDA)-ыг устгахын тулд заавал зөвшөөрөх шаардлагатай. $_CLICK"
!endif

!ifdef MUI_LICENSEPAGE | MUI_UNLICENSEPAGE
  ${LangFileString} MUI_INNERTEXT_LICENSE_TOP "Page Down товчийг даран зөвшилцлийг доош гүйлгэнэ үү."
!endif

!ifdef MUI_COMPONENTSPAGE
  ${LangFileString} MUI_TEXT_COMPONENTS_TITLE "Нэгдлийг сонгох"
  ${LangFileString} MUI_TEXT_COMPONENTS_SUBTITLE "$(^NameDA)-ыг суулгахад шаардагдах хэсгийг сонгоно уу."
!endif

!ifdef MUI_UNCOMPONENTSPAGE
  ${LangFileString} MUI_UNTEXT_COMPONENTS_TITLE "Нэгдлийг сонгох"
  ${LangFileString} MUI_UNTEXT_COMPONENTS_SUBTITLE "$(^NameDA)-ын устгах шаардлагатай нэгдлийг сонгох."
!endif

!ifdef MUI_COMPONENTSPAGE | MUI_UNCOMPONENTSPAGE
  ${LangFileString} MUI_INNERTEXT_COMPONENTS_DESCRIPTION_TITLE "Тайлбар"
  !ifndef NSIS_CONFIG_COMPONENTPAGE_ALTERNATIVE
    ${LangFileString} MUI_INNERTEXT_COMPONENTS_DESCRIPTION_INFO "Та хулганаараа нэгдлийн дээр очиход түүний тайлбарыг харуулна."
  !else
    ${LangFileString} MUI_INNERTEXT_COMPONENTS_DESCRIPTION_INFO "Нэгдлийг сонговол түүний тайлбарыг харна."
  !endif
!endif

!ifdef MUI_DIRECTORYPAGE
  ${LangFileString} MUI_TEXT_DIRECTORY_TITLE "Суулгах байрлалыг сонгох"
  ${LangFileString} MUI_TEXT_DIRECTORY_SUBTITLE "$(^NameDA) суулгацын суулгах замыг сонго."
!endif

!ifdef MUI_UNDIRECTORYPAGE
  ${LangFileString} MUI_UNTEXT_DIRECTORY_TITLE "Устгацын байрлалыг сонгох"
  ${LangFileString} MUI_UNTEXT_DIRECTORY_SUBTITLE "$(^NameDA)-ыг устгах хавтсыг сонгох."
!endif

!ifdef MUI_INSTFILESPAGE
  ${LangFileString} MUI_TEXT_INSTALLING_TITLE "Суулгаж байна"
  ${LangFileString} MUI_TEXT_INSTALLING_SUBTITLE "$(^NameDA)-ыг суулгаж дуустал түр хүлээнэ үү."
  ${LangFileString} MUI_TEXT_FINISH_TITLE "Суулгаж дууслаа"
  ${LangFileString} MUI_TEXT_FINISH_SUBTITLE "Суулгац амжилттай болов."
  ${LangFileString} MUI_TEXT_ABORT_TITLE "Суулгалт таслагдлаа"
  ${LangFileString} MUI_TEXT_ABORT_SUBTITLE "Суулгалт амжилтгүй болов."
!endif

!ifdef MUI_UNINSTFILESPAGE
  ${LangFileString} MUI_UNTEXT_UNINSTALLING_TITLE "Устгаж байна"
  ${LangFileString} MUI_UNTEXT_UNINSTALLING_SUBTITLE "$(^NameDA) -ыг зайлуулж дуустал түр хүлээнэ үү."
  ${LangFileString} MUI_UNTEXT_FINISH_TITLE "Устгаж дууслаа"
  ${LangFileString} MUI_UNTEXT_FINISH_SUBTITLE "Устгалт амжилттай дууслаа."
  ${LangFileString} MUI_UNTEXT_ABORT_TITLE "Устгац таслагдлаа"
  ${LangFileString} MUI_UNTEXT_ABORT_SUBTITLE "Устгалт амжилтгүй боллоо."
!endif

!ifdef MUI_FINISHPAGE
  ${LangFileString} MUI_TEXT_FINISH_INFO_TITLE "$(^NameDA) Суулгацын илбэчин дууслаа"
  ${LangFileString} MUI_TEXT_FINISH_INFO_TEXT "$(^NameDA) нь таны компьютерт суулаа.$\r$\n$\r$\nТөгсгөл дээр дарвал хаана."
  ${LangFileString} MUI_TEXT_FINISH_INFO_REBOOT "$(^NameDA)-ын суулгацын дараалалд та компьютерээ дахин ачаалснаар дуусна. Та дахин ачаалахыг хүсэж байна уу?"
!endif

!ifdef MUI_UNFINISHPAGE
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_TITLE "$(^NameDA) Устгацын илбэчин дууслаа"
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_TEXT "$(^NameDA) нь таны компьютерээс зайлуулагдлаа.$\r$\n$\r$\nТөгсгөл дээр дарвал хаана."
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_REBOOT "$(^NameDA) Устгацын дараалалд та компьютерээ дахин ачаалснаар дуусна. Та д.ачаалмаар байна уу?"
!endif

!ifdef MUI_FINISHPAGE | MUI_UNFINISHPAGE
  ${LangFileString} MUI_TEXT_FINISH_REBOOTNOW "Д.Ачаал"
  ${LangFileString} MUI_TEXT_FINISH_REBOOTLATER "Би дараа д.ачаалахыг хүсэж байна."
  ${LangFileString} MUI_TEXT_FINISH_RUN "$(^NameDA) ажиллуулах"
  ${LangFileString} MUI_TEXT_FINISH_SHOWREADME "&Readme харуулах"
  ${LangFileString} MUI_BUTTONTEXT_FINISH "&Төгсгөл"  
!endif

!ifdef MUI_STARTMENUPAGE
  ${LangFileString} MUI_TEXT_STARTMENU_TITLE "Start цэсний хавтсыг сонго"
  ${LangFileString} MUI_TEXT_STARTMENU_SUBTITLE "Start цэс дэх $(^NameDA) shortcut-ын хавтсыг сонго."
  ${LangFileString} MUI_INNERTEXT_STARTMENU_TOP "Start цэсэнд програмын shortcut үүсгэх хавтсыг сонго. Эсвэл та шинэ нэрээр үүсгэж болно."
  ${LangFileString} MUI_INNERTEXT_STARTMENU_CHECKBOX "Shortcut үүсгэхгүй"
!endif

!ifdef MUI_UNCONFIRMPAGE
  ${LangFileString} MUI_UNTEXT_CONFIRM_TITLE "$(^NameDA)--ын Устгац"
  ${LangFileString} MUI_UNTEXT_CONFIRM_SUBTITLE "$(^NameDA) -ыг таны компьютерээс зайлуулах."
!endif

!ifdef MUI_ABORTWARNING
  ${LangFileString} MUI_TEXT_ABORTWARNING "$(^Name) -ын суулгацаас гармаар байна уу?"
!endif

!ifdef MUI_UNABORTWARNING
  ${LangFileString} MUI_UNTEXT_ABORTWARNING "$(^Name) Устгацаас гармаар байна уу?"
!endif

!ifdef MULTIUSER_INSTALLMODEPAGE
  ${LangFileString} MULTIUSER_TEXT_INSTALLMODE_TITLE "Хэрэглэгч сонгох"
  ${LangFileString} MULTIUSER_TEXT_INSTALLMODE_SUBTITLE "$(^NameDA)-ыг аль хэрэглэгчид зориулж суулгах вэ."
  ${LangFileString} MULTIUSER_INNERTEXT_INSTALLMODE_TOP "$(^NameDA)-ыг зөвхөн өөртөө эсвэл энэ компьютер дээрх бүх хэрэглэгчдэд зориулж суулгахыг сонго. $(^ClickNext)"
  ${LangFileString} MULTIUSER_INNERTEXT_INSTALLMODE_ALLUSERS "Энэ компьютер дээрх бүх хэрэглэчдэд суулгах"
  ${LangFileString} MULTIUSER_INNERTEXT_INSTALLMODE_CURRENTUSER "Зөвхөн өөртөө суулгах"
!endif
