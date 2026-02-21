/**
 * SkinPAI API Service
 * Handles all communication with the .NET backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Types
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Social Login types
export type SocialProvider = 'google' | 'apple' | 'facebook';

export interface SocialLoginRequest {
  provider: SocialProvider;
  idToken: string;
  accessToken?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImageUrl?: string;
}

export interface SocialAuthResponse {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  membershipType: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  isNewUser: boolean;
  questionnaireCompleted: boolean;
}

// Backend returns flat AuthResponse (no nested user object)
export interface AuthResponse {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  membershipType: string;
  questionnaireCompleted: boolean;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

// Guest login has different response structure
export interface GuestLoginResponse {
  userId: string;
  membershipType: string;
  maxScans: number;
  accessToken: string;
  expiresAt: string;
}

export interface UserDto {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  membershipType: string;
  membershipStatus: string;
  membershipStartDate?: string;
  membershipEndDate?: string;
  walletBalance: number;
  totalScansUsed: number;
  isVerified: boolean;
  isCreator: boolean;
  questionnaireCompleted: boolean;
  skinProfile?: SkinProfileDto;
  createdAt: string;
}

export interface SkinProfileDto {
  skinType?: string;
  skinConcerns?: string;
  currentRoutine?: string;
  sunExposure?: string;
  lifestyle?: string;
  questionnaireCompleted: boolean;
}

export interface UpdateSkinProfileRequest {
  skinType?: string;
  skinConcerns?: string;
  currentRoutine?: string;
  sunExposure?: string;
  lifestyle?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
  profileImageBase64?: string;
  profileImageUrl?: string;
}

export interface CreateScanRequest {
  imageBase64: string;
  scanType: string;
  notes?: string;
}

export interface SkinScanDto {
  scanId: string;
  userId: string;
  scanImageUrl: string;
  overlayImageUrl?: string;
  scanType: string;
  scanDate: string;
  aiProcessingStatus: string;
  overallScore?: number;
  estimatedSkinAge?: number;
  actualAge?: number;
  analysisResult?: SkinAnalysisResultDto;
  productRecommendations?: ProductRecommendationDto[];
}

export interface SkinAnalysisResultDto {
  skinType?: string;
  // Health Metrics
  hydration?: number;
  moisture?: number;
  oiliness?: number;
  evenness?: number;
  texture?: number;
  clarity?: number;
  firmness?: number;
  elasticity?: number;
  poreSize?: number;
  smoothness?: number;
  radiance?: number;
  // Concerns
  acneSeverity?: number;
  wrinklesSeverity?: number;
  darkSpotsSeverity?: number;
  rednessLevel?: number;
  darkCircles?: number;
  uvDamage?: number;
  // Analysis
  topConcerns?: string;
  recommendedIngredients?: string;
  aiAnalysisText?: string;
  recommendations?: string[];
  confidenceScore?: number;
  faceDetected: boolean;
  faceLandmarksCount?: number;
}

export interface ProductRecommendationDto {
  productId: string;
  productName: string;
  productImageUrl?: string;
  price: number;
  recommendationScore: number;
  recommendationReason?: string;
  brandName: string;
}

export interface DailyScanUsageDto {
  scanDate: string;
  scanCount: number;
  maxScans: number;
  remainingScans: number;
}

export interface SkinProgressPointDto {
  date: string;
  value: number;
}

export interface SkinProgressDto {
  overallScoreProgress: SkinProgressPointDto[];
  hydrationProgress: SkinProgressPointDto[];
  acneProgress: SkinProgressPointDto[];
  averageScore: number;
  scoreChange: number;
  totalScans: number;
}

export interface CreateReminderRequest {
  routineId: string;
  reminderTime: string;
  daysOfWeek: number[];
  isEnabled: boolean;
  soundEnabled?: boolean;
  vibrationEnabled?: boolean;
}

export interface ProductDto {
  productId: string;
  productName: string;
  description?: string;
  productImageUrl?: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  averageRating?: number;
  totalReviews: number;
  inStock: boolean;
  isFeatured: boolean;
  isRecommended: boolean;
  volume?: string;
  shopUrl?: string;
  keyIngredients?: string[];
  skinTypes?: string[];
  skinConcerns?: string[];
  brand: BrandDto;
  category: ProductCategoryDto;
  distributor?: DistributorDto;
}

export interface DistributorDto {
  distributorId: string;
  name: string;
  logoUrl?: string;
  website?: string;
  isPartner: boolean;
}

export interface ProductCategoryDto {
  categoryId: string;
  categoryName: string;
  description?: string;
  categoryIcon?: string;
}

export interface BrandDto {
  brandId: string;
  brandName: string;
  logoUrl?: string;
  description?: string;
  website?: string;
  isVerified: boolean;
  isPartner: boolean;
}

export interface ProductBundleDto {
  bundleId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  bundlePrice: number;
  originalPrice: number;
  savings: number;
  category?: string;
  benefits?: string[];
  forSkinTypes?: string[];
  forSkinConcerns?: string[];
  brand: BrandDto;
  products: ProductSummaryDto[];
}

export interface ProductSummaryDto {
  productId: string;
  name: string;
  imageUrl?: string;
  price: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface RoutineDto {
  routineId: string;
  routineName: string;
  routineType: string;
  isActive: boolean;
  steps: RoutineStepDto[];
  createdAt: string;
}

export interface RoutineStepDto {
  stepId: number;
  stepOrder: number;
  stepName: string;
  instructions?: string;
  durationMinutes?: number;
  isCompleted: boolean;
  product?: ProductSummaryDto;
}

export interface CreateRoutineRequest {
  routineName: string;
  routineType: string;
  steps?: CreateRoutineStepRequest[];
}

export interface CreateRoutineStepRequest {
  stepOrder: number;
  stepName: string;
  instructions?: string;
  durationMinutes?: number;
  productId?: string;
}

export interface RoutineReminderDto {
  reminderId: string;
  routineId: string;
  routineName: string;
  reminderTime: string;
  daysOfWeek: number[];
  isEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export interface CommunityPostDto {
  postId: string;
  userId: string;
  userName?: string;
  userProfileImage?: string;
  isVerified: boolean;
  stationId?: string;
  stationName?: string;
  postType: string;
  title?: string;
  content?: string;
  thumbnailUrl?: string;
  mediaUrls?: string[];
  tags?: string[];
  hashtags?: string[];
  readTimeMinutes?: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  status: string;
  publishedAt?: string;
  createdAt: string;
  isLikedByCurrentUser: boolean;
}

export interface CreatePostRequest {
  content: string;
  postType?: string;
  title?: string;
  mediaBase64?: string[];
  tags?: string[];
  hashtags?: string[];
}

export interface PostCommentDto {
  commentId: number;
  userId: string;
  authorName: string;
  authorImageUrl?: string;
  content: string;
  createdAt: string;
  replies?: PostCommentDto[];
}

export interface CreatorStationDto {
  stationId: string;
  userId: string;
  stationName: string;
  stationSlug: string;
  bio?: string;
  description?: string;
  location?: string;
  bannerImageUrl?: string;
  profileImageUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  tikTokUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
  email?: string;
  specialties?: string[];
  certifications?: string[];
  experience?: string;
  contentFrequency?: string;
  theme: string;
  followersCount: number;
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  isPublished: boolean;
  createdAt: string;
  isFollowedByCurrentUser: boolean;
}

export interface BrandCampaignDto {
  campaignId: string;
  brand: BrandDto;
  title: string;
  description?: string;
  campaignImageUrl?: string;
  campaignVideoUrl?: string;
  startDate: string;
  endDate: string;
  participantCount: number;
  totalEngagement: number;
  hashtag?: string;
  prize?: string;
  requirements?: string[];
  isActive: boolean;
  featured: boolean;
  isParticipating: boolean;
}

export interface CommunityStatsDto {
  totalMembers: number;
  activeToday: number;
  postsToday: number;
  topHashtags: string[];
}

export interface SubscriptionPlanDto {
  planId: string;
  planCode: string;
  planName: string;
  description?: string;
  priceMonthly: number;
  priceYearly: number;
  scansPerDay: number;
  hasAdvancedAnalysis: boolean;
  hasProductRecommendations: boolean;
  hasProgressTracking: boolean;
  hasCommunityAccess: boolean;
  hasCreatorStudio: boolean;
  hasPrioritySupport: boolean;
  adFree: boolean;
  featureListJson?: string;
}

export interface UserSubscriptionDto {
  subscriptionId: string;
  planId: string;
  planCode: string;
  planName: string;
  startDate: string;
  endDate?: string;
  billingCycle: string;
  isActive: boolean;
  autoRenew: boolean;
  cancelledAt?: string;
  nextBillingDate?: string;
  amount: number;
}

export interface WalletInfoDto {
  balance: number;
  currency: string;
  recentTransactions: WalletTransactionSummary[];
}

export interface WalletTransactionSummary {
  transactionType: string;
  amount: number;
  transactionDate: string;
}

export interface WalletTransactionDto {
  transactionId: string;
  transactionType: string;
  amount: number;
  description?: string;
  createdAt: string;
}

export interface NotificationDto {
  notificationId: string;
  notificationType: string;
  title: string;
  body?: string;
  isRead: boolean;
  actionUrl?: string;
  iconUrl?: string;
  relatedEntityId?: string;
  createdAt: string;
  readAt?: string;
}

export interface UserAchievementDto {
  achievementId: string;
  achievementCode: string;
  achievementName: string;
  description?: string;
  iconUrl?: string;
  category?: string;
  rarity?: string;
  pointsValue: number;
  unlockedAt: string;
  progress: number;
}

export interface MemberDashboardDto {
  user: UserDto;
  dailyScanUsage: DailyScanUsageDto;
  latestScan?: SkinScanDto;
  recentScans: SkinScanDto[];
  activeRoutines: RoutineDto[];
  recentAchievements: UserAchievementDto[];
  unreadNotifications: number;
}

export interface ProDashboardDto {
  user: UserDto;
  station?: CreatorStationDto;
  dailyScanUsage: DailyScanUsageDto;
  latestScan?: SkinScanDto;
  totalFollowers: number;
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  recentPosts: CommunityPostDto[];
  unreadMessages: number;
  unreadNotifications: number;
}

export interface ChatConversationDto {
  partnerId: string;
  partnerName: string;
  partnerProfileImage?: string;
  isVerified: boolean;
  lastMessage?: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface ChatMessageDto {
  messageId: string;
  senderId: string;
  senderName?: string;
  senderProfileImage?: string;
  receiverId: string;
  messageType: string;
  content: string;
  mediaUrl?: string;
  isRead: boolean;
  sentAt: string;
  readAt?: string;
  isMine: boolean;
}

// API Response type
interface ApiResponse<T> {
  data: T | null;
  error?: string;
}

// API Service Class
class ApiService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.loadTokens();
  }

  private loadTokens() {
    this.accessToken = localStorage.getItem('skinpai_access_token');
    this.refreshToken = localStorage.getItem('skinpai_refresh_token');
  }

  setTokens(accessToken: string, refreshToken?: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken ?? null;
    localStorage.setItem('skinpai_access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('skinpai_refresh_token', refreshToken);
    } else {
      localStorage.removeItem('skinpai_refresh_token');
    }
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('skinpai_access_token');
    localStorage.removeItem('skinpai_refresh_token');
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401 && this.refreshToken) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          (headers as Record<string, string>)['Authorization'] = `Bearer ${this.accessToken}`;
          const retryResponse = await fetch(url, { ...options, headers });
          if (!retryResponse.ok) {
            const errorData = await retryResponse.json().catch(() => ({}));
            return { data: null, error: errorData.title || errorData.detail || 'Request failed' };
          }
          const data = await retryResponse.json().catch(() => null);
          return { data };
        } else {
          this.clearTokens();
          window.dispatchEvent(new CustomEvent('auth:logout'));
          return { data: null, error: 'Session expired. Please log in again.' };
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { data: null, error: errorData.title || errorData.detail || `Request failed: ${response.status}` };
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return { data: null };
      }

      const data = await response.json().catch(() => null);
      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { data: null, error: 'Network error. Please check your connection.' };
    }
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/Auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (response.ok) {
        const data: AuthResponse = await response.json();
        this.setTokens(data.accessToken, data.refreshToken);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  // ==================== Auth ====================

  async register(request: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/Auth/register', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    if (response.data?.accessToken) {
      this.setTokens(response.data.accessToken, response.data.refreshToken);
    }
    return response;
  }

  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/Auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (response.data?.accessToken) {
      this.setTokens(response.data.accessToken, response.data.refreshToken);
    }
    return response;
  }

  async guestLogin(): Promise<ApiResponse<GuestLoginResponse>> {
    const response = await this.request<GuestLoginResponse>('/Auth/guest', {
      method: 'POST',
    });
    if (response.data?.accessToken) {
      this.setTokens(response.data.accessToken, undefined);
    }
    return response;
  }

  async socialLogin(request: SocialLoginRequest): Promise<ApiResponse<SocialAuthResponse>> {
    const response = await this.request<SocialAuthResponse>('/Auth/social', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    if (response.data?.accessToken) {
      this.setTokens(response.data.accessToken, response.data.refreshToken);
    }
    return response;
  }

  async logout(): Promise<void> {
    await this.request('/Auth/logout', { method: 'POST' });
    this.clearTokens();
  }

  // ==================== Users ====================

  async getCurrentUser(): Promise<ApiResponse<UserDto>> {
    return this.request<UserDto>('/Users/me');
  }

  async updateProfile(data: UpdateUserRequest): Promise<ApiResponse<UserDto>> {
    return this.request<UserDto>('/Users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getMemberDashboard(): Promise<ApiResponse<MemberDashboardDto>> {
    return this.request<MemberDashboardDto>('/Users/me/dashboard');
  }

  async getProDashboard(): Promise<ApiResponse<ProDashboardDto>> {
    return this.request<ProDashboardDto>('/Users/me/pro-dashboard');
  }

  async getSkinProfile(): Promise<ApiResponse<SkinProfileDto>> {
    return this.request<SkinProfileDto>('/Users/me/skin-profile');
  }

  async updateSkinProfile(data: UpdateSkinProfileRequest): Promise<ApiResponse<SkinProfileDto>> {
    return this.request<SkinProfileDto>('/Users/me/skin-profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async uploadProfileImage(imageBase64: string): Promise<ApiResponse<UserDto>> {
    return this.request<UserDto>('/Users/me/profile-image', {
      method: 'POST',
      body: JSON.stringify({ imageBase64 }),
    });
  }

  // ==================== Scans ====================

  async createScan(imageBase64: string, scanType: string = 'Full', notes?: string): Promise<ApiResponse<SkinScanDto>> {
    return this.request<SkinScanDto>('/Scans', {
      method: 'POST',
      body: JSON.stringify({ imageBase64, scanType, notes }),
    });
  }

  async getScans(): Promise<ApiResponse<SkinScanDto[]>> {
    return this.request<SkinScanDto[]>('/Scans');
  }

  async getScan(scanId: string): Promise<ApiResponse<SkinScanDto>> {
    return this.request<SkinScanDto>(`/Scans/${scanId}`);
  }

  async getScanAnalysis(scanId: string): Promise<ApiResponse<SkinAnalysisResultDto>> {
    return this.request<SkinAnalysisResultDto>(`/Scans/${scanId}/analysis`);
  }

  async getDailyUsage(): Promise<ApiResponse<DailyScanUsageDto>> {
    return this.request<DailyScanUsageDto>('/Scans/usage');
  }

  async canScan(): Promise<ApiResponse<{ canScan: boolean; scansRemaining: number; reason?: string }>> {
    return this.request('/Scans/can-scan');
  }

  async getSkinProgress(days: number = 30): Promise<ApiResponse<SkinProgressDto>> {
    return this.request<SkinProgressDto>(`/Scans/progress?days=${days}`);
  }

  // ==================== Products ====================

  async getProducts(params?: {
    page?: number;
    pageSize?: number;
    categoryId?: string;
    brandId?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }): Promise<ApiResponse<PaginatedResponse<ProductDto>>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    return this.request<PaginatedResponse<ProductDto>>(`/Products${queryString ? '?' + queryString : ''}`);
  }

  async getProduct(productId: string): Promise<ApiResponse<ProductDto>> {
    return this.request<ProductDto>(`/Products/${productId}`);
  }

  async getCategories(): Promise<ApiResponse<ProductCategoryDto[]>> {
    return this.request<ProductCategoryDto[]>('/Products/categories');
  }

  async getBrands(): Promise<ApiResponse<BrandDto[]>> {
    return this.request<BrandDto[]>('/Products/brands');
  }

  async getDistributors(): Promise<ApiResponse<DistributorDto[]>> {
    return this.request<DistributorDto[]>('/Products/distributors');
  }

  async getFavorites(): Promise<ApiResponse<ProductDto[]>> {
    return this.request<ProductDto[]>('/Products/favorites');
  }

  async addFavorite(productId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/Products/favorites/${productId}`, { method: 'POST' });
  }

  async removeFavorite(productId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/Products/favorites/${productId}`, { method: 'DELETE' });
  }

  async getBundles(): Promise<ApiResponse<ProductBundleDto[]>> {
    return this.request<ProductBundleDto[]>('/Products/bundles');
  }

  async getBundle(bundleId: string): Promise<ApiResponse<ProductBundleDto>> {
    return this.request<ProductBundleDto>(`/Products/bundles/${bundleId}`);
  }

  async getScanRecommendations(scanId: string): Promise<ApiResponse<ProductDto[]>> {
    return this.request<ProductDto[]>(`/Products/recommendations/scan/${scanId}`);
  }

  async getPersonalizedRecommendations(): Promise<ApiResponse<ProductDto[]>> {
    return this.request<ProductDto[]>('/Products/recommendations');
  }

  // ==================== Routines ====================

  async getRoutines(): Promise<ApiResponse<RoutineDto[]>> {
    return this.request<RoutineDto[]>('/Routines');
  }

  async createRoutine(data: CreateRoutineRequest): Promise<ApiResponse<RoutineDto>> {
    return this.request<RoutineDto>('/Routines', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRoutine(routineId: string, data: Partial<CreateRoutineRequest>): Promise<ApiResponse<RoutineDto>> {
    return this.request<RoutineDto>(`/Routines/${routineId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteRoutine(routineId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/Routines/${routineId}`, { method: 'DELETE' });
  }

  async completeRoutine(routineId: string, notes?: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/Routines/${routineId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  }

  async getReminders(): Promise<ApiResponse<RoutineReminderDto[]>> {
    return this.request<RoutineReminderDto[]>('/Routines/reminders');
  }

  async createReminder(data: CreateReminderRequest): Promise<ApiResponse<RoutineReminderDto>> {
    return this.request<RoutineReminderDto>('/Routines/reminders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateReminder(reminderId: string, data: Partial<CreateReminderRequest>): Promise<ApiResponse<RoutineReminderDto>> {
    return this.request<RoutineReminderDto>(`/Routines/reminders/${reminderId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteReminder(reminderId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/Routines/reminders/${reminderId}`, { method: 'DELETE' });
  }

  // ==================== Community ====================

  async getCommunityFeed(page = 1, pageSize = 20, stationId?: string): Promise<ApiResponse<PaginatedResponse<CommunityPostDto>>> {
    let url = `/Community/feed?page=${page}&pageSize=${pageSize}`;
    if (stationId) url += `&stationId=${stationId}`;
    return this.request<PaginatedResponse<CommunityPostDto>>(url);
  }

  async getPost(postId: string): Promise<ApiResponse<CommunityPostDto>> {
    return this.request<CommunityPostDto>(`/Community/posts/${postId}`);
  }

  async createPost(data: CreatePostRequest): Promise<ApiResponse<CommunityPostDto>> {
    return this.request<CommunityPostDto>('/Community/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async likePost(postId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/Community/posts/${postId}/like`, { method: 'POST' });
  }

  async unlikePost(postId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/Community/posts/${postId}/unlike`, { method: 'POST' });
  }

  async getComments(postId: string): Promise<ApiResponse<PostCommentDto[]>> {
    return this.request<PostCommentDto[]>(`/Community/posts/${postId}/comments`);
  }

  async addComment(postId: string, content: string, parentCommentId?: string): Promise<ApiResponse<PostCommentDto>> {
    return this.request<PostCommentDto>(`/Community/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, parentCommentId }),
    });
  }

  async getStations(): Promise<ApiResponse<CreatorStationDto[]>> {
    return this.request<CreatorStationDto[]>('/Community/stations');
  }

  async getStation(stationId: string): Promise<ApiResponse<CreatorStationDto>> {
    return this.request<CreatorStationDto>(`/Community/stations/${stationId}`);
  }

  async followStation(stationId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/Community/stations/${stationId}/follow`, { method: 'POST' });
  }

  async unfollowStation(stationId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/Community/stations/${stationId}/unfollow`, { method: 'POST' });
  }

  async getTopInfluencers(): Promise<ApiResponse<CreatorStationDto[]>> {
    return this.request<CreatorStationDto[]>('/Community/influencers/top');
  }

  async getCampaigns(): Promise<ApiResponse<BrandCampaignDto[]>> {
    return this.request<BrandCampaignDto[]>('/Community/campaigns');
  }

  async getCommunityStats(): Promise<ApiResponse<CommunityStatsDto>> {
    return this.request<CommunityStatsDto>('/Community/stats');
  }

  async joinCampaign(campaignId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/Community/campaigns/${campaignId}/join`, { method: 'POST' });
  }

  // ==================== Subscriptions ====================

  async getPlans(): Promise<ApiResponse<SubscriptionPlanDto[]>> {
    return this.request<SubscriptionPlanDto[]>('/Subscriptions/plans');
  }

  async subscribe(planId: string, paymentMethodId?: string): Promise<ApiResponse<UserSubscriptionDto>> {
    return this.request<UserSubscriptionDto>('/Subscriptions/subscribe', {
      method: 'POST',
      body: JSON.stringify({ planId, paymentMethodId }),
    });
  }

  async getCurrentSubscription(): Promise<ApiResponse<UserSubscriptionDto>> {
    return this.request<UserSubscriptionDto>('/Subscriptions/current');
  }

  async cancelSubscription(): Promise<ApiResponse<void>> {
    return this.request<void>('/Subscriptions/cancel', { method: 'POST' });
  }

  async getWalletInfo(): Promise<ApiResponse<WalletInfoDto>> {
    return this.request<WalletInfoDto>('/Subscriptions/wallet');
  }

  async addFunds(amount: number, paymentMethodId?: string): Promise<ApiResponse<void>> {
    return this.request<void>('/Subscriptions/wallet/add-funds', {
      method: 'POST',
      body: JSON.stringify({ amount, paymentMethodId }),
    });
  }

  // ==================== Notifications ====================

  async getNotifications(unreadOnly = false): Promise<ApiResponse<NotificationDto[]>> {
    return this.request<NotificationDto[]>(`/Notifications?unreadOnly=${unreadOnly}`);
  }

  async markNotificationRead(notificationId: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/Notifications/${notificationId}/read`, { method: 'PUT' });
  }

  async markAllNotificationsRead(): Promise<ApiResponse<void>> {
    return this.request<void>('/Notifications/read-all', { method: 'PUT' });
  }

  async getAchievements(): Promise<ApiResponse<UserAchievementDto[]>> {
    return this.request<UserAchievementDto[]>('/Notifications/achievements');
  }

  // ==================== Chat ====================

  async getConversations(): Promise<ApiResponse<ChatConversationDto[]>> {
    return this.request<ChatConversationDto[]>('/Chat/conversations');
  }

  async getMessages(otherUserId: string): Promise<ApiResponse<ChatMessageDto[]>> {
    return this.request<ChatMessageDto[]>(`/Chat/conversations/${otherUserId}/messages`);
  }

  async sendMessage(receiverId: string, content: string, mediaBase64?: string): Promise<ApiResponse<ChatMessageDto>> {
    return this.request<ChatMessageDto>('/Chat/messages', {
      method: 'POST',
      body: JSON.stringify({ receiverId, content, mediaBase64 }),
    });
  }

  async markMessagesRead(otherUserId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/Chat/conversations/${otherUserId}/read`, { method: 'PUT' });
  }
}

// Export singleton instance
export const api = new ApiService();
export default api;
