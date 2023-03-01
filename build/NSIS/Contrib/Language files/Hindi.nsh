;Language: Hindī (Devanagari script) (1081)
;By Ryan Pretorius

!insertmacro LANGFILE "Hindi" = "हिन्दी" "Hindi"

!ifdef MUI_WELCOMEPAGE
  ${LangFileString} MUI_TEXT_WELCOME_INFO_TITLE "$(^NameDA) सेटअप में आपका स्वागत है"
  ${LangFileString} MUI_TEXT_WELCOME_INFO_TEXT "सेटअप $(^NameDA) के इंस्टालेशन के दौरान आपका मार्गदर्शन करेगा।$\r$\n$\r$\nयह सिफारिश की जाती है कि सेटअप शुरू करने से पहले आप अन्य सभी अनुप्रयोग बंद कर दें। इससे आपके कंप्यूटर को रीबूट किए बिना प्रासंगिक सिस्टम फ़ाइलों को अपडेट करना संभव हो जाएगा।$\r$\n$\r$\n$_CLICK"
!endif

!ifdef MUI_UNWELCOMEPAGE
  ${LangFileString} MUI_UNTEXT_WELCOME_INFO_TITLE "$(^NameDA) के अनइंस्टालेशन में आपका स्वागत है"
  ${LangFileString} MUI_UNTEXT_WELCOME_INFO_TEXT "सेटअप $(^NameDA) के अनइंस्टालेशन के दौरान आपका मार्गदर्शन करेगा।$\r$\n$\r$\nअनइंस्टालेशन शुरू करने से पहले सुनिश्चित करें कि $(^NameDA) चल न रहा हो।$\r$\n$\r$\n$_CLICK"
!endif

!ifdef MUI_LICENSEPAGE
  ${LangFileString} MUI_TEXT_LICENSE_TITLE "लाइसेंस समझौता"
  ${LangFileString} MUI_TEXT_LICENSE_SUBTITLE "$(^NameDA) इनस्टॉल करने से पहले लाइसेंस शर्तों की समीक्षा करें।"
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM "यदि आप समझौते की शर्ते स्वीकार करते हैं तो जारी रखने के लिए मैं सहमत हूँ पर क्लिक करें। आपको $(^NameDA) इनस्टॉल करने के लिए समझौते को स्वीकार करना होगा।"
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM_CHECKBOX "यदि आप समझौते की शर्ते स्वीकार करते हैं तो नीचे दिए गए चेक बॉक्स पर क्लिक करें। आपको $(^NameDA) इनस्टॉल करने के लिए समझौते को स्वीकार करना होगा। $_CLICK"
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM_RADIOBUTTONS "यदि आप समझौते की शर्ते स्वीकार करते हैं तो नीचे दिए गए पहले विकल्प का चयन करें। आपको $(^NameDA) इनस्टॉल करने के लिए समझौते को स्वीकार करना होगा। $_CLICK"
!endif

!ifdef MUI_UNLICENSEPAGE
  ${LangFileString} MUI_UNTEXT_LICENSE_TITLE "लाइसेंस समझौता"
  ${LangFileString} MUI_UNTEXT_LICENSE_SUBTITLE "$(^NameDA) अनइनस्टॉल करने से पहले लाइसेंस शर्तों की समीक्षा करें।"
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM "यदि आप समझौते की शर्ते स्वीकार करते हैं तो जारी रखने के लिए मैं सहमत हूँ पर क्लिक करें। आपको $(^NameDA) अनइनस्टॉल करने के लिए समझौते को स्वीकार करना होगा।"
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM_CHECKBOX "यदि आप समझौते की शर्ते स्वीकार करते हैं तो नीचे दिए गए चेक बॉक्स पर क्लिक करें। आपको $(^NameDA) अनइनस्टॉल करने के लिए समझौते को स्वीकार करना होगा। $_CLICK"
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM_RADIOBUTTONS "यदि आप समझौते की शर्ते स्वीकार करते हैं तो नीचे दिए गए पहले विकल्प का चयन करें। आपको $(^NameDA) अनइनस्टॉल करने के लिए समझौते को स्वीकार करना होगा। $_CLICK"
!endif

!ifdef MUI_LICENSEPAGE | MUI_UNLICENSEPAGE
  ${LangFileString} MUI_INNERTEXT_LICENSE_TOP "शेष समझौता देखने के लिए पेज नीचे करें को दबाएं।"
!endif

