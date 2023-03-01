/*

NSIS Modern User Interface
Localization

*/

;--------------------------------
;Variables

!macro MUI_LANGDLL_VARIABLES

  !ifdef MUI_LANGDLL_REGISTRY_ROOT & MUI_LANGDLL_REGISTRY_KEY & MUI_LANGDLL_REGISTRY_VALUENAME
    !ifndef MUI_LANGDLL_REGISTRY_VARIABLES
      !define MUI_LANGDLL_REGISTRY_VARIABLES

      ;/GLOBAL because the macros are included in a function
      Var /GLOBAL mui.LangDLL.RegistryLanguage

    !endif
  !endif

!macroend


;--------------------------------
;Include langauge files

!macro MUI_LANGUAGEEX LangDir NLFID

  !verbose push ${MUI_VERBOSE}

  !ifndef MUI_PAGE_UNINSTALLER_PREFIX
    !ifndef MUI_DISABLE_INSERT_LANGUAGE_AFTER_PAGES_WARNING ; Define this to avoid the warning if you only have custom pages
      !warning "MUI_LANGUAGE[EX] should be inserted after the MUI_[UN]PAGE_* macros"
    !endif
  !endif

  !insertmacro MUI_INSERT

  ;Include a language
  LoadLanguageFile "${LangDir}\${NLFID}.nlf"

  ;Include MUI language file
  !insertmacro LANGFILE_INCLUDE_WITHDEFAULT \
    "${LangDir}\${NLFID}.nsh" "${NSISDIR}\Contrib\Language files\English.nsh"

  ;Add language to list of languages for selection dialog
  !define /ifndef MUI_LANGDLL_LANGUAGES ""
  !define /redef MUI_LANGDLL_LANGUAGES \
    `"${LANGFILE_${NLFID}_LANGDLL}" "${LANG_${NLFID}}" ${MUI_LANGDLL_LANGUAGES}`
  !define /ifndef MUI_LANGDLL_LANGUAGES_CP ""
  !define /redef MUI_LANGDLL_LANGUAGES_CP \
    `"${LANGFILE_${NLFID}_LANGDLL}" "${LANG_${NLFID}}" "${LANG_${NLFID}_CP}" ${MUI_LANGDLL_LANGUAGES_CP}`

  !verbose pop

!macroend

!macro MUI_LANGUAGE NLFID

  !verbose push ${MUI_VERBOSE}

  !insertmacro MUI_LANGUAGEEX "${NSISDIR}\Contrib\Language files" "${NLFID}"

  !verbose pop

!macroend


;--------------------------------
;Language selection

!macro MUI_LANGDLL_DISPLAY

  !verbose push
  !verbose ${MUI_VERBOSE}

  !ifndef MUI_LANGDLL_LANGUAGES
    !warning "MUI_LANGDLL_DISPLAY should only be used after inserting the MUI_LANGUAGE macro(s)"
  !endif

  !insertmacro MUI_LANGDLL_VARIABLES

  !insertmacro MUI_DEFAULT MUI_LANGDLL_WINDOWTITLE "Installer Language"
  !insertmacro MUI_DEFAULT MUI_LANGDLL_INFO "Please select a language."

  !ifdef MUI_LANGDLL_REGISTRY_VARIABLES

    ReadRegStr $mui.LangDLL.RegistryLanguage "${MUI_LANGDLL_REGISTRY_ROOT}" "${MUI_LANGDLL_REGISTRY_KEY}" "${MUI_LANGDLL_REGISTRY_VALUENAME}"
    
    ${if} $mui.LangDLL.RegistryLanguage != ""
      ;Set default langauge to registry language
      StrCpy $LANGUAGE $mui.LangDLL.RegistryLanguage
    ${endif}

  !endif

  !ifdef NSIS_CONFIG_SILENT_SUPPORT
    ${unless} ${Silent}
  !endif

  !ifndef MUI_LANGDLL_ALWAYSSHOW
  !ifdef MUI_LANGDLL_REGISTRY_VARIABLES
    ${if} $mui.LangDLL.RegistryLanguage == ""
  !endif
  !endif
  
  ;Show langauge selection dialog
  !ifdef MUI_LANGDLL_ALLLANGUAGES
    LangDLL::LangDialog "${MUI_LANGDLL_WINDOWTITLE}" "${MUI_LANGDLL_INFO}" A ${MUI_LANGDLL_LANGUAGES} ""
  !else
    LangDLL::LangDialog "${MUI_LANGDLL_WINDOWTITLE}" "${MUI_LANGDLL_INFO}" AC ${MUI_LANGDLL_LANGUAGES_CP} ""
  !endif
  
    Pop $LANGUAGE
    ${if} $LANGUAGE == "cancel"
      Abort
    ${endif}
  
  !ifndef MUI_LANGDLL_ALWAYSSHOW
  !ifdef MUI_LANGDLL_REGISTRY_VARIABLES
    ${endif}
  !endif
  !endif


  !ifdef NSIS_CONFIG_SILENT_SUPPORT
    ${endif}
  !endif

  !verbose pop

!macroend

!macro MUI_LANGDLL_SAVELANGUAGE

  ;Save language in registry

  !ifndef MUI_PAGE_UNINSTALLER

    IfAbort mui.langdllsavelanguage_abort

    !ifdef MUI_LANGDLL_REGISTRY_ROOT & MUI_LANGDLL_REGISTRY_KEY & MUI_LANGDLL_REGISTRY_VALUENAME
      WriteRegStr "${MUI_LANGDLL_REGISTRY_ROOT}" "${MUI_LANGDLL_REGISTRY_KEY}" "${MUI_LANGDLL_REGISTRY_VALUENAME}" $LANGUAGE
    !endif

    mui.langdllsavelanguage_abort:

  !endif

!macroend

!macro MUI_UNGETLANGUAGE

  ;Get language from registry in uninstaller

  !verbose push
  !verbose ${MUI_VERBOSE}

  !insertmacro MUI_LANGDLL_VARIABLES

  !ifdef MUI_LANGDLL_REGISTRY_ROOT & MUI_LANGDLL_REGISTRY_KEY & MUI_LANGDLL_REGISTRY_VALUENAME

    ReadRegStr $mui.LangDLL.RegistryLanguage "${MUI_LANGDLL_REGISTRY_ROOT}" "${MUI_LANGDLL_REGISTRY_KEY}" "${MUI_LANGDLL_REGISTRY_VALUENAME}"
    
    ${if} $mui.LangDLL.RegistryLanguage = ""

  !endif

  !insertmacro MUI_LANGDLL_DISPLAY

  !ifdef MUI_LANGDLL_REGISTRY_ROOT & MUI_LANGDLL_REGISTRY_KEY & MUI_LANGDLL_REGISTRY_VALUENAME

    ${else}
      StrCpy $LANGUAGE $mui.LangDLL.RegistryLanguage
    ${endif}

  !endif

  !verbose pop

!macroend


;--------------------------------
;Rerserve LangDLL file

!macro MUI_RESERVEFILE_LANGDLL

  !verbose push
  !verbose ${MUI_VERBOSE}

  ReserveFile /plugin LangDLL.dll

  !verbose pop

!macroend
