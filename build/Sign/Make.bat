@echo off

rem -------------------------------------
set pfx_password=%3
rem set timestamp=http://timestamp.verisign.com/scripts/timestamp.dll
rem set timestamp=http://timestamp.globalsign.com/scripts/timstamp.dll
set timestamp=http://timestamp.digicert.com
@rem set timestamp=http://rfc3161timestamp.globalsign.com/standard
@rem set timestamp=http://timestamp.entrust.net/TSS/AuthenticodeTS
@rem set timestamp=http://time.certum.pl
@rem set timestamp=http://rfc3161timestamp.globalsign.com/advanced
@rem set timestamp=http://tsa.wosign.com/timestamp

:doSign
	echo "doSign %1-------"
	signtool.exe sign /f %2  /p "%pfx_password%" /t %timestamp% /du %4 "%1"
    if errorlevel 2 goto :doSign
    if errorlevel 1 goto :doSign
    if errorlevel 0 goto :eof
    :offline
    echo "no network"
    pause
    exit

