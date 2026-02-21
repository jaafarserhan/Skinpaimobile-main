# SkinPAI Developer Quickstart Guide

**Quick reference for developers working on SkinPAI**

---

## 🚀 Getting Started (5 Minutes)

### Prerequisites

```powershell
# Check versions
dotnet --version    # Requires: 9.0+
node --version      # Requires: 18+
npm --version       # Requires: 9+
```

### Clone & Setup

```powershell
# 1. Backend
cd C:\Projects\SkinPAI.API\SkinPAI.API
dotnet restore
dotnet ef database update
dotnet run

# API running at: http://localhost:5001
```

```powershell
# 2. Frontend (new terminal)
cd C:\Projects\Skinpaimobile-main\Skinpaimobile-main
npm install
npm run dev

# App running at: http://localhost:5173
```

### First Login (Test Accounts)

| Email | Password | Role |
|-------|----------|------|
| demo@skinpai.com | Demo123! | Member |
| pro@skinpai.com | Pro123! | Pro |

---

## 📁 Project Structure

### Backend (C:\Projects\SkinPAI.API\SkinPAI.API)

```
├── Controllers/     # API endpoints
├── Services/        # Business logic
├── Models/
│   ├── Entities/   # Database models
│   └── DTOs/       # Request/Response objects
├── Data/           # EF Context + Seeding
├── Repositories/   # Data access layer
└── Middleware/     # Auth, error handling
```

### Frontend (C:\Projects\Skinpaimobile-main\Skinpaimobile-main\src)

```
├── components/      # React components
│   ├── ui/         # shadcn/ui components
│   └── navigation/ # Navigation components
├── services/       # API calls (api.ts)
├── types/          # TypeScript interfaces
├── hooks/          # Custom React hooks
├── contexts/       # React contexts (RTL)
└── i18n/           # Translations (en/ar)
```

---

## 🔧 Common Tasks

### Add New API Endpoint

```csharp
// 1. Add DTO (Models/DTOs/YourDTOs.cs)
public record YourRequestDto(string Data);
public record YourResponseDto(int Id, string Result);

// 2. Add Service Interface (Services/IYourService.cs)
public interface IYourService
{
    Task<YourResponseDto> DoSomethingAsync(YourRequestDto request);
}

// 3. Implement Service (Services/YourService.cs)
public class YourService : IYourService
{
    public async Task<YourResponseDto> DoSomethingAsync(YourRequestDto request)
    {
        // Implementation
    }
}

// 4. Register in Program.cs
builder.Services.AddScoped<IYourService, YourService>();

// 5. Add Controller Endpoint (Controllers/YourController.cs)
[HttpPost]
[Authorize]
public async Task<ActionResult<YourResponseDto>> DoSomething(YourRequestDto request)
{
    var result = await _yourService.DoSomethingAsync(request);
    return Ok(result);
}
```

### Add Frontend Component

```tsx
// 1. Create component (src/components/YourComponent.tsx)
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export const YourComponent: React.FC = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await api.yourMethod();
        setData(result);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{/* Your JSX */}</div>;
};

// 2. Add API method (src/services/api.ts)
async yourMethod(): Promise<YourType> {
  return this.request('/api/your-endpoint');
}

// 3. Add types (src/types/index.ts)
export interface YourType {
  id: number;
  data: string;
}
```

### Add Translation

```json
// src/i18n/locales/en.json
{
  "yourFeature": {
    "title": "Your Title",
    "description": "Your description"
  }
}

// src/i18n/locales/ar.json
{
  "yourFeature": {
    "title": "العنوان",
    "description": "الوصف"
  }
}
```

```tsx
// Use in component
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
return <h1>{t('yourFeature.title')}</h1>;
```

### Add Database Entity

```csharp
// 1. Create Entity (Models/Entities/YourEntity.cs)
public class YourEntity
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

// 2. Add to DbContext (Data/SkinPAIDbContext.cs)
public DbSet<YourEntity> YourEntities { get; set; }

// 3. Configure in OnModelCreating
modelBuilder.Entity<YourEntity>(entity =>
{
    entity.HasKey(e => e.Id);
    entity.HasOne(e => e.User)
          .WithMany()
          .HasForeignKey(e => e.UserId);
});

// 4. Create migration
dotnet ef migrations add AddYourEntity
dotnet ef database update
```

---

