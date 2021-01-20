scriptdir = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
CreateObject("Wscript.Shell").Run  scriptdir & "\discord-rpc-broker.exe", 0