!ifdef MUI_COMPONENTSPAGE
  ${LangFileString} MUI_TEXT_COMPONENTS_TITLE "घटक चुनें"
  ${LangFileString} MUI_TEXT_COMPONENTS_SUBTITLE "$(^NameDA) की वे विशेषताएं चुनें जो आप इनस्टॉल करना चाहते हैं।"
!endif

!ifdef MUI_UNCOMPONENTSPAGE
  ${LangFileString} MUI_UNTEXT_COMPONENTS_TITLE "घटक चुनें"
  ${LangFileString} MUI_UNTEXT_COMPONENTS_SUBTITLE "$(^NameDA) की वे विशेषताएं चुनें जो आप अनइनस्टॉल करना चाहते हैं।"
!endif

!ifdef MUI_COMPONENTSPAGE | MUI_UNCOMPONENTSPAGE
  ${LangFileString} MUI_INNERTEXT_COMPONENTS_DESCRIPTION_TITLE "विवरण"
  !ifndef NSIS_CONFIG_COMPONENTPAGE_ALTERNATIVE
    ${LangFileString} MUI_INNERTEXT_COMPONENTS_DESCRIPTION_INFO "उस घटक पर अपना माउस रखें जिसका आप विवरण देखना चाहते हैं।"
  !else
    ${LangFileString} MUI_INNERTEXT_COMPONENTS_DESCRIPTION_INFO "उस घटक का चयन करें जिसका आप विवरण देखना चाहते हैं।"
  !endif
!endif

!ifdef MUI_DIRECTORYPAGE
  ${LangFileString} MUI_TEXT_DIRECTORY_TITLE "इनस्टॉल करने का स्थान चुनें"
  ${LangFileString} MUI_TEXT_DIRECTORY_SUBTITLE "वह फोल्डर चुनें जिसमें $(^NameDA) को इनस्टॉल करना है।"
!endif

!ifdef MUI_UNDIRECTORYPAGE
  ${LangFileString} MUI_UNTEXT_DIRECTORY_TITLE "अनइनस्टॉल करने का स्थान चुनें"
  ${LangFileString} MUI_UNTEXT_DIRECTORY_SUBTITLE "वह फोल्डर चुनें जिससे $(^NameDA) को इनस्टॉल करना है।"
!endif

!ifdef MUI_INSTFILESPAGE
  ${LangFileString} MUI_TEXT_INSTALLING_TITLE "इनस्टॉल कर रहे हैं"
  ${LangFileString} MUI_TEXT_INSTALLING_SUBTITLE "$(^NameDA) इनस्टॉल होने तक प्रतीक्षा करें।"
  ${LangFileString} MUI_TEXT_FINISH_TITLE "इंस्टालेशन सम्पन्न"
  ${LangFileString} MUI_TEXT_FINISH_SUBTITLE "सेटअप सफलतापूर्वक पूर्ण हुआ।"
  ${LangFileString} MUI_TEXT_ABORT_TITLE "इंस्टालेशन निरस्त किया गया"
  ${LangFileString} MUI_TEXT_ABORT_SUBTITLE "सेटअप सफलतापूर्वक पूर्ण नहीं हुआ।"
!endif

!ifdef MUI_UNINSTFILESPAGE
  ${LangFileString} MUI_UNTEXT_UNINSTALLING_TITLE "अनइनस्टॉल कर रहे हैं"
  ${LangFileString} MUI_UNTEXT_UNINSTALLING_SUBTITLE "$(^NameDA) अनइनस्टॉल होने तक प्रतीक्षा करें।"
  ${LangFileString} MUI_UNTEXT_FINISH_TITLE "अनइंस्टालेशन सम्पन्न"
  ${LangFileString} MUI_UNTEXT_FINISH_SUBTITLE "अनइंस्टालेशन सफलतापूर्वक पूर्ण हुआ।"
  ${LangFileString} MUI_UNTEXT_ABORT_TITLE "अनइंस्टालेशन निरस्त किया गया"
  ${LangFileString} MUI_UNTEXT_ABORT_SUBTITLE "अनइंस्टालेशन सफलतापूर्वक पूर्ण नहीं हुआ।"
!endif

!ifdef MUI_FINISHPAGE
  ${LangFileString} MUI_TEXT_FINISH_INFO_TITLE "$(^NameDA) का सेटअप पूरा कर रहे हैं"
  ${LangFileString} MUI_TEXT_FINISH_INFO_TEXT "आपके कंप्यूटर पर $(^NameDA) को इनस्टॉल कर दिया गया है।$\r$\n$\r$\nसेटअप बंद करने के लिए समाप्त करें पर क्लिक करें।"
  ${LangFileString} MUI_TEXT_FINISH_INFO_REBOOT "$(^NameDA) के इंस्टालेशन को पूरा करने के लिए आपके कंप्यूटर को फिर से शुरू करना होगा। क्या आप अभी रीबूट करना चाहते हैं?"