## 🔑 Authentication

### Backend - Secure Endpoint

```csharp
[Authorize]  // Requires any authenticated user
public async Task<ActionResult> SecureEndpoint() { }

[Authorize(Roles = "Pro")]  // Requires Pro subscription
public async Task<ActionResult> ProOnlyEndpoint() { }
```

### Frontend - Include Token

```typescript
// Token automatically included by api.ts
// Just ensure user is logged in:
if (!api.isAuthenticated()) {
  navigate('/auth');
}

// Call protected endpoint normally:
const data = await api.getScans();
```

### Get Current User

```csharp
// Backend - in Controller
var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
var user = await _userService.GetByIdAsync(int.Parse(userId));
```

```typescript
// Frontend
const user = await api.getCurrentUser();
```

---

## 📊 Database

### Connection String

```json
// appsettings.json
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=SkinPAI;Trusted_Connection=True;"
}
```

### Common EF Commands

```powershell
# Create migration
dotnet ef migrations add MigrationName

# Apply migrations
dotnet ef database update

# Rollback last migration
dotnet ef database update PreviousMigrationName

# Reset database (dev only!)
dotnet ef database drop --force
dotnet ef database update

# Re-seed data
# Automatic on startup when database is empty
```

### Key Tables

| Table | Purpose |
|-------|---------|
| Users | User accounts |
| SkinScans | Scan results |
| Products | Product catalog |
| SubscriptionPlans | Plan definitions |
| UserSubscriptions | User subscriptions |
| CommunityPosts | Social posts |

---

## 🧪 Testing

### Manual Testing with HTTP Client

```http
### Login
POST http://localhost:5001/api/auth/login
Content-Type: application/json

{
  "email": "demo@skinpai.com",
  "password": "Demo123!"
}

### Get Scans (with token)
GET http://localhost:5001/api/scans
Authorization: Bearer YOUR_TOKEN
```

### Frontend Testing

```powershell
# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🐛 Debugging

### Backend Logging

```csharp
// Use ILogger
_logger.LogInformation("User {UserId} performed action", userId);
_logger.LogError(ex, "Failed to process scan {ScanId}", scanId);

// Check console output or logs/
```

### Frontend Debugging

```typescript
// Check API calls in browser DevTools → Network tab

// Add console logs
console.log('Data:', data);

// Check React DevTools for component state
```

### Common Issues

| Problem | Solution |
|---------|----------|
| CORS error | Check Backend Program.cs CORS policy |
| 401 Unauthorized | Token expired, re-login |
| 500 Server Error | Check backend console for exception |
| DB connection failed | Ensure SQL Server is running |
| npm install fails | Delete node_modules, npm cache clean --force |

---

## 📝 Code Style

### Backend (C#)

```csharp
// Use async/await for I/O
public async Task<User> GetUserAsync(int id) { }

// Use dependency injection
public class UserService(IUserRepository repo, ILogger<UserService> logger)
{
    // Primary constructor pattern
}

// Return ActionResult<T> from controllers
public async Task<ActionResult<UserDto>> GetUser(int id) { }
```

### Frontend (TypeScript/React)

```tsx
// Use functional components
const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => { };

// Use hooks for state
const [value, setValue] = useState<string>('');

// Destructure props
const { title, onClick } = props;

