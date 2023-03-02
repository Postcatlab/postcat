{
  NSIS ExDLL2 example
  Original is ExDLL
  (C) 2001 - Peter Windridge

  Changed with delphi unit nsis.pas
  by bernhard mayer

  Tested in Delphi 7.0
}

// Example NSIS code
{
Section
  exdll_with_unit::registerplugincallback

  StrCpy $0 "Hello"
  Push "World"
  exdll_with_unit::pop_dlg_push
  Pop $1
  DetailPrint $$0=$0
  DetailPrint $$1=$1

  GetFunctionAddress $0 nsistest
  Push $0
  exdll_with_unit::callnsisfunc
SectionEnd

Function nsistest
  DetailPrint "Hello from NSIS function"
FunctionEnd
}


library exdll;

uses
  nsis, windows;


procedure pop_dlg_push(const hwndParent: HWND; const string_size: integer; const variables: PChar; const stacktop: pointer); cdecl;
begin
  // set up global variables
  Init(hwndParent, string_size, variables, stacktop);

  NSISDialog(GetUserVariable(INST_0), 'The value of $0', MB_OK);
  NSISDialog(PopString, 'pop', MB_OK);
  PushString('Hello, this is a push');
  SetUserVariable(INST_0, 'This is user var $0');
end;


procedure callnsisfunc(const hwndParent: HWND; const string_size: integer; const variables: PChar; const stacktop: pointer; const extraparameters: pointer); cdecl;
var
  FuncAddr : String;
begin
  Init(hwndParent, string_size, variables, stacktop, extraparameters);

  FuncAddr := PopString();
  Call(FuncAddr);
end;


function mynsiscallback(const NSPIM: TNSPIM): Pointer; cdecl;
begin
  Result := nil;
  if NSPIM = NSPIM_UNLOAD then
    begin
      NSISDialog(PChar('NSPIM_UNLOAD is the final callback, goodbye...'), PChar('mynsiscallback'), MB_OK);
    end;
end;


procedure registerplugincallback(const hwndParent: HWND; const string_size: integer; const variables: PChar; const stacktop: pointer; const extraparameters: pointer); cdecl;
var
  ThisDllInstance : HMODULE;
begin
  Init(hwndParent, string_size, variables, stacktop, extraparameters);

  if g_extraparameters <> nil then
  begin
    ThisDllInstance := hInstance;
    TRegisterPluginCallback(g_extraparameters.RegisterPluginCallback)(ThisDllInstance, @mynsiscallback);
  end;
end;


exports pop_dlg_push;
exports callnsisfunc;
exports registerplugincallback;

begin
end.
