export interface User {
  id: string;
  type: 'guest' | 'member' | 'pro';
  membershipType?: 'guest' | 'member' | 'pro';
  scansToday: number;
  maxScans: number;
  name?: string;
  email?: string;
  profileImage?: string;
  hasStation?: boolean;
  stationData?: StationData;
  questionnaireCompleted?: boolean;
  skinProfile?: SkinProfile;
  walletBalance?: number;
  subscriptionStatus?: 'active' | 'expired' | 'cancelled';
  subscriptionEndDate?: string;
  membershipEndDate?: Date;
  paymentMethod?: PaymentMethod;
}

export interface SkinProfile {
  skinType?: string;
  skinConcerns?: string;
  currentRoutine?: string;
  sunExposure?: string;
  lifestyle?: string;
}

export interface StationData {
  stationName: string;
  stationUsername: string;
  bio: string;
  description: string;
  location: string;
  coverImage: string;
  avatarImage: string;
  specialties: string[];
  theme: string;
  socialLinks: {
    instagram: string;
    youtube: string;
    twitter: string;
    website: string;
    email: string;
  };
  certifications: string[];
  experience: string;
  contentFrequency: string;
  createdDate: string;
}

export interface ScanResult {
  id: string;
  date: string;
  imageUrl: string;
  overallScore: number;
  estimatedAge: number;
  actualAge?: number;
  
  // Skin Health Metrics (0-100 scale)
  hydration: number;
  moisture: number;
  oiliness: number;
  evenness: number;
  texture: number;
  clarity: number;
  firmness: number;
  elasticity: number;
  poreSize: number;
  smoothness: number;
  radiance: number;
  
  // Skin Concerns Detection (0-100 severity scale)
  acne: number;
  wrinkles: number;
  darkCircles: number;
  darkSpots: number;
  redness: number;
  
  // Additional Analysis
  skinType: 'oily' | 'dry' | 'combination' | 'normal' | 'sensitive';
  uvDamage: number;
  
  recommendations: string[];
  aiAnalysis?: string;
  
  // AI Face Detection Overlay (Skindu)
  overlayImageUrl?: string;
  faceDetected?: boolean;
  faceLandmarksCount?: number;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
  verified: boolean;
  distributors: Distributor[];
}

export interface Distributor {
  id: string;
  name: string;
  website: string;
  logo: string;
  isPartner: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: Brand;
  distributor: Distributor;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: ProductCategory;
  description: string;
  keyIngredients: string[];
  skinType: string[];
  skinConcerns: string[];
  shopUrl: string;
  inStock: boolean;
  isRecommended?: boolean;
  discount?: number;
  // Affiliate store links
  affiliateLinks?: {
    amazon?: string;
    sephora?: string;
    ulta?: string;
  };
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface FilterOptions {
  brands: string[];
  distributors: string[];
  categories: string[];
  priceRange: [number, number];
  inStock: boolean;
  onSale: boolean;
  skinTypes: string[];
  skinConcerns: string[];
}

export interface ProductBundle {
  id: string;
  name: string;
  brand: Brand;
  description: string;
  products: Product[];
  bundlePrice: number;
  originalPrice: number;
  savings: number;
  image: string;
  category: string;
  benefits: string[];
  isCustomized?: boolean;
  forSkinType?: string[];
  forSkinConcerns?: string[];
}

export interface RoutineItem {
  id: number;
  name: string;
  time: 'AM' | 'PM';
  completed: boolean;
  productId?: string;
  reminderTime?: string;
  reminderEnabled: boolean;
}

export interface Reminder {
  id: string;
  routineItemId: number;
  time: string;
  frequency: 'daily' | 'weekly' | 'custom';
  days?: string[];
  enabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export interface ProgressWidget {
  id: string;
  title: string;
  value: number;
  maxValue: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  color: string;
  icon: string;
  description: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  progress: number;
  maxProgress: number;
}

export type Screen = 'auth' | 'create-account' | 'camera' | 'results' | 'dashboard' | 'pro-dashboard' | 'community' | 'products' | 'shop' | 'profile' | 'settings' | 'notifications' | 'admin' | 'help' | 'scan-detail' | 'product-detail' | 'influencer-profile' | 'brand-profile' | 'upgrade' | 'create-post' | 'post-detail' | 'campaign-detail' | 'create-station' | 'station-view' | 'questionnaire';

export interface PaymentMethod {
  type: 'card' | 'wallet';
  last4?: string;
  brand?: string;
}