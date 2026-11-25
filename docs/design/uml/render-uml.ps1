# Requires a local PlantUML installation (plantuml command or plantuml.jar).
# Run from repository root: powershell -ExecutionPolicy Bypass -File docs/design/uml/render-uml.ps1
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
$files = Get-ChildItem $dir -Filter '*.puml'
if (Get-Command plantuml -ErrorAction SilentlyContinue) {
    foreach ($file in $files) { & plantuml -tpng -charset UTF-8 $file.FullName; if ($LASTEXITCODE -ne 0) { throw "PlantUML render failed: $($file.Name)" } }
} elseif ($env:PLANTUML_JAR -and (Test-Path $env:PLANTUML_JAR)) {
    foreach ($file in $files) { & java -jar $env:PLANTUML_JAR -tpng -charset UTF-8 $file.FullName; if ($LASTEXITCODE -ne 0) { throw "PlantUML render failed: $($file.Name)" } }
} else {
    throw 'PlantUML not found. Install PlantUML, or set PLANTUML_JAR to its jar file path.'
}
Write-Host "Rendered $($files.Count) UML diagram(s) from .puml source."
