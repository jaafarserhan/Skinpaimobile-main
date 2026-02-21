import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { 
  Heart, MessageCircle, Share, Play, ShoppingBag, MoreHorizontal, Verified, 
  TrendingUp, TrendingDown, Crown, Users, Calendar, Target, Award,
  Plus, ExternalLink, Flame, Hash, Trophy, Star, ChevronRight, Search, X,
  Filter, SlidersHorizontal, Clock, Sparkles, User, Building2
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { useAppTranslation } from '../hooks/useAppTranslation';
import api, { CommunityPostDto, CreatorStationDto, BrandCampaignDto, CommunityStatsDto } from '../services/api';

interface Post {
  id: string;
  type: 'image' | 'video';
  author: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
    isInfluencer: boolean;
    isBrand: boolean;
  };
  content: {
    media: string;
    caption: string;
    products?: string[];
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    liked: boolean;
  };
  timestamp: string;
  hashtags?: string[];
}

interface CommunityFeedProps {
  user: { type: 'guest' | 'member' | 'pro' } | null;
  onCreatePost: () => void;
  onCreateStation: () => void;
  onViewPost: (postId: string) => void;
  onViewInfluencer: (influencerId: string) => void;
  onViewBrand: (brandId: string) => void;
  onViewCampaign: (campaignId: string) => void;
  userHasStation?: boolean;
  onViewStation?: () => void;
  onUpgrade?: () => void;
}

type SortOption = 'recent' | 'popular' | 'trending';
type ContentFilter = 'all' | 'images' | 'videos';
type AuthorFilter = 'all' | 'influencers' | 'brands' | 'users';

