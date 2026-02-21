# SkinPAI Backend API Documentation
## .NET Core 8+ Implementation Guide

**Version:** 1.0  
**Last Updated:** December 15, 2024  
**API Base URL:** `https://api.skinpai.com/v1`

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Database Schema](#database-schema)
4. [Authentication & Authorization](#authentication--authorization)
5. [API Endpoints](#api-endpoints)
6. [Business Rules & Logic](#business-rules--logic)
7. [Payment Integration](#payment-integration)
8. [AI/ML Integration](#aiml-integration)
9. [File Storage & CDN](#file-storage--cdn)
10. [Push Notifications](#push-notifications)
11. [Email Services](#email-services)
12. [Rate Limiting & Throttling](#rate-limiting--throttling)
13. [Error Handling](#error-handling)
14. [Security Considerations](#security-considerations)
15. [Deployment & DevOps](#deployment--devops)
16. [Monitoring & Logging](#monitoring--logging)

---

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Applications                      │
│              (iOS, Android, Web Browser)                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway / Load Balancer               │
│                  (NGINX / Azure API Management)              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    .NET Core 8 Web API                       │
│                  (RESTful API Services)                      │
├─────────────────────────────────────────────────────────────┤
│  Controllers │ Services │ Repositories │ Middleware          │
└─────────────────────────────────────────────────────────────┘
            │               │              │
            ▼               ▼              ▼
┌─────────────┐  ┌──────────────┐  ┌─────────────┐
│  SQL Server │  │ Redis Cache  │  │ Blob Storage│
│  Database   │  │              │  │  (Images)   │
└─────────────┘  └──────────────┘  └─────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
├─────────────────────────────────────────────────────────────┤
│  AI/ML API │ Payment Gateway │ Email Service │ SMS Service  │
└─────────────────────────────────────────────────────────────┘
```

### Design Patterns

- **Repository Pattern**: Data access abstraction
- **Unit of Work Pattern**: Transaction management
- **Dependency Injection**: Loose coupling
- **CQRS Pattern**: Command Query Responsibility Segregation (for analytics)
- **Mediator Pattern**: Request handling via MediatR
- **Factory Pattern**: Object creation for services

---

## Technology Stack

### Core Technologies

```xml
<!-- SkinPAI.API.csproj -->
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

  <ItemGroup>
    <!-- ASP.NET Core -->
    <PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="8.0.0" />
    <PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
    
    <!-- Entity Framework Core -->
    <PackageReference Include="Microsoft.EntityFrameworkCore" Version="8.0.0" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.0" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="8.0.0" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="8.0.0" />
    
    <!-- Authentication & Security -->
    <PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.0" />
    <PackageReference Include="Microsoft.AspNetCore.Identity.EntityFrameworkCore" Version="8.0.0" />
    <PackageReference Include="System.IdentityModel.Tokens.Jwt" Version="7.0.0" />
    
    <!-- Caching -->
    <PackageReference Include="Microsoft.Extensions.Caching.StackExchangeRedis" Version="8.0.0" />
    
    <!-- Validation -->
    <PackageReference Include="FluentValidation.AspNetCore" Version="11.3.0" />
    
    <!-- Mapping -->
    <PackageReference Include="AutoMapper.Extensions.Microsoft.DependencyInjection" Version="12.0.1" />
    
    <!-- API Documentation -->
    <PackageReference Include="Swashbuckle.AspNetCore.Annotations" Version="6.5.0" />
    
    <!-- Logging -->
    <PackageReference Include="Serilog.AspNetCore" Version="8.0.0" />
    <PackageReference Include="Serilog.Sinks.Console" Version="5.0.1" />
    <PackageReference Include="Serilog.Sinks.File" Version="5.0.0" />
    <PackageReference Include="Serilog.Sinks.Seq" Version="7.0.0" />
    
    <!-- Storage -->
    <PackageReference Include="Azure.Storage.Blobs" Version="12.19.1" />
    
    <!-- HTTP Client -->
    <PackageReference Include="Microsoft.Extensions.Http.Polly" Version="8.0.0" />
    
    <!-- Background Jobs -->
    <PackageReference Include="Hangfire.AspNetCore" Version="1.8.6" />
    <PackageReference Include="Hangfire.SqlServer" Version="1.8.6" />
    
    <!-- Rate Limiting -->
    <PackageReference Include="AspNetCoreRateLimit" Version="5.0.0" />
    
    <!-- Email -->
    <PackageReference Include="SendGrid" Version="9.28.1" />
    
    <!-- Push Notifications -->
    <PackageReference Include="FirebaseAdmin" Version="2.4.0" />
    
    <!-- Payment Processing -->
    <PackageReference Include="Stripe.net" Version="43.0.0" />
    
    <!-- Real-time Communication -->
    <PackageReference Include="Microsoft.AspNetCore.SignalR" Version="8.0.0" />
    
    <!-- Health Checks -->
    <PackageReference Include="AspNetCore.HealthChecks.SqlServer" Version="8.0.0" />
    <PackageReference Include="AspNetCore.HealthChecks.Redis" Version="8.0.0" />
    <PackageReference Include="AspNetCore.HealthChecks.UI" Version="8.0.0" />
    
    <!-- Request/Response -->
    <PackageReference Include="MediatR" Version="12.1.1" />
  </ItemGroup>
</Project>
```

---

## Database Schema

### Complete Database Schema (SQL Server)

```sql
-- =============================================
-- SkinPAI Database Schema
-- SQL Server 2022 or above
-- =============================================

USE master;
GO

-- Create Database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'SkinPAI')
BEGIN
    CREATE DATABASE SkinPAI;
END
GO

USE SkinPAI;
GO

-- =============================================
-- USERS & AUTHENTICATION
-- =============================================

-- Users Table
CREATE TABLE Users (
    UserId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Email NVARCHAR(256) NOT NULL UNIQUE,
    EmailConfirmed BIT NOT NULL DEFAULT 0,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    SecurityStamp NVARCHAR(MAX),
    PhoneNumber NVARCHAR(50),
    PhoneNumberConfirmed BIT NOT NULL DEFAULT 0,
    TwoFactorEnabled BIT NOT NULL DEFAULT 0,
    LockoutEnd DATETIMEOFFSET NULL,
    LockoutEnabled BIT NOT NULL DEFAULT 1,
    AccessFailedCount INT NOT NULL DEFAULT 0,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    DateOfBirth DATE NULL,
    Gender NVARCHAR(20) NULL,
    ProfileImageUrl NVARCHAR(500) NULL,
    Bio NVARCHAR(500) NULL,
    MembershipType NVARCHAR(20) NOT NULL DEFAULT 'Guest', -- Guest, Member, Pro
    MembershipStatus NVARCHAR(20) NOT NULL DEFAULT 'Active', -- Active, Suspended, Cancelled
    MembershipStartDate DATETIME2 NULL,
    MembershipEndDate DATETIME2 NULL,
    IsCreator BIT NOT NULL DEFAULT 0,
    IsVerified BIT NOT NULL DEFAULT 0,
    WalletBalance DECIMAL(18,2) NOT NULL DEFAULT 0,
    TotalScansUsed INT NOT NULL DEFAULT 0,
    LastScanDate DATETIME2 NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    LastLoginAt DATETIME2 NULL,
    IsDeleted BIT NOT NULL DEFAULT 0,
    DeletedAt DATETIME2 NULL,
    
    INDEX IX_Users_Email (Email),
    INDEX IX_Users_MembershipType (MembershipType),
    INDEX IX_Users_CreatedAt (CreatedAt),
    INDEX IX_Users_IsDeleted (IsDeleted)
);

-- Refresh Tokens
CREATE TABLE RefreshTokens (
    RefreshTokenId BIGINT IDENTITY(1,1) PRIMARY KEY,
    UserId UNIQUEIDENTIFIER NOT NULL,
    Token NVARCHAR(500) NOT NULL UNIQUE,
    ExpiresAt DATETIME2 NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CreatedByIp NVARCHAR(50),
    RevokedAt DATETIME2 NULL,
    RevokedByIp NVARCHAR(50),
    ReplacedByToken NVARCHAR(500) NULL,
    
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    INDEX IX_RefreshTokens_UserId (UserId),
    INDEX IX_RefreshTokens_Token (Token)
);

-- User Roles
CREATE TABLE Roles (
    RoleId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    RoleName NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(500),
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

INSERT INTO Roles (RoleName, Description) VALUES
('Admin', 'Full system access'),
('Moderator', 'Content moderation access'),
('User', 'Standard user access'),
('Creator', 'Content creator access');

-- User Role Mapping
CREATE TABLE UserRoles (
    UserRoleId BIGINT IDENTITY(1,1) PRIMARY KEY,
    UserId UNIQUEIDENTIFIER NOT NULL,
    RoleId UNIQUEIDENTIFIER NOT NULL,
    AssignedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    FOREIGN KEY (RoleId) REFERENCES Roles(RoleId) ON DELETE CASCADE,
    UNIQUE(UserId, RoleId),
    INDEX IX_UserRoles_UserId (UserId)
);

-- =============================================
-- SUBSCRIPTION & PAYMENTS
-- =============================================

-- Subscription Plans
CREATE TABLE SubscriptionPlans (
    PlanId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    PlanName NVARCHAR(50) NOT NULL, -- Member, Pro
    BillingPeriod NVARCHAR(20) NOT NULL, -- Monthly, Yearly
    PriceAmount DECIMAL(18,2) NOT NULL,
    Currency NVARCHAR(3) NOT NULL DEFAULT 'USD',
    DailyScansLimit INT NULL, -- NULL = unlimited
    Features NVARCHAR(MAX), -- JSON array of features
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    INDEX IX_SubscriptionPlans_PlanName (PlanName)
);

INSERT INTO SubscriptionPlans (PlanName, BillingPeriod, PriceAmount, DailyScansLimit, Features) VALUES
('Member', 'Monthly', 9.99, 5, '["5 scans per day","Progress tracking","Routine reminders","Achievements","Personalized tips","Data backup"]'),
('Member', 'Yearly', 79.99, 5, '["5 scans per day","Progress tracking","Routine reminders","Achievements","Personalized tips","Data backup"]'),
('Pro', 'Monthly', 29.99, NULL, '["Unlimited scans","Creator Station","Advanced Analytics","Audience insights","Monetization tools","Priority support","Early feature access","Custom branding","Verified badge","Advanced data export"]'),
('Pro', 'Yearly', 239.99, NULL, '["Unlimited scans","Creator Station","Advanced Analytics","Audience insights","Monetization tools","Priority support","Early feature access","Custom branding","Verified badge","Advanced data export"]');

-- User Subscriptions
CREATE TABLE UserSubscriptions (
    SubscriptionId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    PlanId UNIQUEIDENTIFIER NOT NULL,
    Status NVARCHAR(20) NOT NULL, -- Active, Cancelled, Expired, Suspended
    StartDate DATETIME2 NOT NULL,
    EndDate DATETIME2 NOT NULL,
    AutoRenew BIT NOT NULL DEFAULT 1,
    CancelledAt DATETIME2 NULL,
    CancellationReason NVARCHAR(500) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    FOREIGN KEY (PlanId) REFERENCES SubscriptionPlans(PlanId),
    INDEX IX_UserSubscriptions_UserId (UserId),
    INDEX IX_UserSubscriptions_Status (Status),
    INDEX IX_UserSubscriptions_EndDate (EndDate)
);

-- Payment Transactions
CREATE TABLE PaymentTransactions (
    TransactionId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    SubscriptionId UNIQUEIDENTIFIER NULL,
    TransactionType NVARCHAR(50) NOT NULL, -- Subscription, WalletTopup, Refund
    PaymentMethod NVARCHAR(50) NOT NULL, -- Card, Wallet, Stripe
    Amount DECIMAL(18,2) NOT NULL,
    Currency NVARCHAR(3) NOT NULL DEFAULT 'USD',
    Status NVARCHAR(20) NOT NULL, -- Pending, Success, Failed, Refunded
    PaymentGatewayTransactionId NVARCHAR(255) NULL,
    PaymentGatewayResponse NVARCHAR(MAX) NULL, -- JSON
    FailureReason NVARCHAR(500) NULL,
    ProcessedAt DATETIME2 NULL,
    RefundedAt DATETIME2 NULL,
    RefundAmount DECIMAL(18,2) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (SubscriptionId) REFERENCES UserSubscriptions(SubscriptionId),
    INDEX IX_PaymentTransactions_UserId (UserId),
    INDEX IX_PaymentTransactions_Status (Status),
    INDEX IX_PaymentTransactions_CreatedAt (CreatedAt)
);

-- Wallet Transactions
CREATE TABLE WalletTransactions (
    WalletTransactionId BIGINT IDENTITY(1,1) PRIMARY KEY,
    UserId UNIQUEIDENTIFIER NOT NULL,
    TransactionType NVARCHAR(50) NOT NULL, -- Credit, Debit, Refund
    Amount DECIMAL(18,2) NOT NULL,
    BalanceAfter DECIMAL(18,2) NOT NULL,
    Description NVARCHAR(500),
    ReferenceId UNIQUEIDENTIFIER NULL, -- Link to payment/subscription
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    INDEX IX_WalletTransactions_UserId (UserId),
    INDEX IX_WalletTransactions_CreatedAt (CreatedAt)
);

-- =============================================
-- SKIN SCANNING & ANALYSIS
-- =============================================

-- Skin Scans
CREATE TABLE SkinScans (
    ScanId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    ScanImageUrl NVARCHAR(500) NOT NULL,
    ScanType NVARCHAR(50) NOT NULL, -- Face, Forehead, Cheeks, etc.
    ScanDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    AIProcessingStatus NVARCHAR(20) NOT NULL DEFAULT 'Pending', -- Pending, Processing, Completed, Failed
    AIProcessingStartedAt DATETIME2 NULL,
    AIProcessingCompletedAt DATETIME2 NULL,
    AIModelVersion NVARCHAR(50) NULL,
    OverallScore DECIMAL(5,2) NULL, -- 0-100
    SkinAge INT NULL,
    Notes NVARCHAR(1000) NULL,
    IsDeleted BIT NOT NULL DEFAULT 0,
    DeletedAt DATETIME2 NULL,
    
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    INDEX IX_SkinScans_UserId (UserId),
    INDEX IX_SkinScans_ScanDate (ScanDate),
    INDEX IX_SkinScans_AIProcessingStatus (AIProcessingStatus)
);

-- Skin Analysis Results
CREATE TABLE SkinAnalysisResults (
    AnalysisId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ScanId UNIQUEIDENTIFIER NOT NULL UNIQUE,
    SkinType NVARCHAR(50) NULL, -- Oily, Dry, Combination, Normal, Sensitive
    
    -- Skin Concerns (0-100 severity scale)
    AcneSeverity DECIMAL(5,2) NULL,
    WrinklesSeverity DECIMAL(5,2) NULL,
    DarkSpotsSeverity DECIMAL(5,2) NULL,
    RednessIrritation DECIMAL(5,2) NULL,
    DrynessLevel DECIMAL(5,2) NULL,
    OilinessLevel DECIMAL(5,2) NULL,
    PoreSizeLevel DECIMAL(5,2) NULL,
    UnderEyeCircles DECIMAL(5,2) NULL,
    
    -- Detailed Metrics
    HydrationLevel DECIMAL(5,2) NULL,
    TextureQuality DECIMAL(5,2) NULL,
    ElasticityScore DECIMAL(5,2) NULL,
    
    -- AI Recommendations
    TopConcerns NVARCHAR(MAX) NULL, -- JSON array
    RecommendedIngredients NVARCHAR(MAX) NULL, -- JSON array
    IngredientsToAvoid NVARCHAR(MAX) NULL, -- JSON array
    RoutineRecommendations NVARCHAR(MAX) NULL, -- JSON
    
    -- Additional Data
    RawAIResponse NVARCHAR(MAX) NULL, -- Full JSON response from AI
    ConfidenceScore DECIMAL(5,2) NULL,
    
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    FOREIGN KEY (ScanId) REFERENCES SkinScans(ScanId) ON DELETE CASCADE,
    INDEX IX_SkinAnalysisResults_ScanId (ScanId)
);

-- Daily Scan Usage Tracking
CREATE TABLE DailyScanUsage (
    UsageId BIGINT IDENTITY(1,1) PRIMARY KEY,
    UserId UNIQUEIDENTIFIER NOT NULL,
    ScanDate DATE NOT NULL,
    ScanCount INT NOT NULL DEFAULT 0,
    LastScanAt DATETIME2 NOT NULL,
    
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    UNIQUE(UserId, ScanDate),
    INDEX IX_DailyScanUsage_UserId_ScanDate (UserId, ScanDate)
);

-- =============================================
-- PRODUCTS & RECOMMENDATIONS
-- =============================================

-- Brands
CREATE TABLE Brands (
    BrandId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    BrandName NVARCHAR(200) NOT NULL,
    LogoUrl NVARCHAR(500),
    Description NVARCHAR(1000),
    Website NVARCHAR(500),
    IsVerified BIT NOT NULL DEFAULT 0,
    IsPartner BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    INDEX IX_Brands_BrandName (BrandName),
    INDEX IX_Brands_IsVerified (IsVerified)
);

-- Product Categories
CREATE TABLE ProductCategories (
    CategoryId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    CategoryName NVARCHAR(100) NOT NULL UNIQUE,
    CategoryIcon NVARCHAR(50),
    DisplayOrder INT NOT NULL DEFAULT 0,
    IsActive BIT NOT NULL DEFAULT 1
);

INSERT INTO ProductCategories (CategoryName, CategoryIcon, DisplayOrder) VALUES
('Cleanser', '🧼', 1),
('Toner', '💧', 2),
('Serum', '✨', 3),
('Moisturizer', '💦', 4),
('Sunscreen', '☀️', 5),
('Treatment', '💊', 6),
('Mask', '🎭', 7),
('Exfoliant', '🌟', 8);

-- Products
CREATE TABLE Products (
    ProductId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    BrandId UNIQUEIDENTIFIER NOT NULL,
    CategoryId UNIQUEIDENTIFIER NOT NULL,
    ProductName NVARCHAR(300) NOT NULL,
    Description NVARCHAR(MAX),
    ProductImageUrl NVARCHAR(500),
    Price DECIMAL(18,2) NOT NULL,
    OriginalPrice DECIMAL(18,2) NULL,
    Currency NVARCHAR(3) NOT NULL DEFAULT 'USD',
    ShopUrl NVARCHAR(500) NOT NULL,
    AffiliateUrl NVARCHAR(500) NULL,
    Volume NVARCHAR(50) NULL, -- e.g., "50ml", "1oz"
    
    -- Product Details
    KeyIngredients NVARCHAR(MAX), -- JSON array
    SkinTypes NVARCHAR(MAX), -- JSON array: Oily, Dry, Combination, Normal, Sensitive
    SkinConcerns NVARCHAR(MAX), -- JSON array: Acne, Wrinkles, Dark Spots, etc.
    
    -- Ratings & Reviews
    AverageRating DECIMAL(3,2) NULL,
    TotalReviews INT NOT NULL DEFAULT 0,
    
    -- Inventory
    InStock BIT NOT NULL DEFAULT 1,
    StockQuantity INT NULL,
    
    -- Status
    IsActive BIT NOT NULL DEFAULT 1,
    IsFeatured BIT NOT NULL DEFAULT 0,
    
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    FOREIGN KEY (BrandId) REFERENCES Brands(BrandId),
    FOREIGN KEY (CategoryId) REFERENCES ProductCategories(CategoryId),
    INDEX IX_Products_BrandId (BrandId),
    INDEX IX_Products_CategoryId (CategoryId),
    INDEX IX_Products_IsActive (IsActive),
    INDEX IX_Products_AverageRating (AverageRating)
);

-- Product Recommendations (AI-generated based on skin scans)
CREATE TABLE ProductRecommendations (
    RecommendationId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ScanId UNIQUEIDENTIFIER NOT NULL,
    ProductId UNIQUEIDENTIFIER NOT NULL,
    RecommendationScore DECIMAL(5,2) NOT NULL, -- 0-100
    RecommendationReason NVARCHAR(500),
    Priority INT NOT NULL DEFAULT 0, -- Higher = more important
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    FOREIGN KEY (ScanId) REFERENCES SkinScans(ScanId) ON DELETE CASCADE,
    FOREIGN KEY (ProductId) REFERENCES Products(ProductId),
    INDEX IX_ProductRecommendations_ScanId (ScanId),
    INDEX IX_ProductRecommendations_ProductId (ProductId)
);

-- User Product Favorites
CREATE TABLE UserProductFavorites (
    FavoriteId BIGINT IDENTITY(1,1) PRIMARY KEY,
    UserId UNIQUEIDENTIFIER NOT NULL,
    ProductId UNIQUEIDENTIFIER NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    FOREIGN KEY (ProductId) REFERENCES Products(ProductId) ON DELETE CASCADE,
    UNIQUE(UserId, ProductId),
    INDEX IX_UserProductFavorites_UserId (UserId)
);

-- =============================================
-- SKINCARE ROUTINES
-- =============================================

-- User Routines
CREATE TABLE UserRoutines (
    RoutineId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    RoutineName NVARCHAR(200) NOT NULL,
    RoutineType NVARCHAR(20) NOT NULL, -- Morning, Evening
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    INDEX IX_UserRoutines_UserId (UserId)
);

-- Routine Steps
CREATE TABLE RoutineSteps (
    StepId BIGINT IDENTITY(1,1) PRIMARY KEY,
    RoutineId UNIQUEIDENTIFIER NOT NULL,
    ProductId UNIQUEIDENTIFIER NULL,
    StepOrder INT NOT NULL,
    StepName NVARCHAR(200) NOT NULL,
    Instructions NVARCHAR(500),
    DurationMinutes INT NULL,
    
    FOREIGN KEY (RoutineId) REFERENCES UserRoutines(RoutineId) ON DELETE CASCADE,
    FOREIGN KEY (ProductId) REFERENCES Products(ProductId),
    INDEX IX_RoutineSteps_RoutineId (RoutineId)
);

-- Routine Completion Tracking
CREATE TABLE RoutineCompletions (
    CompletionId BIGINT IDENTITY(1,1) PRIMARY KEY,
    RoutineId UNIQUEIDENTIFIER NOT NULL,
    UserId UNIQUEIDENTIFIER NOT NULL,
    CompletionDate DATE NOT NULL,
    CompletedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    Notes NVARCHAR(500),
    
    FOREIGN KEY (RoutineId) REFERENCES UserRoutines(RoutineId) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    INDEX IX_RoutineCompletions_UserId (UserId),
    INDEX IX_RoutineCompletions_CompletionDate (CompletionDate)
);

-- Routine Reminders
CREATE TABLE RoutineReminders (
    ReminderId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    RoutineId UNIQUEIDENTIFIER NOT NULL,
    ReminderTime TIME NOT NULL,
    DaysOfWeek NVARCHAR(50) NOT NULL, -- JSON array: [0,1,2,3,4,5,6]
    IsEnabled BIT NOT NULL DEFAULT 1,
    LastSentAt DATETIME2 NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    FOREIGN KEY (RoutineId) REFERENCES UserRoutines(RoutineId),
    INDEX IX_RoutineReminders_UserId (UserId)
);

-- =============================================
-- CREATOR STATIONS & CONTENT
-- =============================================

-- Creator Stations
CREATE TABLE CreatorStations (
    StationId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL UNIQUE, -- One station per Pro user
    StationName NVARCHAR(200) NOT NULL,
    StationSlug NVARCHAR(200) NOT NULL UNIQUE, -- URL-friendly name
    Bio NVARCHAR(1000),
    BannerImageUrl NVARCHAR(500),
    ProfileImageUrl NVARCHAR(500),
    
    -- Social Links
    InstagramUrl NVARCHAR(500),
    YoutubeUrl NVARCHAR(500),
    TikTokUrl NVARCHAR(500),
    WebsiteUrl NVARCHAR(500),
    
    -- Stats
    FollowersCount INT NOT NULL DEFAULT 0,
    TotalPosts INT NOT NULL DEFAULT 0,
    TotalViews BIGINT NOT NULL DEFAULT 0,
    
    -- Settings
    IsPublished BIT NOT NULL DEFAULT 0,
    AllowComments BIT NOT NULL DEFAULT 1,
    AllowMessages BIT NOT NULL DEFAULT 1,
    
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    INDEX IX_CreatorStations_StationSlug (StationSlug),
    INDEX IX_CreatorStations_FollowersCount (FollowersCount)
);

-- Station Followers
CREATE TABLE StationFollowers (
    FollowId BIGINT IDENTITY(1,1) PRIMARY KEY,
    StationId UNIQUEIDENTIFIER NOT NULL,
    FollowerUserId UNIQUEIDENTIFIER NOT NULL,
    FollowedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    NotificationsEnabled BIT NOT NULL DEFAULT 1,
    
    FOREIGN KEY (StationId) REFERENCES CreatorStations(StationId) ON DELETE CASCADE,
    FOREIGN KEY (FollowerUserId) REFERENCES Users(UserId),
    UNIQUE(StationId, FollowerUserId),
    INDEX IX_StationFollowers_StationId (StationId),
    INDEX IX_StationFollowers_FollowerUserId (FollowerUserId)
);

-- Creator Posts
CREATE TABLE CreatorPosts (
    PostId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    StationId UNIQUEIDENTIFIER NOT NULL,
    PostType NVARCHAR(50) NOT NULL, -- Article, Video, Tutorial, Tip
    Title NVARCHAR(300) NOT NULL,
    Content NVARCHAR(MAX), -- HTML or Markdown
    ThumbnailUrl NVARCHAR(500),
    MediaUrls NVARCHAR(MAX), -- JSON array of image/video URLs
    
    -- Metadata
    Tags NVARCHAR(MAX), -- JSON array
    ReadTimeMinutes INT NULL,
    
    -- Engagement
    ViewCount INT NOT NULL DEFAULT 0,
    LikeCount INT NOT NULL DEFAULT 0,
    CommentCount INT NOT NULL DEFAULT 0,
    ShareCount INT NOT NULL DEFAULT 0,
    
    -- Publishing
    Status NVARCHAR(20) NOT NULL DEFAULT 'Draft', -- Draft, Published, Scheduled, Archived
    PublishedAt DATETIME2 NULL,
    ScheduledFor DATETIME2 NULL,
    
    -- Moderation
    IsFlagged BIT NOT NULL DEFAULT 0,
    FlagReason NVARCHAR(500) NULL,
    
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    FOREIGN KEY (StationId) REFERENCES CreatorStations(StationId) ON DELETE CASCADE,
    INDEX IX_CreatorPosts_StationId (StationId),
    INDEX IX_CreatorPosts_Status (Status),
    INDEX IX_CreatorPosts_PublishedAt (PublishedAt)
);

-- Post Likes
CREATE TABLE PostLikes (
    LikeId BIGINT IDENTITY(1,1) PRIMARY KEY,
    PostId UNIQUEIDENTIFIER NOT NULL,
    UserId UNIQUEIDENTIFIER NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    FOREIGN KEY (PostId) REFERENCES CreatorPosts(PostId) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    UNIQUE(PostId, UserId),
    INDEX IX_PostLikes_PostId (PostId),
    INDEX IX_PostLikes_UserId (UserId)
);

-- Post Comments
CREATE TABLE PostComments (
    CommentId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    PostId UNIQUEIDENTIFIER NOT NULL,
    UserId UNIQUEIDENTIFIER NOT NULL,
    ParentCommentId UNIQUEIDENTIFIER NULL, -- For nested replies
    CommentText NVARCHAR(1000) NOT NULL,
    
    -- Moderation
    IsFlagged BIT NOT NULL DEFAULT 0,
    FlagReason NVARCHAR(500) NULL,
    IsDeleted BIT NOT NULL DEFAULT 0,
    
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    FOREIGN KEY (PostId) REFERENCES CreatorPosts(PostId) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (ParentCommentId) REFERENCES PostComments(CommentId),
    INDEX IX_PostComments_PostId (PostId),
    INDEX IX_PostComments_UserId (UserId)
);

-- =============================================
-- NOTIFICATIONS
-- =============================================

-- Notifications
CREATE TABLE Notifications (
    NotificationId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    NotificationType NVARCHAR(50) NOT NULL, -- RoutineReminder, ScanReady, NewFollower, NewComment, etc.
    Title NVARCHAR(200) NOT NULL,
    Message NVARCHAR(500) NOT NULL,
    DeepLink NVARCHAR(500) NULL, -- App deep link
    IsRead BIT NOT NULL DEFAULT 0,
    ReadAt DATETIME2 NULL,
    
    -- Additional Data
    ReferenceId NVARCHAR(255) NULL, -- Link to related entity
    ReferenceType NVARCHAR(50) NULL, -- EntityType: Post, Scan, etc.
    
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ExpiresAt DATETIME2 NULL,
    
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    INDEX IX_Notifications_UserId (UserId),
    INDEX IX_Notifications_IsRead (IsRead),
    INDEX IX_Notifications_CreatedAt (CreatedAt)
);

-- Push Notification Tokens
CREATE TABLE PushNotificationTokens (
    TokenId BIGINT IDENTITY(1,1) PRIMARY KEY,
    UserId UNIQUEIDENTIFIER NOT NULL,
    DeviceToken NVARCHAR(500) NOT NULL,
    Platform NVARCHAR(20) NOT NULL, -- iOS, Android, Web
    DeviceInfo NVARCHAR(500), -- JSON: device model, OS version, etc.
    IsActive BIT NOT NULL DEFAULT 1,
    LastUsedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    INDEX IX_PushNotificationTokens_UserId (UserId),
    INDEX IX_PushNotificationTokens_DeviceToken (DeviceToken)
);

-- =============================================
-- ANALYTICS & TRACKING
-- =============================================

-- User Activity Logs
CREATE TABLE UserActivityLogs (
    ActivityId BIGINT IDENTITY(1,1) PRIMARY KEY,
    UserId UNIQUEIDENTIFIER NULL, -- NULL for anonymous
    ActivityType NVARCHAR(50) NOT NULL, -- Login, Scan, ProductView, PostView, etc.
    ActivityData NVARCHAR(MAX), -- JSON
    IpAddress NVARCHAR(50),
    UserAgent NVARCHAR(500),
    Timestamp DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    INDEX IX_UserActivityLogs_UserId (UserId),
    INDEX IX_UserActivityLogs_ActivityType (ActivityType),
    INDEX IX_UserActivityLogs_Timestamp (Timestamp)
);

-- Station Analytics (Daily aggregates)
CREATE TABLE StationAnalytics (
    AnalyticsId BIGINT IDENTITY(1,1) PRIMARY KEY,
    StationId UNIQUEIDENTIFIER NOT NULL,
    AnalyticsDate DATE NOT NULL,
    
    -- Metrics
    TotalViews INT NOT NULL DEFAULT 0,
    UniqueVisitors INT NOT NULL DEFAULT 0,
    NewFollowers INT NOT NULL DEFAULT 0,
    TotalLikes INT NOT NULL DEFAULT 0,
    TotalComments INT NOT NULL DEFAULT 0,
    TotalShares INT NOT NULL DEFAULT 0,
    
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    FOREIGN KEY (StationId) REFERENCES CreatorStations(StationId) ON DELETE CASCADE,
    UNIQUE(StationId, AnalyticsDate),
    INDEX IX_StationAnalytics_StationId_Date (StationId, AnalyticsDate)
);

-- =============================================
-- ACHIEVEMENTS & GAMIFICATION
-- =============================================

-- Achievements
CREATE TABLE Achievements (
    AchievementId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    AchievementName NVARCHAR(200) NOT NULL,
    Description NVARCHAR(500),
    IconUrl NVARCHAR(500),
    AchievementType NVARCHAR(50) NOT NULL, -- ScanCount, RoutineStreak, etc.
    RequiredValue INT NOT NULL, -- e.g., 10 scans, 7 day streak
    PointsReward INT NOT NULL DEFAULT 0,
    BadgeColor NVARCHAR(20),
    IsActive BIT NOT NULL DEFAULT 1,
    DisplayOrder INT NOT NULL DEFAULT 0
);

-- User Achievements
CREATE TABLE UserAchievements (
    UserAchievementId BIGINT IDENTITY(1,1) PRIMARY KEY,
    UserId UNIQUEIDENTIFIER NOT NULL,
    AchievementId UNIQUEIDENTIFIER NOT NULL,
    UnlockedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CurrentProgress INT NOT NULL DEFAULT 0,
    IsCompleted BIT NOT NULL DEFAULT 0,
    
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    FOREIGN KEY (AchievementId) REFERENCES Achievements(AchievementId),
    UNIQUE(UserId, AchievementId),
    INDEX IX_UserAchievements_UserId (UserId)
);

-- =============================================
-- ADMIN & MODERATION
-- =============================================

-- Reported Content
CREATE TABLE ReportedContent (
    ReportId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ReporterUserId UNIQUEIDENTIFIER NOT NULL,
    ContentType NVARCHAR(50) NOT NULL, -- Post, Comment, Station
    ContentId NVARCHAR(255) NOT NULL,
    ReasonType NVARCHAR(50) NOT NULL, -- Spam, Inappropriate, Harmful, Copyright
    ReasonDescription NVARCHAR(1000),
    Status NVARCHAR(20) NOT NULL DEFAULT 'Pending', -- Pending, Reviewed, ActionTaken, Dismissed
    ReviewedBy UNIQUEIDENTIFIER NULL,
    ReviewedAt DATETIME2 NULL,
    ReviewNotes NVARCHAR(1000) NULL,
    ActionTaken NVARCHAR(500) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    FOREIGN KEY (ReporterUserId) REFERENCES Users(UserId),
    FOREIGN KEY (ReviewedBy) REFERENCES Users(UserId),
    INDEX IX_ReportedContent_Status (Status),
    INDEX IX_ReportedContent_CreatedAt (CreatedAt)
);

-- Admin Action Logs
CREATE TABLE AdminActionLogs (
    LogId BIGINT IDENTITY(1,1) PRIMARY KEY,
    AdminUserId UNIQUEIDENTIFIER NOT NULL,
    ActionType NVARCHAR(50) NOT NULL, -- UserSuspended, PostDeleted, etc.
    TargetType NVARCHAR(50) NOT NULL, -- User, Post, Comment, Station
    TargetId NVARCHAR(255) NOT NULL,
    ActionDetails NVARCHAR(MAX), -- JSON
    Reason NVARCHAR(1000),
    Timestamp DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    FOREIGN KEY (AdminUserId) REFERENCES Users(UserId),
    INDEX IX_AdminActionLogs_AdminUserId (AdminUserId),
    INDEX IX_AdminActionLogs_Timestamp (Timestamp)
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Additional composite indexes for common queries
CREATE INDEX IX_SkinScans_UserId_ScanDate ON SkinScans(UserId, ScanDate DESC);
CREATE INDEX IX_CreatorPosts_StationId_PublishedAt ON CreatorPosts(StationId, PublishedAt DESC) WHERE Status = 'Published';
CREATE INDEX IX_Notifications_UserId_IsRead_CreatedAt ON Notifications(UserId, IsRead, CreatedAt DESC);
CREATE INDEX IX_PaymentTransactions_UserId_Status ON PaymentTransactions(UserId, Status);

GO

-- =============================================
-- STORED PROCEDURES
-- =============================================

-- Get User's Daily Scan Limit
CREATE PROCEDURE sp_GetUserDailyScanLimit
    @UserId UNIQUEIDENTIFIER,
    @ScanDate DATE
AS
BEGIN
    DECLARE @MembershipType NVARCHAR(20);
    DECLARE @DailyLimit INT;
    DECLARE @CurrentUsage INT;
    
    -- Get user's membership type
    SELECT @MembershipType = MembershipType FROM Users WHERE UserId = @UserId;
    
    -- Determine daily limit
    IF @MembershipType = 'Guest'
        SET @DailyLimit = 1;
    ELSE IF @MembershipType = 'Member'
        SET @DailyLimit = 5;
    ELSE IF @MembershipType = 'Pro'
        SET @DailyLimit = NULL; -- Unlimited
    ELSE
        SET @DailyLimit = 0;
    
    -- Get current usage
    SELECT @CurrentUsage = ISNULL(ScanCount, 0)
    FROM DailyScanUsage
    WHERE UserId = @UserId AND ScanDate = @ScanDate;
    
    -- Return result
    SELECT 
        @DailyLimit AS DailyLimit,
        @CurrentUsage AS CurrentUsage,
        CASE 
            WHEN @DailyLimit IS NULL THEN 1 -- Unlimited
            WHEN @CurrentUsage < @DailyLimit THEN 1
            ELSE 0
        END AS CanScan;
END;
GO

-- Increment Daily Scan Usage
CREATE PROCEDURE sp_IncrementDailyScanUsage
    @UserId UNIQUEIDENTIFIER,
    @ScanDate DATE
AS
BEGIN
    MERGE DailyScanUsage AS target
    USING (SELECT @UserId AS UserId, @ScanDate AS ScanDate) AS source
    ON target.UserId = source.UserId AND target.ScanDate = source.ScanDate
    WHEN MATCHED THEN
        UPDATE SET ScanCount = ScanCount + 1, LastScanAt = GETUTCDATE()
    WHEN NOT MATCHED THEN
        INSERT (UserId, ScanDate, ScanCount, LastScanAt)
        VALUES (@UserId, @ScanDate, 1, GETUTCDATE());
END;
GO

-- Get Station Analytics Summary
CREATE PROCEDURE sp_GetStationAnalyticsSummary
    @StationId UNIQUEIDENTIFIER,
    @StartDate DATE,
    @EndDate DATE
AS
BEGIN
    SELECT 
        SUM(TotalViews) AS TotalViews,
        SUM(UniqueVisitors) AS TotalUniqueVisitors,
        SUM(NewFollowers) AS TotalNewFollowers,
        SUM(TotalLikes) AS TotalLikes,
        SUM(TotalComments) AS TotalComments,
        SUM(TotalShares) AS TotalShares,
        AVG(TotalViews) AS AvgDailyViews,
        COUNT(*) AS DaysCount
    FROM StationAnalytics
    WHERE StationId = @StationId 
        AND AnalyticsDate BETWEEN @StartDate AND @EndDate;
END;
GO

-- Update User Wallet Balance
CREATE PROCEDURE sp_UpdateWalletBalance
    @UserId UNIQUEIDENTIFIER,
    @Amount DECIMAL(18,2),
    @TransactionType NVARCHAR(50),
    @Description NVARCHAR(500),
    @ReferenceId UNIQUEIDENTIFIER = NULL
AS
BEGIN
    BEGIN TRANSACTION;
    
    DECLARE @NewBalance DECIMAL(18,2);
    
    -- Update user wallet balance
    UPDATE Users
    SET WalletBalance = WalletBalance + @Amount,
        @NewBalance = WalletBalance + @Amount
    WHERE UserId = @UserId;
    
    -- Insert transaction record
    INSERT INTO WalletTransactions (UserId, TransactionType, Amount, BalanceAfter, Description, ReferenceId)
    VALUES (@UserId, @TransactionType, @Amount, @NewBalance, @Description, @ReferenceId);
    
    COMMIT TRANSACTION;
    
    SELECT @NewBalance AS NewBalance;
END;
GO

-- =============================================
-- TRIGGERS
-- =============================================

-- Update Users.UpdatedAt on change
CREATE TRIGGER trg_Users_UpdatedAt
ON Users
AFTER UPDATE
AS
BEGIN
    UPDATE Users
    SET UpdatedAt = GETUTCDATE()
    FROM Users u
    INNER JOIN inserted i ON u.UserId = i.UserId;
END;
GO

-- Update CreatorStations followers count
CREATE TRIGGER trg_StationFollowers_Insert
ON StationFollowers
AFTER INSERT
AS
BEGIN
    UPDATE CreatorStations
    SET FollowersCount = FollowersCount + 1
    FROM CreatorStations cs
    INNER JOIN inserted i ON cs.StationId = i.StationId;
END;
GO

CREATE TRIGGER trg_StationFollowers_Delete
ON StationFollowers
AFTER DELETE
AS
BEGIN
    UPDATE CreatorStations
    SET FollowersCount = FollowersCount - 1
    FROM CreatorStations cs
    INNER JOIN deleted d ON cs.StationId = d.StationId;
END;
GO

-- Update post counts
CREATE TRIGGER trg_CreatorPosts_Published
ON CreatorPosts
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (SELECT * FROM inserted WHERE Status = 'Published')
    BEGIN
        UPDATE CreatorStations
        SET TotalPosts = (
            SELECT COUNT(*) 
            FROM CreatorPosts 
            WHERE StationId = cs.StationId AND Status = 'Published'
        )
        FROM CreatorStations cs
        INNER JOIN inserted i ON cs.StationId = i.StationId;
    END
END;
GO

-- =============================================
-- VIEWS
-- =============================================

-- Active Users View
CREATE VIEW vw_ActiveUsers AS
SELECT 
    u.UserId,
    u.Email,
    u.FirstName,
    u.LastName,
    u.MembershipType,
    u.MembershipStatus,
    u.IsCreator,
    u.IsVerified,
    u.WalletBalance,
    u.CreatedAt,
    u.LastLoginAt,
    DATEDIFF(day, u.LastLoginAt, GETUTCDATE()) AS DaysSinceLastLogin
FROM Users u
WHERE u.IsDeleted = 0 AND u.MembershipStatus = 'Active';
GO

-- Popular Products View
CREATE VIEW vw_PopularProducts AS
SELECT TOP 100
    p.ProductId,
    p.ProductName,
    b.BrandName,
    p.AverageRating,
    p.TotalReviews,
    p.Price,
    COUNT(DISTINCT upf.UserId) AS FavoriteCount,
    COUNT(DISTINCT pr.RecommendationId) AS RecommendationCount
FROM Products p
INNER JOIN Brands b ON p.BrandId = b.BrandId
LEFT JOIN UserProductFavorites upf ON p.ProductId = upf.ProductId
LEFT JOIN ProductRecommendations pr ON p.ProductId = pr.ProductId
WHERE p.IsActive = 1
GROUP BY p.ProductId, p.ProductName, b.BrandName, p.AverageRating, p.TotalReviews, p.Price
ORDER BY p.AverageRating DESC, p.TotalReviews DESC;
GO

-- Creator Leaderboard View
CREATE VIEW vw_CreatorLeaderboard AS
SELECT 
    cs.StationId,
    cs.StationName,
    u.FirstName + ' ' + u.LastName AS CreatorName,
    cs.FollowersCount,
    cs.TotalPosts,
    cs.TotalViews,
    COUNT(DISTINCT cp.PostId) AS PublishedPosts,
    SUM(cp.LikeCount) AS TotalLikes,
    SUM(cp.CommentCount) AS TotalComments
FROM CreatorStations cs
INNER JOIN Users u ON cs.UserId = u.UserId
LEFT JOIN CreatorPosts cp ON cs.StationId = cp.StationId AND cp.Status = 'Published'
WHERE cs.IsPublished = 1
GROUP BY cs.StationId, cs.StationName, u.FirstName, u.LastName, cs.FollowersCount, cs.TotalPosts, cs.TotalViews;
GO

```

---

## Authentication & Authorization

### JWT Configuration

```csharp
// Models/AuthModels.cs
public class JwtSettings
{
    public string Secret { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;
    public int AccessTokenExpirationMinutes { get; set; } = 60; // 1 hour
    public int RefreshTokenExpirationDays { get; set; } = 30; // 30 days
}

public class LoginRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;
    
    public string? DeviceToken { get; set; }
    public string? Platform { get; set; } // iOS, Android, Web
}

public class RegisterRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;
    
    [Required]
    [MinLength(2)]
    public string FirstName { get; set; } = string.Empty;
    
    [Required]
    [MinLength(2)]
    public string LastName { get; set; } = string.Empty;
    
    public DateTime? DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public string? PhoneNumber { get; set; }
}

public class AuthResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public UserDto User { get; set; } = null!;
}

public class RefreshTokenRequest
{
    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}

public class UserDto
{
    public Guid UserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? ProfileImageUrl { get; set; }
    public string MembershipType { get; set; } = "Guest"; // Guest, Member, Pro
    public string MembershipStatus { get; set; } = "Active";
    public bool IsCreator { get; set; }
    public bool IsVerified { get; set; }
    public decimal WalletBalance { get; set; }
    public int TotalScansUsed { get; set; }
    public DateTime? MembershipEndDate { get; set; }
    public List<string> Roles { get; set; } = new();
}
```

### JWT Service Implementation

```csharp
// Services/JwtService.cs
public interface IJwtService
{
    string GenerateAccessToken(User user, List<string> roles);
    string GenerateRefreshToken();
    ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
    Task<RefreshToken> SaveRefreshToken(Guid userId, string token, string? ipAddress);
    Task<RefreshToken?> GetRefreshToken(string token);
    Task RevokeRefreshToken(string token, string? ipAddress);
    Task RevokeAllUserTokens(Guid userId);
}

public class JwtService : IJwtService
{
    private readonly JwtSettings _jwtSettings;
    private readonly ApplicationDbContext _context;
    
    public JwtService(IOptions<JwtSettings> jwtSettings, ApplicationDbContext context)
    {
        _jwtSettings = jwtSettings.Value;
        _context = context;
    }
    
    public string GenerateAccessToken(User user, List<string> roles)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.GivenName, user.FirstName),
            new(ClaimTypes.Surname, user.LastName),
            new("MembershipType", user.MembershipType),
            new("IsCreator", user.IsCreator.ToString()),
            new("IsVerified", user.IsVerified.ToString())
        };
        
        // Add roles
        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }
        
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        
        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_jwtSettings.AccessTokenExpirationMinutes),
            signingCredentials: credentials
        );
        
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
    
    public string GenerateRefreshToken()
    {
        var randomNumber = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }
    
    public ClaimsPrincipal? GetPrincipalFromExpiredToken(string token)
    {
        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = true,
            ValidateIssuer = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = _jwtSettings.Issuer,
            ValidAudience = _jwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret)),
            ValidateLifetime = false // Don't validate expiration
        };
        
        var tokenHandler = new JwtSecurityTokenHandler();
        var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var securityToken);
        
        if (securityToken is not JwtSecurityToken jwtSecurityToken || 
            !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
        {
            return null;
        }
        
        return principal;
    }
    
    public async Task<RefreshToken> SaveRefreshToken(Guid userId, string token, string? ipAddress)
    {
        var refreshToken = new RefreshToken
        {
            UserId = userId,
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays),
            CreatedByIp = ipAddress
        };
        
        _context.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync();
        
        return refreshToken;
    }
    
    public async Task<RefreshToken?> GetRefreshToken(string token)
    {
        return await _context.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.Token == token && rt.RevokedAt == null && rt.ExpiresAt > DateTime.UtcNow);
    }
    
    public async Task RevokeRefreshToken(string token, string? ipAddress)
    {
        var refreshToken = await _context.RefreshTokens.FirstOrDefaultAsync(rt => rt.Token == token);
        if (refreshToken != null)
        {
            refreshToken.RevokedAt = DateTime.UtcNow;
            refreshToken.RevokedByIp = ipAddress;
            await _context.SaveChangesAsync();
        }
    }
    
    public async Task RevokeAllUserTokens(Guid userId)
    {
        var tokens = await _context.RefreshTokens
            .Where(rt => rt.UserId == userId && rt.RevokedAt == null)
            .ToListAsync();
            
        foreach (var token in tokens)
        {
            token.RevokedAt = DateTime.UtcNow;
        }
        
        await _context.SaveChangesAsync();
    }
}
```

### Program.cs Configuration

```csharp
// Program.cs
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using Serilog;
using AspNetCoreRateLimit;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/skinpai-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// JWT Settings
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
builder.Services.Configure<JwtSettings>(jwtSettings);

// Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorNumbersToAdd: null
        )
    ));

