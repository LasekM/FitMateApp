# FitMate - Add Sample Workouts
# Adds 2 completed workout sessions from the past

$TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjM5OTJjM2Y0LTllNzgtNDk2MS05ZTIxLTIyM2I1MjhiYzMzYSIsInN1YiI6IjM5OTJjM2Y0LTllNzgtNDk2MS05ZTIxLTIyM2I1MjhiYzMzYSIsImVtYWlsIjoiYWRtaW5AZml0bWF0ZS5sb2NhbCIsInByZWZlcnJlZF91c2VybmFtZSI6ImFkbWluIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImFkbWluIiwianRpIjoiNjAxMjA2MjUtZmM4NS00NTg5LWExYzItY2I1ZTcxMzNhMDg0IiwiaWF0IjoxNzY0MDE5Mzc2LCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBZG1pbiIsIm5iZiI6MTc2NDAxOTM3NiwiZXhwIjoxNzY0MDIyOTc2LCJpc3MiOiJGaXRNYXRlQmFja2VuZCIsImF1ZCI6IkZpdE1hdGVDbGllbnQifQ.laQKMnZ56xe1l0Zcfyl2fR7CA2_gRGAj82OA4mwzYtI"
$BASE = "http://localhost:8080"
$H = @{"Authorization" = "Bearer $TOKEN"; "Content-Type" = "application/json"}

Write-Host "Creating plan..." -ForegroundColor Cyan
$planJson = '{"planName":"Upper Body","type":"Push","notes":"Sample plan","exercises":[{"name":"Bench Press","rest":120,"sets":[{"reps":8,"weight":80},{"reps":8,"weight":80}]},{"name":"Overhead Press","rest":90,"sets":[{"reps":10,"weight":50},{"reps":10,"weight":50}]}]}'
$plan = Invoke-RestMethod -Uri "$BASE/api/plans" -Method Post -Headers $H -Body $planJson
Write-Host "Plan created: $($plan.id)" -ForegroundColor Green

# Workout 1 - 5 days ago
$date1 = (Get-Date).AddDays(-5).ToString("yyyy-MM-dd")
$end1 = (Get-Date).AddDays(-5).AddHours(-1).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")

Write-Host "Scheduling workout 1..." -ForegroundColor Cyan
$sched1Json = "{`"date`":`"$date1`",`"time`":`"18:00`",`"planId`":`"$($plan.id)`",`"status`":`"planned`",`"visibleToFriends`":false}"
$sched1 = Invoke-RestMethod -Uri "$BASE/api/scheduled" -Method Post -Headers $H -Body $sched1Json

Write-Host "Starting session 1..." -ForegroundColor Cyan
$start1Json = "{`"scheduledId`":`"$($sched1.id)`"}"
$sess1 = Invoke-RestMethod -Uri "$BASE/api/sessions/start" -Method Post -Headers $H -Body $start1Json

Write-Host "Recording sets..." -ForegroundColor Cyan
$s1 = $sess1.exercises[0].sets[0].id
$s2 = $sess1.exercises[0].sets[1].id
$s3 = $sess1.exercises[1].sets[0].id
$s4 = $sess1.exercises[1].sets[1].id

Invoke-RestMethod -Uri "$BASE/api/sessions/$($sess1.id)/sets/$s1" -Method Patch -Headers $H -Body '{"repsDone":8,"weightDone":80,"rpe":7,"isFailure":false}' | Out-Null
Invoke-RestMethod -Uri "$BASE/api/sessions/$($sess1.id)/sets/$s2" -Method Patch -Headers $H -Body '{"repsDone":8,"weightDone":80,"rpe":8,"isFailure":false}' | Out-Null
Invoke-RestMethod -Uri "$BASE/api/sessions/$($sess1.id)/sets/$s3" -Method Patch -Headers $H -Body '{"repsDone":10,"weightDone":50,"rpe":6,"isFailure":false}' | Out-Null
Invoke-RestMethod -Uri "$BASE/api/sessions/$($sess1.id)/sets/$s4" -Method Patch -Headers $H -Body '{"repsDone":10,"weightDone":50,"rpe":7,"isFailure":false}' | Out-Null

Write-Host "Completing session 1..." -ForegroundColor Cyan
$comp1Json = "{`"completedAtUtc`":`"$end1`",`"sessionNotes`":`"Great workout!`"}"
Invoke-RestMethod -Uri "$BASE/api/sessions/$($sess1.id)/complete" -Method Post -Headers $H -Body $comp1Json | Out-Null
Write-Host "Session 1 done!" -ForegroundColor Green

# Workout 2 - 10 days ago
$date2 = (Get-Date).AddDays(-10).ToString("yyyy-MM-dd")
$end2 = (Get-Date).AddDays(-10).AddHours(-1).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")

Write-Host "Scheduling workout 2..." -ForegroundColor Cyan
$sched2Json = "{`"date`":`"$date2`",`"time`":`"17:30`",`"planId`":`"$($plan.id)`",`"status`":`"planned`",`"visibleToFriends`":false}"
$sched2 = Invoke-RestMethod -Uri "$BASE/api/scheduled" -Method Post -Headers $H -Body $sched2Json

Write-Host "Starting session 2..." -ForegroundColor Cyan
$start2Json = "{`"scheduledId`":`"$($sched2.id)`"}"
$sess2 = Invoke-RestMethod -Uri "$BASE/api/sessions/start" -Method Post -Headers $H -Body $start2Json

Write-Host "Recording sets..." -ForegroundColor Cyan
$s1 = $sess2.exercises[0].sets[0].id
$s2 = $sess2.exercises[0].sets[1].id
$s3 = $sess2.exercises[1].sets[0].id
$s4 = $sess2.exercises[1].sets[1].id

Invoke-RestMethod -Uri "$BASE/api/sessions/$($sess2.id)/sets/$s1" -Method Patch -Headers $H -Body '{"repsDone":8,"weightDone":75,"rpe":7,"isFailure":false}' | Out-Null
Invoke-RestMethod -Uri "$BASE/api/sessions/$($sess2.id)/sets/$s2" -Method Patch -Headers $H -Body '{"repsDone":8,"weightDone":77.5,"rpe":7,"isFailure":false}' | Out-Null
Invoke-RestMethod -Uri "$BASE/api/sessions/$($sess2.id)/sets/$s3" -Method Patch -Headers $H -Body '{"repsDone":10,"weightDone":47.5,"rpe":6,"isFailure":false}' | Out-Null
Invoke-RestMethod -Uri "$BASE/api/sessions/$($sess2.id)/sets/$s4" -Method Patch -Headers $H -Body '{"repsDone":9,"weightDone":50,"rpe":7,"isFailure":false}' | Out-Null

Write-Host "Completing session 2..." -ForegroundColor Cyan
$comp2Json = "{`"completedAtUtc`":`"$end2`",`"sessionNotes`":`"Building strength`"}"
Invoke-RestMethod -Uri "$BASE/api/sessions/$($sess2.id)/complete" -Method Post -Headers $H -Body $comp2Json | Out-Null
Write-Host "Session 2 done!" -ForegroundColor Green

Write-Host ""
Write-Host "SUCCESS! Added 2 workouts on $date1 and $date2" -ForegroundColor Green
Write-Host "Refresh Statistics page to see charts!" -ForegroundColor Yellow
