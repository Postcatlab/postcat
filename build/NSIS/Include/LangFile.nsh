/*

LangFile.nsh

Header file to create language files that can be
included with a single command.

Copyright 2008-2021 Joost Verburg, Anders Kjersem

* Either LANGFILE_INCLUDE or LANGFILE_INCLUDE_WITHDEFAULT
  can be called from the script to include a language file.

  - LANGFILE_INCLUDE takes the language file name as parameter.
  - LANGFILE_INCLUDE_WITHDEFAULT takes as additional second
    parameter, the default language file to load missing strings from.

* Language strings in the language file have the format:
  ${LangFileString} LANGSTRING_NAME "Text"

* There are two types of language header files:

  - NSIS multi-lang support; these must start with the LANGFILE macro and 
    provide strings for features like MUI and MultiUser. If you are adding 
    support for a new language to NSIS you should make a copy of English.nsh 
    and translate this .nsh along with the .nlf.
  - Custom installer strings; these must start with the LANGFILE_EXT macro and 
    contain translated versions of 
    custom strings used in a particular installer.
    This is useful if you want to put the translations for each language in 
    their own separate file.

* Example:

  ; Setup.nsi
  !include "MUI.nsh"
  !insertmacro MUI_PAGE_INSTFILES
  !insertmacro MUI_LANGUAGE "Danish"
  !insertmacro LANGFILE_INCLUDE "DanishExtra.nsh"
  !insertmacro MUI_LANGUAGE "Swedish"
  !insertmacro LANGFILE_INCLUDE "SwedishExtra.nsh"
  Section
  MessageBox MB_OK "$(myCustomString)"
  SectionEnd

  ; SwedishExtra.nsh
  !insertmacro LANGFILE_EXT Swedish
  ${LangFileString} myCustomString "Bork bork"

*/

!ifndef LANGFILE_INCLUDED
!define LANGFILE_INCLUDED

!macro LANGFILE_INCLUDE FILENAME

  ;Called from script: include a language file

  !ifdef LangFileString
    !undef LangFileString
  !endif

  !define LangFileString "!insertmacro LANGFILE_SETSTRING"

  !define LANGFILE_SETNAMES
  !include "${FILENAME}"
  !undef LANGFILE_SETNAMES

  ;Create language strings
  !define /redef LangFileString "!insertmacro LANGFILE_LANGSTRING"
  !include "${FILENAME}"

!macroend

!macro LANGFILE_INCLUDE_WITHDEFAULT FILENAME FILENAME_DEFAULT

  ;Called from script: include a language file
  ;Obtains missing strings from a default file

  !ifdef LangFileString
    !undef LangFileString
  !endif

  !define LangFileString "!insertmacro LANGFILE_SETSTRING"

  !define LANGFILE_SETNAMES
  !include "${FILENAME}"
  !undef LANGFILE_SETNAMES

  ;Include default language for missing strings
  !define LANGFILE_PRIV_INCLUDEISFALLBACK "${FILENAME_DEFAULT}"
  !include "${FILENAME_DEFAULT}"
  !undef LANGFILE_PRIV_INCLUDEISFALLBACK

  ;Create language strings
  !define /redef LangFileString "!insertmacro LANGFILE_LANGSTRING"
  !include "${FILENAME_DEFAULT}"

!macroend

!macro LANGFILE NLFID ENGNAME NATIVENAME NATIVEASCIINAME

  ;Start of standard NSIS language file

  ; NLFID: Must match the name of the .nlf file
  ; ENGNAME: English name of language, "=" if it is the same as NLFID
  ; NATIVENAME: Native name of language. (In Unicode)
  ; NATIVEASCIINAME: Native name of language using only ASCII, "=" if it is the same as NATIVENAME

  ; Example: LANGFILE "Swedish" = "Svenska" = (This is the same as LANGFILE "Swedish" "Swedish" "Svenska" "Svenska")
  ; For more examples, see French.nsh, Greek.nsh and PortugueseBR.nsh

  !ifdef LANGFILE_SETNAMES

    !ifdef LANGFILE_IDNAME
      !undef LANGFILE_IDNAME
    !endif

    !define LANGFILE_IDNAME "${NLFID}"

    ; ModernUI or the .nsi can change LANGFILE_LANGDLL_FMT if desired
    !ifndef LANGFILE_LANGDLL_FMT
      !ifndef NSIS_UNICODE
        !define LANGFILE_LANGDLL_FMT "%ENGNAME% / %NATIVEASCIINAME%"
      !endif
      !define /ifndef LANGFILE_LANGDLL_FMT "%NATIVENAME%"
    !endif

    !ifndef "LANGFILE_${NLFID}_NAME"
      !if "${ENGNAME}" == "="
        !define /redef ENGNAME "${NLFID}"
      !endif
      !if "${NATIVEASCIINAME}" == "="
        !define /redef NATIVEASCIINAME "${NATIVENAME}"
      !endif

      !define "LANGFILE_${NLFID}_ENGLISHNAME" "${ENGNAME}"
      !ifdef NSIS_UNICODE
        !define "LANGFILE_${NLFID}_NAME" "${NATIVENAME}"
      !else
        !define "LANGFILE_${NLFID}_NAME" "${NATIVEASCIINAME}"
      !endif

      !searchreplace LANGFILE_${NLFID}_LANGDLL "${LANGFILE_LANGDLL_FMT}" %NATIVEASCIINAME% "${NATIVEASCIINAME}"
      !searchreplace LANGFILE_${NLFID}_LANGDLL "${LANGFILE_${NLFID}_LANGDLL}" %NATIVENAME% "${NATIVENAME}"
      !searchreplace LANGFILE_${NLFID}_LANGDLL "${LANGFILE_${NLFID}_LANGDLL}" %ENGNAME% "${ENGNAME}"

    !endif

  !endif

!macroend

!macro LANGFILE_EXT IDNAME

  ;Start of installer language file
  
  !ifdef LANGFILE_SETNAMES

    !ifdef LANGFILE_IDNAME
      !undef LANGFILE_IDNAME
    !endif

    !define LANGFILE_IDNAME "${IDNAME}"

  !endif

!macroend

!macro LANGFILE_SETSTRING NAME VALUE

  ;Set define with translated string

  !ifndef ${NAME}
    !define "${NAME}" "${VALUE}"
    !ifdef LANGFILE_PRIV_INCLUDEISFALLBACK
      !warning 'LangString "${NAME}" for language ${LANGFILE_IDNAME} is missing, using fallback from "${LANGFILE_PRIV_INCLUDEISFALLBACK}"'
    !endif
  !endif

!macroend

!macro LANGFILE_LANGSTRING NAME DUMMY

  ;Create a language string from a define and undefine

  LangString "${NAME}" "${LANG_${LANGFILE_IDNAME}}" "${${NAME}}"
  !undef "${NAME}"

!macroend

!endif