// Redis Cache
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("Redis");
    options.InstanceName = "SkinPAI_";
});

// Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var jwtSecret = jwtSettings["Secret"];
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret!)),
        ClockSkew = TimeSpan.Zero // Remove default 5 minute tolerance
    };
});

// Authorization Policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("MemberOnly", policy => policy.RequireClaim("MembershipType", "Member", "Pro"));
    options.AddPolicy("ProOnly", policy => policy.RequireClaim("MembershipType", "Pro"));
    options.AddPolicy("CreatorOnly", policy => policy.RequireClaim("IsCreator", "True"));
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("ModeratorOrAdmin", policy => policy.RequireRole("Admin", "Moderator"));
});

// Rate Limiting
builder.Services.AddMemoryCache();
builder.Services.Configure<IpRateLimitOptions>(builder.Configuration.GetSection("IpRateLimiting"));
builder.Services.AddSingleton<IIpPolicyStore, MemoryCacheIpPolicyStore>();
builder.Services.AddSingleton<IRateLimitCounterStore, MemoryCacheRateLimitCounterStore>();
builder.Services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();
builder.Services.AddSingleton<IProcessingStrategy, AsyncKeyLockProcessingStrategy>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

// AutoMapper
builder.Services.AddAutoMapper(typeof(Program));

// FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// MediatR
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblyContaining<Program>());

// HTTP Clients with Polly
builder.Services.AddHttpClient("AIService", client =>
{
    client.BaseAddress = new Uri(builder.Configuration["AIService:BaseUrl"]!);
    client.Timeout = TimeSpan.FromSeconds(60);
})
.AddTransientHttpErrorPolicy(policy => 
    policy.WaitAndRetryAsync(3, retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt))))
.AddTransientHttpErrorPolicy(policy => 
    policy.CircuitBreakerAsync(5, TimeSpan.FromSeconds(30)));

// Services
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IScanService, ScanService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IRoutineService, RoutineService>();
builder.Services.AddScoped<ICreatorService, CreatorService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IStorageService, AzureBlobStorageService>();
builder.Services.AddScoped<IAIService, AIService>();
builder.Services.AddScoped<IAnalyticsService, AnalyticsService>();

// Background Jobs (Hangfire)
builder.Services.AddHangfire(config => config
    .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UseSqlServerStorage(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddHangfireServer();

// SignalR (for real-time notifications)
builder.Services.AddSignalR();

// Health Checks
builder.Services.AddHealthChecks()
    .AddSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")!)
    .AddRedis(builder.Configuration.GetConnectionString("Redis")!);

// Controllers
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "SkinPAI API",
        Version = "v1",
        Description = "AI-Powered Skincare Analysis & Community Platform",
        Contact = new OpenApiContact
        {
            Name = "SkinPAI Support",
            Email = "support@skinpai.com"
        }
    });
    
    // JWT Authentication
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
    
    // XML Comments
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    c.IncludeXmlComments(xmlPath);
});

