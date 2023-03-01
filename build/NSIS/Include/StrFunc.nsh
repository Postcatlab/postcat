/*
o-----------------------------------------------------------------------------o
|String Functions Header File 1.10                                            |
(-----------------------------------------------------------------------------)
| By deguix                                     / A Header file for NSIS 2.01 |
| <cevo_deguix@yahoo.com.br>                   -------------------------------|
|                                                                             |
|    This header file contains NSIS functions for string manipulation.        |
|                                                                    ---------|
| !include "StrFunc.nsh"                                            / Example |
| ${Using:StrFunc} StrRep                                          -----------|
|                                                                             |
| Section                                                                     |
| ${StrRep} $0 "Hello world!" "world" "everyone"                              |
| MessageBox mb_ok $0                                                         |
| SectionEnd                                                                  |
|                                                                             |
o-----------------------------------------------------------------------------o
*/

!verbose push 3
!define /IfNDef STRFUNC_VERBOSITY 3
!define /IfNDef _STRFUNC_VERBOSITY ${STRFUNC_VERBOSITY}
!define /IfNDef _STRFUNC_CREDITVERBOSITY ${STRFUNC_VERBOSITY}
!undef STRFUNC_VERBOSITY
!verbose ${_STRFUNC_VERBOSITY}

!include LogicLib.nsh

