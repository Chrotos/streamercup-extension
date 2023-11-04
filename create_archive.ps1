$winRar = "F:\WinRAR\Rar.exe"

Push-Location -Path $PSScriptRoot
try {
    Remove-Item -Path "public.zip" -ErrorAction SilentlyContinue
    # $files = Get-ChildItem -Path "public" -Directory -Exclude @("*.psd") | Compress-Archive -DestinationPath "public.zip" -Force -CompressionLevel Fastest
    &$winRar a -r -ep1 -m5  -x"*.psd" public.zip public/*
} finally {
    Pop-Location
}