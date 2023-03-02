;Language: 'Chinese (Simplified)' (2052)
;Translator: Kii Ali <kiiali@cpatch.org>, <kiiali@ms1.url.com.tw>, <kiiali@pchome.com.tw>, Tyson Tan <tysontan@tysontan.com>
;Revision date: 2020-06-03

!insertmacro LANGFILE "SimpChinese" "Chinese (Simplified)" "中文(简体)" "Hanyu (Jiantizi)"

!ifdef MUI_WELCOMEPAGE
  ${LangFileString} MUI_TEXT_WELCOME_INFO_TITLE "欢迎使用 $(^NameDA) 安装程序"
  ${LangFileString} MUI_TEXT_WELCOME_INFO_TEXT "此程序将引导你完成 $(^NameDA) 的安装。$\r$\n$\r$\n在安装之前，请先关闭其他所有应用程序。这将确保安装程序能够更新所需的系统文件，从而避免在安装后重新启动计算机。$\r$\n$\r$\n$_CLICK"
!endif

!ifdef MUI_UNWELCOMEPAGE
  ${LangFileString} MUI_UNTEXT_WELCOME_INFO_TITLE "欢迎使用 $(^NameDA) 卸载程序"
  ${LangFileString} MUI_UNTEXT_WELCOME_INFO_TEXT "此程序将引导你完成 $(^NameDA) 的卸载。$\r$\n$\r$\n在卸载之前，请确认 $(^NameDA) 已经关闭。$\r$\n$\r$\n$_CLICK"
!endif

!ifdef MUI_LICENSEPAGE
  ${LangFileString} MUI_TEXT_LICENSE_TITLE "许可证协议"
  ${LangFileString} MUI_TEXT_LICENSE_SUBTITLE "在安装 $(^NameDA) 之前，请阅读许可证条款。"
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM "如果你接受许可证的条款，请点击 [我同意(I)] 继续安装。你必须在同意后才能安装 $(^NameDA) 。"
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM_CHECKBOX "如果你接受许可证的条款，请点击勾选下方的选框。你必须在同意后才能安装 $(^NameDA)。$_CLICK"
  ${LangFileString} MUI_INNERTEXT_LICENSE_BOTTOM_RADIOBUTTONS "如果你接受许可证的条款，请选择下方第一个选项。你必须在同意后才能安装 $(^NameDA)。$_CLICK"
!endif

!ifdef MUI_UNLICENSEPAGE
  ${LangFileString} MUI_UNTEXT_LICENSE_TITLE "许可证协议"
  ${LangFileString} MUI_UNTEXT_LICENSE_SUBTITLE "在卸载 $(^NameDA) 之前，请阅读许可证条款。"
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM "如果你接受许可证的条款，请点击 [我同意(I)] 继续卸载。如果你点击 [取消(C)] ，卸载程序将会关闭。你必须在同意后才能卸载 $(^NameDA) 。"
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM_CHECKBOX "如果你接受许可证的条款，点击勾选下方的选框。你必须在同意后才能卸载 $(^NameDA)。$_CLICK"
  ${LangFileString} MUI_UNINNERTEXT_LICENSE_BOTTOM_RADIOBUTTONS "如果你接受许可证的条款，请选择下方第一个选项。你必须在同意后才能卸载 $(^NameDA)。$_CLICK"
!endif

!ifdef MUI_LICENSEPAGE | MUI_UNLICENSEPAGE
  ${LangFileString} MUI_INNERTEXT_LICENSE_TOP "要阅读协议的其余部分，请按 [PgDn] 键向下翻页。"
!endif

!ifdef MUI_COMPONENTSPAGE
  ${LangFileString} MUI_TEXT_COMPONENTS_TITLE "选择组件"
  ${LangFileString} MUI_TEXT_COMPONENTS_SUBTITLE "选择你想安装的 $(^NameDA) 功能组件。"
!endif

!ifdef MUI_UNCOMPONENTSPAGE
  ${LangFileString} MUI_UNTEXT_COMPONENTS_TITLE "选择组件"
  ${LangFileString} MUI_UNTEXT_COMPONENTS_SUBTITLE "选择你想卸载的 $(^NameDA) 功能组件。"
!endif

!ifdef MUI_COMPONENTSPAGE | MUI_UNCOMPONENTSPAGE
  ${LangFileString} MUI_INNERTEXT_COMPONENTS_DESCRIPTION_TITLE "组件描述"
  !ifndef NSIS_CONFIG_COMPONENTPAGE_ALTERNATIVE
    ${LangFileString} MUI_INNERTEXT_COMPONENTS_DESCRIPTION_INFO "将光标悬停在组件名称之上，即可显示它的功能描述。"
  !else
    ${LangFileString} MUI_INNERTEXT_COMPONENTS_DESCRIPTION_INFO "点击选中组件，即可显示它的功能描述。"
  !endif
!endif

!ifdef MUI_DIRECTORYPAGE
  ${LangFileString} MUI_TEXT_DIRECTORY_TITLE "选择安装位置"
  ${LangFileString} MUI_TEXT_DIRECTORY_SUBTITLE "选择 $(^NameDA) 的安装文件夹。"
!endif

!ifdef MUI_UNDIRECTORYPAGE
  ${LangFileString} MUI_UNTEXT_DIRECTORY_TITLE "选择卸载位置"
  ${LangFileString} MUI_UNTEXT_DIRECTORY_SUBTITLE "选择 $(^NameDA) 的卸载文件夹。"
