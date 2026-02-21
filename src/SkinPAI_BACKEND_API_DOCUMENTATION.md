# SkinPAI Backend API Documentation
## .NET Core 8+ Implementation Guide

**Version:** 1.1.0  
**Last Updated:** December 15, 2024  
**Author:** Senior Software Engineer - API Architect

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture & Tech Stack](#architecture--tech-stack)
3. [Database Schema](#database-schema)
4. [Authentication & Authorization](#authentication--authorization)
5. [API Endpoints](#api-endpoints)
6. [Business Rules & Logic](#business-rules--logic)
7. [Third-Party Integrations](#third-party-integrations)
8. [Security & Compliance](#security--compliance)
9. [Error Handling](#error-handling)
10. [Rate Limiting & Performance](#rate-limiting--performance)

---

## System Overview

SkinPAI is a mobile-first skincare application with:
- AI-powered skin analysis
- Three-tier membership system (Guest, Member, Pro)
- Community platform with Creator Stations
- E-commerce product recommendations
- Payment gateway integration
- Real-time notifications

### Core Modules
1. **User Management & Authentication**
2. **Skin Analysis Engine**
3. **Product Recommendation System**
4. **Community & Social Platform**
5. **Creator Station Management**
6. **Payment & Subscription System**
7. **Wallet & Transactions**
8. **Notifications & Reminders**
9. **Analytics & Reporting**

---

## Architecture & Tech Stack

### Recommended Stack

```csharp
// Framework
- .NET 8.0 or above
- ASP.NET Core Web API
- Entity Framework Core 8.0

// Database
- Primary: PostgreSQL 15+ (or SQL Server 2022)
- Cache: Redis 7.0+
- File Storage: Azure Blob Storage / AWS S3

// Authentication
- JWT Bearer Tokens
- ASP.NET Core Identity
- OAuth 2.0 / OpenID Connect

// Messaging
- Azure Service Bus / RabbitMQ
- SignalR for real-time notifications

// AI/ML
- Azure Cognitive Services (Computer Vision)
- ML.NET for recommendation engine
- Python microservice for advanced AI (optional)

// Payment
- Stripe API
- PayPal SDK
- (or local payment gateways)

// Additional
- AutoMapper (DTO mapping)
- FluentValidation (input validation)
- Serilog (logging)
- Hangfire (background jobs)
- MediatR (CQRS pattern)
```

### Project Structure

```
SkinPAISkincare.API/
├── SkinPAISkincare.API/              # Web API Project
├── SkinPAISkincare.Core/             # Domain entities & interfaces
├── SkinPAISkincare.Application/      # Business logic & services
├── SkinPAISkincare.Infrastructure/   # Data access & external services
├── SkinPAISkincare.Shared/          # Shared DTOs & utilities
└── SkinPAISkincare.Tests/           # Unit & integration tests
```

---

## Database Schema

### User Management

```sql
-- Users Table
CREATE TABLE Users (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Email NVARCHAR(255) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    Name NVARCHAR(100),
    PhoneNumber NVARCHAR(20),
    DateOfBirth DATE,
    ProfileImageUrl NVARCHAR(500),
    MembershipType NVARCHAR(20) NOT NULL CHECK (MembershipType IN ('Guest', 'Member', 'Pro')),
    ScansToday INT DEFAULT 0,
    MaxScans INT DEFAULT 1,
    WalletBalance DECIMAL(18, 2) DEFAULT 0.00,
    SubscriptionStatus NVARCHAR(20) CHECK (SubscriptionStatus IN ('Active', 'Expired', 'Cancelled')),
    SubscriptionEndDate DATETIME,
    QuestionnaireCompleted BIT DEFAULT 0,
    IsEmailVerified BIT DEFAULT 0,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME DEFAULT GETUTCDATE(),
    LastLoginAt DATETIME,
    CONSTRAINT CK_MaxScans CHECK (
        (MembershipType = 'Guest' AND MaxScans = 1) OR
        (MembershipType = 'Member' AND MaxScans = 5) OR
        (MembershipType = 'Pro' AND MaxScans = 9999)
    )
);

-- User Profiles (Skin Information)
CREATE TABLE UserSkinProfiles (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Users(Id) ON DELETE CASCADE,
    SkinType NVARCHAR(50) CHECK (SkinType IN ('Oily', 'Dry', 'Combination', 'Normal', 'Sensitive')),
    SkinConcerns NVARCHAR(MAX), -- JSON array
    CurrentRoutine NVARCHAR(50),
    SunExposure NVARCHAR(50),
    Lifestyle NVARCHAR(50),
    Allergies NVARCHAR(MAX),
    CreatedAt DATETIME DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME DEFAULT GETUTCDATE(),
    CONSTRAINT UQ_UserSkinProfile UNIQUE (UserId)
);

-- Refresh Tokens
CREATE TABLE RefreshTokens (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Users(Id) ON DELETE CASCADE,
    Token NVARCHAR(500) NOT NULL,
    ExpiresAt DATETIME NOT NULL,
    CreatedAt DATETIME DEFAULT GETUTCDATE(),
    RevokedAt DATETIME,
    IsRevoked BIT DEFAULT 0,
    DeviceInfo NVARCHAR(500)
);
```

### Skin Analysis

```sql
-- Scan Results
CREATE TABLE ScanResults (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Users(Id) ON DELETE CASCADE,
    ImageUrl NVARCHAR(500) NOT NULL,
    ImageBlobName NVARCHAR(255) NOT NULL,
    ScanDate DATETIME DEFAULT GETUTCDATE(),
    
    -- Overall Metrics
    OverallScore DECIMAL(5, 2) NOT NULL,
    EstimatedAge INT,
    ActualAge INT,
    SkinType NVARCHAR(50),
    
    -- Health Metrics (0-100 scale)
    Hydration DECIMAL(5, 2),
    Moisture DECIMAL(5, 2),
    Oiliness DECIMAL(5, 2),
    Evenness DECIMAL(5, 2),
    Texture DECIMAL(5, 2),
    Clarity DECIMAL(5, 2),
    Firmness DECIMAL(5, 2),
    Elasticity DECIMAL(5, 2),
    PoreSize DECIMAL(5, 2),
    Smoothness DECIMAL(5, 2),
    Radiance DECIMAL(5, 2),
    
    -- Concerns (0-100 severity)
    Acne DECIMAL(5, 2),
    Wrinkles DECIMAL(5, 2),
    DarkCircles DECIMAL(5, 2),
    DarkSpots DECIMAL(5, 2),
    Redness DECIMAL(5, 2),
    UVDamage DECIMAL(5, 2),
    
    -- AI Analysis
    AIAnalysis NVARCHAR(MAX), -- JSON with detailed analysis
    ProcessingStatus NVARCHAR(20) DEFAULT 'Pending' CHECK (ProcessingStatus IN ('Pending', 'Processing', 'Completed', 'Failed')),
    ProcessingError NVARCHAR(MAX),
    
    CreatedAt DATETIME DEFAULT GETUTCDATE()
);

-- Scan Recommendations
CREATE TABLE ScanRecommendations (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ScanResultId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES ScanResults(Id) ON DELETE CASCADE,
    RecommendationText NVARCHAR(500) NOT NULL,
    Category NVARCHAR(100),
    Priority INT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETUTCDATE()
);

-- Daily Scan Limits Tracker
CREATE TABLE DailyScanLimits (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Users(Id),
    ScanDate DATE NOT NULL,
    ScanCount INT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETUTCDATE(),
    CONSTRAINT UQ_UserDailyScan UNIQUE (UserId, ScanDate)
);
```

### Products & E-commerce

```sql
-- Brands
CREATE TABLE Brands (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(200) NOT NULL,
    LogoUrl NVARCHAR(500),
    Description NVARCHAR(MAX),
    IsVerified BIT DEFAULT 0,
    Website NVARCHAR(500),
    CreatedAt DATETIME DEFAULT GETUTCDATE()
);

-- Distributors
CREATE TABLE Distributors (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(200) NOT NULL,
    LogoUrl NVARCHAR(500),
    Website NVARCHAR(500),
    IsPartner BIT DEFAULT 0,
    CommissionRate DECIMAL(5, 2) DEFAULT 0.00,
    CreatedAt DATETIME DEFAULT GETUTCDATE()
);

-- Product Categories
CREATE TABLE ProductCategories (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    IconName NVARCHAR(50),
    ParentCategoryId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES ProductCategories(Id),
    DisplayOrder INT DEFAULT 0
);

-- Products
CREATE TABLE Products (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    BrandId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Brands(Id),
    DistributorId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Distributors(Id),
    CategoryId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES ProductCategories(Id),
    Name NVARCHAR(300) NOT NULL,
    Description NVARCHAR(MAX),
    Price DECIMAL(18, 2) NOT NULL,
    OriginalPrice DECIMAL(18, 2),
    DiscountPercentage DECIMAL(5, 2),
    ImageUrl NVARCHAR(500),
    ShopUrl NVARCHAR(500) NOT NULL,
    Rating DECIMAL(3, 2) DEFAULT 0.00,
    ReviewCount INT DEFAULT 0,
    InStock BIT DEFAULT 1,
    IsActive BIT DEFAULT 1,
    KeyIngredients NVARCHAR(MAX), -- JSON array
    SkinTypes NVARCHAR(MAX), -- JSON array
    SkinConcerns NVARCHAR(MAX), -- JSON array
    CreatedAt DATETIME DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME DEFAULT GETUTCDATE()
);

-- Product Bundles
CREATE TABLE ProductBundles (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(300) NOT NULL,
    Description NVARCHAR(MAX),
    BrandId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Brands(Id),
    ImageUrl NVARCHAR(500),
    BundlePrice DECIMAL(18, 2) NOT NULL,
    OriginalPrice DECIMAL(18, 2) NOT NULL,
    Savings DECIMAL(18, 2),
    Category NVARCHAR(100),
    Benefits NVARCHAR(MAX), -- JSON array
    ForSkinTypes NVARCHAR(MAX), -- JSON array
    ForSkinConcerns NVARCHAR(MAX), -- JSON array
    IsCustomized BIT DEFAULT 0,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETUTCDATE()
);

-- Bundle Products (Many-to-Many)
CREATE TABLE BundleProducts (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    BundleId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES ProductBundles(Id) ON DELETE CASCADE,
    ProductId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Products(Id),
    Quantity INT DEFAULT 1,
    DisplayOrder INT DEFAULT 0,
    CONSTRAINT UQ_BundleProduct UNIQUE (BundleId, ProductId)
);

-- Product Reviews
CREATE TABLE ProductReviews (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ProductId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Products(Id) ON DELETE CASCADE,
    UserId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Users(Id),
    Rating INT NOT NULL CHECK (Rating >= 1 AND Rating <= 5),
    ReviewText NVARCHAR(MAX),
    IsVerifiedPurchase BIT DEFAULT 0,
    HelpfulCount INT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME DEFAULT GETUTCDATE()
);
```

### Community & Social

```sql
-- Creator Stations
CREATE TABLE CreatorStations (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Users(Id),
    StationName NVARCHAR(200) NOT NULL,
    StationUsername NVARCHAR(100) NOT NULL UNIQUE,
    Bio NVARCHAR(500),
    Description NVARCHAR(MAX),
    Location NVARCHAR(200),
    CoverImageUrl NVARCHAR(500),
    AvatarImageUrl NVARCHAR(500),
    Specialties NVARCHAR(MAX), -- JSON array
    Theme NVARCHAR(50),
    InstagramUrl NVARCHAR(500),
    YoutubeUrl NVARCHAR(500),
    TwitterUrl NVARCHAR(500),
    WebsiteUrl NVARCHAR(500),
    ContactEmail NVARCHAR(255),
    Certifications NVARCHAR(MAX), -- JSON array
    Experience NVARCHAR(200),
    ContentFrequency NVARCHAR(100),
    IsActive BIT DEFAULT 1,
    IsVerified BIT DEFAULT 0,
    FollowerCount INT DEFAULT 0,
    PostCount INT DEFAULT 0,
    TotalViews BIGINT DEFAULT 0,
    TotalLikes BIGINT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME DEFAULT GETUTCDATE(),
    CONSTRAINT UQ_UserStation UNIQUE (UserId),
    CONSTRAINT CK_OnlyProCanCreateStation CHECK (
        EXISTS (SELECT 1 FROM Users WHERE Users.Id = UserId AND Users.MembershipType = 'Pro')
    )
);

-- Posts
CREATE TABLE Posts (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Users(Id),
    StationId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES CreatorStations(Id),
    PostType NVARCHAR(20) NOT NULL CHECK (PostType IN ('Image', 'Video', 'Article', 'Poll')),
    Caption NVARCHAR(MAX),
    MediaUrl NVARCHAR(500),
    MediaType NVARCHAR(50),
    MediaBlobName NVARCHAR(255),
    Hashtags NVARCHAR(MAX), -- JSON array
    LikeCount INT DEFAULT 0,
    CommentCount INT DEFAULT 0,
    ShareCount INT DEFAULT 0,
    ViewCount INT DEFAULT 0,
    IsPublished BIT DEFAULT 1,
    IsFeatured BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME DEFAULT GETUTCDATE()
);

-- Post Media (for multiple images/videos)
CREATE TABLE PostMedia (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    PostId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Posts(Id) ON DELETE CASCADE,
    MediaUrl NVARCHAR(500) NOT NULL,
    MediaType NVARCHAR(50),
    BlobName NVARCHAR(255),
    DisplayOrder INT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETUTCDATE()
);

-- Tagged Products in Posts
CREATE TABLE PostProducts (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    PostId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Posts(Id) ON DELETE CASCADE,
    ProductId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Products(Id),
    CreatedAt DATETIME DEFAULT GETUTCDATE(),
    CONSTRAINT UQ_PostProduct UNIQUE (PostId, ProductId)
);

-- Comments
CREATE TABLE Comments (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    PostId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Posts(Id) ON DELETE CASCADE,
    UserId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Users(Id),
    ParentCommentId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Comments(Id),
    CommentText NVARCHAR(1000) NOT NULL,
    LikeCount INT DEFAULT 0,
    IsEdited BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME DEFAULT GETUTCDATE()
);

-- Likes
CREATE TABLE Likes (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Users(Id),
    PostId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Posts(Id) ON DELETE CASCADE,
    CommentId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Comments(Id),
    CreatedAt DATETIME DEFAULT GETUTCDATE(),
    CONSTRAINT CK_LikeTarget CHECK (
        (PostId IS NOT NULL AND CommentId IS NULL) OR
        (PostId IS NULL AND CommentId IS NOT NULL)
    ),
    CONSTRAINT UQ_UserPostLike UNIQUE (UserId, PostId),
    CONSTRAINT UQ_UserCommentLike UNIQUE (UserId, CommentId)
);

-- Follows
CREATE TABLE Follows (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    FollowerUserId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Users(Id),
    FollowingStationId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES CreatorStations(Id) ON DELETE CASCADE,
    CreatedAt DATETIME DEFAULT GETUTCDATE(),
    CONSTRAINT UQ_UserFollowStation UNIQUE (FollowerUserId, FollowingStationId)
);

-- Campaigns (Brand Collaborations)
CREATE TABLE Campaigns (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    BrandId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Brands(Id),
    Title NVARCHAR(300) NOT NULL,
    Description NVARCHAR(MAX),
    ImageUrl NVARCHAR(500),
    StartDate DATETIME NOT NULL,
    EndDate DATETIME NOT NULL,
    Hashtag NVARCHAR(100),
    ParticipantCount INT DEFAULT 0,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETUTCDATE()
);
```

### Payments & Subscriptions

```sql
-- Subscriptions
CREATE TABLE Subscriptions (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Users(Id),
    PlanType NVARCHAR(20) NOT NULL CHECK (PlanType IN ('Member', 'Pro')),
    BillingCycle NVARCHAR(20) NOT NULL CHECK (BillingCycle IN ('Monthly', 'Yearly')),
    Amount DECIMAL(18, 2) NOT NULL,
    Currency NVARCHAR(3) DEFAULT 'USD',
    Status NVARCHAR(20) NOT NULL CHECK (Status IN ('Active', 'Cancelled', 'Expired', 'PastDue')),
    StartDate DATETIME NOT NULL,
    EndDate DATETIME NOT NULL,
    NextBillingDate DATETIME,
    CancelledAt DATETIME,
    CancellationReason NVARCHAR(500),
    StripeSubscriptionId NVARCHAR(255),
    StripeCustomerId NVARCHAR(255),
    CreatedAt DATETIME DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME DEFAULT GETUTCDATE()
);

-- Payment Methods
CREATE TABLE PaymentMethods (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Users(Id),
    PaymentType NVARCHAR(20) NOT NULL CHECK (PaymentType IN ('Card', 'Wallet')),
    CardBrand NVARCHAR(50),
    Last4Digits NVARCHAR(4),
    ExpiryMonth INT,
    ExpiryYear INT,
    IsDefault BIT DEFAULT 0,
    StripePaymentMethodId NVARCHAR(255),
    CreatedAt DATETIME DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME DEFAULT GETUTCDATE()
);

-- Transactions
CREATE TABLE Transactions (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Users(Id),
    TransactionType NVARCHAR(50) NOT NULL CHECK (TransactionType IN ('Subscription', 'WalletTopUp', 'WalletPayment', 'Refund', 'Commission')),
    Amount DECIMAL(18, 2) NOT NULL,
    Currency NVARCHAR(3) DEFAULT 'USD',
    Status NVARCHAR(20) NOT NULL CHECK (Status IN ('Pending', 'Completed', 'Failed', 'Refunded')),
    PaymentMethodId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES PaymentMethods(Id),
    SubscriptionId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Subscriptions(Id),
    StripePaymentIntentId NVARCHAR(255),
    StripeChargeId NVARCHAR(255),
    Description NVARCHAR(500),
    Metadata NVARCHAR(MAX), -- JSON
    FailureReason NVARCHAR(500),
    CreatedAt DATETIME DEFAULT GETUTCDATE()
);

-- Wallet Transactions
CREATE TABLE WalletTransactions (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Users(Id),
    TransactionId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Transactions(Id),
    TransactionType NVARCHAR(50) NOT NULL CHECK (TransactionType IN ('Credit', 'Debit')),
    Amount DECIMAL(18, 2) NOT NULL,
    BalanceBefore DECIMAL(18, 2) NOT NULL,
    BalanceAfter DECIMAL(18, 2) NOT NULL,
    Description NVARCHAR(500),
    Reference NVARCHAR(255),
    CreatedAt DATETIME DEFAULT GETUTCDATE()
);

-- Invoices
CREATE TABLE Invoices (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Users(Id),
    SubscriptionId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Subscriptions(Id),
    TransactionId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Transactions(Id),
    InvoiceNumber NVARCHAR(50) NOT NULL UNIQUE,
    Amount DECIMAL(18, 2) NOT NULL,
    Tax DECIMAL(18, 2) DEFAULT 0.00,
    Total DECIMAL(18, 2) NOT NULL,
    Status NVARCHAR(20) NOT NULL CHECK (Status IN ('Paid', 'Unpaid', 'Void')),
    DueDate DATETIME,
    PaidAt DATETIME,
    InvoiceUrl NVARCHAR(500),
    CreatedAt DATETIME DEFAULT GETUTCDATE()
);
```

### Notifications & Reminders

```sql
-- Notifications
CREATE TABLE Notifications (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Users(Id),
    NotificationType NVARCHAR(50) NOT NULL CHECK (NotificationType IN ('ScanReminder', 'RoutineReminder', 'ProductDeal', 'CommunityUpdate', 'InfluencerPost', 'NewFollower', 'Like', 'Comment', 'Subscription')),
    Title NVARCHAR(200) NOT NULL,
    Message NVARCHAR(1000) NOT NULL,
    ImageUrl NVARCHAR(500),
    ActionUrl NVARCHAR(500),
    IsRead BIT DEFAULT 0,
    ReadAt DATETIME,
    IsSent BIT DEFAULT 0,
    SentAt DATETIME,
    ScheduledFor DATETIME,
    CreatedAt DATETIME DEFAULT GETUTCDATE()
);

-- Notification Settings
CREATE TABLE NotificationSettings (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Users(Id),
    ScanReminders BIT DEFAULT 1,
    RoutineReminders BIT DEFAULT 1,
    ProductDeals BIT DEFAULT 1,
    CommunityUpdates BIT DEFAULT 0,
    InfluencerPosts BIT DEFAULT 1,
    EmailNotifications BIT DEFAULT 1,
    PushNotifications BIT DEFAULT 1,
    UpdatedAt DATETIME DEFAULT GETUTCDATE(),
    CONSTRAINT UQ_UserNotificationSettings UNIQUE (UserId)
);

-- Routine Items
CREATE TABLE RoutineItems (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Users(Id),
    Name NVARCHAR(200) NOT NULL,
    Time NVARCHAR(2) NOT NULL CHECK (Time IN ('AM', 'PM')),
    ProductId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Products(Id),
    ReminderTime TIME,
    ReminderEnabled BIT DEFAULT 0,
    DisplayOrder INT DEFAULT 0,
    IsCompleted BIT DEFAULT 0,
    CompletedAt DATETIME,
    CreatedAt DATETIME DEFAULT GETUTCDATE()
);
```

### Analytics

```sql
-- Station Analytics
CREATE TABLE StationAnalytics (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    StationId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES CreatorStations(Id) ON DELETE CASCADE,
    Date DATE NOT NULL,
    ViewCount INT DEFAULT 0,
    NewFollowers INT DEFAULT 0,
    UnfollowCount INT DEFAULT 0,
    LikeCount INT DEFAULT 0,
    CommentCount INT DEFAULT 0,
    ShareCount INT DEFAULT 0,
    EngagementRate DECIMAL(5, 2) DEFAULT 0.00,
    RevenueGenerated DECIMAL(18, 2) DEFAULT 0.00,
    CreatedAt DATETIME DEFAULT GETUTCDATE(),
    CONSTRAINT UQ_StationDailyAnalytics UNIQUE (StationId, Date)
);

-- Post Analytics
CREATE TABLE PostAnalytics (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    PostId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Posts(Id) ON DELETE CASCADE,
    Date DATE NOT NULL,
    ViewCount INT DEFAULT 0,
    UniqueViewCount INT DEFAULT 0,
    LikeCount INT DEFAULT 0,
    CommentCount INT DEFAULT 0,
    ShareCount INT DEFAULT 0,
    SaveCount INT DEFAULT 0,
    ClickThroughCount INT DEFAULT 0,
    EngagementRate DECIMAL(5, 2) DEFAULT 0.00,
    CreatedAt DATETIME DEFAULT GETUTCDATE(),
    CONSTRAINT UQ_PostDailyAnalytics UNIQUE (PostId, Date)
);

-- User Activity Logs
CREATE TABLE ActivityLogs (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Users(Id),
    ActivityType NVARCHAR(100) NOT NULL,
    EntityType NVARCHAR(50),
    EntityId UNIQUEIDENTIFIER,
    IPAddress NVARCHAR(45),
    UserAgent NVARCHAR(500),
    Metadata NVARCHAR(MAX), -- JSON
    CreatedAt DATETIME DEFAULT GETUTCDATE()
);
```

---

## Authentication & Authorization

### JWT Configuration

```csharp
// appsettings.json
{
  "JwtSettings": {
    "Secret": "YOUR-256-BIT-SECRET-KEY-CHANGE-THIS-IN-PRODUCTION",
    "Issuer": "SkinPAIAPI",
    "Audience": "SkinPAIApp",
    "AccessTokenExpirationMinutes": 30,
    "RefreshTokenExpirationDays": 30
  }
}

// Program.cs or Startup.cs
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidAudience = jwtSettings.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtSettings.Secret)
        ),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("GuestOnly", policy => 
        policy.RequireClaim("MembershipType", "Guest"));
    options.AddPolicy("MemberOnly", policy => 
        policy.RequireClaim("MembershipType", "Member", "Pro"));
    options.AddPolicy("ProOnly", policy => 
        policy.RequireClaim("MembershipType", "Pro"));
});
```

### Token Models

```csharp
public class TokenResponse
{
    public string AccessToken { get; set; }
    public string RefreshToken { get; set; }
    public DateTime ExpiresAt { get; set; }
    public string TokenType { get; set; } = "Bearer";
}

public class JwtClaims
{
    public const string UserId = "uid";
    public const string Email = "email";
    public const string Name = "name";
    public const string MembershipType = "membership";
    public const string IsEmailVerified = "email_verified";
}
```

---

## API Endpoints

### Base URL
```
Production: https://api.skinpai.com/api/v1
Staging: https://staging-api.skinpai.com/api/v1
Development: https://localhost:5001/api/v1
```

### 1. Authentication & User Management

#### 1.1 Register User
```http
POST /auth/register
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe",
  "phoneNumber": "+1234567890",
  "dateOfBirth": "1995-05-15"
}

Response: 201 Created
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "data": {
    "userId": "guid",
    "email": "user@example.com",
    "name": "John Doe",
    "membershipType": "Guest",
    "requiresEmailVerification": true
  }
}

Business Rules:
- Email must be unique
- Password: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
- Default membership: Guest
- Max scans: 1 per day
- Send verification email asynchronously
- Age must be 13+
```

#### 1.2 Create Account with Membership Selection
```http
POST /auth/create-account
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "confirmPassword": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "dateOfBirth": "1995-05-15",
  "agreedToTerms": true,
  "membershipTier": "Member",  // "Guest" | "Member" | "Pro"
  "billingPeriod": "yearly",   // "monthly" | "yearly" (required for Member/Pro)
  "paymentMethod": "card",     // "card" | "wallet" (optional for Guest)
  "paymentDetails": {
    // For Card Payment:
    "paymentMethodId": "pm_1234567890",  // Stripe payment method ID
    "cardholderName": "John Doe",
    "billingAddress": {
      "line1": "123 Main St",
      "city": "Los Angeles",
      "state": "CA",
      "postalCode": "90001",
      "country": "US"
    }
    // For Wallet Payment: (no additional fields needed)
  }
}

Response: 201 Created
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "userId": "guid",
    "email": "user@example.com",
    "name": "John Doe",
    "membershipType": "Member",
    "scansAvailable": 5,
    "maxScans": 5,
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "refresh_token_here",
    "expiresAt": "2024-12-15T12:30:00Z",
    "subscription": {
      "subscriptionId": "guid",
      "planType": "Member",
      "billingCycle": "Yearly",
      "amount": 79.99,
      "status": "Active",
      "startDate": "2024-12-15T00:00:00Z",
      "endDate": "2025-12-15T00:00:00Z",
      "nextBillingDate": "2025-12-15T00:00:00Z"
    },
    "transaction": {
      "transactionId": "guid",
      "amount": 79.99,
      "status": "Completed",
      "paymentMethod": "Card",
      "last4": "4242"
    },
    "requiresQuestionnaireCompletion": true
  }
}

Response: 400 Bad Request (Payment Failed)
{
  "success": false,
  "message": "Payment processing failed",
  "errors": [
    "Your card was declined. Please try another payment method."
  ],
  "data": {
    "accountCreated": true,
    "userId": "guid",
    "membershipType": "Guest",
    "requiresPayment": true
  }
}

Business Rules:
- Validate all personal information
- Email must be unique
- Password must match confirmPassword
- Password: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
- User must agree to terms (agreedToTerms = true)
- Age must be 13+ (calculated from dateOfBirth)
- Guest tier: No payment required
  - Set MembershipType = 'Guest'
  - Set MaxScans = 1
  - No subscription record created
- Member/Pro tier: Requires payment processing
  - billingPeriod is required
  - Create user account first
  - Process payment via Stripe or Wallet
  - If payment fails:
    * Create account as Guest
    * Return error with accountCreated flag
    * User can upgrade later
  - If payment succeeds:
    * Create Stripe customer (if card payment)
    * Create Stripe subscription
    * Update MembershipType, MaxScans, SubscriptionStatus
    * Create Subscription record
    * Create Transaction record
    * Create Invoice record
- Send welcome email with verification link
- Return JWT tokens for immediate login
- Set QuestionnaireCompleted = false
- Redirect frontend to questionnaire flow

Plan Pricing Reference:
- Guest: $0/forever
- Member Monthly: $9.99/month
- Member Yearly: $79.99/year ($6.67/month, save 33%)
- Pro Monthly: $29.99/month
- Pro Yearly: $239.99/year ($19.99/month, save 33%)

Scan Limits:
- Guest: 1 scan per day (MaxScans = 1)
- Member: 5 scans total (MaxScans = 5)
- Pro: Unlimited scans (MaxScans = 9999)
```

#### 1.3 Login
```http
POST /auth/login
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "deviceInfo": "iPhone 15 Pro, iOS 17.2"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "refresh_token_here",
    "expiresAt": "2024-12-15T12:30:00Z",
    "tokenType": "Bearer",
    "user": {
      "id": "guid",
      "email": "user@example.com",
      "name": "John Doe",
      "membershipType": "Guest",
      "scansToday": 0,
      "maxScans": 1,
      "questionnaireCompleted": false,
      "isEmailVerified": true,
      "profileImageUrl": null,
      "walletBalance": 0.00
    }
  }
}

Business Rules:
- Lock account after 5 failed attempts (15 minutes)
- Update LastLoginAt timestamp
- Create refresh token entry
- Clear old expired refresh tokens for user
- Return error if email not verified (configurable)
```

#### 1.4 Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

Request Body:
{
  "refreshToken": "refresh_token_here"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "accessToken": "new_access_token",
    "refreshToken": "new_refresh_token",
    "expiresAt": "2024-12-15T13:00:00Z"
  }
}

Business Rules:
- Validate refresh token exists and not revoked
- Check expiration
- Generate new access + refresh tokens
- Revoke old refresh token
- Maintain token rotation for security
```

#### 1.5 Logout
```http
POST /auth/logout
Authorization: Bearer {token}

Request Body:
{
  "refreshToken": "refresh_token_here"
}

Response: 200 OK
{
  "success": true,
  "message": "Logged out successfully"
}

Business Rules:
- Revoke refresh token
- Optionally blacklist access token (if using blacklist strategy)
```

#### 1.6 Verify Email
```http
POST /auth/verify-email
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "verificationCode": "123456"
}

Response: 200 OK
{
  "success": true,
  "message": "Email verified successfully"
}

Business Rules:
- Code expires after 24 hours
- Max 3 verification attempts
- Update IsEmailVerified flag
- Send welcome email after verification
```

#### 1.7 Forgot Password
```http
POST /auth/forgot-password
Content-Type: application/json

Request Body:
{
  "email": "user@example.com"
}

Response: 200 OK
{
  "success": true,
  "message": "Password reset email sent"
}

Business Rules:
- Always return success (security best practice)
- Send reset email only if email exists
- Generate reset token (expires in 1 hour)
- Rate limit: max 3 requests per hour per IP
```

#### 1.8 Reset Password
```http
POST /auth/reset-password
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "resetToken": "token_from_email",
  "newPassword": "NewSecurePassword123!"
}

Response: 200 OK
{
  "success": true,
  "message": "Password reset successfully"
}

Business Rules:
- Validate reset token
- Check token expiration
- Validate new password strength
- Invalidate all refresh tokens for user
- Send password changed confirmation email
```

#### 1.9 Get Current User Profile
```http
GET /users/me
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "guid",
    "email": "user@example.com",
    "name": "John Doe",
    "phoneNumber": "+1234567890",
    "dateOfBirth": "1995-05-15",
    "profileImageUrl": "https://...",
    "membershipType": "Pro",
    "scansToday": 3,
    "maxScans": 9999,
    "walletBalance": 150.00,
    "subscriptionStatus": "Active",
    "subscriptionEndDate": "2025-01-15T00:00:00Z",
    "questionnaireCompleted": true,
    "isEmailVerified": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "skinProfile": {
      "skinType": "Combination",
      "skinConcerns": ["Acne", "DarkSpots"],
      "currentRoutine": "Advanced",
      "sunExposure": "Moderate",
      "lifestyle": "Active"
    },
    "hasStation": true,
    "stationData": { /* station details */ }
  }
}
```

#### 1.10 Update User Profile
```http
PUT /users/me
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "name": "John Updated Doe",
  "phoneNumber": "+1234567890",
  "dateOfBirth": "1995-05-15"
}

Response: 200 OK
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { /* updated user object */ }
}
```

#### 1.11 Upload Profile Image
```http
POST /users/me/profile-image
Authorization: Bearer {token}
Content-Type: multipart/form-data

Request Body:
- image: (binary file)

Response: 200 OK
{
  "success": true,
  "data": {
    "profileImageUrl": "https://storage.skinpai.com/profiles/user-id/image.jpg"
  }
}

Business Rules:
- Max file size: 5MB
- Allowed formats: JPG, PNG, WebP
- Auto-resize to 512x512px
- Delete old profile image from storage
- Update Users.ProfileImageUrl
```

---

### 2. Skin Questionnaire

#### 2.1 Submit Questionnaire
```http
POST /questionnaire
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "skinType": "Combination",
  "skinConcerns": "Acne and Dark Spots",
  "currentRoutine": "Advanced",
  "sunExposure": "Moderate",
  "lifestyle": "Active",
  "allergies": "None"
}

Response: 200 OK
{
  "success": true,
  "message": "Skin profile saved successfully",
  "data": {
    "skinProfile": { /* profile data */ },
    "recommendedProducts": [ /* array of products */ ]
  }
}

Business Rules:
- Create or update UserSkinProfiles record
- Set QuestionnaireCompleted = true on Users table
- Trigger recommendation engine
- Can be updated multiple times
```

---

### 3. Skin Analysis & Scanning

#### 3.1 Check Scan Availability
```http
GET /scans/availability
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "canScan": true,
    "scansUsedToday": 2,
    "scansRemaining": 3,
    "maxScans": 5,
    "membershipType": "Member",
    "resetTime": "2024-12-16T00:00:00Z"
  }
}

