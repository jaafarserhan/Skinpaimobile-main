import { InfluencerProfile, InfluencerStation, BrandCampaign, TrendingTopic, CommunityStats, BrandCommunity, InfluencerBadge } from '../types/community';

export const mockInfluencerBadges: InfluencerBadge[] = [
  {
    id: 'skincare-expert',
    name: 'Skincare Expert',
    icon: '🧴',
    description: 'Recognized for expert skincare knowledge',
    earnedDate: '2024-10-15'
  },
  {
    id: 'trending-creator',
    name: 'Trending Creator',
    icon: '🔥',
    description: 'Created viral skincare content',
    earnedDate: '2024-11-20'
  },
  {
    id: 'community-leader',
    name: 'Community Leader',
    icon: '👑',
    description: 'Top engagement and helpful content',
    earnedDate: '2024-12-01'
  }
];

export const mockInfluencers: InfluencerProfile[] = [
  {
    id: 'inf-001',
    name: 'Sarah Beauty',
    username: '@sarahbeauty',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b7a1?w=150&h=150&fit=crop',
    verified: true,
    bio: 'Skincare enthusiast sharing my glow-up journey ✨ | Certified esthetician | DM for collabs',
    followers: 45200,
    following: 1240,
    totalPosts: 342,
    totalLikes: 125000,
    specialties: ['Anti-aging', 'Sensitive Skin', 'K-beauty'],
    joinedDate: '2023-03-15',
    rank: 1,
    badges: [mockInfluencerBadges[0], mockInfluencerBadges[1], mockInfluencerBadges[2]],
    stationId: 'station-001'
  },
  {
    id: 'inf-002',
    name: 'Alex Glow',
    username: '@alexglow',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    verified: true,
    bio: 'Men\'s skincare advocate 💪 | Product reviewer | Building confidence one routine at a time',
    followers: 32100,
    following: 892,
    totalPosts: 218,
    totalLikes: 89000,
    specialties: ['Men\'s Skincare', 'Acne Treatment', 'Product Reviews'],
    joinedDate: '2023-06-20',
    rank: 2,
    badges: [mockInfluencerBadges[0], mockInfluencerBadges[1]],
    stationId: 'station-002'
  },
  {
    id: 'inf-003',
    name: 'Maya Radiance',
    username: '@mayaradiance',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    verified: false,
    bio: 'Natural skincare lover 🌿 | DIY recipes | Minimal routine maximalist results',
    followers: 28500,
    following: 1456,
    totalPosts: 156,
    totalLikes: 67000,
    specialties: ['Natural Skincare', 'DIY', 'Minimalist Routines'],
    joinedDate: '2023-08-10',
    rank: 3,
    badges: [mockInfluencerBadges[0]],
    stationId: 'station-003'
  },
  {
    id: 'inf-004',
    name: 'Dr. Emma Skin',
    username: '@dremmaskin',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop',
    verified: true,
    bio: 'Board-certified dermatologist 👩‍⚕️ | Science-based skincare | Patient education',
    followers: 67800,
    following: 234,
    totalPosts: 89,
    totalLikes: 156000,
    specialties: ['Medical Dermatology', 'Scientific Research', 'Ingredient Analysis'],
    joinedDate: '2023-01-05',
    rank: 4,
    badges: [mockInfluencerBadges[0], mockInfluencerBadges[2]]
  },
  {
    id: 'inf-005',
    name: 'Zoe Glowing',
    username: '@zoeglowing',
    avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop',
    verified: false,
    bio: 'Teen skincare journey 🌟 | Acne survivor | Budget-friendly finds | Gen Z skincare',
    followers: 19300,
    following: 2100,
    totalPosts: 124,
    totalLikes: 45000,
    specialties: ['Teen Skincare', 'Budget Products', 'Acne Journey'],
    joinedDate: '2024-02-14',
    rank: 5,
    badges: [mockInfluencerBadges[1]]
  }
];

export const mockInfluencerStations: InfluencerStation[] = [
  {
    id: 'station-001',
    influencerId: 'inf-001',
    name: 'Sarah\'s Glow Hub',
    description: 'Your daily dose of skincare wisdom and glow-up inspiration',
    coverImage: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=300&fit=crop',
    theme: 'skincare',
    subscribers: 12400,
    totalContent: 89,
    isActive: true,
    createdDate: '2023-05-20'
  },
  {
    id: 'station-002',
    influencerId: 'inf-002',
    name: 'The Man Cave Skincare',
    description: 'Breaking down skincare barriers for men, one product at a time',
    coverImage: 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=600&h=300&fit=crop',
    theme: 'lifestyle',
    subscribers: 8900,
    totalContent: 67,
    isActive: true,
    createdDate: '2023-07-15'
  },
  {
    id: 'station-003',
    influencerId: 'inf-003',
    name: 'Natural Glow Kitchen',
    description: 'DIY skincare recipes and natural beauty secrets',
    coverImage: 'https://images.unsplash.com/photo-1559627328-cf57ac4fe1e1?w=600&h=300&fit=crop',
    theme: 'wellness',
    subscribers: 6700,
    totalContent: 45,
    isActive: true,
    createdDate: '2023-09-01'
  }
];

