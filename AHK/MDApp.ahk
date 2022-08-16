PID := DllCall("GetCurrentProcessId")
SysGet, NumMons, MonitorCount
#Include Neutron.ahk

#NoEnv
SetBatchLines, -1
CoordMode, Mouse, Screen

Gui, Add, Text, x12 y9 w320 h30 , Drag this on the window you want to use Macro Deck on and press OK.
Gui, Add, Button, gOK x202 y39 w130 h30 , OK
; Generated using SmartGUI Creator for SciTE
Gui, Show, w350 h80, Macro Deck App Client
return

OK:
Loop, % NumMons {
	SysGet, Mon%a_index%, MonitorWorkArea, %a_index%
	WinGetPos, x, y, w, h, ahk_pid %PID%
	If (x > Mon%a_index%Left && x < Mon%a_index%Right && y > Mon%a_index%Top && y < Mon%a_index%Bottom)
		M := A_Index
}

title = Macro Deck WebClient Program

URLDownloadToFile, https://github.com/jbcarreon123/MacroDeckWebClientProgram/archive/refs/heads/main.zip, %A_Temp%\mdweb.zip
RunWait cmd.exe /c mkdir %A_Temp%\mdweb,
// RunWait PowerShell.exe -Command Expand-Archive -LiteralPath '%A_Temp%\mdweb.zip' -DestinationPath '%A_Temp%\mdweb',, Hide

name := new NeutronWindow()
name.Load(A_Temp . "\mdweb\MacroDeckWebClientProgram-main\index.html")

name.Show(Center "x" x " y" y " w" A_ScreenWidth " h" A_ScreenHeight)
return

Clicked(neutron, event)
{
	ExitApp
}

#If WinActive("ahk_pid " PID)
!F4::return
#If

GuiClose:
ExitApp