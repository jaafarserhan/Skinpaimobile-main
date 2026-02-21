# Backend Documentation Update Summary
**Date:** December 15, 2024  
**Version:** 1.1.0

## Overview
Updated the SkinPAI Backend API Documentation to reflect the new Create Account flow with integrated membership selection and payment processing.

---

## 📝 Major Updates

### 1. New API Endpoint: Create Account with Membership Selection

#### Endpoint Details:
```http
POST /auth/create-account
Content-Type: application/json
```

#### Features:
- ✅ Full user registration with personal details
- ✅ Immediate membership tier selection (Guest, Member, Pro)
- ✅ Billing period selection (monthly/yearly)
- ✅ Integrated payment processing (Card or Wallet)
- ✅ Automatic fallback to Guest tier on payment failure
- ✅ JWT token generation for immediate login
- ✅ Questionnaire redirect flag

#### Request Body Structure:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "confirmPassword": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "dateOfBirth": "1995-05-15",
  "agreedToTerms": true,
  "membershipTier": "Member",
  "billingPeriod": "yearly",
  "paymentMethod": "card",
  "paymentDetails": {
    "paymentMethodId": "pm_1234567890",
    "cardholderName": "John Doe",
    "billingAddress": { /* address details */ }
  }
}
```

---

### 2. Scan Limits Clarification

#### Updated Behavior:
| Tier | Previous | **NEW Behavior** |
|------|----------|------------------|
| **Guest** | 1 scan/day | ✅ **1 scan per day** (resets at midnight UTC) |
| **Member** | ~~5 scans/day~~ | ✅ **5 scans total** (NO daily reset) |
| **Pro** | Unlimited | ✅ **Unlimited** (9999 MaxScans) |

#### Key Changes:
- **Guest users**: Continue to have daily reset at midnight UTC
- **Member users**: Now have 5 total scans across their subscription period (NOT per day)
- **Pro users**: Truly unlimited with no practical limit

---

### 3. Updated API Response Formats

#### Scan Availability Response:
```json
{
  "canScan": true,
  "scansUsed": 2,
  "scansRemaining": 3,
  "maxScans": 5,
  "membershipType": "Member",
  "resetTime": null,  // null for Member/Pro, date for Guest
  "isUnlimited": false
}
```

---

### 4. Business Logic Updates

#### Daily Scan Reset Job:
```csharp
// NOW: Only resets Guest users
await _dbContext.Database.ExecuteSqlRawAsync(
    "UPDATE Users SET ScansToday = 0 
     WHERE ScansToday > 0 AND MembershipType = 'Guest'"
);
```

#### Scan Availability Check:
- **Guest**: Query `DailyScanLimits` table, check against daily limit
- **Member**: Query `Users.ScansToday` field, check against total of 5
- **Pro**: Always return `canScan = true`, no limit enforcement

---

## 📋 Documentation Changes

### Files Updated:
1. ✅ `/SkinPAI_BACKEND_API_DOCUMENTATION.md`

### Sections Modified:
1. **Version number**: 1.0.0 → 1.1.0
2. **API Endpoints Section**:
   - Added new endpoint: `1.2 Create Account with Membership Selection`
   - Renumbered subsequent endpoints: 1.2 → 1.3, 1.3 → 1.4, etc.
3. **Database Schema**: Added clarification notes (no schema changes needed)
4. **Business Rules & Logic**:
   - Updated Membership Tiers table with new scan limits
   - Added "Important Note" about scan limit behavior
   - Updated Daily Scan Reset Logic
   - Updated Scan Availability Check logic
5. **Changelog**: Added new Version 1.1.0 section

---

## 🎯 Frontend Integration Points

### Create Account Flow:
```
Step 1: Personal Information
  ↓
Step 2: Membership Selection
  - Guest (free)
  - Member ($9.99/mo or $79.99/yr)
  - Pro ($29.99/mo or $239.99/yr)
  ↓