Business Rules:
- Guest: 1 scan per day (resets daily at midnight UTC)
- Member: 5 scans total (NOT per day - total limit)
- Pro: Unlimited scans (isUnlimited = true)
- For Guest users: Query DailyScanLimits table and check daily reset
- For Member users: Check Users.ScansToday field (no reset)
- For Pro users: Always return canScan = true
- resetTime is null for Member/Pro, tomorrow's date for Guest
```

#### 3.2 Upload Scan Image & Start Analysis
```http
POST /scans
Authorization: Bearer {token}
Content-Type: multipart/form-data

Request Body:
- image: (binary file)
- actualAge: 29 (optional)

Response: 202 Accepted
{
  "success": true,
  "message": "Scan uploaded. Processing started.",
  "data": {
    "scanId": "guid",
    "status": "Processing",
    "estimatedCompletionTime": "2024-12-15T12:35:00Z"
  }
}

Business Rules:
- Check scan availability first
- Increment DailyScanLimits.ScanCount
- Increment Users.ScansToday
- Upload image to blob storage
- Create ScanResults record with status "Processing"
- Trigger async AI analysis job
- Max file size: 10MB
- Allowed formats: JPG, PNG
- Recommended size: 1024x1024px minimum
```

#### 3.3 Get Scan Result
```http
GET /scans/{scanId}
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "guid",
    "userId": "guid",
    "imageUrl": "https://...",
    "scanDate": "2024-12-15T12:30:00Z",
    "processingStatus": "Completed",
    "overallScore": 78.5,
    "estimatedAge": 27,
    "actualAge": 29,
    "skinType": "Combination",
    "metrics": {
      "hydration": 72.3,
      "moisture": 68.5,
      "oiliness": 45.2,
      "evenness": 81.0,
      "texture": 75.5,
      "clarity": 69.8,
      "firmness": 82.1,
      "elasticity": 78.9,
      "poreSize": 55.3,
      "smoothness": 73.2,
      "radiance": 71.5
    },
    "concerns": {
      "acne": 35.2,
      "wrinkles": 15.8,
      "darkCircles": 42.1,
      "darkSpots": 28.5,
      "redness": 18.3,
      "uvDamage": 22.7
    },
    "aiAnalysis": "Your skin shows good overall health with...",
    "recommendations": [
      "Use a hydrating serum daily",
      "Consider products with niacinamide for dark spots",
      "Apply SPF 30+ sunscreen every morning"
    ]
  }
}

