# Active GitHub Pages avec la source "GitHub Actions" (build_type workflow) via l'API.
# Usage (PowerShell) :
#   $env:GITHUB_TOKEN = "ghp_xxxxxxxx"   # PAT classique avec scope "repo", ou fine-grained avec Pages + Administration en écriture
#   .\scripts\Enable-GitHubPages.ps1
#
# Ne commitez jamais le token. Révoquez le PAT après usage si c'était un jeton jetable.

$ErrorActionPreference = 'Stop'

$token = $env:GITHUB_TOKEN
if (-not $token) {
    Write-Error "Definissez la variable d'environnement GITHUB_TOKEN (PAT GitHub)."
}

$remote = git remote get-url origin 2>$null
if (-not $remote) { Write-Error "Aucun remote 'origin'. Lancez ce script depuis la racine du depot." }

if ($remote -match 'github\.com[:/]([^/]+)/([^/]+?)(?:\.git)?$') {
    $Owner = $Matches[1]
    $Repo = $Matches[2]
} else {
    Write-Error "Impossible de parser owner/repo depuis : $remote"
}

$uri = "https://api.github.com/repos/$Owner/$Repo/pages"
$headers = @{
    Authorization = "Bearer $token"
    Accept        = "application/vnd.github+json"
    'X-GitHub-Api-Version' = '2022-11-28'
}

$bodyObj = @{
    build_type = 'workflow'
    source     = @{
        branch = 'main'
        path   = '/'
    }
}
$body = $bodyObj | ConvertTo-Json -Depth 5

Write-Host "Depot: $Owner/$Repo"
Write-Host "POST $uri (creation du site Pages en mode workflow)..."

try {
    Invoke-RestMethod -Uri $uri -Method Post -Headers $headers -Body $body -ContentType 'application/json'
    Write-Host "OK : site Pages cree (source GitHub Actions)."
    exit 0
} catch {
    $resp = $_.Exception.Response
    if ($resp -and $resp.StatusCode -eq 409) {
        Write-Host "Site deja present : passage en PUT (mise a jour build_type workflow)..."
        try {
            Invoke-RestMethod -Uri $uri -Method Put -Headers $headers -Body $body -ContentType 'application/json'
            Write-Host "OK : Pages mis a jour (workflow)."
            exit 0
        } catch {
            Write-Error $_
        }
    }
    Write-Error $_
}
