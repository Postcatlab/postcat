del ".\SetupScripts\app.7z"
@set unpacked_file_path=%1

7z.exe a ".\SetupScripts\app.7z" ".\%unpacked_file_path%\*.*" -r