// Handle loading/error states
if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
```

---

## 🔗 Quick Links

| Resource | URL |
|----------|-----|
| Backend API | http://localhost:5001 |
| Swagger Docs | http://localhost:5001/swagger |
| Frontend Dev | http://localhost:5173 |
| SQL Server | (localdb)\mssqllocaldb |

---

## 📞 Need Help?

1. Check this guide
2. Search code for similar examples
3. Check existing documentation in `src/` folder
4. Review git history for context

---

**Happy coding! 🎉**

# SkinPAI Business Documentation

**Version:** 1.0  
**Last Updated:** February 21, 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Features](#2-product-features)
3. [User Journey & Flows](#3-user-journey--flows)
4. [Monetization Model](#4-monetization-model)
5. [Business Rules](#5-business-rules)
6. [Market Positioning](#6-market-positioning)
7. [Success Metrics](#7-success-metrics)

---

## 1. Executive Summary

### 1.1 Product Vision

**SkinPAI** is an AI-powered skincare analysis mobile application that helps users understand their skin health, receive personalized product recommendations, and connect with a community of skincare enthusiasts.

### 1.2 Value Proposition

| For Users | For Partners |
|-----------|--------------|
| Instant skin analysis using AI | Product visibility to target audience |
| Personalized product recommendations | Data-driven marketing insights |
| Track skin improvement over time | Affiliate sales channel |
| Learn from skincare experts | Brand awareness in Iraq market |

### 1.3 Target Market

- **Primary:** Iraq (Basra region)
- **Demographics:** Ages 18-45, predominantly female
- **Focus:** Skincare-conscious consumers
- **Currency:** Iraqi Dinar (IQD)

---

## 2. Product Features

### 2.1 Core Features

#### AI Skin Scanner
- **What:** Users take a photo of their face
- **How:** AI analyzes skin for 12+ metrics
- **Output:** Detailed report with scores, concerns, and recommendations

#### Skin Health Metrics Analyzed
| Metric | Description | Scale |
|--------|-------------|-------|
| Overall Score | Combined health rating | 0-100 |
| Hydration | Skin moisture level | 0-100 |
| Texture | Smoothness and evenness | 0-100 |
| Pore Visibility | Size and visibility of pores | 0-100 |
| Acne Severity | Active breakouts and scarring | 0-100 |
| Wrinkles | Fine lines and wrinkles | 0-100 |
| Pigmentation | Dark spots, uneven tone | 0-100 |
| Elasticity | Skin firmness | 0-100 |
| Oil Level | Sebum production | 0-100 |
| Radiance | Skin glow and brightness | 0-100 |
| Estimated Skin Age | AI-estimated biological skin age | Years |

#### Product Recommendations
- Personalized based on scan results
- Matched to skin type and concerns
- Links to local distributors in Iraq
- Prices in Iraqi Dinar (IQD)

#### Progress Tracking
- Compare scans over time
- Visual progress charts
- Milestone achievements
- Weekly/monthly summaries

#### Community Features
- Share skincare journeys
- Follow influencers/creators
- Participate in brand campaigns
- Learn from video tutorials

### 2.2 Feature Access by Tier

| Feature | Guest | Member | Pro |
|---------|-------|--------|-----|
| Daily Scans | 3 | 5 | Unlimited |
| Scan History | Last scan only | Full history | Full history |
| Basic Analysis | ✓ | ✓ | ✓ |
| Advanced Analysis | - | ✓ | ✓ |
| Product Recommendations | Top 3 | Full list | Full list |
| Progress Tracking | - | ✓ | ✓ |
| Routines | View only | 10 routines | Unlimited |
| Community Viewing | ✓ | ✓ | ✓ |
| Community Posting | - | ✓ | ✓ |
| Creator Station | - | - | ✓ |
| Priority Support | - | - | ✓ |
| Ad-Free | - | - | ✓ |

---

## 3. User Journey & Flows

### 3.1 New User Onboarding

```
Download App
     │
     ├──► Guest Mode ──► Limited Features ──► Upgrade Prompt
     │
     └──► Create Account
              │
              ├──► Email Registration
              │         │
              │         └──► Email Verification (optional)
              │
              └──► Social Login (Google/Apple/Facebook)
                        │
                        ▼
              Skin Questionnaire
              (Skin type, concerns, routine)
                        │
                        ▼
              First Scan Experience
                        │
                        ▼
              View Results + Recommendations
                        │
                        ▼
              Explore App / Upgrade
```

### 3.2 Skin Scanning Flow

```
User taps "Scan" button
         │
         ▼
Camera opens with face guide overlay
         │
         ▼
AI validates face detection
         │
         ├─► Face not detected ──► Show guidance
         │
         └─► Capture photo
                   │
                   ▼
         Upload to server (encrypted)
                   │
                   ▼
         AI analysis (Hugging Face API)
                   │
                   ├─► Processing (show loading)
                   │
                   └─► Complete
                            │
                            ▼
                   Display Results Screen
                   - Overall score
                   - Detailed metrics
                   - Concerns identified
                   - Product recommendations
                   - Comparison to previous scan
```

### 3.3 Subscription Upgrade Flow

```
User views premium feature
         │
         ▼
Upgrade prompt shown
         │
         ├──► Select Plan (Member/Pro)
         │
         └──► Select Billing (Monthly/Yearly)
                   │
                   ▼
         Payment Method
         ├── Wallet Balance (if sufficient)
         └── External Payment
                   │
                   ▼
         Confirmation
                   │
                   ▼
         Features Unlocked Immediately
