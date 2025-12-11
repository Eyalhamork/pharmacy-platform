function Show-Tree {
    param([string]$Path = ".", [int]$Indent = 0)
    $items = Get-ChildItem -Path $Path -Force | Where-Object { 
        $_.Name -notin @('node_modules','.next','.git','dist','build','.vscode') 
    }
    foreach ($item in $items) {
        Write-Host ("  " * $Indent + "|-- " + $item.Name)
        if ($item.PSIsContainer) {
            Show-Tree -Path $item.FullName -Indent ($Indent + 1)
        }
    }
}
Show-Tree