@echo off

if "%1"=="start" (
    set linkPath=%AppData%\Microsoft\Windows\Start Menu\Programs
) else (
    set linkPath=%USERPROFILE%\Desktop
)

set SCRIPT="%TEMP%\%RANDOM%-%RANDOM%-%RANDOM%-%RANDOM%.vbs"

echo Set oWS = WScript.CreateObject("WScript.Shell") >> %SCRIPT%
echo sLinkFile = "%linkPath%\Character Sheet Generator.lnk" >> %SCRIPT%
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> %SCRIPT%
echo oLink.TargetPath = "pythonw.exe" >> %SCRIPT%
echo oLink.Arguments = """%cd%\charactersheetgen\__main__.py""" >> %SCRIPT%
echo oLink.WindowStyle = 4 >> %SCRIPT%
echo oLink.Save >> %SCRIPT%

cscript /nologo %SCRIPT%
del %SCRIPT%