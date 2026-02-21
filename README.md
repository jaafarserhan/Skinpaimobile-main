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
