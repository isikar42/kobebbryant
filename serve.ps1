# Small local web server for previewing the site without installing anything.
# Usage: powershell -ExecutionPolicy Bypass -File serve.ps1 [-Root kobebbryant-main] [-Port 8080]
param([string]$Root = (Join-Path $PSScriptRoot 'kobebbryant-main'), [int]$Port = 8080)

$Root = [IO.Path]::GetFullPath($Root)
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Serving $Root on http://localhost:$Port/"

$types = @{
  '.html' = 'text/html; charset=utf-8'; '.css' = 'text/css'; '.js' = 'application/javascript'
  '.svg' = 'image/svg+xml'; '.png' = 'image/png'; '.jpg' = 'image/jpeg'; '.ico' = 'image/x-icon'
  '.json' = 'application/json'; '.xml' = 'application/xml'; '.txt' = 'text/plain; charset=utf-8'
}

function Resolve-SiteFile([string]$urlPath) {
  $rel = [Uri]::UnescapeDataString($urlPath).TrimStart('/')
  if ($rel -eq '') { $rel = 'index.html' }
  $base = [IO.Path]::GetFullPath((Join-Path $Root $rel))
  if (-not $base.StartsWith($Root)) { return $null }
  # Clean URLs: /pricing -> pricing.html, /agents/darkhawk -> agents/darkhawk.html
  $candidates = if ([IO.Path]::GetExtension($base)) { @($base) } else { @("$base.html", (Join-Path $base 'index.html')) }
  foreach ($c in $candidates) { if (Test-Path $c -PathType Leaf) { return $c } }
  return $null
}

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $file = Resolve-SiteFile $ctx.Request.Url.AbsolutePath
  if (-not $file) {
    $ctx.Response.StatusCode = 404
    $file = Join-Path $Root '404.html'
  }
  if (Test-Path $file -PathType Leaf) {
    $bytes = [IO.File]::ReadAllBytes($file)
    $ext = [IO.Path]::GetExtension($file).ToLower()
    $ctx.Response.ContentType = if ($types[$ext]) { $types[$ext] } else { 'application/octet-stream' }
    $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  }
  $ctx.Response.Close()
  Write-Host "$($ctx.Request.HttpMethod) $($ctx.Request.Url.AbsolutePath) $($ctx.Response.StatusCode)"
}