Business Rules:
- User can only access their own scans
- Return 202 if still processing
- Return 500 if processing failed
- Cache results for 24 hours
```

#### 3.4 Get Scan History
```http
GET /scans/history?page=1&pageSize=20&sortBy=date&sortOrder=desc
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "items": [ /* array of scan summaries */ ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 20,
      "totalPages": 5,
      "totalItems": 95
    }
  }
}

Business Rules:
- Only available for Member and Pro users
- Guest users get error: "Upgrade to Member to access scan history"
- Default sort: newest first
- Include only completed scans
```

#### 3.5 Delete Scan
```http
DELETE /scans/{scanId}
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "message": "Scan deleted successfully"
}

Business Rules:
- User can only delete their own scans
- Delete image from blob storage
- Delete scan record and all recommendations
- Soft delete recommended (add IsDeleted flag)
```

---

### 4. Products & Recommendations

#### 4.1 Get Product Recommendations
```http
GET /products/recommendations?basedOn=scan&scanId={guid}
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "forYou": [
      {
        "id": "guid",
        "name": "Vitamin C Brightening Serum",
        "brand": {
          "id": "guid",
          "name": "CeraVe",
          "logoUrl": "https://...",
          "isVerified": true
        },
        "price": 29.99,
        "originalPrice": 39.99,
        "discount": 25,
        "rating": 4.5,
        "reviews": 1243,
        "imageUrl": "https://...",
        "category": "Serum",
        "keyIngredients": ["Vitamin C", "Hyaluronic Acid"],
        "skinTypes": ["All"],
        "skinConcerns": ["Dark Spots", "Dullness"],
        "shopUrl": "https://...",
        "inStock": true,
        "isRecommended": true,
        "matchScore": 95.5
      }
    ]
  }
}

