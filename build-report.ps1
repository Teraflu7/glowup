$ErrorActionPreference = 'Stop'

$projectRoot = $PSScriptRoot
$builder = Join-Path $projectRoot 'build-report.py'

$python = Get-Command py -ErrorAction SilentlyContinue
if ($null -ne $python) {
  & $python.Source -3 $builder
  exit $LASTEXITCODE
}

$python = Get-Command python -ErrorAction SilentlyContinue
if ($null -ne $python) {
  & $python.Source $builder
  exit $LASTEXITCODE
}

throw 'Python 3 is required. Install python-docx with: python -m pip install python-docx'
