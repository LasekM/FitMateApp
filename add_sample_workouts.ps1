# FitMate - Add Sample Workout Sessions
# This script adds 2 completed workout sessions from the past

$TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjM5OTJjM2Y0LTllNzgtNDk2MS05ZTIxLTIyM2I1MjhiYzMzYSIsInN1YiI6IjM5OTJjM2Y0LTllNzgtNDk2MS05ZTIxLTIyM2I1MjhiYzMzYSIsImVtYWlsIjoiYWRtaW5AZml0bWF0ZS5sb2NhbCIsInByZWZlcnJlZF91c2VybmFtZSI6ImFkbWluIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImFkbWluIiwianRpIjoiNjAxMjA2MjUtZmM4NS00NTg5LWExYzItY2I1ZTcxMzNhMDg0IiwiaWF0IjoxNzY0MDE5Mzc2LCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBZG1pbiIsIm5iZiI6MTc2NDAxOTM3NiwiZXhwIjoxNzY0MDIyOTc2LCJpc3MiOiJGaXRNYXRlQmFja2VuZCIsImF1ZCI6IkZpdE1hdGVDbGllbnQifQ.laQKMnZ56xe1l0Zcfyl2fR7CA2_gRGAj82OA4mwzYtI"
$BASE_URL = "http://localhost:8080"
$HEADERS = @{
    "Authorization" = "Bearer $TOKEN"
    "Content-Type" = "application/json"
}

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "FitMate - Adding Sample Workouts" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Create a Training Plan
Write-Host "[1/10] Creating training plan..." -ForegroundColor Yellow
$planBody = @{
    planName = "Upper Body Strength"
    type = "Push"
    notes = "Focus on chest and shoulders"
    exercises = @(
        @{
            name = "Bench Press"
            rest = 120
            sets = @(
                @{ reps = 8; weight = 80 }
                @{ reps = 8; weight = 80 }
                @{ reps = 6; weight = 85 }
            )
        }
        @{
            name = "Overhead Press"
            rest = 90
            sets = @(
                @{ reps = 10; weight = 50 }
                @{ reps = 10; weight = 50 }
                @{ reps = 8; weight = 52.5 }
            )
        }
    )
} | ConvertTo-Json -Depth 10

$plan = Invoke-RestMethod -Uri "$BASE_URL/api/plans" -Method Post -Headers $HEADERS -Body $planBody
Write-Host "✓ Plan created: $($plan.planName) (ID: $($plan.id))" -ForegroundColor Green

# ========================================
# WORKOUT 1 - 5 days ago
# ========================================
Write-Host ""
Write-Host "Creating Workout #1 (5 days ago)..." -ForegroundColor Cyan

# Get date 5 days ago
$date1 = (Get-Date).AddDays(-5).ToString("yyyy-MM-dd")
$startTime1 = (Get-Date).AddDays(-5).AddHours(-2).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
$endTime1 = (Get-Date).AddDays(-5).AddHours(-1).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")

# Schedule workout 1
Write-Host "[2/10] Scheduling workout 1 for $date1..." -ForegroundColor Yellow
$scheduleBody1 = @{
    date = $date1
    time = "18:00"
    planId = $plan.id
    status = "planned"
    visibleToFriends = $false
} | ConvertTo-Json

$scheduled1 = Invoke-RestMethod -Uri "$BASE_URL/api/scheduled" -Method Post -Headers $HEADERS -Body $scheduleBody1
Write-Host "✓ Scheduled (ID: $($scheduled1.id))" -ForegroundColor Green

# Start session 1
Write-Host "[3/10] Starting session 1..." -ForegroundColor Yellow
$startBody1 = @{
    scheduledId = $scheduled1.id
} | ConvertTo-Json

$session1 = Invoke-RestMethod -Uri "$BASE_URL/api/sessions/start" -Method Post -Headers $HEADERS -Body $startBody1
Write-Host "✓ Session started (ID: $($session1.id))" -ForegroundColor Green

# Update sets for session 1
Write-Host "[4/10] Recording performance for session 1..." -ForegroundColor Yellow

# Bench Press sets
$setIds1 = $session1.exercises[0].sets
foreach ($i in 0..2) {
    $setBody = @{
        repsDone = @(8, 8, 7)[$i]
        weightDone = @(80, 80, 85)[$i]
        rpe = @(7, 8, 9)[$i]
        isFailure = $false
    } | ConvertTo-Json
    
    Invoke-RestMethod -Uri "$BASE_URL/api/sessions/$($session1.id)/sets/$($setIds1[$i].id)" -Method Patch -Headers $HEADERS -Body $setBody | Out-Null
}