Business Rules:
- Based on scan results, skin profile, or user preferences
- Use ML recommendation algorithm
- Filter by in-stock items
- Prioritize verified brands
- Include affiliate links
```

#### 4.2 Get All Products (with Filters)
```http
GET /products?
  category=Serum&
  brands[]=CeraVe&brands[]=Neutrogena&
  minPrice=10&maxPrice=50&
  skinType=Combination&
  skinConcern=Acne&
  verifiedOnly=true&
  inStock=true&
  sortBy=price&
  sortOrder=asc&
  page=1&pageSize=24

Authorization: Bearer {token} (optional for guests)

Response: 200 OK
{
  "success": true,
  "data": {
    "items": [ /* array of products */ ],
    "filters": {
      "availableCategories": ["Cleanser", "Serum", "Moisturizer"],
      "availableBrands": ["CeraVe", "Neutrogena", "La Roche-Posay"],
      "priceRange": { "min": 5.99, "max": 199.99 },
      "availableSkinTypes": ["Oily", "Dry", "Combination"],
      "availableConcerns": ["Acne", "Wrinkles", "Dark Spots"]
    },
    "pagination": {
      "currentPage": 1,
      "pageSize": 24,
      "totalPages": 8,
      "totalItems": 187
    }
  }
}
```

#### 4.3 Get Product Details
```http
GET /products/{productId}
Authorization: Bearer {token} (optional)

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "guid",
    "name": "Product Name",
    "brand": { /* brand details */ },
    "distributor": { /* distributor details */ },
    "price": 29.99,
    "originalPrice": 39.99,
    "discount": 25,
    "rating": 4.5,
    "reviews": 1243,
    "imageUrl": "https://...",
    "category": { /* category details */ },
    "description": "Full product description...",
    "keyIngredients": ["Ingredient 1", "Ingredient 2"],
    "skinTypes": ["Oily", "Combination"],
    "skinConcerns": ["Acne", "Dark Spots"],
    "shopUrl": "https://...",
    "inStock": true,
    "howToUse": "Apply twice daily...",
    "warnings": "For external use only..."
  }
}

Business Rules:
- Track product view in analytics
- Log click if user is authenticated
```

#### 4.4 Get Product Reviews
```http
GET /products/{productId}/reviews?page=1&pageSize=10&sortBy=helpful
Authorization: Bearer {token} (optional)

Response: 200 OK
{
  "success": true,
  "data": {
    "averageRating": 4.5,
    "totalReviews": 1243,
    "ratingDistribution": {
      "5": 850,
      "4": 250,
      "3": 100,
      "2": 30,
      "1": 13
    },
    "reviews": [
      {
        "id": "guid",
        "userId": "guid",
        "userName": "Sarah M.",
        "userAvatar": "https://...",
        "rating": 5,
        "reviewText": "Amazing product! My skin has never looked better.",
        "isVerifiedPurchase": true,
        "helpfulCount": 45,
        "createdAt": "2024-12-01T10:30:00Z",
        "updatedAt": "2024-12-01T10:30:00Z"
      }
    ],
    "pagination": { /* pagination details */ }
  }
}
```

#### 4.5 Submit Product Review
```http
POST /products/{productId}/reviews
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "rating": 5,
  "reviewText": "Great product! Highly recommend."
}

Response: 201 Created
{
  "success": true,
  "message": "Review submitted successfully",
  "data": { /* review object */ }
}

Business Rules:
- One review per user per product
- Update product rating and review count
- Requires authentication
- Optional: verify purchase before allowing review
```

#### 4.6 Get Product Bundles
```http
GET /bundles?category=Anti-Aging&forSkinType=Dry&page=1&pageSize=12
Authorization: Bearer {token} (optional)

Response: 200 OK
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "guid",
        "name": "Complete Anti-Aging Kit",
        "description": "Everything you need...",
        "brand": { /* brand */ },
        "bundlePrice": 89.99,
        "originalPrice": 129.99,
        "savings": 40.00,
        "imageUrl": "https://...",
        "category": "Anti-Aging",
        "benefits": ["Reduces wrinkles", "Firms skin"],
        "forSkinTypes": ["All"],
        "forSkinConcerns": ["Wrinkles", "Fine Lines"],
        "products": [ /* array of products in bundle */ ],
        "isCustomized": false
      }
    ],
    "pagination": { /* pagination */ }
  }
}
```

#### 4.7 Get Bundle Details
```http
GET /bundles/{bundleId}
Authorization: Bearer {token} (optional)

Response: 200 OK
{
  "success": true,
  "data": {
    /* Full bundle details with all products */
  }
}
```

---

### 5. Community & Social Features

#### 5.1 Get Community Feed
```http
GET /community/feed?page=1&pageSize=20&filter=following
Authorization: Bearer {token}

Query Parameters:
- filter: all | following | trending
- page: 1
- pageSize: 20

Response: 200 OK
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "guid",
        "author": {
          "id": "guid",
          "name": "Sarah Beauty",
          "username": "@sarahbeauty",
          "avatar": "https://...",
          "isVerified": true,
          "isInfluencer": true,
          "stationId": "guid"
        },
        "postType": "Image",
        "caption": "Day 15 of #GlowChallenge30!",
        "mediaUrl": "https://...",
        "mediaType": "image/jpeg",
        "hashtags": ["GlowChallenge30", "Skincare"],
        "taggedProducts": [ /* product objects */ ],
        "engagement": {
          "likeCount": 1247,
          "commentCount": 89,
          "shareCount": 34,
          "viewCount": 5632,
          "isLiked": false,
          "isSaved": false
        },
        "createdAt": "2024-12-15T10:30:00Z"
      }
    ],
    "pagination": { /* pagination */ }
  }
}

Business Rules:
- "following" filter: show posts from followed stations only
- "trending": sort by engagement rate (last 24h)
- "all": show all public posts
- Include sponsored posts (marked)
```

#### 5.2 Create Post
```http
POST /community/posts
Authorization: Bearer {token}
Content-Type: multipart/form-data

Request Body:
- caption: "My skincare routine!"
- media: (file upload - image or video)
- hashtags[]: ["Skincare", "RoutineGoals"]
- taggedProducts[]: ["product-id-1", "product-id-2"]
- stationId: "guid" (if posting to station)

Response: 201 Created
{
  "success": true,
  "message": "Post created successfully",
  "data": { /* post object */ }
}

Business Rules:
- Requires authentication
- Max file size: 50MB
- Allowed formats: JPG, PNG, MP4, MOV
- Max 30 hashtags
- Max 10 tagged products
- Auto-moderate content (profanity filter)
- If stationId provided, verify user owns station
```

#### 5.3 Get Post Details
```http
GET /community/posts/{postId}
Authorization: Bearer {token} (optional)

Response: 200 OK
{
  "success": true,
  "data": { /* full post object with comments */ }
}

Business Rules:
- Increment view count
- Return with top 5 comments
- Include link to load more comments
```

#### 5.4 Like/Unlike Post
```http
POST /community/posts/{postId}/like
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "isLiked": true,
    "likeCount": 1248
  }
}

Business Rules:
- Toggle like/unlike
- Update Posts.LikeCount
- Create/delete Like record
- Send notification to post author (if liked)
```

#### 5.5 Comment on Post
```http
POST /community/posts/{postId}/comments
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "commentText": "Great skincare tips!",
  "parentCommentId": "guid" // optional for replies
}

Response: 201 Created
{
  "success": true,
  "data": {
    "id": "guid",
    "postId": "guid",
    "userId": "guid",
    "userName": "John Doe",
    "userAvatar": "https://...",
    "commentText": "Great skincare tips!",
    "parentCommentId": null,
    "likeCount": 0,
    "createdAt": "2024-12-15T12:45:00Z"
  }
}

Business Rules:
- Update Posts.CommentCount
- Send notification to post author
- If reply, notify parent comment author
- Max 1000 characters
```

#### 5.6 Get Post Comments
```http
GET /community/posts/{postId}/comments?page=1&pageSize=20
Authorization: Bearer {token} (optional)

Response: 200 OK
{
  "success": true,
  "data": {
    "comments": [ /* comments with nested replies */ ],
    "pagination": { /* pagination */ }
  }
}
```

#### 5.7 Delete Post
```http
DELETE /community/posts/{postId}
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "message": "Post deleted successfully"
}

Business Rules:
- User can only delete their own posts
- Delete media from blob storage
- Delete all comments, likes
- Decrement station post count
```

---

### 6. Creator Stations

#### 6.1 Create Station
```http
POST /stations
Authorization: Bearer {token}
Content-Type: multipart/form-data

Request Body:
- stationName: "Sarah's Skincare Studio"
- stationUsername: "sarahskincare"
- bio: "Certified dermatologist sharing tips"
- description: "Welcome to my station..."
- location: "Los Angeles, CA"
- coverImage: (file)
- avatarImage: (file)
- specialties[]: ["Anti-Aging", "Acne Treatment"]
- theme: "modern"
- instagramUrl: "https://instagram.com/..."
- youtubeUrl: "https://youtube.com/..."
- twitterUrl: "https://twitter.com/..."
- websiteUrl: "https://mywebsite.com"
- contactEmail: "contact@example.com"
- certifications[]: ["Board Certified Dermatologist"]
- experience: "10+ years"
- contentFrequency: "Daily"

Response: 201 Created
{
  "success": true,
  "message": "Creator Station created successfully",
  "data": { /* station object */ }
}

