# Inject shared scripts into all root HTML files
# Handles UTF-8 encoding properly and verifies injections

$repoPath = "C:\Users\kurto\Documents\GitHub\KODZEN-Website"
$scriptTags = @(
    '  <script src="js/navbar-fix.js"><\/script>',
    '  <script src="js/newsletter.js"><\/script>'
)

# Get all root HTML files (exclude subfolders)
$htmlFiles = Get-ChildItem -Path $repoPath -Filter "*.html" -File | Where-Object { $_.Name -notlike "_*" }

Write-Host "Found $($htmlFiles.Count) HTML files to process"

$injected = 0
$skipped = 0
$failed = 0

foreach ($file in $htmlFiles) {
    $filePath = $file.FullName
    $fileName = $file.Name
    
    # Read file with UTF-8 encoding
    $content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)
    
    # Check if scripts already present
    if ($content -match 'js/navbar-fix\.js') {
        Write-Host "⊘ [$fileName] already has scripts, skipping..."
        $skipped++
        continue
    }
    
    # Find insertion point (before </body> or </html>)
    if ($content -match '(.*?)</body>', ) {
        $insertPoint = '</body>'
    } elseif ($content -match '(.*?)</html>') {
        $insertPoint = '</html>'
    } else {
        Write-Host "✗ [$fileName] No closing body/html tag found, FAILED"
        $failed++
        continue
    }
    
    # Build script block
    $scriptsBlock = "  `<script src=`"js/navbar-fix.js`">`</script>`n  `<script src=`"js/newsletter.js`">`</script>`n"
    
    # Insert scripts before closing tag
    $newContent = $content -replace [regex]::Escape($insertPoint), ($scriptsBlock + $insertPoint)
    
    # Write back with UTF-8 encoding
    try {
        [System.IO.File]::WriteAllText($filePath, $newContent, [System.Text.Encoding]::UTF8)
        Write-Host "✓ [$fileName] Scripts injected successfully"
        $injected++
    } catch {
        Write-Host "✗ [$fileName] Write failed: $_"
        $failed++
    }
}

Write-Host "`n=== SUMMARY ==="
Write-Host "Injected: $injected"
Write-Host "Skipped:  $skipped (already present)"
Write-Host "Failed:   $failed"