var app = builder.Build();

// Configure middleware pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "SkinPAI API v1");
        c.RoutePrefix = string.Empty; // Swagger at root
    });
}

app.UseIpRateLimiting();
app.UseSerilogRequestLogging();
app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

// Hangfire Dashboard
app.UseHangfireDashboard("/hangfire", new DashboardOptions
{
    Authorization = new[] { new HangfireAuthorizationFilter() }
});

// Health Checks
app.MapHealthChecks("/health");

// SignalR Hubs
app.MapHub<NotificationHub>("/hubs/notifications");

app.MapControllers();

// Database Migration & Seeding
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await dbContext.Database.MigrateAsync();
    
    // Seed initial data
    await SeedData.Initialize(scope.ServiceProvider);
}

app.Run();
```

---

## API Endpoints

### Base Response Models

```csharp
// Models/ApiResponse.cs
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
    public List<string> Errors { get; set; } = new();
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}

public class PagedResponse<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
    public bool HasPreviousPage => PageNumber > 1;
    public bool HasNextPage => PageNumber < TotalPages;
}

public class PaginationQuery
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    
    public int Skip => (PageNumber - 1) * PageSize;
    public int Take => PageSize;
}
```

### 1. Authentication Endpoints

```csharp
// Controllers/AuthController.cs
[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IJwtService _jwtService;
    private readonly ILogger<AuthController> _logger;
    
    public AuthController(IAuthService authService, IJwtService jwtService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _jwtService = jwtService;
        _logger = logger;
    }
    
    /// <summary>
    /// Register a new user account
    /// </summary>
    [HttpPost("register")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        try
        {
            var response = await _authService.RegisterAsync(request, GetIpAddress());
            return Ok(new ApiResponse<AuthResponse>
            {
                Success = true,
                Message = "Registration successful",
                Data = response
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Registration failed for {Email}", request.Email);
            return BadRequest(new ApiResponse<object>
            {
                Success = false,
                Message = "Registration failed",
                Errors = new List<string> { ex.Message }
            });
        }
    }
    
    /// <summary>
    /// Login with email and password
    /// </summary>
    [HttpPost("login")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            var response = await _authService.LoginAsync(request, GetIpAddress());
            return Ok(new ApiResponse<AuthResponse>
            {
                Success = true,
                Message = "Login successful",
                Data = response
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new ApiResponse<object>
            {
                Success = false,
                Message = "Invalid credentials",
                Errors = new List<string> { ex.Message }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Login failed for {Email}", request.Email);
            return StatusCode(500, new ApiResponse<object>
            {
                Success = false,
                Message = "Login failed",
                Errors = new List<string> { ex.Message }
            });
        }
    }
    
    /// <summary>
    /// Refresh access token using refresh token
    /// </summary>
    [HttpPost("refresh-token")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        try
        {
            var response = await _authService.RefreshTokenAsync(request.RefreshToken, GetIpAddress());
            return Ok(new ApiResponse<AuthResponse>
            {
                Success = true,
                Message = "Token refreshed",
                Data = response
            });
        }
        catch (Exception ex)
        {
            return Unauthorized(new ApiResponse<object>
            {
                Success = false,
                Message = "Invalid refresh token",
                Errors = new List<string> { ex.Message }
            });
        }
    }
    
    /// <summary>
    /// Logout and revoke refresh token
    /// </summary>
    [Authorize]
    [HttpPost("logout")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Logout([FromBody] RefreshTokenRequest request)
    {
        await _jwtService.RevokeRefreshToken(request.RefreshToken, GetIpAddress());
        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Logged out successfully"
        });
    }
    
    /// <summary>
    /// Request password reset email
    /// </summary>
    [HttpPost("forgot-password")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        await _authService.ForgotPasswordAsync(request.Email);
        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "If the email exists, a password reset link has been sent"
        });
    }
    
    /// <summary>
    /// Reset password with token
    /// </summary>
    [HttpPost("reset-password")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        try
        {
            await _authService.ResetPasswordAsync(request);
            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Password reset successful"
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>
            {
                Success = false,
                Message = "Password reset failed",
                Errors = new List<string> { ex.Message }
            });
        }
    }
    
    /// <summary>
    /// Verify email with token
    /// </summary>
    [HttpPost("verify-email")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailRequest request)
    {
        try
        {
            await _authService.VerifyEmailAsync(request.Token);
            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Email verified successfully"
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>
            {
                Success = false,
                Message = "Email verification failed",
                Errors = new List<string> { ex.Message }
            });
        }
    }
    
    /// <summary>
    /// Continue as guest (no registration)
    /// </summary>
    [HttpPost("guest")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ContinueAsGuest([FromBody] GuestRequest? request)
    {
        var response = await _authService.CreateGuestAccountAsync(request?.DeviceId, GetIpAddress());
        return Ok(new ApiResponse<AuthResponse>
        {
            Success = true,
            Message = "Guest account created",
            Data = response
        });
    }
    
    private string? GetIpAddress()
    {
        if (Request.Headers.ContainsKey("X-Forwarded-For"))
            return Request.Headers["X-Forwarded-For"];
        else
            return HttpContext.Connection.RemoteIpAddress?.MapToIPv4().ToString();
    }
}
```

### 2. User Management Endpoints

```csharp
// Controllers/UsersController.cs
[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    
    public UsersController(IUserService userService)
    {
        _userService = userService;
    }
    
    /// <summary>
    /// Get current user profile
    /// </summary>
    [HttpGet("me")]
    [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = GetUserId();
        var user = await _userService.GetUserByIdAsync(userId);
        return Ok(new ApiResponse<UserDto>
        {
            Success = true,
            Data = user
        });
    }
    
    /// <summary>
    /// Update current user profile
    /// </summary>
    [HttpPut("me")]
    [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var userId = GetUserId();
        var user = await _userService.UpdateProfileAsync(userId, request);
        return Ok(new ApiResponse<UserDto>
        {
            Success = true,
            Message = "Profile updated successfully",
            Data = user
        });
    }
    
    /// <summary>
    /// Upload profile image
    /// </summary>
    [HttpPost("me/profile-image")]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UploadProfileImage([FromForm] IFormFile file)
    {
        var userId = GetUserId();
        var imageUrl = await _userService.UploadProfileImageAsync(userId, file);
        return Ok(new ApiResponse<string>
        {
            Success = true,
            Message = "Profile image uploaded",
            Data = imageUrl
        });
    }
    
    /// <summary>
    /// Change password
    /// </summary>
    [HttpPost("me/change-password")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var userId = GetUserId();
        await _userService.ChangePasswordAsync(userId, request);
        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Password changed successfully"
        });
    }
    
    /// <summary>
    /// Get user statistics
    /// </summary>
    [HttpGet("me/statistics")]
    [ProducesResponseType(typeof(ApiResponse<UserStatistics>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetStatistics()
    {
        var userId = GetUserId();
        var stats = await _userService.GetUserStatisticsAsync(userId);
        return Ok(new ApiResponse<UserStatistics>
        {
            Success = true,
            Data = stats
        });
    }
    
    /// <summary>
    /// Get wallet balance and transactions
    /// </summary>
    [HttpGet("me/wallet")]
    [ProducesResponseType(typeof(ApiResponse<WalletInfo>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetWallet([FromQuery] PaginationQuery pagination)
    {
        var userId = GetUserId();
        var wallet = await _userService.GetWalletInfoAsync(userId, pagination);
        return Ok(new ApiResponse<WalletInfo>
        {
            Success = true,
            Data = wallet
        });
    }
    
    /// <summary>
    /// Delete account
    /// </summary>
    [HttpDelete("me")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteAccount()
    {
        var userId = GetUserId();
        await _userService.DeleteAccountAsync(userId);
        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Account deleted successfully"
        });
    }
    
    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.Parse(userIdClaim!);
    }
}
```

### 3. Skin Scanning Endpoints

```csharp
// Controllers/ScansController.cs
[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class ScansController : ControllerBase
{
    private readonly IScanService _scanService;
    
    public ScansController(IScanService scanService)
    {
        _scanService = scanService;
    }
    
    /// <summary>
    /// Check if user can perform a scan today
    /// </summary>
    [HttpGet("can-scan")]
    [ProducesResponseType(typeof(ApiResponse<ScanLimitInfo>), StatusCodes.Status200OK)]
    public async Task<IActionResult> CanScan()
    {
        var userId = GetUserId();
        var info = await _scanService.GetScanLimitInfoAsync(userId);
        return Ok(new ApiResponse<ScanLimitInfo>
        {
            Success = true,
            Data = info
        });
    }
    
    /// <summary>
    /// Upload and analyze skin scan
    /// </summary>
    [HttpPost]
    [RequestSizeLimit(10 * 1024 * 1024)] // 10MB
    [ProducesResponseType(typeof(ApiResponse<ScanResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status429TooManyRequests)]
    public async Task<IActionResult> CreateScan([FromForm] CreateScanRequest request)
    {
        var userId = GetUserId();
        
        // Check scan limit
        var canScan = await _scanService.CheckScanLimitAsync(userId);
        if (!canScan)
        {
            return StatusCode(429, new ApiResponse<object>
            {
                Success = false,
                Message = "Daily scan limit reached. Upgrade your membership for more scans."
            });
        }
        
        var scan = await _scanService.CreateScanAsync(userId, request);
        return Ok(new ApiResponse<ScanResponse>
        {
            Success = true,
            Message = "Scan uploaded successfully. Analysis in progress...",
            Data = scan
        });
    }
    
    /// <summary>
    /// Get scan by ID with analysis results
    /// </summary>
    [HttpGet("{scanId}")]
    [ProducesResponseType(typeof(ApiResponse<ScanDetailResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetScan(Guid scanId)
    {
        var userId = GetUserId();
        var scan = await _scanService.GetScanByIdAsync(userId, scanId);
        return Ok(new ApiResponse<ScanDetailResponse>
        {
            Success = true,
            Data = scan
        });
    }
    
    /// <summary>
    /// Get user's scan history
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PagedResponse<ScanSummary>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetScans([FromQuery] ScanFilterQuery filter)
    {
        var userId = GetUserId();
        var scans = await _scanService.GetUserScansAsync(userId, filter);
        return Ok(new ApiResponse<PagedResponse<ScanSummary>>
        {
            Success = true,
            Data = scans
        });
    }
    
    /// <summary>
    /// Get scan progress comparison (last 30/60/90 days)
    /// </summary>
    [HttpGet("progress")]
    [Authorize(Policy = "MemberOnly")]
    [ProducesResponseType(typeof(ApiResponse<ProgressResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetProgress([FromQuery] int days = 30)
    {
        var userId = GetUserId();
        var progress = await _scanService.GetProgressDataAsync(userId, days);
        return Ok(new ApiResponse<ProgressResponse>
        {
            Success = true,
            Data = progress
        });
    }
    
    /// <summary>
    /// Delete a scan
    /// </summary>
    [HttpDelete("{scanId}")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteScan(Guid scanId)
    {
        var userId = GetUserId();
        await _scanService.DeleteScanAsync(userId, scanId);
        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Scan deleted successfully"
        });
    }
    
    private Guid GetUserId() => Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
}

// Models for Scan endpoints
public class CreateScanRequest
{
    [Required]
    public IFormFile Image { get; set; } = null!;
    
    [Required]
    public string ScanType { get; set; } = "Face"; // Face, Forehead, Cheeks, etc.
    
    public string? Notes { get; set; }
}

public class ScanResponse
{
    public Guid ScanId { get; set; }
    public string ScanImageUrl { get; set; } = string.Empty;
    public string ProcessingStatus { get; set; } = "Pending";
    public DateTime ScanDate { get; set; }
}

public class ScanDetailResponse
{
    public Guid ScanId { get; set; }
    public string ScanImageUrl { get; set; } = string.Empty;
    public string ScanType { get; set; } = string.Empty;
    public DateTime ScanDate { get; set; }
    public string ProcessingStatus { get; set; } = string.Empty;
    public decimal? OverallScore { get; set; }
    public int? SkinAge { get; set; }
    public SkinAnalysisDto? Analysis { get; set; }
    public List<ProductRecommendationDto> RecommendedProducts { get; set; } = new();
}

public class SkinAnalysisDto
{
    public string? SkinType { get; set; }
    public decimal? AcneSeverity { get; set; }
    public decimal? WrinklesSeverity { get; set; }
    public decimal? DarkSpotsSeverity { get; set; }
    public decimal? RednessIrritation { get; set; }
    public decimal? DrynessLevel { get; set; }
    public decimal? OilinessLevel { get; set; }
    public decimal? PoreSizeLevel { get; set; }
    public decimal? UnderEyeCircles { get; set; }
    public decimal? HydrationLevel { get; set; }
    public decimal? TextureQuality { get; set; }
    public decimal? ElasticityScore { get; set; }
    public List<string> TopConcerns { get; set; } = new();
    public List<string> RecommendedIngredients { get; set; } = new();
    public List<string> IngredientsToAvoid { get; set; } = new();
    public Dictionary<string, string> RoutineRecommendations { get; set; } = new();
    public decimal? ConfidenceScore { get; set; }
}

public class ScanLimitInfo
{
    public int DailyLimit { get; set; } // NULL = unlimited
    public int UsedToday { get; set; }
    public int Remaining { get; set; } // -1 = unlimited
    public bool CanScan { get; set; }
    public string MembershipType { get; set; } = string.Empty;
    public DateTime NextResetAt { get; set; }
}

public class ScanFilterQuery : PaginationQuery
{
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? ScanType { get; set; }
}

public class ProgressResponse
{
    public List<ProgressDataPoint> OverallScores { get; set; } = new();
    public List<ProgressDataPoint> AcneProgress { get; set; } = new();
    public List<ProgressDataPoint> WrinklesProgress { get; set; } = new();
    public List<ProgressDataPoint> DarkSpotsProgress { get; set; } = new();
    public List<ProgressDataPoint> HydrationProgress { get; set; } = new();
    public ProgressSummary Summary { get; set; } = new();
}

public class ProgressDataPoint
{
    public DateTime Date { get; set; }
    public decimal Value { get; set; }
}

public class ProgressSummary
{
    public decimal AverageScore { get; set; }
    public decimal TrendPercentage { get; set; } // Positive = improvement
    public string TrendDirection { get; set; } = "Stable"; // Improving, Declining, Stable
    public int TotalScans { get; set; }
}
```

### 4. Product Endpoints

```csharp
// Controllers/ProductsController.cs
[ApiController]
[Route("api/v1/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;
    
    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }
    
    /// <summary>
    /// Get all products with filtering and pagination
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PagedResponse<ProductDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetProducts([FromQuery] ProductFilterQuery filter)
    {
        var products = await _productService.GetProductsAsync(filter);
        return Ok(new ApiResponse<PagedResponse<ProductDto>>
        {
            Success = true,
            Data = products
        });
    }
    
    /// <summary>
    /// Get product by ID
    /// </summary>
    [HttpGet("{productId}")]
    [ProducesResponseType(typeof(ApiResponse<ProductDetailDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetProduct(Guid productId)
    {
        var product = await _productService.GetProductByIdAsync(productId);
        return Ok(new ApiResponse<ProductDetailDto>
        {
            Success = true,
            Data = product
        });
    }
    
    /// <summary>
    /// Get personalized recommendations based on latest scan
    /// </summary>
    [Authorize]
    [HttpGet("recommendations")]
    [ProducesResponseType(typeof(ApiResponse<List<ProductRecommendationDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRecommendations()
    {
        var userId = GetUserId();
        var recommendations = await _productService.GetPersonalizedRecommendationsAsync(userId);
        return Ok(new ApiResponse<List<ProductRecommendationDto>>
        {
            Success = true,
            Data = recommendations
        });
    }
    
    /// <summary>
    /// Search products
    /// </summary>
    [HttpGet("search")]
    [ProducesResponseType(typeof(ApiResponse<PagedResponse<ProductDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> SearchProducts([FromQuery] ProductSearchQuery query)
    {
        var products = await _productService.SearchProductsAsync(query);
        return Ok(new ApiResponse<PagedResponse<ProductDto>>
        {
            Success = true,
            Data = products
        });
    }
    
    /// <summary>
    /// Get user's favorite products
    /// </summary>
    [Authorize]
    [HttpGet("favorites")]
    [ProducesResponseType(typeof(ApiResponse<PagedResponse<ProductDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetFavorites([FromQuery] PaginationQuery pagination)
    {
        var userId = GetUserId();
        var favorites = await _productService.GetUserFavoritesAsync(userId, pagination);
        return Ok(new ApiResponse<PagedResponse<ProductDto>>
        {
            Success = true,
            Data = favorites
        });
    }
    
    /// <summary>
    /// Add product to favorites
    /// </summary>
    [Authorize]
    [HttpPost("{productId}/favorite")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> AddToFavorites(Guid productId)
    {
        var userId = GetUserId();
        await _productService.AddToFavoritesAsync(userId, productId);
        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Added to favorites"
        });
    }
    
    /// <summary>
    /// Remove product from favorites
    /// </summary>
    [Authorize]
    [HttpDelete("{productId}/favorite")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> RemoveFromFavorites(Guid productId)
    {
        var userId = GetUserId();
        await _productService.RemoveFromFavoritesAsync(userId, productId);
        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Removed from favorites"
        });
    }
    
    /// <summary>
    /// Get all brands
    /// </summary>
    [HttpGet("brands")]
    [ProducesResponseType(typeof(ApiResponse<List<BrandDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetBrands()
    {
        var brands = await _productService.GetBrandsAsync();
        return Ok(new ApiResponse<List<BrandDto>>
        {
            Success = true,
            Data = brands
        });
    }
    
    /// <summary>
    /// Get all product categories
    /// </summary>
    [HttpGet("categories")]
    [ProducesResponseType(typeof(ApiResponse<List<CategoryDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _productService.GetCategoriesAsync();
        return Ok(new ApiResponse<List<CategoryDto>>
        {
            Success = true,
            Data = categories
        });
    }
    
    private Guid GetUserId() => Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
}

// Product Models
public class ProductFilterQuery : PaginationQuery
{
    public List<Guid>? BrandIds { get; set; }
    public List<Guid>? CategoryIds { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public bool? InStock { get; set; }
    public bool? OnSale { get; set; }
    public List<string>? SkinTypes { get; set; }
    public List<string>? SkinConcerns { get; set; }
    public string? SortBy { get; set; } // price_asc, price_desc, rating, newest
}

public class ProductSearchQuery : PaginationQuery
{
    [Required]
    public string Query { get; set; } = string.Empty;
}

public class ProductDto
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ProductImageUrl { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? OriginalPrice { get; set; }
    public int? DiscountPercentage { get; set; }
    public string ShopUrl { get; set; } = string.Empty;
    public BrandDto Brand { get; set; } = null!;
    public CategoryDto Category { get; set; } = null!;
    public List<string> KeyIngredients { get; set; } = new();
    public List<string> SkinTypes { get; set; } = new();
    public List<string> SkinConcerns { get; set; } = new();
    public decimal? AverageRating { get; set; }
    public int TotalReviews { get; set; }
    public bool InStock { get; set; }
    public bool IsFavorite { get; set; }
}

public class ProductDetailDto : ProductDto
{
    public string? Volume { get; set; }
    public string? AffiliateUrl { get; set; }
}

public class ProductRecommendationDto : ProductDto
{
    public decimal RecommendationScore { get; set; }
    public string RecommendationReason { get; set; } = string.Empty;
    public int Priority { get; set; }
}

public class BrandDto
{
    public Guid BrandId { get; set; }
    public string BrandName { get; set; } = string.Empty;
    public string? LogoUrl { get; set; }
    public bool IsVerified { get; set; }
    public bool IsPartner { get; set; }
}

public class CategoryDto
{
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string? CategoryIcon { get; set; }
}
```

### 5. Routine Management Endpoints

```csharp
// Controllers/RoutinesController.cs
[ApiController]
[Route("api/v1/[controller]")]
[Authorize(Policy = "MemberOnly")]
public class RoutinesController : ControllerBase
{
    private readonly IRoutineService _routineService;
    
    public RoutinesController(IRoutineService routineService)
    {
        _routineService = routineService;
    }
    
    /// <summary>
    /// Get all user routines
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<RoutineDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRoutines()
    {
        var userId = GetUserId();
        var routines = await _routineService.GetUserRoutinesAsync(userId);
        return Ok(new ApiResponse<List<RoutineDto>>
        {
            Success = true,
            Data = routines
        });
    }
    
    /// <summary>
    /// Get routine by ID with steps
    /// </summary>
    [HttpGet("{routineId}")]
    [ProducesResponseType(typeof(ApiResponse<RoutineDetailDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRoutine(Guid routineId)
    {
        var userId = GetUserId();
        var routine = await _routineService.GetRoutineByIdAsync(userId, routineId);
        return Ok(new ApiResponse<RoutineDetailDto>
        {
            Success = true,
            Data = routine
        });
    }
    
    /// <summary>
    /// Create new routine
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<RoutineDto>), StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateRoutine([FromBody] CreateRoutineRequest request)
    {
        var userId = GetUserId();
        var routine = await _routineService.CreateRoutineAsync(userId, request);
        return CreatedAtAction(nameof(GetRoutine), new { routineId = routine.RoutineId }, new ApiResponse<RoutineDto>
        {
            Success = true,
            Message = "Routine created successfully",
            Data = routine
        });
    }
    
    /// <summary>
    /// Update routine
    /// </summary>
    [HttpPut("{routineId}")]
    [ProducesResponseType(typeof(ApiResponse<RoutineDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateRoutine(Guid routineId, [FromBody] UpdateRoutineRequest request)
    {
        var userId = GetUserId();
        var routine = await _routineService.UpdateRoutineAsync(userId, routineId, request);
        return Ok(new ApiResponse<RoutineDto>
        {
            Success = true,
            Message = "Routine updated successfully",
            Data = routine
        });
    }
    
    /// <summary>
    /// Delete routine
    /// </summary>
    [HttpDelete("{routineId}")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteRoutine(Guid routineId)
    {
        var userId = GetUserId();
        await _routineService.DeleteRoutineAsync(userId, routineId);
        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Routine deleted successfully"
        });
    }
    
    /// <summary>
    /// Mark routine as completed for today
    /// </summary>
    [HttpPost("{routineId}/complete")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> CompleteRoutine(Guid routineId, [FromBody] CompleteRoutineRequest request)
    {
        var userId = GetUserId();
        await _routineService.MarkRoutineCompletedAsync(userId, routineId, request.Notes);
        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Routine marked as completed"
        });
    }
    
    /// <summary>
    /// Get routine completion history
    /// </summary>
    [HttpGet("{routineId}/history")]
    [ProducesResponseType(typeof(ApiResponse<RoutineHistoryResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRoutineHistory(Guid routineId, [FromQuery] int days = 30)
    {
        var userId = GetUserId();
        var history = await _routineService.GetRoutineHistoryAsync(userId, routineId, days);
        return Ok(new ApiResponse<RoutineHistoryResponse>
        {
            Success = true,
            Data = history
        });
    }
    
    /// <summary>
    /// Create/Update routine reminder
    /// </summary>
    [HttpPost("{routineId}/reminder")]
    [ProducesResponseType(typeof(ApiResponse<ReminderDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> SetReminder(Guid routineId, [FromBody] SetReminderRequest request)
    {
        var userId = GetUserId();
        var reminder = await _routineService.SetReminderAsync(userId, routineId, request);
        return Ok(new ApiResponse<ReminderDto>
        {
            Success = true,
            Message = "Reminder set successfully",
            Data = reminder
        });
    }
    
    /// <summary>
    /// Delete routine reminder
    /// </summary>
    [HttpDelete("{routineId}/reminder")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteReminder(Guid routineId)
    {
        var userId = GetUserId();
        await _routineService.DeleteReminderAsync(userId, routineId);
        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Reminder deleted successfully"
        });
    }
    
    private Guid GetUserId() => Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
}

// Routine Models
public class RoutineDto
{
    public Guid RoutineId { get; set; }
    public string RoutineName { get; set; } = string.Empty;
    public string RoutineType { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public int TotalSteps { get; set; }
    public int CompletedToday { get; set; }
    public DateTime? LastCompletedAt { get; set; }
    public int CurrentStreak { get; set; }
    public bool HasReminder { get; set; }
}

public class RoutineDetailDto : RoutineDto
{
    public List<RoutineStepDto> Steps { get; set; } = new();
    public ReminderDto? Reminder { get; set; }
}

public class RoutineStepDto
{
    public long StepId { get; set; }
    public int StepOrder { get; set; }
    public string StepName { get; set; } = string.Empty;
    public string? Instructions { get; set; }
    public int? DurationMinutes { get; set; }
    public ProductDto? Product { get; set; }
}

public class CreateRoutineRequest
{
    [Required]
    public string RoutineName { get; set; } = string.Empty;
    
    [Required]
    public string RoutineType { get; set; } = "Morning"; // Morning, Evening
    
    public List<CreateRoutineStepRequest> Steps { get; set; } = new();
}

public class CreateRoutineStepRequest
{
    [Required]
    public string StepName { get; set; } = string.Empty;
    
    public Guid? ProductId { get; set; }
    public string? Instructions { get; set; }
    public int? DurationMinutes { get; set; }
}

public class UpdateRoutineRequest : CreateRoutineRequest
{
    public bool IsActive { get; set; } = true;
}

public class CompleteRoutineRequest
{
    public string? Notes { get; set; }
}

public class SetReminderRequest
{
    [Required]
    public TimeSpan ReminderTime { get; set; }
    
    [Required]
    public List<int> DaysOfWeek { get; set; } = new(); // 0=Sunday, 6=Saturday
    
    public bool IsEnabled { get; set; } = true;
}

public class ReminderDto
{
    public Guid ReminderId { get; set; }
    public TimeSpan ReminderTime { get; set; }
    public List<int> DaysOfWeek { get; set; } = new();
    public bool IsEnabled { get; set; }
}

public class RoutineHistoryResponse
{
    public int TotalCompletions { get; set; }
    public int CurrentStreak { get; set; }
    public int LongestStreak { get; set; }
    public decimal CompletionRate { get; set; } // Percentage
    public List<CompletionRecord> Completions { get; set; } = new();
}

public class CompletionRecord
{
    public DateTime CompletionDate { get; set; }
    public string? Notes { get; set; }
}
```

### 6. Creator Station Endpoints

```csharp
// Controllers/CreatorStationsController.cs
[ApiController]
[Route("api/v1/creator-stations")]
public class CreatorStationsController : ControllerBase
{
    private readonly ICreatorService _creatorService;
    
    public CreatorStationsController(ICreatorService creatorService)
    {
        _creatorService = creatorService;
    }
    
    /// <summary>
    /// Get creator station by slug (public)
    /// </summary>
    [HttpGet("{stationSlug}")]
    [ProducesResponseType(typeof(ApiResponse<StationDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetStation(string stationSlug)
    {
        var station = await _creatorService.GetStationBySlugAsync(stationSlug);
        return Ok(new ApiResponse<StationDto>
        {
            Success = true,
            Data = station
        });
    }
    
    /// <summary>
    /// Get current user's creator station
    /// </summary>
    [Authorize(Policy = "CreatorOnly")]
    [HttpGet("me")]
    [ProducesResponseType(typeof(ApiResponse<StationDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMyStation()
    {
        var userId = GetUserId();
        var station = await _creatorService.GetUserStationAsync(userId);
        return Ok(new ApiResponse<StationDto>
        {
            Success = true,
            Data = station
        });
    }
    
    /// <summary>
    /// Create creator station (Pro members only)
    /// </summary>
    [Authorize(Policy = "ProOnly")]
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<StationDto>), StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateStation([FromBody] CreateStationRequest request)
    {
        var userId = GetUserId();
        var station = await _creatorService.CreateStationAsync(userId, request);
        return CreatedAtAction(nameof(GetStation), new { stationSlug = station.StationSlug }, new ApiResponse<StationDto>
        {
            Success = true,
            Message = "Creator station created successfully",
            Data = station
        });
    }
    
    /// <summary>
    /// Update creator station
    /// </summary>
    [Authorize(Policy = "CreatorOnly")]
    [HttpPut("me")]
    [ProducesResponseType(typeof(ApiResponse<StationDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateStation([FromBody] UpdateStationRequest request)
    {
        var userId = GetUserId();
        var station = await _creatorService.UpdateStationAsync(userId, request);
        return Ok(new ApiResponse<StationDto>
        {
            Success = true,
            Message = "Station updated successfully",
            Data = station
        });
    }
    
    /// <summary>
    /// Upload station banner image
    /// </summary>
    [Authorize(Policy = "CreatorOnly")]
    [HttpPost("me/banner")]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UploadBanner([FromForm] IFormFile file)
    {
        var userId = GetUserId();
        var imageUrl = await _creatorService.UploadBannerImageAsync(userId, file);
        return Ok(new ApiResponse<string>
        {
            Success = true,
            Message = "Banner uploaded",
            Data = imageUrl
        });
    }
    
    /// <summary>
    /// Get station posts
    /// </summary>
    [HttpGet("{stationSlug}/posts")]
    [ProducesResponseType(typeof(ApiResponse<PagedResponse<PostDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetStationPosts(string stationSlug, [FromQuery] PaginationQuery pagination)
    {
        var posts = await _creatorService.GetStationPostsAsync(stationSlug, pagination);
        return Ok(new ApiResponse<PagedResponse<PostDto>>
        {
            Success = true,
            Data = posts
        });
    }
    
    /// <summary>
    /// Create new post
    /// </summary>
    [Authorize(Policy = "CreatorOnly")]
    [HttpPost("me/posts")]
    [ProducesResponseType(typeof(ApiResponse<PostDto>), StatusCodes.Status201Created)]
    public async Task<IActionResult> CreatePost([FromBody] CreatePostRequest request)
    {
        var userId = GetUserId();
        var post = await _creatorService.CreatePostAsync(userId, request);
        return CreatedAtAction(nameof(GetPost), new { postId = post.PostId }, new ApiResponse<PostDto>
        {
            Success = true,
            Message = "Post created successfully",
            Data = post
        });
    }
    
    /// <summary>
    /// Get post by ID
    /// </summary>
    [HttpGet("posts/{postId}")]
    [ProducesResponseType(typeof(ApiResponse<PostDetailDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPost(Guid postId)
    {
        var post = await _creatorService.GetPostByIdAsync(postId);
        return Ok(new ApiResponse<PostDetailDto>
        {
            Success = true,
            Data = post
        });
    }
    
    /// <summary>
    /// Update post
    /// </summary>
    [Authorize(Policy = "CreatorOnly")]
    [HttpPut("posts/{postId}")]
    [ProducesResponseType(typeof(ApiResponse<PostDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdatePost(Guid postId, [FromBody] UpdatePostRequest request)
    {
        var userId = GetUserId();
        var post = await _creatorService.UpdatePostAsync(userId, postId, request);
        return Ok(new ApiResponse<PostDto>
        {
            Success = true,
            Message = "Post updated successfully",
            Data = post
        });
    }
    
    /// <summary>
    /// Delete post
    /// </summary>
    [Authorize(Policy = "CreatorOnly")]
    [HttpDelete("posts/{postId}")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeletePost(Guid postId)
    {
        var userId = GetUserId();
        await _creatorService.DeletePostAsync(userId, postId);
        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Post deleted successfully"
        });
    }
    
    /// <summary>
    /// Like a post
    /// </summary>
    [Authorize]
    [HttpPost("posts/{postId}/like")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> LikePost(Guid postId)
    {
        var userId = GetUserId();
        await _creatorService.LikePostAsync(userId, postId);
        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Post liked"
        });
    }
    
    /// <summary>
    /// Unlike a post
    /// </summary>
    [Authorize]
    [HttpDelete("posts/{postId}/like")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UnlikePost(Guid postId)
    {
        var userId = GetUserId();
        await _creatorService.UnlikePostAsync(userId, postId);
        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Post unliked"
        });
    }
    
    /// <summary>
    /// Add comment to post
    /// </summary>
    [Authorize]
    [HttpPost("posts/{postId}/comments")]
    [ProducesResponseType(typeof(ApiResponse<CommentDto>), StatusCodes.Status201Created)]
    public async Task<IActionResult> AddComment(Guid postId, [FromBody] AddCommentRequest request)
    {
        var userId = GetUserId();
        var comment = await _creatorService.AddCommentAsync(userId, postId, request);
        return Created(string.Empty, new ApiResponse<CommentDto>
        {
            Success = true,
            Message = "Comment added",
            Data = comment
        });
    }
    
    /// <summary>
    /// Get post comments
    /// </summary>
    [HttpGet("posts/{postId}/comments")]
    [ProducesResponseType(typeof(ApiResponse<PagedResponse<CommentDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetComments(Guid postId, [FromQuery] PaginationQuery pagination)
    {
        var comments = await _creatorService.GetPostCommentsAsync(postId, pagination);
        return Ok(new ApiResponse<PagedResponse<CommentDto>>
        {
            Success = true,
            Data = comments
        });
    }
    
    /// <summary>
    /// Follow a station
    /// </summary>
    [Authorize]
    [HttpPost("{stationSlug}/follow")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> FollowStation(string stationSlug)
    {
        var userId = GetUserId();
        await _creatorService.FollowStationAsync(userId, stationSlug);
        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Followed successfully"
        });
    }
    
    /// <summary>
    /// Unfollow a station
    /// </summary>
    [Authorize]
    [HttpDelete("{stationSlug}/follow")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UnfollowStation(string stationSlug)
    {
        var userId = GetUserId();
        await _creatorService.UnfollowStationAsync(userId, stationSlug);
        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Unfollowed successfully"
        });
    }
    
    /// <summary>
    /// Get station analytics (creator only)
    /// </summary>
    [Authorize(Policy = "CreatorOnly")]
    [HttpGet("me/analytics")]
    [ProducesResponseType(typeof(ApiResponse<StationAnalyticsDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAnalytics([FromQuery] int days = 30)
    {
        var userId = GetUserId();
        var analytics = await _creatorService.GetStationAnalyticsAsync(userId, days);
        return Ok(new ApiResponse<StationAnalyticsDto>
        {
            Success = true,
            Data = analytics
        });
    }
    
    /// <summary>
    /// Discover trending stations
    /// </summary>
    [HttpGet("discover/trending")]
    [ProducesResponseType(typeof(ApiResponse<List<StationDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> DiscoverTrending([FromQuery] int limit = 10)
    {
        var stations = await _creatorService.GetTrendingStationsAsync(limit);
        return Ok(new ApiResponse<List<StationDto>>
        {
            Success = true,
            Data = stations
        });
    }
    
    private Guid GetUserId() => Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
}

// Creator Models (partial - add more as needed)
public class StationDto
{
    public Guid StationId { get; set; }
    public string StationName { get; set; } = string.Empty;
    public string StationSlug { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public string? BannerImageUrl { get; set; }
    public string? ProfileImageUrl { get; set; }
    public string? InstagramUrl { get; set; }
    public string? YoutubeUrl { get; set; }
    public int FollowersCount { get; set; }
    public int TotalPosts { get; set; }
    public long TotalViews { get; set; }
    public bool IsFollowing { get; set; }
    public bool IsPublished { get; set; }
    public UserDto Creator { get; set; } = null!;
}

public class CreateStationRequest
{
    [Required]
    [MinLength(3)]
    public string StationName { get; set; } = string.Empty;
    
    [Required]
    [RegularExpression(@"^[a-z0-9-]+$")]
    public string StationSlug { get; set; } = string.Empty;
    
    public string? Bio { get; set; }
}

public class PostDto
{
    public Guid PostId { get; set; }
    public string PostType { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public int ViewCount { get; set; }
    public int LikeCount { get; set; }
    public int CommentCount { get; set; }
    public bool IsLiked { get; set; }
    public DateTime? PublishedAt { get; set; }
    public StationDto Station { get; set; } = null!;
}

public class PostDetailDto : PostDto
{
    public string Content { get; set; } = string.Empty;
    public List<string> MediaUrls { get; set; } = new();
    public List<string> Tags { get; set; } = new();
    public int? ReadTimeMinutes { get; set; }
}

public class CreatePostRequest
{
    [Required]
    public string PostType { get; set; } = "Article";
    
    [Required]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    public string Content { get; set; } = string.Empty;
    
    public string? ThumbnailUrl { get; set; }
    public List<string> MediaUrls { get; set; } = new();
    public List<string> Tags { get; set; } = new();
    public string Status { get; set; } = "Draft"; // Draft, Published
    public DateTime? ScheduledFor { get; set; }
}
```

*Due to character limits, I'll continue with the remaining endpoints in the next section...*

---

**[CONTINUED IN NEXT SECTION - This documentation covers 6/15 major endpoint groups. Would you like me to continue with:**
- Subscription & Payment Endpoints
- Notifications Endpoints
- Admin & Moderation Endpoints
- Analytics Endpoints
- And the complete Business Rules, AI Integration, Payment Integration, Security sections, etc.]