Business Rules:
- ONLY Pro members can create stations
- One station per user
- Username must be unique (lowercase, alphanumeric + underscore)
- Username: 3-30 characters
- Update Users.HasStation = true
- Store station data
- Send welcome email with station guidelines
```

#### 6.2 Get Station Details
```http
GET /stations/{stationId}
Authorization: Bearer {token} (optional)

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "guid",
    "userId": "guid",
    "stationName": "Sarah's Skincare Studio",
    "stationUsername": "sarahskincare",
    "bio": "Certified dermatologist...",
    "description": "Welcome to my station...",
    "location": "Los Angeles, CA",
    "coverImageUrl": "https://...",
    "avatarImageUrl": "https://...",
    "specialties": ["Anti-Aging", "Acne Treatment"],
    "theme": "modern",
    "socialLinks": {
      "instagram": "https://...",
      "youtube": "https://...",
      "twitter": "https://...",
      "website": "https://...",
      "email": "contact@example.com"
    },
    "certifications": ["Board Certified Dermatologist"],
    "experience": "10+ years",
    "contentFrequency": "Daily",
    "stats": {
      "followerCount": 3842,
      "postCount": 47,
      "totalViews": 125478,
      "totalLikes": 18924
    },
    "isFollowing": false,
    "isVerified": true,
    "createdAt": "2024-01-15T00:00:00Z"
  }
}

Business Rules:
- Increment view count in analytics
- Return isFollowing status if user authenticated
```

#### 6.3 Update Station
```http
PUT /stations/{stationId}
Authorization: Bearer {token}
Content-Type: multipart/form-data

Request Body:
/* Same as create, all fields optional */

Response: 200 OK
{
  "success": true,
  "message": "Station updated successfully",
  "data": { /* updated station */ }
}

Business Rules:
- Only station owner can update
- Cannot change stationUsername after creation
- Validate Pro membership still active
```

#### 6.4 Delete Station
```http
DELETE /stations/{stationId}
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "message": "Station deleted successfully"
}

Business Rules:
- Only station owner can delete
- Confirm deletion (require password)
- Soft delete (set IsActive = false)
- Keep posts but mark as orphaned
- Update Users.HasStation = false
- Remove all followers
```

#### 6.5 Follow/Unfollow Station
```http
POST /stations/{stationId}/follow
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "isFollowing": true,
    "followerCount": 3843
  }
}

Business Rules:
- Toggle follow/unfollow
- Update CreatorStations.FollowerCount
- Create/delete Follow record
- Send notification to station owner (if followed)
```

#### 6.6 Get Station Posts
```http
GET /stations/{stationId}/posts?page=1&pageSize=20
Authorization: Bearer {token} (optional)

Response: 200 OK
{
  "success": true,
  "data": {
    "posts": [ /* array of posts */ ],
    "pagination": { /* pagination */ }
  }
}
```

#### 6.7 Get Station Followers
```http
GET /stations/{stationId}/followers?page=1&pageSize=50
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "followers": [
      {
        "userId": "guid",
        "name": "John Doe",
        "username": "@johndoe",
        "avatar": "https://...",
        "followedAt": "2024-12-01T10:00:00Z"
      }
    ],
    "pagination": { /* pagination */ }
  }
}

Business Rules:
- Only station owner can view followers list
```

#### 6.8 Search Stations
```http
GET /stations/search?q=skincare&specialties[]=Anti-Aging&verified=true
Authorization: Bearer {token} (optional)

Response: 200 OK
{
  "success": true,
  "data": {
    "stations": [ /* array of stations */ ],
    "pagination": { /* pagination */ }
  }
}
```

---

### 7. Payment & Subscriptions

#### 7.1 Get Subscription Plans
```http
GET /subscriptions/plans

Response: 200 OK
{
  "success": true,
  "data": {
    "plans": [
      {
        "id": "member-monthly",
        "planType": "Member",
        "billingCycle": "Monthly",
        "price": 9.99,
        "originalPrice": 9.99,
        "currency": "USD",
        "features": [
          "5 scans per day",
          "Progress tracking",
          "Routine reminders",
          "Achievements",
          "Data backup"
        ]
      },
      {
        "id": "member-yearly",
        "planType": "Member",
        "billingCycle": "Yearly",
        "price": 79.99,
        "originalPrice": 119.88,
        "savings": 39.89,
        "savingsPercentage": 33,
        "currency": "USD",
        "pricePerMonth": 6.67,
        "features": [ /* same as monthly */ ]
      },
      {
        "id": "pro-monthly",
        "planType": "Pro",
        "billingCycle": "Monthly",
        "price": 29.99,
        "currency": "USD",
        "features": [
          "Unlimited scans",
          "Creator Station",
          "Analytics Dashboard",
          "Priority support",
          "Monetization tools"
        ]
      },
      {
        "id": "pro-yearly",
        "planType": "Pro",
        "billingCycle": "Yearly",
        "price": 239.99,
        "originalPrice": 359.88,
        "savings": 119.89,
        "savingsPercentage": 33,
        "currency": "USD",
        "pricePerMonth": 19.99,
        "features": [ /* same as monthly */ ]
      }
    ]
  }
}
```

#### 7.2 Create Subscription (Stripe Payment)
```http
POST /subscriptions
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "planId": "pro-monthly",
  "paymentMethodId": "pm_1234567890", // Stripe payment method ID
  "billingDetails": {
    "name": "John Doe",
    "email": "john@example.com",
    "address": {
      "line1": "123 Main St",
      "city": "Los Angeles",
      "state": "CA",
      "postalCode": "90001",
      "country": "US"
    }
  }
}

Response: 201 Created
{
  "success": true,
  "message": "Subscription created successfully",
  "data": {
    "subscriptionId": "guid",
    "planType": "Pro",
    "billingCycle": "Monthly",
    "amount": 29.99,
    "status": "Active",
    "startDate": "2024-12-15T00:00:00Z",
    "endDate": "2025-01-15T00:00:00Z",
    "nextBillingDate": "2025-01-15T00:00:00Z",
    "stripeSubscriptionId": "sub_1234567890"
  }
}

Business Rules:
- Validate plan exists
- Create Stripe customer if not exists
- Create Stripe subscription
- Update Users table:
  - MembershipType = plan type
  - MaxScans = based on plan
  - SubscriptionStatus = Active
  - SubscriptionEndDate = calculated
- Create Subscription record
- Create Transaction record
- Create Invoice
- Send confirmation email
- If upgrading, prorate previous subscription
```

#### 7.3 Create Subscription (Wallet Payment)
```http
POST /subscriptions/wallet
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "planId": "pro-monthly"
}

Response: 201 Created
{
  "success": true,
  "message": "Subscription activated using wallet balance",
  "data": { /* subscription details */ }
}

Business Rules:
- Check wallet balance >= plan price
- Deduct from wallet
- Create WalletTransaction (Debit)
- Update Users.WalletBalance
- Create Subscription record
- Same membership update as card payment
```

#### 7.4 Get Current Subscription
```http
GET /subscriptions/current
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "subscriptionId": "guid",
    "planType": "Pro",
    "billingCycle": "Monthly",
    "amount": 29.99,
    "status": "Active",
    "startDate": "2024-12-15T00:00:00Z",
    "endDate": "2025-01-15T00:00:00Z",
    "nextBillingDate": "2025-01-15T00:00:00Z",
    "daysRemaining": 31,
    "autoRenew": true,
    "paymentMethod": {
      "type": "Card",
      "cardBrand": "Visa",
      "last4": "4242"
    }
  }
}
```

#### 7.5 Cancel Subscription
```http
POST /subscriptions/{subscriptionId}/cancel
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "reason": "Too expensive",
  "cancelImmediately": false
}

Response: 200 OK
{
  "success": true,
  "message": "Subscription will be cancelled at period end",
  "data": {
    "status": "Cancelled",
    "accessUntil": "2025-01-15T00:00:00Z"
  }
}

Business Rules:
- If cancelImmediately = false: access until period end
- If cancelImmediately = true: cancel now, calculate refund
- Cancel Stripe subscription
- Update Subscription.Status = Cancelled
- Update Subscription.CancelledAt
- Store cancellation reason
- Send cancellation confirmation email
- Schedule job to downgrade user at period end
```

#### 7.6 Reactivate Subscription
```http
POST /subscriptions/{subscriptionId}/reactivate
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "message": "Subscription reactivated successfully",
  "data": { /* subscription details */ }
}

Business Rules:
- Only if status = Cancelled and not expired
- Resume Stripe subscription
- Update status to Active
```

#### 7.7 Upgrade/Downgrade Subscription
```http
POST /subscriptions/{subscriptionId}/change-plan
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "newPlanId": "pro-yearly"
}

Response: 200 OK
{
  "success": true,
  "message": "Subscription upgraded successfully",
  "data": { /* new subscription details */ }
}

Business Rules:
- Calculate proration
- Update Stripe subscription
- Create new Subscription record or update existing
- If upgrade: charge difference immediately
- If downgrade: apply credit to next billing
- Update user membership type and limits
```

#### 7.8 Get Subscription History
```http
GET /subscriptions/history?page=1&pageSize=10
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "subscriptions": [ /* past and current subscriptions */ ],
    "pagination": { /* pagination */ }
  }
}
```

---

### 8. Wallet & Transactions

#### 8.1 Get Wallet Balance
```http
GET /wallet
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "balance": 150.00,
    "currency": "USD",
    "lastTransaction": {
      "id": "guid",
      "type": "Credit",
      "amount": 50.00,
      "description": "Wallet top-up",
      "date": "2024-12-10T15:30:00Z"
    }
  }
}
```

#### 8.2 Add Funds to Wallet
```http
POST /wallet/add-funds
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "amount": 100.00,
  "paymentMethodId": "pm_1234567890" // Stripe payment method
}

Response: 201 Created
{
  "success": true,
  "message": "Funds added successfully",
  "data": {
    "transactionId": "guid",
    "amount": 100.00,
    "newBalance": 250.00
  }
}

Business Rules:
- Min amount: $10.00
- Max amount: $1000.00 per transaction
- Create Transaction record (Type = WalletTopUp)
- Create WalletTransaction (Type = Credit)
- Update Users.WalletBalance
- Send email receipt
```

#### 8.3 Get Transaction History
```http
GET /wallet/transactions?
  type=Credit&
  startDate=2024-01-01&
  endDate=2024-12-31&
  page=1&pageSize=20

Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "guid",
        "transactionType": "Credit",
        "amount": 100.00,
        "balanceBefore": 150.00,
        "balanceAfter": 250.00,
        "description": "Wallet top-up",
        "reference": "TXN-20241215-001",
        "createdAt": "2024-12-15T10:00:00Z"
      }
    ],
    "summary": {
      "totalCredits": 500.00,
      "totalDebits": 350.00,
      "netAmount": 150.00
    },
    "pagination": { /* pagination */ }
  }
}
```

#### 8.4 Get Invoices
```http
GET /invoices?page=1&pageSize=20
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "invoices": [
      {
        "id": "guid",
        "invoiceNumber": "INV-2024-001234",
        "amount": 29.99,
        "tax": 2.40,
        "total": 32.39,
        "status": "Paid",
        "dueDate": "2024-12-15T00:00:00Z",
        "paidAt": "2024-12-15T10:30:00Z",
        "invoiceUrl": "https://storage.skinpai.com/invoices/INV-2024-001234.pdf",
        "description": "Pro Membership - Monthly",
        "createdAt": "2024-12-15T10:00:00Z"
      }
    ],
    "pagination": { /* pagination */ }
  }
}
```

#### 8.5 Download Invoice
```http
GET /invoices/{invoiceId}/download
Authorization: Bearer {token}

Response: 200 OK (PDF file)
Content-Type: application/pdf
Content-Disposition: attachment; filename="INV-2024-001234.pdf"

