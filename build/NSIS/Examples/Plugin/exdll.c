#include <windows.h>
#include <nsis/pluginapi.h> // nsis plugin

HINSTANCE g_hInstance;
HWND g_hwndParent;

// To work with Unicode version of NSIS, please use TCHAR-type
// functions for accessing the variables and the stack.

void __declspec(dllexport) myFunction(HWND hwndParent, int string_size, 
                                      LPTSTR variables, stack_t **stacktop,
                                      extra_parameters *extra, ...)
{
  EXDLL_INIT();
  g_hwndParent = hwndParent;


  // note if you want parameters from the stack, pop them off in order.
  // i.e. if you are called via exdll::myFunction file.dat read.txt
  // calling popstring() the first time would give you file.dat,
  // and the second time would give you read.txt. 
  // you should empty the stack of your parameters, and ONLY your
  // parameters.

  // do your stuff here
  {
    LPTSTR msgbuf = (LPTSTR) GlobalAlloc(GPTR, (3 + string_size + 1) * sizeof(*msgbuf));
    if (msgbuf)
    {
      wsprintf(msgbuf, TEXT("$0=%s"), getuservariable(INST_0));
      MessageBox(g_hwndParent, msgbuf, TEXT("Message from example plugin"), MB_OK);
      GlobalFree(msgbuf);
    }
  }
}


BOOL WINAPI DllMain(HINSTANCE hInst, ULONG ul_reason_for_call, LPVOID lpReserved)
{
  g_hInstance = hInst;
  return TRUE;
}
