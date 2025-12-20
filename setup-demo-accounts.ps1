# Setup Demo Accounts for Project Showcase
# This script helps you create test accounts for different roles

Write-Host "=== Demo Accounts Setup Guide ===" -ForegroundColor Green
Write-Host "`nYou can run the frontend in different browsers with different roles!" -ForegroundColor Cyan
Write-Host "`n📋 How it works:" -ForegroundColor Yellow
Write-Host "1. Each browser has its own localStorage (separate sessions)" -ForegroundColor White
Write-Host "2. Backend supports multiple concurrent users" -ForegroundColor White
Write-Host "3. Each browser can login as different role simultaneously" -ForegroundColor White

Write-Host "`n👥 Recommended Demo Accounts:" -ForegroundColor Yellow

$demoAccounts = @(
    @{
        Name = "Patient Demo"
        Email = "patient@demo.com"
        Password = "patient123"
        Role = "Patient"
        License = ""
        Specialization = ""
    },
    @{
        Name = "Doctor Demo"
        Email = "doctor@demo.com"
        Password = "doctor123"
        Role = "Doctor"
        License = "MD-12345"
        Specialization = "Cardiology"
    }
)

Write-Host "`n📝 Demo Account Credentials:" -ForegroundColor Yellow
foreach ($account in $demoAccounts) {
    Write-Host "`n  Role: $($account.Role)" -ForegroundColor Cyan
    Write-Host "    Email: $($account.Email)" -ForegroundColor White
    Write-Host "    Password: $($account.Password)" -ForegroundColor White
    if ($account.Role -eq "Doctor") {
        Write-Host "    Medical License: $($account.License)" -ForegroundColor Gray
        Write-Host "    Specialization: $($account.Specialization)" -ForegroundColor Gray
    }
}

Write-Host "`n🚀 Steps to Showcase:" -ForegroundColor Yellow
Write-Host "`n1. Open Browser 1 (Chrome):" -ForegroundColor Cyan
Write-Host "   - Go to: http://localhost:5500 (or your frontend URL)" -ForegroundColor White
Write-Host "   - Register/Login as Patient" -ForegroundColor White
Write-Host "   - Keep this browser open" -ForegroundColor White

Write-Host "`n2. Open Browser 2 (Edge/Firefox):" -ForegroundColor Cyan
Write-Host "   - Go to: http://localhost:5500 (same URL)" -ForegroundColor White
Write-Host "   - Register/Login as Doctor" -ForegroundColor White
Write-Host "   - Keep this browser open" -ForegroundColor White

Write-Host "`n3. Show Role-Based Features:" -ForegroundColor Cyan
Write-Host "   - Patient browser: Show Medications, Reminders, View Prescriptions" -ForegroundColor White
Write-Host "   - Doctor browser: Show Create Prescriptions, View Issued Prescriptions" -ForegroundColor White
Write-Host "   - Notice: Doctor CANNOT see Medications/Reminders (Patient-only)" -ForegroundColor White

Write-Host "`n✨ Pro Tips:" -ForegroundColor Yellow
Write-Host "- Use Chrome for Patient, Edge for Doctor (easy to distinguish)" -ForegroundColor White
Write-Host "- Use Incognito/Private windows to avoid localStorage conflicts" -ForegroundColor White
Write-Host "- Or use different browsers completely (Chrome, Edge, Firefox)" -ForegroundColor White
Write-Host "- Each browser session is completely independent" -ForegroundColor White

Write-Host "`n📱 Quick Demo Script:" -ForegroundColor Yellow
Write-Host "`nBrowser 1 (Patient):" -ForegroundColor Cyan
Write-Host "  1. Login as patient@demo.com" -ForegroundColor White
Write-Host "  2. Add a medication" -ForegroundColor White
Write-Host "  3. View reminders" -ForegroundColor White
Write-Host "  4. Mark reminder as taken" -ForegroundColor White

Write-Host "`nBrowser 2 (Doctor):" -ForegroundColor Cyan
Write-Host "  1. Login as doctor@demo.com" -ForegroundColor White
Write-Host "  2. Create a prescription for patient@demo.com" -ForegroundColor White
Write-Host "  3. View issued prescriptions" -ForegroundColor White
Write-Host "  4. Notice: Cannot access Medications/Reminders (403 error)" -ForegroundColor White

Write-Host "`n🔍 Testing Role Restrictions:" -ForegroundColor Yellow
Write-Host "- Try accessing /medications as Doctor → Should get 403 Forbidden" -ForegroundColor White
Write-Host "- Try accessing /reminders as Doctor → Should get 403 Forbidden" -ForegroundColor White
Write-Host "- Try creating prescription as Patient → Should get 403 Forbidden" -ForegroundColor White

Write-Host ""
Write-Host "=== Setup Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Create these accounts through the registration form, or use existing accounts." -ForegroundColor Cyan
Write-Host "Each browser maintains its own session independently." -ForegroundColor Cyan

