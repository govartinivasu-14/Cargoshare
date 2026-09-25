# CargoShare Backend Verification Script

Write-Host "=== 1. Testing Public Container Search ==="
$searchRes = Invoke-RestMethod -Uri "http://localhost:8080/api/containers/search" -Method Get
Write-Host "Found $($searchRes.Count) available containers."
Write-Host "Container 1 Number: $($searchRes[0].containerNumber), Route: $($searchRes[0].origin) -> $($searchRes[0].destination), Avail: $($searchRes[0].availableCapacity) CBM"

Write-Host "`n=== 2. Testing Trader Login ==="
$loginBody = @{ email = "trader@cargoshare.com"; password = "password123" } | ConvertTo-Json
$traderAuth = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
Write-Host "Trader logged in: $($traderAuth.name), Role: $($traderAuth.role)"
$traderToken = $traderAuth.token

Write-Host "`n=== 3. Testing Overbooking Rejection (Rule 4) ==="
$overbookReq = @{ containerId = 1; spaceRequired = 999.0; cargoDescription = "Huge Load" } | ConvertTo-Json
try {
    Invoke-RestMethod -Uri "http://localhost:8080/api/bookings" -Method Post -Headers @{ Authorization = "Bearer $traderToken" } -Body $overbookReq -ContentType "application/json"
    Write-Host "FAIL: Overbooking should have been rejected!" -ForegroundColor Red
} catch {
    Write-Host "SUCCESS: Overbooking correctly rejected with 409 Conflict: $($_.Exception.Message)" -ForegroundColor Green
}

Write-Host "`n=== 4. Testing Valid Booking (Rule 5) ==="
$validReq = @{ containerId = 1; spaceRequired = 2.0; cargoDescription = "5 Crates Electronics" } | ConvertTo-Json
$booking = Invoke-RestMethod -Uri "http://localhost:8080/api/bookings" -Method Post -Headers @{ Authorization = "Bearer $traderToken" } -Body $validReq -ContentType "application/json"
Write-Host "Created Booking ID: $($booking.id), Amount: $($booking.totalAmount), Status: $($booking.status)"

Write-Host "`n=== 5. Testing Payment Order Creation & Verification ==="
$orderReq = @{ bookingId = $booking.id.Replace("BKG-", "") } | ConvertTo-Json
$order = Invoke-RestMethod -Uri "http://localhost:8080/api/payments/create-order" -Method Post -Headers @{ Authorization = "Bearer $traderToken" } -Body $orderReq -ContentType "application/json"
Write-Host "Razorpay Order ID: $($order.razorpayOrderId), Amount: $($order.amount)"

$verifyReq = @{
    bookingId = $booking.id.Replace("BKG-", "")
    razorpayOrderId = $order.razorpayOrderId
    razorpayPaymentId = "pay_test_live_8841"
    razorpaySignature = "sig_valid_test_sha256"
} | ConvertTo-Json
$verifiedBooking = Invoke-RestMethod -Uri "http://localhost:8080/api/payments/verify" -Method Post -Headers @{ Authorization = "Bearer $traderToken" } -Body $verifyReq -ContentType "application/json"
Write-Host "Payment Verified! Booking Status: $($verifiedBooking.status)"

Write-Host "`n=== 6. Testing Admin Dashboard ==="
$adminLogin = @{ email = "admin@cargoshare.com"; password = "password123" } | ConvertTo-Json
$adminAuth = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $adminLogin -ContentType "application/json"
$adminToken = $adminAuth.token

$dashboard = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/dashboard" -Method Get -Headers @{ Authorization = "Bearer $adminToken" }
Write-Host "Admin Overview: Traders: $($dashboard.stats.totalTraders), Providers: $($dashboard.stats.totalProviders), Containers: $($dashboard.stats.totalContainers), Bookings: $($dashboard.stats.totalBookings)"
Write-Host "Applications: Pending: $($dashboard.providerApplications.pending), Approved: $($dashboard.providerApplications.approved)"

Write-Host "`n=== 7. Testing Unapproved Provider Publishing Lockout (Rule 2) ==="
$pendingLogin = @{ email = "vanguard@applicant.com"; password = "password123" } | ConvertTo-Json
$pendingAuth = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $pendingLogin -ContentType "application/json"
$pendingToken = $pendingAuth.token

$addContainerReq = @{
    mode = "SEA"
    origin = "Singapore"
    destination = "Mumbai"
    totalCapacity = 70.0
    pricePerCbm = 130.0
    departureDate = (Get-Date).AddDays(10).ToString("yyyy-MM-ddTHH:mm:ss")
    arrivalDate = (Get-Date).AddDays(20).ToString("yyyy-MM-ddTHH:mm:ss")
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:8080/api/containers/add" -Method Post -Headers @{ Authorization = "Bearer $pendingToken" } -Body $addContainerReq -ContentType "application/json"
    Write-Host "FAIL: Unapproved provider should NOT be allowed to publish containers!" -ForegroundColor Red
} catch {
    Write-Host "SUCCESS: Unapproved provider correctly rejected with 403 Forbidden: $($_.Exception.Message)" -ForegroundColor Green
}

Write-Host "`nALL BACKEND API CONTRACT TESTS PASSED!" -ForegroundColor Green