```

### 3.4 Product Purchase Flow

```
User views recommended product
         │
         ▼
Product detail modal
(Description, ingredients, reviews)
         │
         ├──► Add to Favorites
         │
         └──► "Shop Now" button
                   │
                   ▼
         Redirect to distributor website
         (Basra Pharmacy, Baghdad Beauty, etc.)
                   │
                   ▼
         External purchase (tracked via affiliate)
```

---

## 4. Monetization Model

### 4.1 Revenue Streams

#### 1. Subscription Revenue (Primary)
| Plan | Monthly | Yearly | Savings |
|------|---------|--------|---------|
| Member | 15,000 IQD | 150,000 IQD | 17% |
| Pro | 35,000 IQD | 350,000 IQD | 17% |

**Target:** 5% conversion from Guest to Member, 10% from Member to Pro

#### 2. Affiliate Commission (Secondary)
- Commission from partner distributors on product purchases
- Tracked via unique affiliate links
- Estimated: 5-15% per sale

#### 3. Brand Partnerships (Growth)
- Featured product placements
- Sponsored campaigns
- Brand communities
- Cost-per-click advertising

#### 4. Wallet System
- In-app currency for subscriptions
- Minimum top-up: 5,000 IQD
- Users pre-pay, reducing churn

### 4.2 Pricing Strategy Rationale

| Factor | Consideration |
|--------|---------------|
| Local Income | Priced for Iraqi middle class |
| Competition | Lower than international skincare apps |
| Value Perception | Premium but accessible |
| Yearly Incentive | 2 months free encourages commitment |

### 4.3 Unit Economics (Projected)

| Metric | Value |
|--------|-------|
| CAC (Customer Acquisition Cost) | ~3,000 IQD |
| LTV (Lifetime Value) - Member | ~120,000 IQD |
| LTV (Lifetime Value) - Pro | ~350,000 IQD |
| LTV:CAC Ratio | 40:1 (healthy) |
| Churn Rate Target | <5% monthly |

---

## 5. Business Rules

### 5.1 User Account Rules

| Rule | Description |
|------|-------------|
| Email Uniqueness | One account per email |
| Guest Sessions | Last 24 hours without registration |
| Account Deletion | User can delete all data |
| Password Reset | Email-based, 1-hour expiry |
| Lockout Policy | 5 failed logins = 15 min lockout |

### 5.2 Scan Rules

| Rule | Guest | Member | Pro |
|------|-------|--------|-----|
| Daily Limit | 3 | 5 | Unlimited |
| Reset Time | Midnight local | Midnight local | N/A |
| History Retention | Latest only | Forever | Forever |
| Comparison Feature | No | Yes | Yes |

### 5.3 Subscription Rules

| Rule | Description |
|------|-------------|
| Activation | Immediate on payment |
| Billing Cycle | Start date = subscription date |
| Auto-Renewal | Yes (can disable) |
| Grace Period | 3 days for payment failure |
| Cancellation | Access until period end |
| Refunds | 14 days if no scans used |
| Downgrades | Effective at next billing |

### 5.4 Community Rules

| Rule | Description |
|------|-------------|
| Post Frequency | Member: 10/day, Pro: 50/day |
| Comment Limit | 100/day per user |
| Content Policy | No spam, harassment, explicit content |
| Flagging | 3 flags = auto-hide for review |
| Strikes | 3 strikes = suspension |
| Creator Station | Pro only, 1 per user |
| Verified Badge | 1000+ followers + review |

### 5.5 Product Rules

| Rule | Description |
|------|-------------|
| Recommendations | Based on latest scan |
| Favorites Limit | 50 products |
| Price Display | Always in IQD |
| Stock Status | Synced with distributor |
| Affiliate Tracking | 30-day cookie |

---

## 6. Market Positioning

### 6.1 Competitive Analysis

| Competitor | Strengths | SkinPAI Differentiator |
|------------|-----------|------------------------|
| International Apps | Advanced AI, brand recognition | Local pricing, Arabic support, Iraq distributors |
| Beauty Salons | Personal touch | Convenience, AI consistency, lower cost |
| General Health Apps | Established user base | Skincare specialization |
| Instagram/TikTok | Influencer content | AI analysis + community |

### 6.2 Unique Selling Points

1. **Localized for Iraq**
   - Arabic language with RTL support
   - Prices in Iraqi Dinar
   - Local distributor partnerships
   - Culturally relevant content

2. **AI-Powered Accuracy**
   - Consistent analysis (not human bias)
   - Progress tracking over time
   - Personalized recommendations

3. **Community + Commerce**
   - Learn from influencers
   - Buy from trusted partners
   - All in one app

4. **Affordable Premium**
   - Lower cost than competitors
   - Flexible payment (wallet system)
   - Guest access for trial

### 6.3 Target User Personas

#### Persona 1: Sarah (Primary)
- **Age:** 25
- **Location:** Basra
- **Income:** Middle class
- **Concerns:** Acne, oily skin
- **Behavior:** Active on social media, follows beauty influencers
- **Need:** Understand her skin, find effective products

#### Persona 2: Fatima (Secondary)
- **Age:** 35
- **Location:** Baghdad
- **Income:** Upper middle class
- **Concerns:** Early aging signs, pigmentation
- **Behavior:** Willing to invest in premium products
- **Need:** Track anti-aging progress, expert recommendations

#### Persona 3: Ahmed (Tertiary)
- **Age:** 28
- **Location:** Erbil
- **Income:** Middle class
- **Concerns:** Acne scars, basic skincare
- **Behavior:** New to skincare, wants simple guidance
- **Need:** Learn basics, build routine

---

## 7. Success Metrics

### 7.1 Key Performance Indicators (KPIs)

#### User Acquisition
| Metric | Target (Month 3) | Target (Month 12) |
|--------|------------------|-------------------|
| Total Downloads | 10,000 | 100,000 |
| Registered Users | 5,000 | 50,000 |
| Paying Subscribers | 250 | 5,000 |
| Member:Pro Ratio | 80:20 | 70:30 |

#### Engagement
| Metric | Target |
|--------|--------|
| DAU/MAU Ratio | >30% |
| Scans per Active User/Week | 3+ |
| Session Duration | 5+ minutes |
| Community Posts/Week | 500+ |

#### Revenue
| Metric | Target (Month 12) |
|--------|-------------------|
| MRR (Monthly Recurring Revenue) | 100M IQD |
| ARR (Annual Recurring Revenue) | 1.2B IQD |
| Affiliate Revenue | 20M IQD/month |
| LTV:CAC | >10:1 |

#### Retention
| Metric | Target |
|--------|--------|
| D1 Retention | 60% |
| D7 Retention | 40% |
| D30 Retention | 25% |
| Monthly Churn (Paid) | <5% |

### 7.2 Tracking & Analytics

| Event | Tracked |
|-------|---------|
| App Open | Yes |
| Scan Started | Yes |
| Scan Completed | Yes |
| Product Viewed | Yes |
| Product Shop Clicked | Yes |
| Post Created | Yes |
| Subscription Started | Yes |
| Subscription Cancelled | Yes |
| Wallet Top-up | Yes |

### 7.3 Feedback Loops

1. **In-App NPS** (Monthly)
   - "How likely are you to recommend SkinPAI?"
   - Target: NPS > 40

2. **Feature Requests**
   - Community voting system
   - Prioritize by user tier (Pro > Member > Guest)

3. **Support Tickets**
   - Response time: <24 hours
   - Resolution time: <48 hours

4. **App Store Reviews**
   - Target: 4.5+ stars
   - Respond to all negative reviews

---

## Appendix: Feature Roadmap (High Level)

### Q1 2026 (Current)
- ✅ Core scanning functionality
- ✅ Product recommendations
- ✅ Community feed
- ✅ Subscription system
- ✅ Arabic localization

### Q2 2026
- [ ] Video tutorials library
- [ ] Brand campaign system
- [ ] Push notifications
- [ ] Routine reminders

### Q3 2026
- [ ] In-app chat with experts
- [ ] AR product try-on
- [ ] Referral program
- [ ] Gamification (badges, streaks)

### Q4 2026
- [ ] Expand to other MENA countries
- [ ] Brand dashboard for partners
- [ ] Advanced AI (ingredient analysis)
- [ ] iOS native app

---

**Document maintained by:** SkinPAI Product Team  
**Questions:** product@skinpai.com

