export interface InfluencerProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  verified: boolean;
  bio: string;
  followers: number;
  following: number;
  totalPosts: number;
  totalLikes: number;
  specialties: string[];
  joinedDate: string;
  rank: number;
  badges: InfluencerBadge[];
  stationId?: string;
}

export interface InfluencerBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedDate: string;
}

export interface InfluencerStation {
  id: string;
  influencerId: string;
  name: string;
  description: string;
  coverImage: string;
  theme: 'skincare' | 'makeup' | 'wellness' | 'lifestyle';
  subscribers: number;
  totalContent: number;
  isActive: boolean;
  createdDate: string;
}

export interface BrandCampaign {
  id: string;
  brandId: string;
  brandName: string;
  brandLogo: string;
  title: string;
  description: string;
  campaignImage: string;
  campaignVideo?: string;
  startDate: string;
  endDate: string;
  participantCount: number;
  totalEngagement: number;
  hashtag: string;
  prize?: string;
  requirements: string[];
  isActive: boolean;
  featured: boolean;
}

export interface TrendingTopic {
  id: string;
  hashtag: string;
  postCount: number;
  engagementRate: number;
  category: 'skincare' | 'product' | 'routine' | 'challenge';
  trending: 'up' | 'down' | 'stable';
  relatedBrands: string[];
}

export interface CommunityStats {
  totalMembers: number;
  activeToday: number;
  postsToday: number;
  topHashtags: string[];
}

export interface BrandCommunity {
  brandId: string;
  brandName: string;
  brandLogo: string;
  description: string;
  memberCount: number;
  postCount: number;
  isVerified: boolean;
  isPartner: boolean;
  joinedDate: string;
  categories: string[];
}