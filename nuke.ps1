# nuke.ps1
# This script removes all node_modules and lock files in the repository.
# Usage: .\nuke.ps1

Write-Host "--- Repository Deep Clean ---" -ForegroundColor Cyan

$root = Get-Location
$skipDirs = @(".git", ".turbo", ".next", ".expo")

Function Clean-Directory($path) {
    Try {
        $items = Get-ChildItem -Path $path -Force -ErrorAction Stop
    } Catch {
        Return
    }

    foreach ($item in $items) {
        if ($item.PSIsContainer) {
            if ($item.Name -eq "node_modules") {
                Write-Host "Removing directory: $($item.FullName)" -ForegroundColor Yellow
                Remove-Item -Path $item.FullName -Recurse -Force -ErrorAction SilentlyContinue
            } elseif ($skipDirs -notcontains $item.Name) {
                Clean-Directory $item.FullName
            }
        } else {
            if ($item.Name -eq "pnpm-lock.yaml" -or $item.Name -eq "package-lock.json" -or $item.Name -eq "yarn.lock") {
                Write-Host "Removing file:      $($item.FullName)" -ForegroundColor Yellow
                Remove-Item -Path $item.FullName -Force -ErrorAction SilentlyContinue
            }
        }
    }
}

Clean-Directory $root
Write-Host "Cleanup complete!" -ForegroundColor Green