!endif

!ifdef MUI_UNFINISHPAGE
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_TITLE "$(^NameDA) का अनइंस्टालेशन पूरा कर रहे हैं"
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_TEXT "आपके कंप्यूटर पर $(^NameDA) को अनइनस्टॉल कर दिया गया है।$\r$\n$\r$\nसेटअप बंद करने के लिए समाप्त करें पर क्लिक करें।"
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_REBOOT "$(^NameDA) के अनइंस्टालेशन को पूरा करने के लिए आपके कंप्यूटर को फिर से शुरू करना होगा। क्या आप अभी रीबूट करना चाहते हैं?"
!endif

!ifdef MUI_FINISHPAGE | MUI_UNFINISHPAGE
  ${LangFileString} MUI_TEXT_FINISH_REBOOTNOW "अभी रीबूट करें"
  ${LangFileString} MUI_TEXT_FINISH_REBOOTLATER "मैं बाद में मैन्युअली रीबूट करना चाहता हूँ"
  ${LangFileString} MUI_TEXT_FINISH_RUN "$(^NameDA) &चलाएं"
  ${LangFileString} MUI_TEXT_FINISH_SHOWREADME "रीडमी &दिखाएं"
  ${LangFileString} MUI_BUTTONTEXT_FINISH "&समाप्त करें"
!endif

!ifdef MUI_STARTMENUPAGE
  ${LangFileString} MUI_TEXT_STARTMENU_TITLE "स्टार्ट मेनू फोल्डर चुनें"
  ${LangFileString} MUI_TEXT_STARTMENU_SUBTITLE "$(^NameDA) के शॉर्टकट के लिए स्टार्ट मेनू फोल्डर चुनें।"
  ${LangFileString} MUI_INNERTEXT_STARTMENU_TOP "उस स्टार्ट मेनू फोल्डर का चयन करें जिसमें आप प्रोग्राम के शॉर्टकट बनाना चाहते हैं। आप नया फोल्डर बनाने के लिए नाम भी प्रविष्ट कर सकते हैं।"
  ${LangFileString} MUI_INNERTEXT_STARTMENU_CHECKBOX "शॉर्टकट न बनाएं"
!endif

!ifdef MUI_UNCONFIRMPAGE
  ${LangFileString} MUI_UNTEXT_CONFIRM_TITLE "$(^NameDA) अनइनस्टॉल करें"
  ${LangFileString} MUI_UNTEXT_CONFIRM_SUBTITLE "अपने कंप्यूटर से $(^NameDA) निकालें।"
!endif

!ifdef MUI_ABORTWARNING
  ${LangFileString} MUI_TEXT_ABORTWARNING "क्या आप वाकई $(^Name) का सेटअप छोड़ना चाहते हैं?"
!endif

!ifdef MUI_UNABORTWARNING
  ${LangFileString} MUI_UNTEXT_ABORTWARNING "क्या आप वाकई $(^Name) को अनइनस्टॉल करना छोड़ना चाहते हैं?"
!endif

!ifdef MULTIUSER_INSTALLMODEPAGE
  ${LangFileString} MULTIUSER_TEXT_INSTALLMODE_TITLE "उपयोगकर्ता चुनें"
  ${LangFileString} MULTIUSER_TEXT_INSTALLMODE_SUBTITLE "वे उपयोगकर्ता चुनें जिनके लिए आप $(^NameDA) इनस्टॉल करना चाहते हैं।"
  ${LangFileString} MULTIUSER_INNERTEXT_INSTALLMODE_TOP "चयन करें कि क्या आप $(^NameDA) को केवल अपने लिए इनस्टॉल करना चाहते हैं या इस कंप्यूटर के सभी उपयोगकर्ताओं के लिए। $(^ClickNext)"
  ${LangFileString} MULTIUSER_INNERTEXT_INSTALLMODE_ALLUSERS "इस कंप्यूटर का उपयोग करने वाले किसी भी व्यक्ति के लिए इनस्टॉल करें"
  ${LangFileString} MULTIUSER_INNERTEXT_INSTALLMODE_CURRENTUSER "केवल मेरे लिए इनस्टॉल करें"
!endif