!endif

!ifdef MUI_INSTFILESPAGE
  ${LangFileString} MUI_TEXT_INSTALLING_TITLE "正在安装"
  ${LangFileString} MUI_TEXT_INSTALLING_SUBTITLE "$(^NameDA) 正在安装，请稍候。"
  ${LangFileString} MUI_TEXT_FINISH_TITLE "安装完成"
  ${LangFileString} MUI_TEXT_FINISH_SUBTITLE "安装程序成功完成安装。"
  ${LangFileString} MUI_TEXT_ABORT_TITLE "安装中止"
  ${LangFileString} MUI_TEXT_ABORT_SUBTITLE "安装程序未能完成安装。"
!endif

!ifdef MUI_UNINSTFILESPAGE
  ${LangFileString} MUI_UNTEXT_UNINSTALLING_TITLE "正在卸载"
  ${LangFileString} MUI_UNTEXT_UNINSTALLING_SUBTITLE "$(^NameDA) 正在卸载，请稍候。"
  ${LangFileString} MUI_UNTEXT_FINISH_TITLE "卸载完成"
  ${LangFileString} MUI_UNTEXT_FINISH_SUBTITLE "卸载程序成功完成卸载。"
  ${LangFileString} MUI_UNTEXT_ABORT_TITLE "卸载中止"
  ${LangFileString} MUI_UNTEXT_ABORT_SUBTITLE "卸载程序未能完成卸载。"
!endif

!ifdef MUI_FINISHPAGE
  ${LangFileString} MUI_TEXT_FINISH_INFO_TITLE "$(^NameDA) 安装程序结束"
  ${LangFileString} MUI_TEXT_FINISH_INFO_TEXT "$(^NameDA) 已经成功安装到本机。$\r$\n点击 [完成(F)] 关闭安装程序。"
  ${LangFileString} MUI_TEXT_FINISH_INFO_REBOOT "必须重新启动本机才能完成 $(^NameDA) 的安装。是否立即重新启动？"
!endif

!ifdef MUI_UNFINISHPAGE
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_TITLE "$(^NameDA) 卸载程序结束"
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_TEXT "$(^NameDA) 已经成功从本机卸载。$\r$\n$\r$\n点击 [完成] 关闭卸载程序。"
  ${LangFileString} MUI_UNTEXT_FINISH_INFO_REBOOT "必须重新启动本机才能完成 $(^NameDA) 的卸载。是否立即重新启动？"
!endif

!ifdef MUI_FINISHPAGE | MUI_UNFINISHPAGE
  ${LangFileString} MUI_TEXT_FINISH_REBOOTNOW "是，立即重新启动(&Y)"
  ${LangFileString} MUI_TEXT_FINISH_REBOOTLATER "否，我会在之后重新启动(&N)"
  ${LangFileString} MUI_TEXT_FINISH_RUN "运行 $(^NameDA)(&R)"
  ${LangFileString} MUI_TEXT_FINISH_SHOWREADME "显示自述文件(&M)"
  ${LangFileString} MUI_BUTTONTEXT_FINISH "完成(&F)"  
!endif

!ifdef MUI_STARTMENUPAGE
  ${LangFileString} MUI_TEXT_STARTMENU_TITLE "选择开始菜单文件夹"
  ${LangFileString} MUI_TEXT_STARTMENU_SUBTITLE "选择开始菜单文件夹，用于创建程序的快捷方式。"
  ${LangFileString} MUI_INNERTEXT_STARTMENU_TOP "选择开始菜单文件夹，用于创建程序的快捷方式。你也可以输入自定义名称，创建新文件夹。"
  ${LangFileString} MUI_INNERTEXT_STARTMENU_CHECKBOX "不要创建快捷方式(&N)"
!endif

!ifdef MUI_UNCONFIRMPAGE
  ${LangFileString} MUI_UNTEXT_CONFIRM_TITLE "卸载 $(^NameDA)"
  ${LangFileString} MUI_UNTEXT_CONFIRM_SUBTITLE "从本机卸载 $(^NameDA) 。"
!endif

!ifdef MUI_ABORTWARNING
  ${LangFileString} MUI_TEXT_ABORTWARNING "确定要退出 $(^Name) 安装程序吗？"
!endif

!ifdef MUI_UNABORTWARNING
  ${LangFileString} MUI_UNTEXT_ABORTWARNING "确定要退出 $(^Name) 卸载程序吗？"
!endif

!ifdef MULTIUSER_INSTALLMODEPAGE
  ${LangFileString} MULTIUSER_TEXT_INSTALLMODE_TITLE "选择用户"
  ${LangFileString} MULTIUSER_TEXT_INSTALLMODE_SUBTITLE "选择为哪些用户安装 $(^NameDA) 。"
  ${LangFileString} MULTIUSER_INNERTEXT_INSTALLMODE_TOP "选择只为自己安装 $(^NameDA) ，还是为本机的所有用户安装。 $(^ClickNext)"
  ${LangFileString} MULTIUSER_INNERTEXT_INSTALLMODE_ALLUSERS "为本机所有用户安装(&A)"
  ${LangFileString} MULTIUSER_INNERTEXT_INSTALLMODE_CURRENTUSER "只为我自己安装(&M)"
!endif