!ifndef STRFUNC

  !define /IfNDef FALSE 0
  !define /IfNDef TRUE 1

  ;Header File Identification

  !define STRFUNC `String Functions Header File`
  ;define STRFUNC_SHORT `StrFunc`
  !define STRFUNC_CREDITS `2004 Diego Pedroso`

  ;Header File Version

  !define STRFUNC_VERMAJ 1
  !define STRFUNC_VERMED 10
 ;!define STRFUNC_VERMIN 0
 ;!define STRFUNC_VERBLD 0

  !define STRFUNC_VER `${STRFUNC_VERMAJ}.${STRFUNC_VERMED}`

  ;Header File Init Message Prefix and Postfix

  !define STRFUNC_INITMSGPRE `----------------------------------------------------------------------$\r$\n`
  !define STRFUNC_INITMSGPOST `$\r$\n----------------------------------------------------------------------$\r$\n`

  ;Header File Init Message

  !verbose push ${_STRFUNC_CREDITVERBOSITY}
  !echo `${STRFUNC_INITMSGPRE}NSIS ${STRFUNC} ${STRFUNC_VER} - Copyright ${STRFUNC_CREDITS}${STRFUNC_INITMSGPOST}`
  !verbose pop

  ;Header File Function Macros

  !ifdef STRFUNC_USECALLARTIFICIALFUNCTION
    !include Util.nsh
  !endif

  !define "Using:StrFunc" `!insertmacro STRFUNC_USING `
  !macro STRFUNC_USING Name
    !if "${STRFUNC_VERBOSITY}" > 4
      !verbose push 4
    !endif
    !ifndef ${Name}_INCLUDED
      !ifndef STRFUNC_USECALLARTIFICIALFUNCTION
        ${${Name}} ; Invoke !insertmacro STRFUNC_MAKEFUNC
      !endif
    !endif
    !if "${STRFUNC_VERBOSITY}" > 4
      !verbose pop
    !endif
  !macroend

  !macro STRFUNC_FUNCLIST_INSERT Name
    !ifdef StrFunc_List
      !define /ReDef StrFunc_List `${StrFunc_List}|${Name}`
    !else
      !define StrFunc_List `${Name}`
    !endif
  !macroend

  !macro STRFUNC_DEFFUNC Name List TypeList
    !insertmacro STRFUNC_FUNCLIST_INSERT ${Name}
    !define `${Name}_List` `${List}`
    !define `${Name}_TypeList` `${TypeList}`
    !ifdef STRFUNC_USECALLARTIFICIALFUNCTION
      !define `${Name}` `!insertmacro STRFUNC_CALL_${Name} "" `
      !define `Un${Name}` `!insertmacro STRFUNC_CALL_${Name} Un `
    !else
      !define `${Name}` `!insertmacro STRFUNC_MAKEFUNC ${Name} "" #`
      !define `Un${Name}` `!insertmacro STRFUNC_MAKEFUNC ${Name} Un #`
    !endif
  !macroend

  !macro STRFUNC_MAKEFUNC basename un
    !ifndef __GLOBAL__
      !error "You forgot ${U+24}{Using:StrFunc} ${un}${basename}"
    !endif
    !insertmacro STRFUNC_MAKEFUNC_${basename}
  !macroend

  !macro STRFUNC_BEGINFUNC basename un credits
    !verbose push ${_STRFUNC_CREDITVERBOSITY}
    !echo `${U+24}{${un}${basename}} - Copyright ${credits}`
    !verbose pop
    !define /IfNDef ${un}${basename}_INCLUDED
    !ifndef STRFUNC_USECALLARTIFICIALFUNCTION
      !define /ReDef ${un}${basename} `!insertmacro STRFUNC_CALL_${basename} "${un}" `
      !if "${un}" != ""
        Function un.${basename}
      !else
        Function ${basename}
      !endif
    !endif
  !macroend
  !macro STRFUNC_ENDFUNC
    !ifndef STRFUNC_USECALLARTIFICIALFUNCTION
      FunctionEnd
    !endif
  !macroend

  !macro STRFUNC_CALL basename un
    !ifdef STRFUNC_USECALLARTIFICIALFUNCTION
      ${CallArtificialFunction} STRFUNC_MAKEFUNC_${basename}
    !else
      !if "${un}" != ""
        Call un.${basename}
      !else
        Call ${basename}
      !endif
    !endif
  !macroend


  ############################################################################  
  # StrCase
  !insertmacro STRFUNC_DEFFUNC StrCase `ResultVar|String|Type` `Output|Text|Option  U L T S <>`

  !macro STRFUNC_CALL_StrCase un ResultVar String Type
    !verbose push ${STRFUNC_VERBOSITY}
    !echo `${U+24}{${un}StrCase} "${ResultVar}" "${String}" "${Type}"`
    !verbose 2
    Push `${String}`
    Push `${Type}`
    !insertmacro STRFUNC_CALL StrCase "${un}"
    Pop ${ResultVar}
    !verbose pop
  !macroend

  !macro STRFUNC_MAKEFUNC_StrCase
    !insertmacro STRFUNC_BEGINFUNC ${basename} `${un}` `2004 Diego Pedroso - Based on functions by Dave Laundon`
    /*After this point:
      ------------------------------------------
       $0 = String (input)
       $1 = Type (input)
       $2 = StrLength (temp)
       $3 = StartChar (temp)
       $4 = EndChar (temp)
       $5 = ResultStr (temp)
       $6 = CurrentChar (temp)
       $7 = LastChar (temp)
       $8 = Temp (temp)*/

      ;Get input from user
      Exch $1
      Exch
      Exch $0
      Exch
      Push $2
      Push $3
      Push $4
      Push $5
      Push $6
      Push $7
      Push $8

      ;Initialize variables
      StrCpy $2 ""
      StrCpy $3 ""
      StrCpy $4 ""
      StrCpy $5 ""
      StrCpy $6 ""
      StrCpy $7 ""
      StrCpy $8 ""

      ;Upper and lower cases are simple to use
      ${If} $1 == "U"

        ;Upper Case System:
        ;------------------
        ; Convert all characters to upper case.

        System::Call "User32::CharUpper(t r0 r5)i"
        Goto StrCase_End
      ${ElseIf} $1 == "L"

        ;Lower Case System:
        ;------------------
        ; Convert all characters to lower case.

        System::Call "User32::CharLower(t r0 r5)i"
        Goto StrCase_End
      ${EndIf}

      ;For the rest of cases:
      ;Get "String" length
      StrLen $2 $0

      ;Make a loop until the end of "String"
      ${For} $3 0 $2
        ;Add 1 to "EndChar" counter also
        IntOp $4 $3 + 1

        # Step 1: Detect one character at a time

        ;Remove characters before "StartChar" except when
        ;"StartChar" is the first character of "String"
        ${If} $3 <> 0
          StrCpy $6 $0 `` $3
        ${EndIf}

        ;Remove characters after "EndChar" except when
        ;"EndChar" is the last character of "String"
        ${If} $4 <> $2
          ${If} $3 = 0
            StrCpy $6 $0 1
          ${Else}
            StrCpy $6 $6 1
          ${EndIf}
        ${EndIf}

        # Step 2: Convert to the advanced case user chose:

        ${If} $1 == "T"

          ;Title Case System:
          ;------------------
          ; Convert all characters after a non-alphabetic character to upper case.
          ; Else convert to lower case.

          ;Use "IsCharAlpha" for the job
          System::Call "*(&t1 r7) p .r8"
          System::Call "*$8(&i1 .r7)"
          System::Free $8
          System::Call "user32::IsCharAlpha(i r7) i .r8"
          
          ;Verify "IsCharAlpha" result and convert the character
          ${If} $8 = 0
            System::Call "User32::CharUpper(t r6 r6)i"
          ${Else}
            System::Call "User32::CharLower(t r6 r6)i"
          ${EndIf}
        ${ElseIf} $1 == "S"

          ;Sentence Case System:
          ;------------------
          ; Convert all characters after a ".", "!" or "?" character to upper case.
          ; Else convert to lower case. Spaces or tabs after these marks are ignored.

          ;Detect current characters and ignore if necessary
          ${If} $6 == " "
          ${OrIf} $6 == "$\t"
            Goto IgnoreLetter
          ${EndIf}

          ;Detect last characters and convert
          ${If} $7 == "."
          ${OrIf} $7 == "!"
          ${OrIf} $7 == "?"
          ${OrIf} $7 == ""
            System::Call "User32::CharUpper(t r6 r6)i"
          ${Else}
            System::Call "User32::CharLower(t r6 r6)i"
          ${EndIf}
        ${ElseIf} $1 == "<>"

          ;Switch Case System:
          ;------------------
          ; Switch all characters cases to their inverse case.

          ;Use "IsCharUpper" for the job
          System::Call "*(&t1 r6) p .r8"
          System::Call "*$8(&i1 .r7)"
          System::Free $8
          System::Call "user32::IsCharUpper(i r7) i .r8"
          
          ;Verify "IsCharUpper" result and convert the character
          ${If} $8 = 0
            System::Call "User32::CharUpper(t r6 r6)i"
          ${Else}
            System::Call "User32::CharLower(t r6 r6)i"
          ${EndIf}
        ${EndIf}

        ;Write the character to "LastChar"
        StrCpy $7 $6

        IgnoreLetter:
        ;Add this character to "ResultStr"
        StrCpy $5 `$5$6`
      ${Next}

      StrCase_End:

    /*After this point:
      ------------------------------------------
       $0 = OutVar (output)*/

      ; Copy "ResultStr" to "OutVar"
      StrCpy $0 $5

      ;Return output to user
      Pop $8
      Pop $7
      Pop $6
      Pop $5
      Pop $4
      Pop $3
      Pop $2
      Pop $1
      Exch $0
    !insertmacro STRFUNC_ENDFUNC

  !macroend

  ############################################################################  
  # StrClb
  !insertmacro STRFUNC_DEFFUNC StrClb `ResultVar|String|Action` `Output|Text|Option  > < <>`

  !macro STRFUNC_CALL_StrClb un ResultVar String Action
    !verbose push ${STRFUNC_VERBOSITY}
    !echo `${U+24}{${un}StrClb} "${ResultVar}" "${String}" "${Action}"`
    !verbose 2
    Push `${String}`
    Push `${Action}`
    !insertmacro STRFUNC_CALL StrClb "${un}"
    Pop ${ResultVar}
    !verbose pop
  !macroend

  !macro STRFUNC_MAKEFUNC_StrClb
    !insertmacro STRFUNC_BEGINFUNC ${basename} `${un}` `2004 Diego Pedroso - Based on functions by Nik Medved`

    /*After this point:
      ------------------------------------------
       $0 = String (input)
       $1 = Action (input)
       $2 = Lock/Unlock (temp)
       $3 = Temp (temp)
       $4 = Temp2 (temp)*/

      ;Get input from user

      Exch $1
      Exch
      Exch $0
      Exch
      Push $2
      Push $3
      Push $4
      
      StrCpy $2 ""
      StrCpy $3 ""
      StrCpy $4 ""

      ;Open the clipboard to do the operations the user chose (kichik's fix)
      System::Call 'user32::OpenClipboard(p $HWNDPARENT)'

      ${If} $1 == ">" ;Set

        ;Step 1: Clear the clipboard
        System::Call 'user32::EmptyClipboard()'

        ;Step 2: Allocate global heap
        StrLen $2 $0
        IntOp $2 $2 + 1
        !if "${NSIS_CHAR_SIZE}" > 1
        IntOp $2 $2 * ${NSIS_CHAR_SIZE}
        !endif
        System::Call 'kernel32::GlobalAlloc(i 2, i r2) p.r2'

        ;Step 3: Lock the handle
        System::Call 'kernel32::GlobalLock(p r2) i.r3'

        ;Step 4: Copy the text to locked clipboard buffer
        System::Call 'kernel32::lstrcpy(p r3, t r0)'

        ;Step 5: Unlock the handle again
        System::Call 'kernel32::GlobalUnlock(p r2)'

        ;Step 6: Set the information to the clipboard
        !if "${NSIS_CHAR_SIZE}" > 1
        System::Call 'user32::SetClipboardData(i 13, p r2)'
        !else
        System::Call 'user32::SetClipboardData(i 1, p r2)'
        !endif

        StrCpy $0 ""

      ${ElseIf} $1 == "<" ;Get

        ;Step 1: Get clipboard data
        !if "${NSIS_CHAR_SIZE}" > 1
        System::Call 'user32::GetClipboardData(i 13)p.r2'
        !else
        System::Call 'user32::GetClipboardData(i 1)p.r2'
        !endif

        ;Step 2: Lock and copy data (kichik's fix)
        System::Call 'kernel32::GlobalLock(p r2) t .r0'

        ;Step 3: Unlock (kichik's fix)
        System::Call 'kernel32::GlobalUnlock(p r2)'

      ${ElseIf} $1 == "<>" ;Swap

        ;Step 1: Get clipboard data
        !if "${NSIS_CHAR_SIZE}" > 1
        System::Call 'user32::GetClipboardData(i 13)p.r2'
        !else
        System::Call 'user32::GetClipboardData(i 1)p.r2'
        !endif

        ;Step 2: Lock and copy data (kichik's fix)
        System::Call 'kernel32::GlobalLock(p r2) t .r4'

        ;Step 3: Unlock (kichik's fix)
        System::Call 'kernel32::GlobalUnlock(p r2)'

        ;Step 4: Clear the clipboard
        System::Call 'user32::EmptyClipboard()'

        ;Step 5: Allocate global heap
        StrLen $2 $0
        IntOp $2 $2 + 1
        !if "${NSIS_CHAR_SIZE}" > 1
        IntOp $2 $2 * ${NSIS_CHAR_SIZE}
        !endif
        System::Call 'kernel32::GlobalAlloc(i 2, i r2) p.r2'

        ;Step 6: Lock the handle
        System::Call 'kernel32::GlobalLock(p r2) i.r3'

        ;Step 7: Copy the text to locked clipboard buffer
        System::Call 'kernel32::lstrcpy(p r3, t r0)'

        ;Step 8: Unlock the handle again
        System::Call 'kernel32::GlobalUnlock(p r2)'

        ;Step 9: Set the information to the clipboard
        !if "${NSIS_CHAR_SIZE}" > 1
        System::Call 'user32::SetClipboardData(i 13, p r2)'
        !else
        System::Call 'user32::SetClipboardData(i 1, p r2)'
        !endif
        
        StrCpy $0 $4
      ${Else} ;Clear

        ;Step 1: Clear the clipboard
        System::Call 'user32::EmptyClipboard()'

        StrCpy $0 ""
      ${EndIf}

      ;Close the clipboard
      System::Call 'user32::CloseClipboard()'

    /*After this point:
      ------------------------------------------
       $0 = OutVar (output)*/

      ;Return result to user
      Pop $4
      Pop $3
      Pop $2
      Pop $1
      Exch $0
    !insertmacro STRFUNC_ENDFUNC

  !macroend

  ############################################################################  
  # StrIOToNSIS
  !insertmacro STRFUNC_DEFFUNC StrIOToNSIS `ResultVar|String` `Output|Text`

  !macro STRFUNC_CALL_StrIOToNSIS un ResultVar String
    !verbose push ${STRFUNC_VERBOSITY}
    !echo `${U+24}{${un}StrIOToNSIS} "${ResultVar}" "${String}"`
    !verbose 2
    Push `${String}`
    !insertmacro STRFUNC_CALL StrIOToNSIS "${un}"
    Pop ${ResultVar}
    !verbose pop
  !macroend

  !macro STRFUNC_MAKEFUNC_StrIOToNSIS
    !insertmacro STRFUNC_BEGINFUNC ${basename} `${un}` `2004 "bluenet" - Based on functions by Amir Szekely, Joost Verburg, Dave Laundon and Diego Pedroso`

    /*After this point:
      ------------------------------------------
       $R0 = String (input/output)
       $R1 = StartCharPos (temp)
       $R2 = StrLen (temp)
       $R3 = TempStr (temp)
       $R4 = TempRepStr (temp)*/

      ;Get input from user
      Exch $R0
      Push $R1
      Push $R2
      Push $R3
      Push $R4
      
      ;Get "String" length
      StrLen $R2 $R0

      ;Loop until "String" end is reached
      ${For} $R1 0 $R2
        ;Get the next "String" characters
        StrCpy $R3 $R0 2 $R1
        
        ;Detect if current character is:
        ${If} $R3 == "\\" ;Back-slash
          StrCpy $R4 "\"
        ${ElseIf} $R3 == "\r" ;Carriage return
          StrCpy $R4 "$\r"
        ${ElseIf} $R3 == "\n" ;Line feed
          StrCpy $R4 "$\n"
        ${ElseIf} $R3 == "\t" ;Tab
          StrCpy $R4 "$\t"
        ${Else} ;Anything else
          StrCpy $R4 ""
        ${EndIf}

        ;Detect if "TempRepStr" is not empty
        ${If} $R4 != ""
          ;Replace the old characters with the new one
          StrCpy $R3 $R0 $R1
          IntOp $R1 $R1 + 2
          StrCpy $R0 $R0 "" $R1
          StrCpy $R0 "$R3$R4$R0"
          IntOp $R2 $R2 - 1 ;Decrease "StrLen"
          IntOp $R1 $R1 - 2 ;Go back to the next character
        ${EndIf}
      ${Next}
      Pop $R4
      Pop $R3
      Pop $R2
      Pop $R1
      Exch $R0
    !insertmacro STRFUNC_ENDFUNC
  !macroend

  ############################################################################  
  # StrLoc
  !insertmacro STRFUNC_DEFFUNC StrLoc `ResultVar|String|StrToSearchFor|CounterDirection` `Output|Text|Text|Option > <`

  !macro STRFUNC_CALL_StrLoc un ResultVar String StrToSearchFor OffsetDirection
    !verbose push ${STRFUNC_VERBOSITY}
    !echo `${U+24}{${un}StrLoc} "${ResultVar}" "${String}" "${StrToSearchFor}" "${OffsetDirection}"`
    !verbose 2
    Push `${String}`
    Push `${StrToSearchFor}`
    Push `${OffsetDirection}`
    !insertmacro STRFUNC_CALL StrLoc "${un}"
    Pop ${ResultVar}
    !verbose pop
  !macroend

  !macro STRFUNC_MAKEFUNC_StrLoc
    !insertmacro STRFUNC_BEGINFUNC ${basename} `${un}` `2004 Diego Pedroso - Based on functions by Ximon Eighteen`

    /*After this point:
      ------------------------------------------
       $R0 = OffsetDirection (input)
       $R1 = StrToSearch (input)
       $R2 = String (input)
       $R3 = StrToSearchLen (temp)
       $R4 = StrLen (temp)
       $R5 = StartCharPos (temp)
       $R6 = TempStr (temp)*/

      ;Get input from user
      Exch $R0
      Exch
      Exch $R1
      Exch 2
      Exch $R2
      Push $R3
      Push $R4
      Push $R5
      Push $R6

      ;Get "String" and "StrToSearch" length
      StrLen $R3 $R1
      StrLen $R4 $R2
      ;Start "StartCharPos" counter
      StrCpy $R5 0

      ;Loop until "StrToSearch" is found or "String" reaches its end
      ${Do}
        ;Remove everything before and after the searched part ("TempStr")
        StrCpy $R6 $R2 $R3 $R5

        ;Compare "TempStr" with "StrToSearch"
        ${If} $R6 == $R1
          ${If} $R0 == `<`
            IntOp $R6 $R3 + $R5
            IntOp $R0 $R4 - $R6
          ${Else}
            StrCpy $R0 $R5
          ${EndIf}
          ${ExitDo}
        ${EndIf}
        ;If not "StrToSearch", this could be "String" end
        ${If} $R5 >= $R4
          StrCpy $R0 ``
          ${ExitDo}
        ${EndIf}
        ;If not, continue the loop
        IntOp $R5 $R5 + 1
      ${Loop}

      ;Return output to user
      Pop $R6
      Pop $R5
      Pop $R4
      Pop $R3
      Pop $R2
      Exch
      Pop $R1
      Exch $R0
    !insertmacro STRFUNC_ENDFUNC

  !macroend

  ############################################################################  
  # StrNSISToIO
  !insertmacro STRFUNC_DEFFUNC StrNSISToIO `ResultVar|String` `Output|Text`

  !macro STRFUNC_CALL_StrNSISToIO un ResultVar String
    !verbose push ${STRFUNC_VERBOSITY}
    !echo `${U+24}{${un}StrNSISToIO} "${ResultVar}" "${String}"`
    !verbose 2
    Push `${String}`
    !insertmacro STRFUNC_CALL StrNSISToIO "${un}"
    Pop ${ResultVar}
    !verbose pop
  !macroend

  !macro STRFUNC_MAKEFUNC_StrNSISToIO
    !insertmacro STRFUNC_BEGINFUNC ${basename} `${un}` `2004 "bluenet" - Based on functions by Amir Szekely, Joost Verburg, Dave Laundon and Diego Pedroso`

    /*After this point:
      ------------------------------------------
       $R0 = String (input/output)
       $R1 = StartCharPos (temp)
       $R2 = StrLen (temp)
       $R3 = TempStr (temp)
       $R4 = TempRepStr (temp)*/

      ;Get input from user
      Exch $R0
      Push $R1
      Push $R2
      Push $R3
      Push $R4
      
      ;Get "String" length
      StrLen $R2 $R0

      ;Loop until "String" end is reached
      ${For} $R1 0 $R2
        ;Get the next "String" character
        StrCpy $R3 $R0 1 $R1

        ;Detect if current character is:
        ${If} $R3 == "$\r" ;Back-slash
          StrCpy $R4 "\r"
        ${ElseIf} $R3 == "$\n" ;Carriage return
          StrCpy $R4 "\n"
        ${ElseIf} $R3 == "$\t" ;Line feed
          StrCpy $R4 "\t"
        ${ElseIf} $R3 == "\" ;Tab
          StrCpy $R4 "\\"
        ${Else} ;Anything else
          StrCpy $R4 ""
        ${EndIf}

        ;Detect if "TempRepStr" is not empty
        ${If} $R4 != ""
          ;Replace the old character with the new ones
          StrCpy $R3 $R0 $R1
          IntOp $R1 $R1 + 1
          StrCpy $R0 $R0 "" $R1
          StrCpy $R0 "$R3$R4$R0"
          IntOp $R2 $R2 + 1 ;Increase "StrLen"
        ${EndIf}
      ${Next}

      ;Return output to user
      Pop $R4
      Pop $R3
      Pop $R2
      Pop $R1
      Exch $R0
    !insertmacro STRFUNC_ENDFUNC
  !macroend

  ############################################################################  
  # StrRep
  !insertmacro STRFUNC_DEFFUNC StrRep `ResultVar|String|StrToReplace|ReplacementString` `Output|Text|Text|Text`

  !macro STRFUNC_CALL_StrRep un ResultVar String StringToReplace ReplacementString
    !verbose push ${STRFUNC_VERBOSITY}
    !echo `${U+24}{${un}StrRep} "${ResultVar}" "${String}" "${StringToReplace}" "${ReplacementString}"`
    !verbose 2
    Push `${String}`
    Push `${StringToReplace}`
    Push `${ReplacementString}`
    !insertmacro STRFUNC_CALL StrRep "${un}"
    Pop ${ResultVar}
    !verbose pop
  !macroend

  !macro STRFUNC_MAKEFUNC_StrRep
    !insertmacro STRFUNC_BEGINFUNC ${basename} `${un}` `2004 Diego Pedroso - Based on functions by Hendri Adriaens`

    /*After this point:
      ------------------------------------------
       $R0 = ReplacementString (input)
       $R1 = StrToSearch (input)
       $R2 = String (input)
       $R3 = RepStrLen (temp)
       $R4 = StrToSearchLen (temp)
       $R5 = StrLen (temp)
       $R6 = StartCharPos (temp)
       $R7 = TempStrL (temp)
       $R8 = TempStrR (temp)*/

      ;Get input from user
      Exch $R0
      Exch
      Exch $R1
      Exch
      Exch 2
      Exch $R2
      Push $R3
      Push $R4
      Push $R5
      Push $R6
      Push $R7
      Push $R8

      ;Return "String" if "StrToSearch" is ""
      ${IfThen} $R1 == "" ${|} Goto Done ${|}

      ;Get "ReplacementString", "String" and "StrToSearch" length
      StrLen $R3 $R0
      StrLen $R4 $R1
      StrLen $R5 $R2
      ;Start "StartCharPos" counter
      StrCpy $R6 0

      ;Loop until "StrToSearch" is found or "String" reaches its end
      ${Do}
        ;Remove everything before and after the searched part ("TempStrL")
        StrCpy $R7 $R2 $R4 $R6

        ;Compare "TempStrL" with "StrToSearch"
        ${If} $R7 == $R1
          ;Split "String" to replace the string wanted
          StrCpy $R7 $R2 $R6 ;TempStrL

          ;Calc: "StartCharPos" + "StrToSearchLen" = EndCharPos
          IntOp $R8 $R6 + $R4

          StrCpy $R8 $R2 "" $R8 ;TempStrR

          ;Insert the new string between the two separated parts of "String"
          StrCpy $R2 $R7$R0$R8
          ;Now calculate the new "StrLen" and "StartCharPos"
          StrLen $R5 $R2
          IntOp $R6 $R6 + $R3
          ${Continue}
        ${EndIf}

        ;If not "StrToSearch", this could be "String" end
        ${IfThen} $R6 >= $R5 ${|} ${ExitDo} ${|}
        ;If not, continue the loop
        IntOp $R6 $R6 + 1
      ${Loop}

      Done:

    /*After this point:
      ------------------------------------------
       $R0 = OutVar (output)*/

      ;Return output to user
      StrCpy $R0 $R2
      Pop $R8
      Pop $R7
      Pop $R6
      Pop $R5
      Pop $R4
      Pop $R3
      Pop $R2
      Pop $R1
      Exch $R0
    !insertmacro STRFUNC_ENDFUNC

  !macroend

  ############################################################################  
  # StrSort
  !insertmacro STRFUNC_DEFFUNC StrSort `ResultVar|String|CenterStr|LeftStr|RightStr|IncludeLeftStr|IncludeCenterStr|IncludeRightStr` `Output|Text|Text|Text|Text|Option 1 0|Option 1 0|Option 1 0`

  !macro STRFUNC_CALL_StrSort un ResultVar String CenterStr LeftStr RightStr IncludeCenterStr IncludeLeftStr IncludeRightStr
    !verbose push ${STRFUNC_VERBOSITY}
    !echo `${U+24}{${un}StrSort} "${ResultVar}" "${String}" "${CenterStr}" "${LeftStr}" "${RightStr}" "${IncludeCenterStr}" "${IncludeLeftStr}" "${IncludeRightStr}"`
    !verbose 2
    Push `${String}`
    Push `${CenterStr}`
    Push `${LeftStr}`
    Push `${RightStr}`
    Push `${IncludeCenterStr}`
    Push `${IncludeLeftStr}`
    Push `${IncludeRightStr}`
    !insertmacro STRFUNC_CALL StrSort "${un}"
    Pop ${ResultVar}
    !verbose pop
  !macroend

  !macro STRFUNC_MAKEFUNC_StrSort
    !insertmacro STRFUNC_BEGINFUNC ${basename} `${un}` `2004 Diego Pedroso - Based on functions by Stuart Welch`

    /*After this point:
      ------------------------------------------
       $R0 = String (input)
       $R1 = LeftStr (input)
       $R2 = CenterStr (input)
       $R3 = RightStr (input)
       $R4 = IncludeLeftStr (input)
       $R5 = IncludeCenterStr (input)
       $R6 = IncludeRightStr (input)

       $0 = StrLen (temp)
       $1 = LeftStrLen (temp)
       $2 = CenterStrLen (temp)
       $3 = RightStrLen (temp)
       $4 = StartPos (temp)
       $5 = EndPos (temp)
       $6 = StartCharPos (temp)
       $7 = EndCharPos (temp)
       $8 = TempStr (temp)*/

      ;Get input from user
      Exch $R6
      Exch
      Exch $R5
      Exch
      Exch 2
      Exch $R4
      Exch 2
      Exch 3
      Exch $R3
      Exch 3
      Exch 4
      Exch $R2
      Exch 4
      Exch 5
      Exch $R1
      Exch 5
      Exch 6
      Exch $R0
      Exch 6
      Push $0
      Push $1
      Push $2
      Push $3
      Push $4
      Push $5
      Push $6
      Push $7
      Push $8

      ;Parameter defaults
      ${IfThen} $R4 == `` ${|} StrCpy $R4 `1` ${|}
      ${IfThen} $R5 == `` ${|} StrCpy $R5 `1` ${|}
      ${IfThen} $R6 == `` ${|} StrCpy $R6 `1` ${|}

      ;Get "String", "CenterStr", "LeftStr" and "RightStr" length
      StrLen $0 $R0
      StrLen $1 $R1
      StrLen $2 $R2
      StrLen $3 $R3
      ;Start "StartCharPos" counter
      StrCpy $6 0
      ;Start "EndCharPos" counter based on "CenterStr" length
      IntOp $7 $6 + $2

      ;Loop until "CenterStr" is found or "String" reaches its end
      ${Do}
        ;Remove everything before and after the searched part ("TempStr")
        StrCpy $8 $R0 $2 $6

        ;Compare "TempStr" with "CenterStr"
        ${IfThen} $8 == $R2 ${|} ${ExitDo} ${|}
        ;If not, this could be "String" end
        ${IfThen} $7 >= $0 ${|} Goto Done ${|}
        ;If not, continue the loop
        IntOp $6 $6 + 1
        IntOp $7 $7 + 1
      ${Loop}

      # "CenterStr" was found

      ;Remove "CenterStr" from "String" if the user wants
      ${If} $R5 = ${FALSE}
        StrCpy $8 $R0 $6
        StrCpy $R0 $R0 `` $7
        StrCpy $R0 $8$R0
      ${EndIf}

      ;"StartPos" and "EndPos" will record "CenterStr" coordinates for now
      StrCpy $4 $6
      StrCpy $5 $7
      ;"StartCharPos" and "EndCharPos" should be before "CenterStr"
      IntOp $6 $6 - $1
      IntOp $7 $6 + $1

      ;Loop until "LeftStr" is found or "String" reaches its start
      ${Do}
        ;Remove everything before and after the searched part ("TempStr")
        StrCpy $8 $R0 $1 $6

        ;If "LeftStr" is empty
        ${If} $R1 == ``
          StrCpy $6 0
          StrCpy $7 0
          ${ExitDo}
        ${EndIf}

        ;Compare "TempStr" with "LeftStr"
        ${IfThen} $8 == $R1 ${|} ${ExitDo} ${|}
        ;If not, this could be "String" start
        ${IfThen} $6 <= 0 ${|} ${ExitDo} ${|}
        ;If not, continue the loop
        IntOp $6 $6 - 1
        IntOp $7 $7 - 1
      ${Loop}

      # "LeftStr" is found or "String" start was reached

      ;Remove "LeftStr" from "String" if the user wants
      ${If} $R4 = ${FALSE}
        IntOp $6 $6 + $1
      ${EndIf}

      ;Record "LeftStr" first character position on "TempStr" (temporarily)
      StrCpy $8 $6

      ;"StartCharPos" and "EndCharPos" should be after "CenterStr"
      ${If} $R5 = ${FALSE}
        StrCpy $6 $4
      ${Else}
        IntOp $6 $4 + $2
      ${EndIf}
      IntOp $7 $6 + $3
      
      ;Record "LeftStr" first character position on "StartPos"
      StrCpy $4 $8

      ;Loop until "RightStr" is found or "String" reaches its end
      ${Do}
        ;Remove everything before and after the searched part ("TempStr")
        StrCpy $8 $R0 $3 $6

        ;If "RightStr" is empty
        ${If} $R3 == ``
          StrCpy $6 $0
          StrCpy $7 $0
          ${ExitDo}
        ${EndIf}

        ;Compare "TempStr" with "RightStr"
        ${IfThen} $8 == $R3 ${|} ${ExitDo} ${|}
        ;If not, this could be "String" end
        ${IfThen} $7 >= $0 ${|} ${ExitDo} ${|}
        ;If not, continue the loop
        IntOp $6 $6 + 1
        IntOp $7 $7 + 1
      ${Loop}

      ;Remove "RightStr" from "String" if the user wants
      ${If} $R6 = ${FALSE}
        IntOp $7 $7 - $3
      ${EndIf}

      ;Record "RightStr" last character position on "StartPos"
      StrCpy $5 $7

      ;As the positionment is relative...
      IntOp $5 $5 - $4

      ;Write the string and finish the job
      StrCpy $R0 $R0 $5 $4
      Goto +2

      Done:
      StrCpy $R0 ``

    /*After this point:
      ------------------------------------------
       $R0 = OutVar (output)*/

      ;Return output to user
      Pop $8
      Pop $7
      Pop $6
      Pop $5
      Pop $4
      Pop $3
      Pop $2
      Pop $1
      Pop $0
      Pop $R6
      Pop $R5
      Pop $R4
      Pop $R3
      Pop $R2
      Pop $R1
      Exch $R0
    !insertmacro STRFUNC_ENDFUNC

  !macroend

  ############################################################################  
  # StrStr
  !insertmacro STRFUNC_DEFFUNC StrStr `ResultVar|String|StrToSearchFor` `Output|Text|Text`

  !macro STRFUNC_CALL_StrStr un ResultVar String StrToSearchFor
    !verbose push ${STRFUNC_VERBOSITY}
    !echo `${U+24}{${un}StrStr} "${ResultVar}" "${String}" "${StrToSearchFor}"`
    !verbose 2
    Push `${String}`
    Push `${StrToSearchFor}`
    !insertmacro STRFUNC_CALL StrStr "${un}"
    Pop ${ResultVar}
    !verbose pop
  !macroend

  !macro STRFUNC_MAKEFUNC_StrStr
    !insertmacro STRFUNC_BEGINFUNC ${basename} `${un}` `2004 Diego Pedroso - Based on functions by Ximon Eighteen`

    /*After this point:
      ------------------------------------------
       $R0 = StrToSearch (input)
       $R1 = String (input)
       $R2 = StrToSearchLen (temp)
       $R3 = StrLen (temp)
       $R4 = StartCharPos (temp)
       $R5 = TempStr (temp)*/

      ;Get input from user
      Exch $R0
      Exch
      Exch $R1
      Push $R2
      Push $R3
      Push $R4
      Push $R5

      ;Get "String" and "StrToSearch" length
      StrLen $R2 $R0
      StrLen $R3 $R1
      ;Start "StartCharPos" counter
      StrCpy $R4 0

      ;Loop until "StrToSearch" is found or "String" reaches its end
      ${Do}
        ;Remove everything before and after the searched part ("TempStr")
        StrCpy $R5 $R1 $R2 $R4

        ;Compare "TempStr" with "StrToSearch"
        ${IfThen} $R5 == $R0 ${|} ${ExitDo} ${|}
        ;If not "StrToSearch", this could be "String" end
        ${IfThen} $R4 >= $R3 ${|} ${ExitDo} ${|}
        ;If not, continue the loop
        IntOp $R4 $R4 + 1
      ${Loop}

    /*After this point:
      ------------------------------------------
       $R0 = OutVar (output)*/

      ;Remove part before "StrToSearch" on "String" (if there has one)
      StrCpy $R0 $R1 `` $R4

      ;Return output to user
      Pop $R5
      Pop $R4
      Pop $R3
      Pop $R2
      Pop $R1
      Exch $R0
    !insertmacro STRFUNC_ENDFUNC

  !macroend

  ############################################################################  
  # StrStrAdv
  !insertmacro STRFUNC_DEFFUNC StrStrAdv `ResultVar|String|StrToSearchFor|SearchDirection|ResultStrDirection|DisplayStrToSearch|Loops|CaseSensitive` `Output|Text|Text|Option > <|Option > <|Option 1 0|Text|Option 0 1`

  !macro STRFUNC_CALL_StrStrAdv un ResultVar String StrToSearchFor SearchDirection ResultStrDirection DisplayStrToSearch Loops CaseSensitive
    !verbose push ${STRFUNC_VERBOSITY}
    !echo `${U+24}{${un}StrStrAdv} "${ResultVar}" "${String}" "${StrToSearchFor}" "${SearchDirection}" "${ResultStrDirection}" "${DisplayStrToSearch}" "${Loops}" "${CaseSensitive}"`
    !verbose 2
    Push `${String}`
    Push `${StrToSearchFor}`
    Push `${SearchDirection}`
    Push `${ResultStrDirection}`
    Push `${DisplayStrToSearch}`
    Push `${Loops}`
    Push `${CaseSensitive}`
    !insertmacro STRFUNC_CALL StrStrAdv "${un}"
    Pop ${ResultVar}
    !verbose pop
  !macroend

  !macro STRFUNC_MAKEFUNC_StrStrAdv
    !insertmacro STRFUNC_BEGINFUNC ${basename} `${un}` `2003-2004 Diego Pedroso`

    /*After this point:
      ------------------------------------------
       $0 = String (input)
       $1 = StringToSearch (input)
       $2 = DirectionOfSearch (input)
       $3 = DirectionOfReturn (input)
       $4 = ShowStrToSearch (input)
       $5 = NumLoops (input)
       $6 = CaseSensitive (input)
       $7 = StringLength (temp)
       $8 = StrToSearchLength (temp)
       $9 = CurrentLoop (temp)
       $R0 = EndCharPos (temp)
       $R1 = StartCharPos (temp)
       $R2 = OutVar (output)
       $R3 = Temp (temp)*/

      ;Get input from user

      Exch $6
      Exch
      Exch $5
      Exch
      Exch 2
      Exch $4
      Exch 2
      Exch 3
      Exch $3
      Exch 3
      Exch 4
      Exch $2
      Exch 4
      Exch 5
      Exch $1
      Exch 5
      Exch 6
      Exch $0
      Exch 6
      Push $7
      Push $8
      Push $9
      Push $R3
      Push $R2
      Push $R1
      Push $R0

      ; Clean $R0-$R3 variables
      StrCpy $R0 ""
      StrCpy $R1 ""
      StrCpy $R2 ""
      StrCpy $R3 ""

      ; Verify if we have the correct values on the variables
      ${If} $0 == ``
        SetErrors ;AdvStrStr_StrToSearch not found
        Goto AdvStrStr_End
      ${EndIf}

      ${If} $1 == ``
        SetErrors ;No text to search
        Goto AdvStrStr_End
      ${EndIf}

      ${If} $2 != <
        StrCpy $2 >
      ${EndIf}

      ${If} $3 != <
        StrCpy $3 >
      ${EndIf}

      ${If} $4 <> 0
        StrCpy $4 1
      ${EndIf}

      ${If} $5 <= 0
        StrCpy $5 0
      ${EndIf}

      ${If} $6 <> 1
        StrCpy $6 0
      ${EndIf}

      ; Find "AdvStrStr_String" length
      StrLen $7 $0

      ; Then find "AdvStrStr_StrToSearch" length
      StrLen $8 $1

      ; Now set up basic variables

      ${If} $2 == <
        IntOp $R1 $7 - $8
        StrCpy $R2 $7
      ${Else}
        StrCpy $R1 0
        StrCpy $R2 $8
      ${EndIf}

      StrCpy $9 0 ; First loop

      ;Let's begin the search

      ${Do}
        ; Step 1: If the starting or ending numbers are negative
        ;         or more than AdvStrStr_StringLen, we return
        ;         error

        ${If} $R1 < 0
          StrCpy $R1 ``
          StrCpy $R2 ``
          StrCpy $R3 ``
          SetErrors ;AdvStrStr_StrToSearch not found
          Goto AdvStrStr_End
        ${ElseIf} $R2 > $7
          StrCpy $R1 ``
          StrCpy $R2 ``
          StrCpy $R3 ``
          SetErrors ;AdvStrStr_StrToSearch not found
          Goto AdvStrStr_End
        ${EndIf}

        ; Step 2: Start the search depending on
        ;         AdvStrStr_DirectionOfSearch. Chop down not needed
        ;         characters.

        ${If} $R1 <> 0
          StrCpy $R3 $0 `` $R1
        ${EndIf}

        ${If} $R2 <> $7
          ${If} $R1 = 0
            StrCpy $R3 $0 $8
          ${Else}
            StrCpy $R3 $R3 $8
          ${EndIf}
        ${EndIf}

        ; Step 3: Make sure that's the string we want

        ; Case-Sensitive Support <- Use "AdvStrStr_Temp"
        ; variable because it won't be used anymore

        ${If} $6 == 1
          System::Call `kernel32::lstrcmp(ts, ts) i.s` `$R3` `$1`
          Pop $R3
          ${If} $R3 = 0
            StrCpy $R3 1 ; Continue
          ${Else}
            StrCpy $R3 0 ; Break
          ${EndIf}
        ${Else}
          ${If} $R3 == $1
            StrCpy $R3 1 ; Continue
          ${Else}
            StrCpy $R3 0 ; Break
          ${EndIf}
        ${EndIf}

        ; After the comparasion, confirm that it is the
        ; value we want.

        ${If} $R3 = 1

          ;We found it, return except if the user has set up to
          ;search for another one:
          ${If} $9 >= $5

            ;Now, let's see if the user wants
            ;AdvStrStr_StrToSearch to appear:
            ${If} $4 == 0
              ;Return depends on AdvStrStr_DirectionOfReturn
              ${If} $3 == <
                ; RTL
                StrCpy $R0 $0 $R1
              ${Else}
                ; LTR
                StrCpy $R0 $0 `` $R2
              ${EndIf}
              ${Break}
            ${Else}
              ;Return depends on AdvStrStr_DirectionOfReturn
              ${If} $3 == <
                ; RTL
                StrCpy $R0 $0 $R2
              ${Else}
                ; LTR
                StrCpy $R0 $0 `` $R1
              ${EndIf}
              ${Break}
            ${EndIf}
          ${Else}
            ;If the user wants to have more loops, let's do it so!
            IntOp $9 $9 + 1

            ${If} $2 == <
              IntOp $R1 $R1 - 1
              IntOp $R2 $R2 - 1
            ${Else}
              IntOp $R1 $R1 + 1
              IntOp $R2 $R2 + 1
            ${EndIf}
          ${EndIf}
        ${Else}
          ; Step 4: We didn't find it, so do steps 1 thru 3 again

          ${If} $2 == <
            IntOp $R1 $R1 - 1
            IntOp $R2 $R2 - 1
          ${Else}
            IntOp $R1 $R1 + 1
            IntOp $R2 $R2 + 1
          ${EndIf}
        ${EndIf}
      ${Loop}

      AdvStrStr_End:

      ;Add 1 to AdvStrStr_EndCharPos to be supportable
      ;by "StrCpy"

      IntOp $R2 $R2 - 1

      ;Return output to user

      Exch $R0
      Exch
      Pop $R1
      Exch
      Pop $R2
      Exch
      Pop $R3
      Exch
      Pop $9
      Exch
      Pop $8
      Exch
      Pop $7
      Exch
      Pop $6
      Exch
      Pop $5
      Exch
      Pop $4
      Exch
      Pop $3
      Exch
      Pop $2
      Exch
      Pop $1
      Exch
      Pop $0

    !insertmacro STRFUNC_ENDFUNC

  !macroend

  ############################################################################  
  # StrTok
  !insertmacro STRFUNC_DEFFUNC StrTok `ResultVar|String|Separators|ResultPart|SkipEmptyParts` `Output|Text|Text|Mixed L|Option 1 0`

  !macro STRFUNC_CALL_StrTok un ResultVar String Separators ResultPart SkipEmptyParts
    !verbose push ${STRFUNC_VERBOSITY}
    !echo `${U+24}{${un}StrTok} "${ResultVar}" "${String}" "${Separators}" "${ResultPart}" "${SkipEmptyParts}"`
    !verbose 2
    Push `${String}`
    Push `${Separators}`
    Push `${ResultPart}`
    Push `${SkipEmptyParts}`
    !insertmacro STRFUNC_CALL StrTok "${un}"
    Pop ${ResultVar}
    !verbose pop
  !macroend

  !macro STRFUNC_MAKEFUNC_StrTok
    !insertmacro STRFUNC_BEGINFUNC ${basename} `${un}` `2004 Diego Pedroso - Based on functions by "bigmac666"`
    /*After this point:
      ------------------------------------------
       $0 = SkipEmptyParts (input)
       $1 = ResultPart (input)
       $2 = Separators (input)
       $3 = String (input)
       $4 = StrToSearchLen (temp)
       $5 = StrLen (temp)
       $6 = StartCharPos (temp)
       $7 = TempStr (temp)
       $8 = CurrentLoop
       $9 = CurrentSepChar
       $R0 = CurrentSepCharNum
       */

      ;Get input from user
      Exch $0
      Exch
      Exch $1
      Exch
      Exch 2
      Exch $2
      Exch 2
      Exch 3
      Exch $3
      Exch 3
      Push $4
      Push $5
      Push $6
      Push $7
      Push $8
      Push $9
      Push $R0

      ;Parameter defaults
      ${IfThen} $2 == `` ${|} StrCpy $2 `|` ${|}
      ${IfThen} $1 == `` ${|} StrCpy $1 `L` ${|}
      ${IfThen} $0 == `` ${|} StrCpy $0 `0` ${|}

      ;Get "String" and "StrToSearch" length
      StrLen $4 $2
      StrLen $5 $3
      ;Start "StartCharPos" and "ResultPart" counters
      StrCpy $6 0
      StrCpy $8 -1

      ;Loop until "ResultPart" is met, "StrToSearch" is found or
      ;"String" reaches its end
      ResultPartLoop: ;"CurrentLoop" Loop

        ;Increase "CurrentLoop" counter
        IntOp $8 $8 + 1

        StrSearchLoop:
        ${Do} ;"String" Loop
          ;Remove everything before and after the searched part ("TempStr")
          StrCpy $7 $3 1 $6

          ;Verify if it's the "String" end
          ${If} $6 >= $5
            ;If "CurrentLoop" is what the user wants, remove the part
            ;after "TempStr" and itself and get out of here
            ${If} $8 == $1
            ${OrIf} $1 == `L`
              StrCpy $3 $3 $6
            ${Else} ;If not, empty "String" and get out of here
              StrCpy $3 ``
            ${EndIf}
            StrCpy $R0 `End`
            ${ExitDo}
          ${EndIf}

          ;Start "CurrentSepCharNum" counter (for "Separators" Loop)
          StrCpy $R0 0

          ${Do} ;"Separators" Loop
            ;Use one "Separators" character at a time
            ${If} $R0 <> 0
              StrCpy $9 $2 1 $R0
            ${Else}
              StrCpy $9 $2 1
            ${EndIf}

            ;Go to the next "String" char if it's "Separators" end
            ${IfThen} $R0 >= $4 ${|} ${ExitDo} ${|}

            ;Or, if "TempStr" equals "CurrentSepChar", then...
            ${If} $7 == $9
              StrCpy $7 $3 $6

              ;If "String" is empty because this result part doesn't
              ;contain data, verify if "SkipEmptyParts" is activated,
              ;so we don't return the output to user yet

              ${If} $7 == ``
              ${AndIf} $0 = ${TRUE}
                IntOp $6 $6 + 1
                StrCpy $3 $3 `` $6
                StrCpy $6 0
                Goto StrSearchLoop
              ${ElseIf} $8 == $1
                StrCpy $3 $3 $6
                StrCpy $R0 "End"
                ${ExitDo}
              ${EndIf} ;If not, go to the next result part
              IntOp $6 $6 + 1
              StrCpy $3 $3 `` $6
              StrCpy $6 0
              Goto ResultPartLoop
            ${EndIf}

            ;Increase "CurrentSepCharNum" counter
            IntOp $R0 $R0 + 1
          ${Loop}
          ${IfThen} $R0 == "End" ${|} ${ExitDo} ${|}
          
          ;Increase "StartCharPos" counter
          IntOp $6 $6 + 1
        ${Loop}

    /*After this point:
      ------------------------------------------
       $3 = OutVar (output)*/

      ;Return output to user

      Pop $R0
      Pop $9
      Pop $8
      Pop $7
      Pop $6
      Pop $5
      Pop $4
      Pop $0
      Pop $1
      Pop $2
      Exch $3
    !insertmacro STRFUNC_ENDFUNC

  !macroend

  ############################################################################  
  # StrTrimNewLines
  !insertmacro STRFUNC_DEFFUNC StrTrimNewLines `ResultVar|String` `Output|Text`

  !macro STRFUNC_CALL_StrTrimNewLines un ResultVar String
    !verbose push ${STRFUNC_VERBOSITY}
    !echo `${U+24}{${un}StrTrimNewLines} "${ResultVar}" "${String}"`
    !verbose 2
    Push `${String}`
    !insertmacro STRFUNC_CALL StrTrimNewLines "${un}"
    Pop ${ResultVar}
    !verbose pop
  !macroend

  !macro STRFUNC_MAKEFUNC_StrTrimNewLines
    !insertmacro STRFUNC_BEGINFUNC ${basename} `${un}` `2004 Diego Pedroso - Based on functions by Ximon Eighteen`

    /*After this point:
      ------------------------------------------
       $R0 = String (input)
       $R1 = TrimCounter (temp)
       $R2 = Temp (temp)*/

      ;Get input from user
      Exch $R0
      Push $R1
      Push $R2
      
      ;Initialize trim counter
      StrCpy $R1 0

      loop:
        ;Subtract to get "String"'s last characters
        IntOp $R1 $R1 - 1

        ;Verify if they are either $\r or $\n
        StrCpy $R2 $R0 1 $R1
        ${If} $R2 == `$\r`
        ${OrIf} $R2 == `$\n`
          Goto loop
        ${EndIf}

      ;Trim characters (if needed)
      IntOp $R1 $R1 + 1
      ${If} $R1 < 0
        StrCpy $R0 $R0 $R1
      ${EndIf}

    /*After this point:
      ------------------------------------------
       $R0 = OutVar (output)*/

      ;Return output to user
      Pop $R2
      Pop $R1
      Exch $R0
    !insertmacro STRFUNC_ENDFUNC

  !macroend

  ############################################################################  

!endif
!verbose 3
!define STRFUNC_VERBOSITY ${_STRFUNC_VERBOSITY}
!undef _STRFUNC_VERBOSITY
!verbose pop
