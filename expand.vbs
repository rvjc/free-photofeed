Const ForReading = 1 
Const ForWriting = 2

Dim TextLine

Set WshShell = WScript.CreateObject("WScript.Shell")
Set FSO = WScript.CreateObject("Scripting.FileSystemObject")

FSO.CreateTextFile("photofeed.xml")
 
Set SkelFile = FSO.GetFile(".\src\photofeed-skeleton.xml")
Set CommFile = FSO.GetFile("photofeed-common.js")
Set ConfFile = FSO.GetFile("photofeed-config.js")
Set HomeFile = FSO.GetFile("photofeed-home.js")

Set DestFile = FSO.GetFile("photofeed.xml")

Set Skel = SkelFile.OpenAsTextStream( forReading)
Set Comm = CommFile.OpenAsTextStream( forReading)
Set Conf = ConfFile.OpenAsTextStream( forReading)
Set Home = HomeFile.OpenAsTextStream( forReading)

Set Dest = DestFile.OpenAsTextStream( forWriting, 0 ) 
   
Do While Not Skel.AtEndOfStream 
     
    TextLine=Skel.ReadLine 
	
	If Trim(TextLine) = "//<common>//" Then
		Do While Not Comm.AtEndOfStream
			Dest.WriteLine Comm.ReadLine
		Loop
	ElseIf Trim(TextLine) = "//<config>//" Then
		Do While Not Conf.AtEndOfStream
			Dest.WriteLine Conf.ReadLine
		Loop
	ElseIf Trim(TextLine) = "//<home>//" Then
		Do While Not Home.AtEndOfStream
			Dest.WriteLine Home.ReadLine
		Loop
	Else
		Dest.WriteLine TextLine
	End If

Loop 
 
Skel.Close
Comm.Close
Conf.Close
Home.Close

Dest.Close 
   
WScript.Quit