export const mockBrandCampaigns: BrandCampaign[] = [
  {
    id: 'camp-001',
    brandId: 'skinglow',
    brandName: 'SkinGlow Pro',
    brandLogo: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=150&h=150&fit=crop',
    title: '30-Day Glow Challenge',
    description: 'Transform your skin in 30 days with our complete skincare routine. Share your progress and win amazing prizes!',
    campaignImage: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    participantCount: 2847,
    totalEngagement: 45600,
    hashtag: '#GlowChallenge30',
    prize: '$500 skincare bundle + 1-year supply',
    requirements: [
      'Post daily progress photos',
      'Use #GlowChallenge30 hashtag',
      'Tag @skinglow and 2 friends',
      'Share your routine details'
    ],
    isActive: true,
    featured: true
  },
  {
    id: 'camp-002',
    brandId: 'radiance',
    brandName: 'Radiance Labs',
    brandLogo: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=150&h=150&fit=crop',
    title: 'Vitamin C Transformation',
    description: 'Show us your vitamin C glow-up! Before and after photos using our Vitamin C serum.',
    campaignImage: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&h=300&fit=crop',
    startDate: '2024-11-15',
    endDate: '2024-12-15',
    participantCount: 1892,
    totalEngagement: 28900,
    hashtag: '#VitaminCGlow',
    prize: 'Featured on our page + $200 gift card',
    requirements: [
      'Before/after comparison',
      'Use product for minimum 2 weeks',
      'Include product in photo',
      'Write honest review'
    ],
    isActive: true,
    featured: false
  },
  {
    id: 'camp-003',
    brandId: 'youth',
    brandName: 'Youth Renewal',
    brandLogo: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=150&h=150&fit=crop',
    title: 'Age-Reverse Journey',
    description: 'Document your anti-aging journey with our retinol collection. Real results, real stories.',
    campaignImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    startDate: '2024-10-01',
    endDate: '2024-12-31',
    participantCount: 1234,
    totalEngagement: 19800,
    hashtag: '#AgeReverse',
    prize: 'Complete anti-aging collection worth $300',
    requirements: [
      'Weekly progress updates',
      'Minimum 4-week participation',
      'Detailed routine explanation',
      'Before/after photos'
    ],
    isActive: true,
    featured: false
  }
];

export const mockTrendingTopics: TrendingTopic[] = [
  {
    id: 'trend-001',
    hashtag: '#GlassSkine',
    postCount: 12847,
    engagementRate: 8.4,
    category: 'skincare',
    trending: 'up',
    relatedBrands: ['SkinGlow Pro', 'Radiance Labs']
  },
  {
    id: 'trend-002',
    hashtag: '#SkipCare',
    postCount: 8923,
    engagementRate: 6.7,
    category: 'routine',
    trending: 'up',
    relatedBrands: ['PureCleanse', 'HydraPlus']
  },
  {
    id: 'trend-003',
    hashtag: '#RetinolReveals',
    postCount: 6543,
    engagementRate: 9.2,
    category: 'product',
    trending: 'stable',
    relatedBrands: ['Youth Renewal']
  },
  {
    id: 'trend-004',
    hashtag: '#SkinMinimalism',
    postCount: 4521,
    engagementRate: 5.8,
    category: 'routine',
    trending: 'down',
    relatedBrands: ['PureCleanse']
  }
];

export const mockCommunityStats: CommunityStats = {
  totalMembers: 127543,
  activeToday: 8934,
  postsToday: 1247,
  topHashtags: ['#GlowUp', '#SkincareRoutine', '#GlassSkine', '#SelfCare', '#SkincareJourney']
};

export const mockBrandCommunities: BrandCommunity[] = [
  {
    brandId: 'skinglow',
    brandName: 'SkinGlow Pro',
    brandLogo: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=150&h=150&fit=crop',
    description: 'Premium skincare with scientifically-proven ingredients for radiant skin',
    memberCount: 23847,
    postCount: 5632,
    isVerified: true,
    isPartner: true,
    joinedDate: '2023-01-15',
    categories: ['Anti-aging', 'Hydration', 'Serums']
  },
  {
    brandId: 'radiance',
    brandName: 'Radiance Labs',
    brandLogo: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=150&h=150&fit=crop',
    description: 'Advanced vitamin C and brightening solutions for luminous skin',
    memberCount: 18923,
    postCount: 3421,
    isVerified: true,
    isPartner: true,
    joinedDate: '2023-02-20',
    categories: ['Brightening', 'Vitamin C', 'Antioxidants']
  },
  {
    brandId: 'sunshield',
    brandName: 'SunShield',
    brandLogo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop',
    description: 'Superior sun protection for all skin types with cutting-edge formulas',
    memberCount: 15634,
    postCount: 2847,
    isVerified: true,
    isPartner: true,
    joinedDate: '2023-03-10',
    categories: ['Sun Protection', 'SPF', 'Mineral Sunscreen']
  },
  {
    brandId: 'youth',
    brandName: 'Youth Renewal',
    brandLogo: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=150&h=150&fit=crop',
    description: 'Anti-aging treatments with retinol and peptides for youthful skin',
    memberCount: 12456,
    postCount: 1923,
    isVerified: true,
    isPartner: true,
    joinedDate: '2023-04-05',
    categories: ['Anti-aging', 'Retinol', 'Peptides']
  },
  {
    brandId: 'hydraplus',
    brandName: 'HydraPlus',
    brandLogo: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=150&h=150&fit=crop',
    description: 'Intensive hydration and moisture barrier repair for all skin types',
    memberCount: 9876,
    postCount: 1456,
    isVerified: false,
    isPartner: false,
    joinedDate: '2023-05-12',
    categories: ['Hydration', 'Moisture Barrier', 'Dry Skin']
  }
];