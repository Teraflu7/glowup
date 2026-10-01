$ErrorActionPreference = 'Stop'

$projectRoot = $PSScriptRoot
$buildRoot = Join-Path $env:TEMP 'glowup-report-docx-build'
$targetPath = Join-Path $projectRoot 'REPORT.docx'

if (Test-Path $buildRoot) {
  Remove-Item -LiteralPath $buildRoot -Recurse -Force
}

$null = New-Item -ItemType Directory -Path (Join-Path $buildRoot '_rels') -Force
$null = New-Item -ItemType Directory -Path (Join-Path $buildRoot 'word\_rels') -Force
$null = New-Item -ItemType Directory -Path (Join-Path $buildRoot 'word\report-assets') -Force

$contentTypes = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Default Extension="html" ContentType="text/html"/>
  <Default Extension="png" ContentType="image/png"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>
'@

$packageRelationships = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>
'@

$documentXml = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    <w:altChunk r:id="htmlChunk1"/>
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134"/>
    </w:sectPr>
  </w:body>
</w:document>
'@

$documentRelationships = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="htmlChunk1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/aFChunk" Target="report.html"/>
</Relationships>
'@

$utf8 = [System.Text.UTF8Encoding]::new($false)
[System.IO.File]::WriteAllText((Join-Path $buildRoot '[Content_Types].xml'), $contentTypes, $utf8)
[System.IO.File]::WriteAllText((Join-Path $buildRoot '_rels\.rels'), $packageRelationships, $utf8)
[System.IO.File]::WriteAllText((Join-Path $buildRoot 'word\document.xml'), $documentXml, $utf8)
[System.IO.File]::WriteAllText((Join-Path $buildRoot 'word\_rels\document.xml.rels'), $documentRelationships, $utf8)

Copy-Item -LiteralPath (Join-Path $projectRoot 'REPORT.html') -Destination (Join-Path $buildRoot 'word\report.html')
Copy-Item -LiteralPath (Join-Path $projectRoot 'report-assets\home-desktop.png') -Destination (Join-Path $buildRoot 'word\report-assets\home-desktop.png')
Copy-Item -LiteralPath (Join-Path $projectRoot 'report-assets\home-mobile.png') -Destination (Join-Path $buildRoot 'word\report-assets\home-mobile.png')
Copy-Item -LiteralPath (Join-Path $projectRoot 'report-assets\blog-carousel.png') -Destination (Join-Path $buildRoot 'word\report-assets\blog-carousel.png')
Copy-Item -LiteralPath (Join-Path $projectRoot 'report-assets\about-form.png') -Destination (Join-Path $buildRoot 'word\report-assets\about-form.png')

Add-Type -AssemblyName System.IO.Compression.FileSystem
Add-Type -AssemblyName System.IO.Compression
if (Test-Path $targetPath) {
  Remove-Item -LiteralPath $targetPath -Force
}

$archive = [System.IO.Compression.ZipFile]::Open($targetPath, [System.IO.Compression.ZipArchiveMode]::Create)
try {
  Get-ChildItem -LiteralPath $buildRoot -Recurse -File | ForEach-Object {
    $entryName = $_.FullName.Substring($buildRoot.Length + 1).Replace('\', '/')
    $entry = $archive.CreateEntry($entryName, [System.IO.Compression.CompressionLevel]::Optimal)
    $entryStream = $entry.Open()
    $fileStream = $_.OpenRead()
    try {
      $fileStream.CopyTo($entryStream)
    } finally {
      $fileStream.Dispose()
      $entryStream.Dispose()
    }
  }
} finally {
  $archive.Dispose()
}
Remove-Item -LiteralPath $buildRoot -Recurse -Force

Write-Output "Created $targetPath"