Business Rules:
- User can only download their own invoices
- Generate PDF if not already cached
- Track download in analytics
```

---

### 9. Notifications

#### 9.1 Get Notifications
```http
GET /notifications?page=1&pageSize=20&unreadOnly=false
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "guid",
        "type": "NewFollower",
        "title": "New Follower",
        "message": "Sarah Beauty started following your station",
        "imageUrl": "https://...",
        "actionUrl": "/stations/sarah-beauty",
        "isRead": false,
        "createdAt": "2024-12-15T10:00:00Z"
      }
    ],
    "unreadCount": 5,
    "pagination": { /* pagination */ }
  }
}
```

#### 9.2 Mark Notification as Read
```http
PUT /notifications/{notificationId}/read
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "message": "Notification marked as read"
}
```

#### 9.3 Mark All as Read
```http
PUT /notifications/read-all
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "message": "All notifications marked as read"
}
```

#### 9.4 Delete Notification
```http
DELETE /notifications/{notificationId}
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "message": "Notification deleted"
}
```

#### 9.5 Get Notification Settings
```http
GET /notifications/settings
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "scanReminders": true,
    "routineReminders": true,
    "productDeals": true,
    "communityUpdates": false,
    "influencerPosts": true,
    "emailNotifications": true,
    "pushNotifications": true
  }
}
```

#### 9.6 Update Notification Settings
```http
PUT /notifications/settings
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "scanReminders": true,
  "routineReminders": false,
  "productDeals": true,
  "communityUpdates": false,
  "influencerPosts": true,
  "emailNotifications": true,
  "pushNotifications": true
}

Response: 200 OK
{
  "success": true,
  "message": "Notification settings updated"
}
```

---

### 10. Analytics (Pro Members Only)

#### 10.1 Get Station Analytics Dashboard
```http
GET /analytics/station/{stationId}?
  startDate=2024-12-01&
  endDate=2024-12-31&
  timeRange=month

Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "overview": {
      "totalViews": 125478,
      "viewsGrowth": 23.5,
      "totalFollowers": 3842,
      "followersGrowth": 15.2,
      "engagementRate": 8.7,
      "engagementGrowth": 5.3,
      "totalRevenue": 2847.50,
      "revenueGrowth": 18.9
    },
    "dailyStats": [
      {
        "date": "2024-12-01",
        "views": 542,
        "newFollowers": 12,
        "likes": 234,
        "comments": 45,
        "shares": 8
      }
    ],
    "topPosts": [
      {
        "postId": "guid",
        "title": "Morning Skincare Routine 2024",
        "views": 2341,
        "likes": 456,
        "comments": 89,
        "engagement": 23.4
      }
    ],
    "audienceInsights": {
      "demographics": {
        "ageGroups": {
          "18-24": 32,
          "25-34": 45,
          "35-44": 18,
          "45+": 5
        },
        "topLocations": [
          { "country": "US", "percentage": 65 },
          { "country": "UK", "percentage": 15 },
          { "country": "CA", "percentage": 10 }
        ]
      },
      "peakEngagementTimes": [
        { "day": "Weekdays", "time": "6-9 PM", "level": "High" },
        { "day": "Weekends", "time": "12-3 PM", "level": "High" }
      ]
    }
  }
}

Business Rules:
- Only Pro members can access analytics
- Only station owner can view their analytics
- Cache results for 1 hour
- Background job updates daily stats
```

#### 10.2 Get Post Performance Analytics
```http
GET /analytics/posts/{postId}
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "postId": "guid",
    "totalViews": 2341,
    "uniqueViews": 1987,
    "likes": 456,
    "comments": 89,
    "shares": 34,
    "saves": 123,
    "clickThroughRate": 12.5,
    "engagementRate": 23.4,
    "dailyViews": [ /* time series data */ ],
    "trafficSources": {
      "feed": 65,
      "profile": 20,
      "hashtags": 10,
      "shared": 5
    }
  }
}

Business Rules:
- Only post owner can view analytics
- Pro members only
```

---

## Business Rules & Logic

### Membership Tiers

| Feature | Guest | Member | Pro |
|---------|-------|--------|-----|
| **Scan Limit** | **1 scan per day** | **5 scans total** | **Unlimited** |
| Scan History | ❌ | ✅ | ✅ |
| Progress Tracking | ❌ | ✅ | ✅ |
| Routine Reminders | ❌ | ✅ | ✅ |
| Achievements | ❌ | ✅ | ✅ |
| Personalized Tips | ❌ | ✅ | ✅ |
| Data Backup | ❌ | ✅ | ✅ |
| Creator Station | ❌ | ❌ | ✅ (One per account) |
| Analytics Dashboard | ❌ | ❌ | ✅ |
| Priority Support | ❌ | ❌ | ✅ |
| Ad-Free Experience | ❌ | ❌ | ✅ |

**Important Note:** 
- **Guest:** 1 scan per day (resets daily at midnight UTC)
- **Member:** 5 scans total (NOT per day - total limit across subscription period)
- **Pro:** Unlimited scans (MaxScans = 9999 in database)

### Daily Scan Reset Logic
```csharp
// Reset scan counter at midnight UTC for GUEST users only
// Member and Pro users have total/unlimited scans, not daily limits
// Background job runs daily at 00:00 UTC
public async Task ResetDailyScanLimits()
{
    var today = DateTime.UtcNow.Date;
    
    // Reset ONLY Guest users' scan counter (MembershipType = 'Guest')
    await _dbContext.Database.ExecuteSqlRawAsync(
        "UPDATE Users SET ScansToday = 0 WHERE ScansToday > 0 AND MembershipType = 'Guest'"
    );
    
    // Clean up old daily scan limit records (older than 30 days)
    await _dbContext.DailyScanLimits
        .Where(d => d.ScanDate < today.AddDays(-30))
        .ExecuteDeleteAsync();
}
```

**Scan Limit Implementation Rules:**
- **Guest Users:** Use `ScansToday` field, resets daily at midnight UTC
- **Member Users:** Use `ScansToday` field for total count, does NOT reset (max 5 total)
- **Pro Users:** Unlimited scans (MaxScans = 9999), no practical limit enforced

### Scan Availability Check
```csharp
public async Task<ScanAvailabilityDto> CheckScanAvailability(Guid userId)
{
    var user = await _userRepository.GetByIdAsync(userId);
    var today = DateTime.UtcNow.Date;
    
    int scansUsedToday = user.ScansToday;
    int scansRemaining = user.MaxScans - scansUsedToday;
    bool canScan = scansRemaining > 0;
    
    DateTime? resetTime = null;
    
    // Guest users: scans reset daily
    if (user.MembershipType == MembershipType.Guest)
    {
        var dailyLimit = await _dbContext.DailyScanLimits
            .FirstOrDefaultAsync(d => d.UserId == userId && d.ScanDate == today);
        
        scansUsedToday = dailyLimit?.ScanCount ?? 0;
        scansRemaining = user.MaxScans - scansUsedToday;
        canScan = scansRemaining > 0;
        resetTime = today.AddDays(1); // Reset at midnight UTC
    }
    // Member users: total 5 scans, no reset
    else if (user.MembershipType == MembershipType.Member)
    {
        scansUsedToday = user.ScansToday;
        scansRemaining = 5 - scansUsedToday;
        canScan = scansRemaining > 0;
        resetTime = null; // No reset - total limit
    }
    // Pro users: unlimited scans
    else if (user.MembershipType == MembershipType.Pro)
    {
        canScan = true;
        scansRemaining = 9999;
        resetTime = null;
    }
    
    return new ScanAvailabilityDto
    {
        CanScan = canScan,
        ScansUsed = scansUsedToday,
        ScansRemaining = scansRemaining,
        MaxScans = user.MaxScans,
        MembershipType = user.MembershipType,
        ResetTime = resetTime,
        IsUnlimited = user.MembershipType == MembershipType.Pro
    };
}
```

### Creator Station Restrictions
```csharp
public async Task<Result> CreateStation(CreateStationDto dto, Guid userId)
{
    var user = await _userRepository.GetByIdAsync(userId);
    
    // Check Pro membership
    if (user.MembershipType != MembershipType.Pro)
    {
        return Result.Failure("Creator Stations are exclusive to Pro members. Please upgrade.");
    }
    
    // Check if user already has a station
    if (user.HasStation)
    {
        return Result.Failure("You already have a Creator Station. Only one station per account is allowed.");
    }
    
    // Check username uniqueness
    var usernameExists = await _stationRepository
        .ExistsAsync(s => s.StationUsername == dto.StationUsername.ToLower());
    
    if (usernameExists)
    {
        return Result.Failure("Station username already taken. Please choose another.");
    }
    
    // Create station...
}
```

### Subscription Proration Logic
```csharp
public async Task<ProrationResult> CalculateProration(
    Subscription currentSubscription, 
    string newPlanId)
{
    var currentPlan = GetPlanDetails(currentSubscription.PlanId);
    var newPlan = GetPlanDetails(newPlanId);
    
    var daysRemaining = (currentSubscription.EndDate - DateTime.UtcNow).Days;
    var totalDays = (currentSubscription.EndDate - currentSubscription.StartDate).Days;
    
    decimal unusedAmount = (currentPlan.Amount / totalDays) * daysRemaining;
    decimal newPlanDailyRate = newPlan.Amount / 30; // or actual billing period days
    decimal chargeNow = (newPlanDailyRate * daysRemaining) - unusedAmount;
    
    return new ProrationResult
    {
        UnusedCredit = unusedAmount,
        NewPlanCost = newPlanDailyRate * daysRemaining,
        AmountToCharge = Math.Max(0, chargeNow),
        AmountToCredit = Math.Max(0, -chargeNow)
    };
}
```

### Wallet Transaction Logic
```csharp
public async Task<Result> ProcessWalletPayment(
    Guid userId, 
    decimal amount, 
    string description)
{
    using var transaction = await _dbContext.Database.BeginTransactionAsync();
    
    try
    {
        var user = await _userRepository.GetByIdAsync(userId);
        
        // Check sufficient balance
        if (user.WalletBalance < amount)
        {
            return Result.Failure($"Insufficient wallet balance. Required: ${amount:F2}, Available: ${user.WalletBalance:F2}");
        }
        
        var balanceBefore = user.WalletBalance;
        var balanceAfter = balanceBefore - amount;
        
        // Update wallet balance
        user.WalletBalance = balanceAfter;
        await _userRepository.UpdateAsync(user);
        
        // Create wallet transaction record
        var walletTxn = new WalletTransaction
        {
            UserId = userId,
            TransactionType = TransactionType.Debit,
            Amount = amount,
            BalanceBefore = balanceBefore,
            BalanceAfter = balanceAfter,
            Description = description,
            CreatedAt = DateTime.UtcNow
        };
        
        await _walletRepository.AddTransactionAsync(walletTxn);
        await transaction.CommitAsync();
        
        return Result.Success();
    }
    catch (Exception ex)
    {
        await transaction.RollbackAsync();
        _logger.LogError(ex, "Wallet payment failed for user {UserId}", userId);
        return Result.Failure("Payment processing failed. Please try again.");
    }
}
```

### Engagement Rate Calculation
```csharp
public decimal CalculateEngagementRate(Post post)
{
    if (post.ViewCount == 0) return 0;
    
    int totalEngagements = post.LikeCount + post.CommentCount + post.ShareCount;
    decimal engagementRate = (decimal)totalEngagements / post.ViewCount * 100;
    
    return Math.Round(engagementRate, 2);
}

public async Task UpdateStationEngagementRate(Guid stationId, DateTime date)
{
    var analytics = await _analyticsRepository
        .GetStationAnalyticsAsync(stationId, date);
    
    if (analytics.ViewCount == 0)
    {
        analytics.EngagementRate = 0;
        return;
    }
    
    int totalEngagements = analytics.LikeCount + analytics.CommentCount + analytics.ShareCount;
    analytics.EngagementRate = (decimal)totalEngagements / analytics.ViewCount * 100;
    
    await _analyticsRepository.UpdateAsync(analytics);
}
```

---

## Third-Party Integrations

### 1. Stripe Payment Integration

```csharp
// Stripe Configuration
public class StripeSettings
{
    public string SecretKey { get; set; }
    public string PublishableKey { get; set; }
    public string WebhookSecret { get; set; }
}

// Payment Service
public class StripePaymentService : IPaymentService
{
    private readonly StripeSettings _stripeSettings;
    
    public async Task<PaymentIntent> CreatePaymentIntent(decimal amount, string currency = "usd")
    {
        StripeConfiguration.ApiKey = _stripeSettings.SecretKey;
        
        var options = new PaymentIntentCreateOptions
        {
            Amount = (long)(amount * 100), // Convert to cents
            Currency = currency,
            PaymentMethodTypes = new List<string> { "card" }
        };
        
        var service = new PaymentIntentService();
        return await service.CreateAsync(options);
    }
    
