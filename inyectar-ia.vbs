Set objShell = CreateObject("WScript.Shell")
strRegPath = "HKCU\Software\Microsoft\Windows\CurrentVersion\Run\IA_Semana_Ingenieria"
objShell.RegWrite strRegPath, "node C:\Users\Dell\chat-total-cmd\chat-ollama.js", "REG_SZ"
MsgBox "Asistente IA indexado con exito. El icono aparecera al lado del reloj.", 64, "IA Semana de la Ingenieria"