Step 3: Payment (if Member/Pro selected)
  - Card Payment (Stripe)
  - Wallet Payment
  ↓
Account Created + Auto Login
  ↓
Redirect to Questionnaire
```

### API Call Example:
```typescript
const response = await fetch('/api/v1/auth/create-account', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: formData.email,
    password: formData.password,
    confirmPassword: formData.confirmPassword,
    firstName: formData.firstName,
    lastName: formData.lastName,
    phoneNumber: formData.phoneNumber,
    dateOfBirth: formData.dateOfBirth,
    agreedToTerms: true,
    membershipTier: selectedTier, // 'Guest' | 'Member' | 'Pro'
    billingPeriod: selectedPeriod, // 'monthly' | 'yearly'
    paymentMethod: 'card',
    paymentDetails: {
      paymentMethodId: stripePaymentMethodId,
      cardholderName: cardholderName,
      billingAddress: billingAddress
    }
  })
});
```

---

## 💡 Important Notes for Backend Developers

### 1. Payment Failure Handling:
- If payment processing fails, **still create the account as Guest**
- Return error response with `accountCreated: true` flag
- Allow user to upgrade later via `/subscriptions` endpoint

### 2. Scan Limit Enforcement:
```csharp
// Guest: Daily reset required
if (user.MembershipType == MembershipType.Guest) {
    // Check DailyScanLimits table
    // Reset at midnight UTC
}

// Member: Total limit, NO reset
else if (user.MembershipType == MembershipType.Member) {
    // Check Users.ScansToday field
    // No reset logic
    // Max 5 total scans
}

// Pro: Unlimited
else if (user.MembershipType == MembershipType.Pro) {
    // Always allow
    // MaxScans = 9999
}
```

### 3. Database Considerations:
- **NO schema changes required**
- `ScansToday` field serves dual purpose:
  - Guest: Daily scan counter (resets)
  - Member: Total scan counter (doesn't reset)
  - Pro: Not enforced (but tracked for analytics)

### 4. Subscription Creation:
- Create Stripe customer if card payment
- Create Stripe subscription with appropriate plan
- Store subscription details in `Subscriptions` table
- Create transaction record in `Transactions` table
- Update user's `MembershipType`, `MaxScans`, `SubscriptionStatus`

---

## ✅ Testing Checklist

### Registration Flow:
- [ ] Guest account creation (no payment)
- [ ] Member account with monthly billing
- [ ] Member account with yearly billing
- [ ] Pro account with monthly billing
- [ ] Pro account with yearly billing
- [ ] Payment failure → fallback to Guest
- [ ] Email validation and uniqueness
- [ ] Password strength validation
- [ ] Age verification (13+)
- [ ] Terms agreement requirement

### Scan Limits:
- [ ] Guest: 1 scan per day, resets at midnight
- [ ] Member: 5 scans total, no reset
- [ ] Pro: Unlimited scans
- [ ] Scan availability check for each tier
- [ ] Daily reset job only affects Guest users

### Payment Processing:
- [ ] Stripe card payment success
- [ ] Stripe card payment failure
- [ ] Wallet payment success
- [ ] Wallet payment insufficient balance
- [ ] Subscription creation in database
- [ ] Transaction record creation
- [ ] Invoice generation

---

## 📊 Pricing Reference

| Plan | Monthly | Yearly | Savings |
|------|---------|--------|---------|
| **Guest** | Free | Free | - |
| **Member** | $9.99/mo | $79.99/yr | 33% ($40/yr) |
| **Pro** | $29.99/mo | $239.99/yr | 33% ($120/yr) |

---

## 🔗 Related Documentation

1. **Main Backend API Docs**: `/SkinPAI_BACKEND_API_DOCUMENTATION.md`
2. **Frontend Components**:
   - `/components/CreateAccount.tsx`
   - `/components/AuthScreen.tsx`
3. **Type Definitions**: `/types.ts` (User, Subscription types)

---

## 📞 Support

For questions or issues with this update, contact the development team.

**Last Updated:** December 15, 2024