    public async Task<Subscription> CreateSubscription(
        string customerId, 
        string priceId)
    {
        var options = new SubscriptionCreateOptions
        {
            Customer = customerId,
            Items = new List<SubscriptionItemOptions>
            {
                new SubscriptionItemOptions { Price = priceId }
            },
            PaymentBehavior = "default_incomplete",
            Expand = new List<string> { "latest_invoice.payment_intent" }
        };
        
        var service = new SubscriptionService();
        return await service.CreateAsync(options);
    }
}

// Webhook Handler
[ApiController]
[Route("api/v1/webhooks/stripe")]
public class StripeWebhookController : ControllerBase
{
    private readonly IStripeWebhookHandler _webhookHandler;
    private readonly StripeSettings _settings;
    
    [HttpPost]
    public async Task<IActionResult> HandleWebhook()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        
        try
        {
            var stripeEvent = EventUtility.ConstructEvent(
                json,
                Request.Headers["Stripe-Signature"],
                _settings.WebhookSecret
            );
            
            switch (stripeEvent.Type)
            {
                case "payment_intent.succeeded":
                    await _webhookHandler.HandlePaymentSucceeded(stripeEvent);
                    break;
                    
                case "payment_intent.payment_failed":
                    await _webhookHandler.HandlePaymentFailed(stripeEvent);
                    break;
                    
                case "customer.subscription.updated":
                    await _webhookHandler.HandleSubscriptionUpdated(stripeEvent);
                    break;
                    
                case "customer.subscription.deleted":
                    await _webhookHandler.HandleSubscriptionCancelled(stripeEvent);
                    break;
                    
                case "invoice.payment_succeeded":
                    await _webhookHandler.HandleInvoicePaid(stripeEvent);
                    break;
            }
            
            return Ok();
        }
        catch (StripeException)
        {
            return BadRequest();
        }
    }
}
```

### 2. Azure Computer Vision (Skin Analysis AI)

```csharp
public class AzureVisionSkinAnalysisService : ISkinAnalysisService
{
    private readonly ComputerVisionClient _visionClient;
    private readonly IConfiguration _config;
    
    public AzureVisionSkinAnalysisService(IConfiguration config)
    {
        _config = config;
        _visionClient = new ComputerVisionClient(
            new ApiKeyServiceClientCredentials(_config["AzureVision:Key"]))
        {
            Endpoint = _config["AzureVision:Endpoint"]
        };
    }
    
    public async Task<SkinAnalysisResult> AnalyzeSkinImage(string imageUrl)
    {
        // Azure Vision Analysis
        var features = new List<VisualFeatureTypes?>
        {
            VisualFeatureTypes.Faces,
            VisualFeatureTypes.Color,
            VisualFeatureTypes.ImageType
        };
        
        var analysisResult = await _visionClient.AnalyzeImageAsync(imageUrl, features);
        
        // Custom ML model for skin-specific analysis
        var skinMetrics = await AnalyzeWithCustomModel(imageUrl);
        
        return new SkinAnalysisResult
        {
            OverallScore = CalculateOverallScore(skinMetrics),
            EstimatedAge = analysisResult.Faces.FirstOrDefault()?.Age ?? 0,
            Hydration = skinMetrics.Hydration,
            Moisture = skinMetrics.Moisture,
            Oiliness = skinMetrics.Oiliness,
            // ... other metrics
            AIAnalysis = GenerateAIAnalysis(skinMetrics),
            Recommendations = GenerateRecommendations(skinMetrics)
        };
    }
    
    private async Task<SkinMetrics> AnalyzeWithCustomModel(string imageUrl)
    {
        // Call your custom trained ML model
        // Could be Azure ML, AWS SageMaker, or custom Python service
        
        var httpClient = new HttpClient();
        var response = await httpClient.PostAsJsonAsync(
            _config["CustomML:Endpoint"],
            new { imageUrl }
        );
        
        return await response.Content.ReadFromJsonAsync<SkinMetrics>();
    }
}
```

### 3. Azure Blob Storage (Image Storage)

```csharp
public class AzureBlobStorageService : IStorageService
{
    private readonly BlobServiceClient _blobServiceClient;
    private readonly string _containerName;
    
    public AzureBlobStorageService(IConfiguration config)
    {
        _blobServiceClient = new BlobServiceClient(
            config["AzureStorage:ConnectionString"]
        );
        _containerName = config["AzureStorage:ContainerName"];
    }
    
    public async Task<string> UploadImageAsync(
        Stream imageStream, 
        string fileName, 
        string contentType)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
        await containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob);
        
        var blobName = $"{Guid.NewGuid()}/{fileName}";
        var blobClient = containerClient.GetBlobClient(blobName);
        
        var blobHttpHeaders = new BlobHttpHeaders
        {
            ContentType = contentType
        };
        
        await blobClient.UploadAsync(imageStream, new BlobUploadOptions
        {
            HttpHeaders = blobHttpHeaders
        });
        
        return blobClient.Uri.ToString();
    }
    
    public async Task DeleteImageAsync(string blobName)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
        var blobClient = containerClient.GetBlobClient(blobName);
        await blobClient.DeleteIfExistsAsync();
    }
}
```

### 4. SendGrid (Email Service)

```csharp
public class SendGridEmailService : IEmailService
{
    private readonly SendGridClient _client;
    private readonly IConfiguration _config;
    
    public SendGridEmailService(IConfiguration config)
    {
        _config = config;
        _client = new SendGridClient(_config["SendGrid:ApiKey"]);
    }
    
    public async Task SendVerificationEmailAsync(string toEmail, string verificationCode)
    {
        var from = new EmailAddress(_config["SendGrid:FromEmail"], "SkinPAI");
        var to = new EmailAddress(toEmail);
        var subject = "Verify Your SkinPAI Account";
        
        var htmlContent = $@"
            <h2>Welcome to SkinPAI!</h2>
            <p>Please verify your email address by using this code:</p>
            <h3>{verificationCode}</h3>
            <p>This code expires in 24 hours.</p>
        ";
        
        var msg = MailHelper.CreateSingleEmail(from, to, subject, "", htmlContent);
        await _client.SendEmailAsync(msg);
    }
    
    public async Task SendSubscriptionConfirmationAsync(
        string toEmail, 
        string planName, 
        decimal amount)
    {
        // Similar implementation...
    }
}
```

### 5. Firebase Cloud Messaging (Push Notifications)

```csharp
public class FirebasePushNotificationService : IPushNotificationService
{
    private readonly FirebaseMessaging _messaging;
    
    public async Task SendNotificationAsync(
        string deviceToken, 
        string title, 
        string body, 
        Dictionary<string, string> data = null)
    {
        var message = new Message
        {
            Token = deviceToken,
            Notification = new Notification
            {
                Title = title,
                Body = body
            },
            Data = data,
            Android = new AndroidConfig
            {
                Notification = new AndroidNotification
                {
                    ClickAction = "FLUTTER_NOTIFICATION_CLICK"
                }
            },
            Apns = new ApnsConfig
            {
                Aps = new Aps
                {
                    Sound = "default"
                }
            }
        };
        
        await FirebaseMessaging.DefaultInstance.SendAsync(message);
    }
    
    public async Task SendToTopicAsync(
        string topic, 
        string title, 
        string body)
    {
        var message = new Message
        {
            Topic = topic,
            Notification = new Notification
            {
                Title = title,
                Body = body
            }
        };
        
        await FirebaseMessaging.DefaultInstance.SendAsync(message);
    }
}
```

### 6. Hangfire (Background Jobs)

```csharp
// Startup configuration
public void ConfigureServices(IServiceCollection services)
{
    services.AddHangfire(config => config
        .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
        .UseSimpleAssemblyNameTypeSerializer()
        .UseRecommendedSerializerSettings()
        .UseSqlServerStorage(Configuration.GetConnectionString("DefaultConnection")));
    
    services.AddHangfireServer();
}

// Background job service
public class BackgroundJobService
{
    public void ScheduleRecurringJobs()
    {
        // Reset daily scan limits at midnight UTC
        RecurringJob.AddOrUpdate<IScanService>(
            "reset-daily-scans",
            x => x.ResetDailyScanLimits(),
            "0 0 * * *", // Cron: daily at midnight
            TimeZoneInfo.Utc
        );
        
        // Update station analytics daily
        RecurringJob.AddOrUpdate<IAnalyticsService>(
            "update-station-analytics",
            x => x.UpdateAllStationAnalytics(),
            "0 1 * * *", // Cron: daily at 1 AM
            TimeZoneInfo.Utc
        );
        
        // Process subscription renewals
        RecurringJob.AddOrUpdate<ISubscriptionService>(
            "process-renewals",
            x => x.ProcessSubscriptionRenewals(),
            "0 2 * * *", // Cron: daily at 2 AM
            TimeZoneInfo.Utc
        );
        
        // Send routine reminders
        RecurringJob.AddOrUpdate<INotificationService>(
            "send-routine-reminders",
            x => x.SendScheduledRoutineReminders(),
            "*/30 * * * *", // Cron: every 30 minutes
            TimeZoneInfo.Utc
        );
    }
}
```

---

## Security & Compliance

### 1. Data Protection & Privacy

```csharp
// GDPR Compliance - Data Anonymization
public async Task<Result> AnonymizeUserData(Guid userId)
{
    var user = await _userRepository.GetByIdAsync(userId);
    
    user.Email = $"deleted_{user.Id}@anonymized.local";
    user.Name = "Deleted User";
    user.PhoneNumber = null;
    user.DateOfBirth = null;
    user.ProfileImageUrl = null;
    
    // Delete sensitive data
    await _scanRepository.DeleteUserScansAsync(userId);
    await _paymentRepository.AnonymizePaymentDataAsync(userId);
    
    // Keep anonymized analytics for business purposes
    await _userRepository.UpdateAsync(user);
    
    return Result.Success();
}

// Data Export (GDPR Right to Data Portability)
public async Task<byte[]> ExportUserData(Guid userId)
{
    var userData = new
    {
        Profile = await _userRepository.GetByIdAsync(userId),
        SkinProfile = await _skinProfileRepository.GetByUserIdAsync(userId),
        ScanHistory = await _scanRepository.GetUserScansAsync(userId),
        Posts = await _postRepository.GetUserPostsAsync(userId),
        Transactions = await _transactionRepository.GetUserTransactionsAsync(userId),
        Subscriptions = await _subscriptionRepository.GetUserSubscriptionsAsync(userId)
    };
    
    var json = JsonSerializer.Serialize(userData, new JsonSerializerOptions 
    { 
        WriteIndented = true 
    });
    
    return Encoding.UTF8.GetBytes(json);
}
```

### 2. Input Validation & Sanitization

```csharp
// Using FluentValidation
public class CreatePostValidator : AbstractValidator<CreatePostDto>
{
    public CreatePostValidator()
    {
        RuleFor(x => x.Caption)
            .MaximumLength(2000)
            .WithMessage("Caption cannot exceed 2000 characters");
        
        RuleFor(x => x.Hashtags)
            .Must(hashtags => hashtags == null || hashtags.Count <= 30)
            .WithMessage("Maximum 30 hashtags allowed");
        
        RuleFor(x => x.TaggedProducts)
            .Must(products => products == null || products.Count <= 10)
            .WithMessage("Maximum 10 products can be tagged");
        
        // Sanitize HTML/Script tags
        RuleFor(x => x.Caption)
            .Must(BeValidAndSanitized)
            .WithMessage("Caption contains invalid characters");
    }
    