# Overhead Press sets
$setIds2 = $session1.exercises[1].sets
foreach ($i in 0..2) {
    $setBody = @{
        repsDone = @(10, 10, 9)[$i]
        weightDone = @(50, 50, 52.5)[$i]
        rpe = @(6, 7, 8)[$i]
        isFailure = $false
    } | ConvertTo-Json
    
    Invoke-RestMethod -Uri "$BASE_URL/api/sessions/$($session1.id)/sets/$($setIds2[$i].id)" -Method Patch -Headers $HEADERS -Body $setBody | Out-Null
}
Write-Host "✓ All sets recorded" -ForegroundColor Green

# Complete session 1
Write-Host "[5/10] Completing session 1..." -ForegroundColor Yellow
$completeBody1 = @{
    completedAtUtc = $endTime1
    sessionNotes = "Great workout! Felt strong on bench press"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$BASE_URL/api/sessions/$($session1.id)/complete" -Method Post -Headers $HEADERS -Body $completeBody1 | Out-Null
Write-Host "✓ Session 1 completed!" -ForegroundColor Green

# ========================================
# WORKOUT 2 - 10 days ago
# ========================================
Write-Host ""
Write-Host "Creating Workout #2 (10 days ago)..." -ForegroundColor Cyan

$date2 = (Get-Date).AddDays(-10).ToString("yyyy-MM-dd")
$startTime2 = (Get-Date).AddDays(-10).AddHours(-2).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
$endTime2 = (Get-Date).AddDays(-10).AddHours(-1).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")

# Schedule workout 2
Write-Host "[6/10] Scheduling workout 2 for $date2..." -ForegroundColor Yellow
$scheduleBody2 = @{
    date = $date2
    time = "17:30"
    planId = $plan.id
    status = "planned"
    visibleToFriends = $false
} | ConvertTo-Json

$scheduled2 = Invoke-RestMethod -Uri "$BASE_URL/api/scheduled" -Method Post -Headers $HEADERS -Body $scheduleBody2
Write-Host "✓ Scheduled (ID: $($scheduled2.id))" -ForegroundColor Green

# Start session 2
Write-Host "[7/10] Starting session 2..." -ForegroundColor Yellow
$startBody2 = @{
    scheduledId = $scheduled2.id
} | ConvertTo-Json

$session2 = Invoke-RestMethod -Uri "$BASE_URL/api/sessions/start" -Method Post -Headers $HEADERS -Body $startBody2
Write-Host "✓ Session started (ID: $($session2.id))" -ForegroundColor Green

# Update sets for session 2
Write-Host "[8/10] Recording performance for session 2..." -ForegroundColor Yellow

# Bench Press sets (slightly lower weights)
$setIds1 = $session2.exercises[0].sets
foreach ($i in 0..2) {
    $setBody = @{
        repsDone = @(8, 8, 6)[$i]
        weightDone = @(75, 77.5, 80)[$i]
        rpe = @(7, 7, 8)[$i]
        isFailure = $false
    } | ConvertTo-Json
    
    Invoke-RestMethod -Uri "$BASE_URL/api/sessions/$($session2.id)/sets/$($setIds1[$i].id)" -Method Patch -Headers $HEADERS -Body $setBody | Out-Null
}

# Overhead Press sets
$setIds2 = $session2.exercises[1].sets
foreach ($i in 0..2) {
    $setBody = @{
        repsDone = @(10, 9, 8)[$i]
        weightDone = @(47.5, 50, 50)[$i]
        rpe = @(6, 7, 8)[$i]
        isFailure = $false
    } | ConvertTo-Json
    
    Invoke-RestMethod -Uri "$BASE_URL/api/sessions/$($session2.id)/sets/$($setIds2[$i].id)" -Method Patch -Headers $HEADERS -Body $setBody | Out-Null
}
Write-Host "✓ All sets recorded" -ForegroundColor Green

# Complete session 2
Write-Host "[9/10] Completing session 2..." -ForegroundColor Yellow
$completeBody2 = @{
    completedAtUtc = $endTime2
    sessionNotes = "Good session, building up strength progressively"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$BASE_URL/api/sessions/$($session2.id)/complete" -Method Post -Headers $HEADERS -Body $completeBody2 | Out-Null
Write-Host "✓ Session 2 completed!" -ForegroundColor Green

# Summary
Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "✓ SUCCESS!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Created:" -ForegroundColor White
Write-Host "  • 1 Training Plan: $($plan.planName)" -ForegroundColor White
Write-Host "  • 2 Completed Workouts:" -ForegroundColor White
Write-Host "    - Workout 1: $date1" -ForegroundColor White
Write-Host "    - Workout 2: $date2" -ForegroundColor White
Write-Host ""
Write-Host "Refresh your Statistics page to see the data!" -ForegroundColor Yellow
Write-Host ""