export default function CommunityFeed({ 
  user,
  onCreatePost,
  onCreateStation,
  onViewPost,
  onViewInfluencer,
  onViewBrand,
  onViewCampaign,
  userHasStation = false,
  onViewStation,
  onUpgrade
}: CommunityFeedProps) {
  const { t, isRTL, direction, flexDir, textAlign } = useAppTranslation();
  const [activeTab, setActiveTab] = useState('following');
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [followedInfluencers, setFollowedInfluencers] = useState<string[]>([]);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  
  // API state
  const [apiPosts, setApiPosts] = useState<Post[]>([]);
  const [apiStations, setApiStations] = useState<CreatorStationDto[]>([]);
  const [apiCampaigns, setApiCampaigns] = useState<BrandCampaignDto[]>([]);
  const [apiStats, setApiStats] = useState<CommunityStatsDto | null>(null);
  const [apiInfluencers, setApiInfluencers] = useState<CreatorStationDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // User type helpers
  const isGuest = !user || user.type === 'guest';
  const isMember = user?.type === 'member';
  const isPro = user?.type === 'pro';
  
  // Advanced Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [contentFilter, setContentFilter] = useState<ContentFilter>('all');
  const [authorFilter, setAuthorFilter] = useState<AuthorFilter>('all');
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([
    '#GlowChallenge30',
    '#skincare',
    '#vitaminc'
  ]);

  // Load posts from API
  useEffect(() => {
    const loadCommunityData = async () => {
      try {
        const [feedRes, stationsRes, campaignsRes, statsRes, influencersRes] = await Promise.all([
          api.getCommunityFeed(1, 20),
          api.getStations(),
          api.getCampaigns(),
          api.getCommunityStats(),
          api.getTopInfluencers()
        ]);

        if (feedRes.data?.items && feedRes.data.items.length > 0) {
          const posts: Post[] = feedRes.data.items.map(post => ({
            id: post.postId,
            type: (post.postType === 'video' ? 'video' : 'image') as 'image' | 'video',
            author: {
              name: post.userName || 'Anonymous',
              username: `@${post.userName?.toLowerCase().replace(/\s/g, '') || 'user'}`,
              avatar: post.userProfileImage || 'https://images.unsplash.com/photo-1494790108755-2616b612b7a1?w=150&h=150&fit=crop',
              verified: post.isVerified,
              isInfluencer: !!post.stationId,
              isBrand: false
            },
            content: {
              media: post.mediaUrls?.[0] || post.thumbnailUrl || '',
              caption: post.content || '',
              products: []
            },
            engagement: {
              likes: post.likeCount,
              comments: post.commentCount,
              shares: post.shareCount,
              liked: post.isLikedByCurrentUser
            },
            timestamp: new Date(post.createdAt).toLocaleDateString(),
            hashtags: post.hashtags || []
          }));
          setApiPosts(posts);
        }

        if (stationsRes.data) {
          setApiStations(stationsRes.data);
        }

        if (campaignsRes.data) {
          setApiCampaigns(campaignsRes.data);
        }

        if (statsRes.data) {
          setApiStats(statsRes.data);
        }

        if (influencersRes.data) {
          setApiInfluencers(influencersRes.data);
        }
      } catch (err) {
        console.error('Failed to load community data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadCommunityData();
  }, []);

  // Extract hashtags from caption
  const extractHashtags = (caption: string): string[] => {
    const hashtagRegex = /#[\w]+/g;
    return caption.match(hashtagRegex) || [];
  };

  // Use API posts directly
  const posts = apiPosts;

  // Get all unique hashtags from posts and API stats
  const allHashtags = useMemo(() => {
    const hashtags = new Set<string>();
    posts.forEach(post => {
      if (post.hashtags) {
        post.hashtags.forEach(tag => hashtags.add(tag));
      }
    });
    // Add top hashtags from API stats
    if (apiStats?.topHashtags) {
      apiStats.topHashtags.forEach(tag => hashtags.add(tag.startsWith('#') ? tag : `#${tag}`));
    }
    return Array.from(hashtags).sort();
  }, [posts, apiStats]);

  // Filter posts based on search and filters
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // Search query filter (searches in caption, author name, username, hashtags)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          post.content.caption.toLowerCase().includes(query) ||
          post.author.name.toLowerCase().includes(query) ||
          post.author.username.toLowerCase().includes(query) ||
          (post.hashtags && post.hashtags.some(tag => tag.toLowerCase().includes(query))) ||
          (post.content.products && post.content.products.some(p => p.toLowerCase().includes(query)));
        
        if (!matchesSearch) return false;
      }

      // Hashtag filter
      if (selectedHashtags.length > 0) {
        const hasSelectedHashtag = selectedHashtags.some(selectedTag => 
          post.hashtags?.includes(selectedTag)
        );
        if (!hasSelectedHashtag) return false;
      }

      // Content type filter
      if (contentFilter !== 'all') {
        if (contentFilter === 'images' && post.type !== 'image') return false;
        if (contentFilter === 'videos' && post.type !== 'video') return false;
      }

      // Author filter
      if (authorFilter !== 'all') {
        if (authorFilter === 'influencers' && !post.author.isInfluencer) return false;
        if (authorFilter === 'brands' && !post.author.isBrand) return false;
        if (authorFilter === 'users' && (post.author.isInfluencer || post.author.isBrand)) return false;
      }

      return true;
    });
  }, [searchQuery, selectedHashtags, contentFilter, authorFilter]);

  // Sort posts
  const sortedPosts = useMemo(() => {
    const posts = [...filteredPosts];
    
    switch (sortBy) {
      case 'popular':
        return posts.sort((a, b) => b.engagement.likes - a.engagement.likes);
      case 'trending':
        return posts.sort((a, b) => 
          (b.engagement.likes + b.engagement.comments * 2 + b.engagement.shares * 3) -
          (a.engagement.likes + a.engagement.comments * 2 + a.engagement.shares * 3)
        );
      case 'recent':
      default:
        return posts; // Already sorted by recency
    }
  }, [filteredPosts, sortBy]);

  const handleToggleLike = (postId: string) => {
    // Guests cannot like posts
    if (isGuest) {
      toast.error('🔒 Sign up to like posts', {
        description: 'Create an account to interact with the community',
        action: onUpgrade ? {
          label: 'Sign Up',
          onClick: onUpgrade,
        } : undefined,
      });
      return;
    }
    
    setLikedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
    toast.success(likedPosts.includes(postId) ? 'Like removed' : 'Post liked!');
  };

  const handleSharePost = (postId: string) => {
    toast.success('Link copied to clipboard!');
  };

  const handleFollowInfluencer = (influencerId: string) => {
    // Guests cannot follow
    if (isGuest) {
      toast.error('🔒 Sign up to follow creators', {
        description: 'Create an account to follow your favorite creators',
        action: onUpgrade ? {
          label: 'Sign Up',
          onClick: onUpgrade,
        } : undefined,
      });
      return;
    }
    
    setFollowedInfluencers(prev =>
      prev.includes(influencerId)
        ? prev.filter(id => id !== influencerId)
        : [...prev, influencerId]
    );
    const isFollowing = followedInfluencers.includes(influencerId);
    toast.success(isFollowing ? 'Unfollowed' : 'Following!');
  };

  const toggleHashtag = (hashtag: string) => {
    setSelectedHashtags(prev =>
      prev.includes(hashtag)
        ? prev.filter(tag => tag !== hashtag)
        : [...prev, hashtag]
    );
  };

  const addToSearchHistory = (term: string) => {
    if (term && !searchHistory.includes(term)) {
      setSearchHistory(prev => [term, ...prev].slice(0, 10));
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value && value.length > 2) {
      addToSearchHistory(value);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedHashtags([]);
    setContentFilter('all');
    setAuthorFilter('all');
    setSortBy('recent');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedHashtags.length > 0) count += selectedHashtags.length;
    if (contentFilter !== 'all') count += 1;
    if (authorFilter !== 'all') count += 1;
    if (sortBy !== 'recent') count += 1;
    return count;
  };

  const renderPostCard = (post: Post) => (
    <Card 
      key={post.id} 
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onViewPost(post.id)}
    >
      <CardContent className="p-0">
        {/* Author Header */}
        <div className="flex items-center gap-3 p-4">
          <Avatar 
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              if (post.author.isBrand) {
                onViewBrand(post.id);
              } else if (post.author.isInfluencer) {
                onViewInfluencer(post.id);
              }
            }}
          >
            <AvatarImage src={post.author.avatar} />
            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{post.author.name}</span>
              {post.author.verified && <Verified className="w-4 h-4 text-blue-500" />}
              {post.author.isBrand && <Badge variant="secondary" className="text-xs">Brand</Badge>}
              {post.author.isInfluencer && <Badge variant="default" className="text-xs bg-[#00B4D8]">Creator</Badge>}
            </div>
            <div className="text-sm text-muted-foreground">{post.author.username} • {post.timestamp}</div>
          </div>
          <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>

        {/* Media */}
        <div className="relative">
          <ImageWithFallback
            src={post.content.media}
            alt="Post"
            className="w-full aspect-square object-cover"
          />
          {post.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                <Play className="w-8 h-8 text-black ml-1" />
              </div>
            </div>
          )}
        </div>

        {/* Engagement */}
        <div className="p-4">
          <div className="flex items-center gap-4 mb-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleLike(post.id);
              }}
            >
              <Heart 
                className={`w-5 h-5 ${
                  likedPosts.includes(post.id) 
                    ? 'fill-red-500 text-red-500' 
                    : ''
                }`} 
              />
              <span className="text-sm">{post.engagement.likes}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">{post.engagement.comments}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2"
              onClick={(e) => {
                e.stopPropagation();
                handleSharePost(post.id);
              }}
            >
              <Share className="w-5 h-5" />
              <span className="text-sm">{post.engagement.shares}</span>
            </Button>
          </div>

          {/* Caption */}
          <p className="text-sm mb-2">
            <span className="font-medium">{post.author.name}</span> {post.content.caption}
          </p>

          {/* Hashtags */}
          {post.hashtags && post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {post.hashtags.map((tag, idx) => (
                <Badge 
                  key={idx} 
                  variant="secondary" 
                  className="text-xs cursor-pointer hover:bg-[#00B4D8] hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleHashtag(tag);
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Products */}
          {post.content.products && post.content.products.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {post.content.products.map((product, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  <ShoppingBag className="w-3 h-3 mr-1" />
                  {product}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderCampaignCard = (campaign: BrandCampaignDto) => (
    <Card key={campaign.campaignId} className="overflow-hidden mb-4">
      <div className="relative">
        <ImageWithFallback
          src={campaign.campaignImageUrl || ''}
          alt={campaign.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-primary text-white">
            {campaign.featured ? 'Featured Campaign' : 'Active Campaign'}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-white/90">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(campaign.endDate).toLocaleDateString()}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <ImageWithFallback
            src={campaign.brand?.logoUrl || ''}
            alt={campaign.brand?.brandName || 'Brand'}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">{campaign.title}</h3>
              <Verified className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-sm text-muted-foreground">{campaign.brand?.brandName || 'Brand'}</p>
          </div>
        </div>

        <p className="text-sm mb-4">{campaign.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-secondary/20 rounded-lg">
            <div className="text-lg font-semibold text-primary">{campaign.participantCount.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Participants</div>
          </div>
          <div className="text-center p-3 bg-secondary/20 rounded-lg">
            <div className="text-lg font-semibold text-green-600">{campaign.totalEngagement.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Total Engagement</div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-muted-foreground" />
            <span 
              className="text-sm font-medium cursor-pointer hover:text-[#00B4D8]"
              onClick={() => {
                setSearchQuery(campaign.hashtag || '');
                setActiveTab('following');
              }}
            >
              {campaign.hashtag}
            </span>
          </div>
          {campaign.prize && (
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-sm">{campaign.prize}</span>
            </div>
          )}
        </div>

        <Button 
          className="w-full bg-[#00B4D8] hover:bg-[#00B4D8]/90"
          onClick={() => onViewCampaign(campaign.id)}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View Campaign
        </Button>
      </CardContent>
    </Card>
  );

  const renderInfluencerCard = (influencer: CreatorStationDto, index: number) => (
    <Card 
      key={influencer.stationId} 
      className="p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onViewInfluencer(influencer.stationId)}
    >
      <div className="flex items-center gap-3">
        {/* Rank Badge */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
          index === 0 ? 'bg-yellow-500 text-white' :
          index === 1 ? 'bg-gray-300 text-gray-700' :
          index === 2 ? 'bg-orange-400 text-white' :
          'bg-secondary text-muted-foreground'
        }`}>
          {index + 1}
        </div>

        <Avatar>
          <AvatarImage src={influencer.profileImageUrl || ''} />
          <AvatarFallback>{influencer.stationName?.[0] || 'U'}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">{influencer.stationName}</span>
            {influencer.isPublished && <Verified className="w-4 h-4 text-blue-500" />}
          </div>
          <div className="text-sm text-muted-foreground">
            {influencer.followersCount.toLocaleString()} followers
          </div>
        </div>

        <Button
          variant={influencer.isFollowedByCurrentUser ? "outline" : "default"}
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleFollowInfluencer(influencer.stationId);
          }}
          className={!influencer.isFollowedByCurrentUser ? 'bg-[#00B4D8] hover:bg-[#00B4D8]/90' : ''}
        >
          {influencer.isFollowedByCurrentUser ? 'Following' : 'Follow'}
        </Button>
      </div>
    </Card>
  );

  // Render a trending hashtag from the API stats
  const renderTrendingHashtag = (hashtag: string, index: number) => (
    <Card 
      key={hashtag} 
      className="p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => {
        setSearchQuery(hashtag);
        setActiveTab('following');
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Hash className="w-5 h-5 text-primary" />
          <span className="font-medium">{hashtag.startsWith('#') ? hashtag : `#${hashtag}`}</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp className="w-4 h-4 text-green-500" />
        </div>
      </div>
      
      <div className="text-sm">
        <Badge variant="outline" className="text-xs">
          Trending #{index + 1}
        </Badge>
      </div>
    </Card>
  );

  // Render a brand/station card from API data
  const renderStationCard = (station: CreatorStationDto) => (
    <Card 
      key={station.stationId} 
      className="p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onViewBrand(station.stationId)}
    >
      <div className="flex items-start gap-3 mb-3">
        <ImageWithFallback
          src={station.profileImageUrl || ''}
          alt={station.stationName}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium">{station.stationName}</h4>
            {station.isPublished && <Verified className="w-4 h-4 text-blue-500" />}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {station.bio || station.description || 'No description'}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div>
          <div className="font-semibold">{station.followersCount.toLocaleString()}</div>
          <div className="text-muted-foreground text-xs">Followers</div>
        </div>
        <div>
          <div className="font-semibold">{station.totalPosts}</div>
          <div className="text-muted-foreground text-xs">Posts</div>
        </div>
        <div>
          <div className="font-semibold">{station.totalLikes.toLocaleString()}</div>
          <div className="text-muted-foreground text-xs">Likes</div>
        </div>
      </div>
    </Card>
  );

  const renderAdvancedSearchSheet = () => (
    <Sheet open={showAdvancedSearch} onOpenChange={setShowAdvancedSearch}>
      <SheetContent side="left" className="w-[320px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#00B4D8]" />
            Advanced Search
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          <div className="space-y-6">
            {/* Sort By */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#00B4D8]" />
                Sort By
              </h4>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Most Recent
                    </div>
                  </SelectItem>
                  <SelectItem value="popular">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Most Popular
                    </div>
                  </SelectItem>
                  <SelectItem value="trending">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4" />
                      Trending
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Content Type */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#00B4D8]" />
                Content Type
              </h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={contentFilter === 'all'}
                    onCheckedChange={() => setContentFilter('all')}
                  />
                  <span className="text-sm">All Content</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={contentFilter === 'images'}
                    onCheckedChange={() => setContentFilter('images')}
                  />
                  <span className="text-sm">Images Only</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={contentFilter === 'videos'}
                    onCheckedChange={() => setContentFilter('videos')}
                  />
                  <span className="text-sm">Videos Only</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Author Type */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-[#00B4D8]" />
                Posted By
              </h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={authorFilter === 'all'}
                    onCheckedChange={() => setAuthorFilter('all')}
                  />
                  <span className="text-sm">Everyone</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={authorFilter === 'influencers'}
                    onCheckedChange={() => setAuthorFilter('influencers')}
                  />
                  <span className="text-sm flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Creators Only
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={authorFilter === 'brands'}
                    onCheckedChange={() => setAuthorFilter('brands')}
                  />
                  <span className="text-sm flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    Brands Only
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={authorFilter === 'users'}
                    onCheckedChange={() => setAuthorFilter('users')}
                  />
                  <span className="text-sm">Community Users</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Popular Hashtags */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Hash className="w-4 h-4 text-[#00B4D8]" />
                Popular Hashtags
              </h4>
              <ScrollArea className="h-48">
                <div className="space-y-2 pr-4">
                  {allHashtags.map((tag) => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedHashtags.includes(tag)}
                        onCheckedChange={() => toggleHashtag(tag)}
                      />
                      <span className="text-sm">{tag}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Clear Filters */}
            {getActiveFilterCount() > 0 && (
              <>
                <Separator />
                <Button 
                  variant="outline" 
                  onClick={clearAllFilters} 
                  className="w-full border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear All Filters
                </Button>
              </>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="min-h-screen bg-background relative" dir={direction}>
      {/* Floating Create Post Button - Pro users only */}
      {isPro && (
        <Button
          size="lg"
          className={`fixed bottom-20 ${isRTL ? 'left-4' : 'right-4'} rounded-full w-14 h-14 shadow-lg z-20 bg-[#00B4D8] hover:bg-[#00B4D8]/90`}
          onClick={onCreatePost}
        >
          <Plus className="w-6 h-6" />
        </Button>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
        {/* Fixed Search Section - Below Top Bar */}
        <div className="fixed top-16 left-0 right-0 bg-background border-b border-border z-10 max-w-md mx-auto">
          {/* Search Bar */}
          <div className="px-4 pt-4 pb-3 space-y-3">
            <div className="relative">
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4`} />
              <Input
                placeholder={t('community.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className={isRTL ? 'pr-10 pl-10' : 'pl-10 pr-10'}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Quick Filters & Advanced Search */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedSearch(true)}
                className="flex-shrink-0"
              >
                <SlidersHorizontal className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                {t('community.filters')}
                {getActiveFilterCount() > 0 && (
                  <Badge className={`${isRTL ? 'mr-2' : 'ml-2'} bg-[#FF6B35]`}>{getActiveFilterCount()}</Badge>
                )}
              </Button>

              {/* Quick Sort */}
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className="w-[130px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">{t('community.recent')}</SelectItem>
                  <SelectItem value="popular">{t('community.popular')}</SelectItem>
                  <SelectItem value="trending">{t('community.trending')}</SelectItem>
                </SelectContent>
              </Select>

              {/* Search History */}
              {!searchQuery && searchHistory.length > 0 && (
                <>
                  {searchHistory.slice(0, 3).map((term, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="cursor-pointer hover:bg-[#00B4D8] hover:text-white flex-shrink-0"
                      onClick={() => setSearchQuery(term)}
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      {term}
                    </Badge>
                  ))}
                </>
              )}
            </div>

            {/* Active Hashtag Filters */}
            {selectedHashtags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedHashtags.map((tag) => (
                  <Badge
                    key={tag}
                    className="bg-[#00B4D8] hover:bg-[#00B4D8]/90 gap-1"
                  >
                    {tag}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => toggleHashtag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <TabsList className="grid w-full grid-cols-4 px-4">
            <TabsTrigger value="following">Following</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="brands">Brands</TabsTrigger>
            <TabsTrigger value="influencers">Creators</TabsTrigger>
          </TabsList>
        </div>

        {/* Scrollable Content Area - with hidden scrollbar */}
        <div className="pt-[155px] overflow-y-auto scrollbar-hide h-full">
          <TabsContent value="following" className="mt-0 px-4 pt-0 pb-4 space-y-4">
            {/* Show search results or regular feed */}
            {(searchQuery || selectedHashtags.length > 0 || getActiveFilterCount() > 0) ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">
                    {sortedPosts.length} {sortedPosts.length === 1 ? 'result' : 'results'} found
                  </h3>
                  {getActiveFilterCount() > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-[#FF6B35]"
                    >
                      Clear all
                    </Button>
                  )}
                </div>
                
                {sortedPosts.length > 0 ? (
                  sortedPosts.map(renderPostCard)
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Search className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <h3 className="text-lg font-medium mb-2">No results found</h3>
                    <p className="text-sm mb-4">Try different keywords or filters</p>
                    <Button onClick={clearAllFilters} variant="outline">
                      Clear Filters
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Community Stats */}
                {apiStats && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-semibold">{apiStats.totalMembers.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Total Members</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-green-600">{apiStats.activeToday.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Active Today</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-blue-600">{apiStats.postsToday.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Posts Today</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Featured Campaigns */}
                {apiCampaigns.filter(c => c.featured).length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Flame className="w-5 h-5 text-orange-500" />
                      Featured Campaigns
                    </h3>
                    {apiCampaigns.filter(c => c.featured).map(renderCampaignCard)}
                  </div>
                )}

                {/* Regular Posts */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Recent Posts</h3>
                  {posts.length > 0 ? posts.map(renderPostCard) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="trending" className="mt-0 px-4 pt-0 pb-4 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Trending Topics
              </h3>
              <div className="grid gap-4">
                {apiStats?.topHashtags && apiStats.topHashtags.length > 0 ? (
                  apiStats.topHashtags.map((tag, index) => renderTrendingHashtag(tag, index))
                ) : (
                  <Card>
                    <CardContent className="p-4 text-center text-muted-foreground">
                      No trending topics yet
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Active Campaigns
              </h3>
              {apiCampaigns.filter(c => c.isActive).length > 0 ? (
                apiCampaigns.filter(c => c.isActive).map(renderCampaignCard)
              ) : (
                <Card>
                  <CardContent className="p-4 text-center text-muted-foreground">
                    No active campaigns
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="brands" className="mt-0 px-4 pt-0 pb-4 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Creator Stations
              </h3>
              <div className="grid gap-4">
                {apiStations.length > 0 ? (
                  apiStations.map(renderStationCard)
                ) : (
                  <Card>
                    <CardContent className="p-4 text-center text-muted-foreground">
                      No stations yet
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="influencers" className="mt-0 px-4 pt-0 pb-4 space-y-6">
            {/* Create/View Station CTA - Pro users only */}
            {isPro && userHasStation ? (
              <Card className="border-green-500/20 bg-green-500/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                        <Crown className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Your Creator Station</h4>
                        <p className="text-sm text-muted-foreground">
                          Manage your content and followers
                        </p>
                      </div>
                    </div>
                    <Button onClick={onViewStation} size="sm" className="bg-[#00B4D8] hover:bg-[#00B4D8]/90">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : isPro ? (
              <Card className="border-[#00B4D8]/20 bg-[#00B4D8]/5">
                <CardContent className="p-4 text-center">
                  <Crown className="w-10 h-10 mx-auto mb-3 text-[#00B4D8]\" />
                  <h4 className="font-semibold mb-2">Become a SkinPAI Creator</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Share your skincare expertise and build your community. One station per account.
                  </p>
                  <Button onClick={onCreateStation} className="bg-[#00B4D8] hover:bg-[#00B4D8]/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your Station
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-amber-500/20 bg-amber-500/5">
                <CardContent className="p-4 text-center">
                  <Crown className="w-10 h-10 mx-auto mb-3 text-amber-500" />
                  <h4 className="font-semibold mb-2">Creator Stations are Pro-Exclusive</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Upgrade to Pro to create your own station and share your skincare expertise with the community.
                  </p>
                  <Button onClick={onUpgrade} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Upgrade to Pro
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Leaderboard */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Creator Leaderboard
              </h3>
              <div className="space-y-3">
                {apiInfluencers.length > 0 ? (
                  apiInfluencers.slice(0, 5).map((influencer, index) => renderInfluencerCard(influencer, index))
                ) : (
                  <Card>
                    <CardContent className="p-4 text-center text-muted-foreground">
                      No influencers yet
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Featured Stations */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Featured Stations
              </h3>
              <div className="space-y-4">
                {apiStations.length > 0 ? (
                  apiStations.filter(s => s.isPublished).map((station) => (
                    <Card key={station.stationId} className="overflow-hidden">
                      <div className="relative">
                        <ImageWithFallback
                          src={station.bannerImageUrl || station.profileImageUrl || ''}
                          alt={station.stationName}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 left-3 text-white">
                          <h4 className="font-semibold">{station.stationName}</h4>
                          <p className="text-sm opacity-90">{station.bio || station.description || ''}</p>
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex gap-4 text-sm">
                            <div>
                              <span className="font-semibold">{station.followersCount?.toLocaleString() || '0'}</span>
                              <span className="text-muted-foreground ml-1">subscribers</span>
                            </div>
                            <div>
                              <span className="font-semibold">{station.totalPosts || 0}</span>
                              <span className="text-muted-foreground ml-1">posts</span>
                            </div>
                          </div>
                          <Button 
                            size="sm"
                            className="bg-[#00B4D8] hover:bg-[#00B4D8]/90"
                            onClick={() => onViewInfluencer(station.stationId)}
                          >
                            Visit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-4 text-center text-muted-foreground">
                      No featured stations yet
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Advanced Search Sheet */}
      {renderAdvancedSearchSheet()}
    </div>
  );
}