    private bool BeValidAndSanitized(string text)
    {
        if (string.IsNullOrWhiteSpace(text)) return true;
        
        // Remove potentially dangerous tags
        var sanitized = Regex.Replace(text, @"<script.*?</script>", "", 
            RegexOptions.IgnoreCase | RegexOptions.Singleline);
        
        return sanitized == text;
    }
}
```

### 3. Rate Limiting

```csharp
// Using AspNetCoreRateLimit
public void ConfigureServices(IServiceCollection services)
{
    services.AddMemoryCache();
    
    services.Configure<IpRateLimitOptions>(options =>
    {
        options.EnableEndpointRateLimiting = true;
        options.StackBlockedRequests = false;
        options.GeneralRules = new List<RateLimitRule>
        {
            // General API rate limit
            new RateLimitRule
            {
                Endpoint = "*",
                Period = "1m",
                Limit = 60
            },
            // Stricter limits for authentication
            new RateLimitRule
            {
                Endpoint = "POST:/api/v1/auth/*",
                Period = "1h",
                Limit = 10
            },
            // Scan upload limits
            new RateLimitRule
            {
                Endpoint = "POST:/api/v1/scans",
                Period = "1m",
                Limit = 5
            }
        };
    });
    
    services.AddSingleton<IIpPolicyStore, MemoryCacheIpPolicyStore>();
    services.AddSingleton<IRateLimitCounterStore, MemoryCacheRateLimitCounterStore>();
    services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();
}
```

### 4. Content Moderation

```csharp
public class ContentModerationService : IContentModerationService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _config;
    
    public async Task<ModerationResult> ModerateContent(string text)
    {
        // Use Azure Content Moderator or similar service
        var response = await _httpClient.PostAsJsonAsync(
            $"{_config["ContentModeration:Endpoint"]}/text/screen",
            new { text }
        );
        
        var result = await response.Content.ReadFromJsonAsync<ModerationResult>();
        
        if (result.ContainsProfanity || result.IsAdultContent)
        {
            return ModerationResult.Rejected("Content violates community guidelines");
        }
        
        return ModerationResult.Approved();
    }
    
    public async Task<ImageModerationResult> ModerateImage(string imageUrl)
    {
        var response = await _httpClient.PostAsJsonAsync(
            $"{_config["ContentModeration:Endpoint"]}/image/evaluate",
            new { imageUrl }
        );
        
        var result = await response.Content.ReadFromJsonAsync<ImageModerationResult>();
        
        if (result.IsAdultContent || result.IsRacyContent)
        {
            return ImageModerationResult.Rejected("Image violates community guidelines");
        }
        
        return ImageModerationResult.Approved();
    }
}
```

### 5. Encryption

```csharp
// Encrypt sensitive data at rest
public class EncryptionService : IEncryptionService
{
    private readonly IDataProtectionProvider _dataProtector;
    
    public EncryptionService(IDataProtectionProvider dataProtector)
    {
        _dataProtector = dataProtector;
    }
    
    public string Encrypt(string plainText)
    {
        var protector = _dataProtector.CreateProtector("SkinPAISensitiveData");
        return protector.Protect(plainText);
    }
    
    public string Decrypt(string cipherText)
    {
        var protector = _dataProtector.CreateProtector("SkinPAISensitiveData");
        return protector.Unprotect(cipherText);
    }
}

// Usage for payment methods
public class PaymentMethod
{
    public string Last4Digits { get; set; }
    
    [EncryptedColumn]
    public string FullCardNumber { get; set; } // Encrypted in database
}
```

---

## Error Handling

### Standard Error Response Format

```csharp
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public T Data { get; set; }
    public List<ErrorDetail> Errors { get; set; }
    public string TraceId { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}

public class ErrorDetail
{
    public string Field { get; set; }
    public string Message { get; set; }
    public string Code { get; set; }
}
```

### Global Exception Handler

```csharp
public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;
    
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception occurred");
            await HandleExceptionAsync(context, ex);
        }
    }
    
    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        
        var response = new ApiResponse<object>
        {
            Success = false,
            TraceId = Activity.Current?.Id ?? context.TraceIdentifier
        };
        
        switch (exception)
        {
            case ValidationException validationEx:
                context.Response.StatusCode = StatusCodes.Status400BadRequest;
                response.Message = "Validation failed";
                response.Errors = validationEx.Errors.Select(e => new ErrorDetail
                {
                    Field = e.PropertyName,
                    Message = e.ErrorMessage,
                    Code = e.ErrorCode
                }).ToList();
                break;
                
            case UnauthorizedAccessException:
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                response.Message = "Unauthorized access";
                break;
                
            case NotFoundException:
                context.Response.StatusCode = StatusCodes.Status404NotFound;
                response.Message = exception.Message;
                break;
                
            case BusinessRuleException businessEx:
                context.Response.StatusCode = StatusCodes.Status422UnprocessableEntity;
                response.Message = businessEx.Message;
                break;
                
            default:
                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                response.Message = "An internal error occurred";
                break;
        }
        
        return context.Response.WriteAsJsonAsync(response);
    }
}
```

### HTTP Status Codes Used

| Code | Usage |
|------|-------|
| 200 OK | Successful GET, PUT, DELETE |
| 201 Created | Successful POST (resource created) |
| 202 Accepted | Async processing started |
| 204 No Content | Successful DELETE with no response body |
| 400 Bad Request | Invalid request format or parameters |
| 401 Unauthorized | Missing or invalid authentication token |
| 403 Forbidden | Authenticated but not authorized |
| 404 Not Found | Resource doesn't exist |
| 409 Conflict | Resource conflict (e.g., duplicate email) |
| 422 Unprocessable Entity | Business rule violation |
| 429 Too Many Requests | Rate limit exceeded |
| 500 Internal Server Error | Server error |
| 503 Service Unavailable | Temporary service outage |

---

## Rate Limiting & Performance

### Caching Strategy

```csharp
public class CachingService : ICachingService
{
    private readonly IDistributedCache _cache;
    
    public async Task<T> GetOrSetAsync<T>(
        string key, 
        Func<Task<T>> factory, 
        TimeSpan? expiration = null)
    {
        var cachedData = await _cache.GetStringAsync(key);
        
        if (!string.IsNullOrEmpty(cachedData))
        {
            return JsonSerializer.Deserialize<T>(cachedData);
        }
        
        var data = await factory();
        var serialized = JsonSerializer.Serialize(data);
        
        var options = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = expiration ?? TimeSpan.FromMinutes(10)
        };
        
        await _cache.SetStringAsync(key, serialized, options);
        
        return data;
    }
}

// Usage
public async Task<Product> GetProductById(Guid productId)
{
    var cacheKey = $"product:{productId}";
    
    return await _cachingService.GetOrSetAsync(
        cacheKey,
        async () => await _productRepository.GetByIdAsync(productId),
        TimeSpan.FromHours(1)
    );
}
```

### Database Indexing Recommendations

```sql
-- Users table
CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_Users_MembershipType ON Users(MembershipType);

-- ScanResults table
CREATE INDEX IX_ScanResults_UserId_ScanDate ON ScanResults(UserId, ScanDate DESC);

-- Products table
CREATE INDEX IX_Products_CategoryId ON Products(CategoryId);
CREATE INDEX IX_Products_BrandId ON Products(BrandId);
CREATE INDEX IX_Products_Price ON Products(Price);

-- Posts table
CREATE INDEX IX_Posts_UserId_CreatedAt ON Posts(UserId, CreatedAt DESC);
CREATE INDEX IX_Posts_StationId_CreatedAt ON Posts(StationId, CreatedAt DESC);

-- Follows table
CREATE INDEX IX_Follows_FollowerUserId ON Follows(FollowerUserId);
CREATE INDEX IX_Follows_FollowingStationId ON Follows(FollowingStationId);

-- Subscriptions table
CREATE INDEX IX_Subscriptions_UserId_Status ON Subscriptions(UserId, Status);
CREATE INDEX IX_Subscriptions_EndDate ON Subscriptions(EndDate);
```

### Performance Optimization Tips

1. **Use pagination** for all list endpoints
2. **Implement lazy loading** for entity relationships
3. **Use async/await** throughout the application
4. **Cache frequently accessed data** (products, user profiles)
5. **Optimize images** before storing (resize, compress)
6. **Use CDN** for static assets and images
7. **Implement database connection pooling**
8. **Use bulk operations** for batch updates
9. **Monitor slow queries** and optimize
10. **Implement read replicas** for heavy read operations

---

## Deployment & Configuration

### appsettings.json Structure

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=...;Database=SkinPAIDB;...",
    "RedisConnection": "localhost:6379"
  },
  "JwtSettings": {
    "Secret": "your-secret-key-min-32-characters",
    "Issuer": "SkinPAIAPI",
    "Audience": "SkinPAIApp",
    "AccessTokenExpirationMinutes": 30,
    "RefreshTokenExpirationDays": 30
  },
  "Stripe": {
    "SecretKey": "sk_test_...",
    "PublishableKey": "pk_test_...",
    "WebhookSecret": "whsec_..."
  },
  "AzureStorage": {
    "ConnectionString": "DefaultEndpointsProtocol=https;...",
    "ContainerName": "skinpai-images"
  },
  "AzureVision": {
    "Endpoint": "https://<region>.api.cognitive.microsoft.com/",
    "Key": "your-key"
  },
  "SendGrid": {
    "ApiKey": "SG...",
    "FromEmail": "noreply@skinpai.com",
    "FromName": "SkinPAI"
  },
  "Firebase": {
    "ProjectId": "skinpai-app",
    "CredentialsPath": "firebase-credentials.json"
  },
  "CustomML": {
    "Endpoint": "https://your-ml-service.com/analyze"
  },
  "ContentModeration": {
    "Endpoint": "https://content-moderator-api.com"
  },
  "RateLimit": {
    "EnableRateLimiting": true,
    "RequestsPerMinute": 60
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  }
}
```

---

## Testing Requirements

### Unit Tests
- Test all business logic in services
- Test validation rules
- Test calculation methods (proration, engagement rate, etc.)
- Minimum 80% code coverage

### Integration Tests
- Test API endpoints
- Test database operations
- Test third-party service integrations
- Test authentication flows

### Load Testing
- Test scan upload under load (1000 concurrent users)
- Test API performance (response time < 200ms for 95th percentile)
- Test database connection pooling
- Test caching effectiveness

---

## Changelog

### Version 1.1.0 - December 15, 2024

#### New Features Added:
1. **Create Account with Membership Selection Endpoint** (`POST /auth/create-account`)
   - Comprehensive registration flow with membership tier selection
   - Integrated payment processing during account creation
   - Support for Guest, Member, and Pro tier selection
   - Billing period selection (monthly/yearly) for paid tiers
   - Payment methods: Card (Stripe) and Wallet
   - Automatic fallback to Guest tier if payment fails
   - Returns JWT tokens for immediate authentication
   - Redirects to questionnaire flow after successful registration

#### Updated Features:
2. **Scan Limits Clarification**
   - **Guest**: 1 scan per day (resets daily at midnight UTC)
   - **Member**: 5 scans total (NOT per day - total limit across subscription)
   - **Pro**: Unlimited scans (9999 MaxScans)
   - Updated `CheckScanAvailability` endpoint response format
   - Added `isUnlimited` field to API responses
   - Updated `resetTime` logic (null for Member/Pro, tomorrow for Guest)

3. **Business Logic Updates**
   - Modified daily scan reset job to only reset Guest users
   - Updated scan availability check to handle different tier behaviors
   - Enhanced membership tier feature comparison table
   - Added scan limit implementation rules documentation

#### API Changes:
- New endpoint: `POST /auth/create-account`
- Updated endpoint: `GET /scans/availability` (new response format)
- Updated endpoint numbering in Authentication section (1.1-1.11)

#### Database Schema Notes:
- No schema changes required - existing `Users` table supports all features
- `ScansToday` field usage clarified for different membership tiers
- `DailyScanLimits` table only used for Guest users

#### Integration Notes:
- Frontend Create Account flow now supports 3-step process:
  1. Personal Information
  2. Membership Selection with Billing Period
  3. Payment Processing (for paid tiers)
- Payment failures gracefully handled with Guest tier fallback
- Subscription and transaction records created atomically with account

---

## Conclusion

This documentation provides a comprehensive guide for implementing the SkinPAI backend API using .NET Core 8+. Follow these specifications to ensure consistency, security, and scalability.

For questions or clarifications, please contact the development team.

**Happy Coding! 🚀**
