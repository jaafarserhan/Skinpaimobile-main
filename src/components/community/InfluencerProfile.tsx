import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  UserPlus, UserCheck, MessageCircle, Share2, MapPin,
  Calendar, Award, Crown, Verified, ExternalLink, 
  Heart, TrendingUp, Users, Star
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

interface InfluencerProfileProps {
  influencerId: string;
  onBack: () => void;
  onViewPost: (postId: string) => void;
}

export default function InfluencerProfile({ influencerId, onBack, onViewPost }: InfluencerProfileProps) {
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock influencer data
  const influencer = {
    id: influencerId,
    name: 'Sarah Beauty',
    username: '@sarahbeauty',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b7a1?w=150&h=150&fit=crop',
    cover: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=300&fit=crop',
    verified: true,
    rank: 1,
    bio: '✨ Skincare enthusiast & certified esthetician 💆‍♀️ Helping you achieve your best skin 🌟 DM for collabs',
    location: 'Los Angeles, CA',
    joinedDate: 'January 2022',
    stats: {
      followers: 234500,
      following: 892,
      posts: 1247,
      likes: 3450000,
    },
    specialties: ['Anti-aging', 'Acne Treatment', 'Natural Skincare'],
    badges: [
      { icon: '👑', name: 'Top Influencer' },
      { icon: '🔥', name: '100 Day Streak' },
      { icon: '⭐', name: 'Expert Verified' },
      { icon: '💎', name: 'Premium Creator' },
    ],
    achievements: [
      { title: 'Most Helpful', count: 500 },
      { title: 'Community Hero', count: 1 },
      { title: 'Trending Posts', count: 50 },
    ],
  };

  const posts = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
      likes: 1247,
      comments: 89,
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop',
      likes: 2134,
      comments: 156,
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop',
      likes: 1876,
      comments: 203,
    },
    {
      id: '4',
      image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop',
      likes: 1543,
      comments: 98,
    },
    {
      id: '5',
      image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=400&fit=crop',
      likes: 1987,
      comments: 134,
    },
    {
      id: '6',
      image: 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=400&h=400&fit=crop',
      likes: 2301,
      comments: 187,
    },
  ];

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast.success(isFollowing ? `Unfollowed ${influencer.name}` : `Following ${influencer.name}!`);
  };

  const handleMessage = () => {
    toast.success('Opening messages...');
  };

  const handleShare = () => {
    toast.success('Profile link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Cover Image */}
      <div className="relative h-32">
        <ImageWithFallback
          src={influencer.cover}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="px-4 -mt-16 relative z-10 space-y-4">
        {/* Profile Header */}
        <div className="flex items-end justify-between">
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-background">
              <AvatarImage src={influencer.avatar} />
              <AvatarFallback>{influencer.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {influencer.rank <= 3 && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-background">
                <Crown className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          <div className="flex gap-2 pb-2">
            <Button 
              variant={isFollowing ? 'outline' : 'default'}
              size="sm"
              onClick={handleFollow}
            >
              {isFollowing ? (
                <><UserCheck className="w-4 h-4 mr-2" /> Following</>
              ) : (
                <><UserPlus className="w-4 h-4 mr-2" /> Follow</>
              )}
            </Button>
            <Button variant="outline" size="icon" onClick={handleMessage}>
              <MessageCircle className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Name & Bio */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold">{influencer.name}</h1>
            {influencer.verified && (
              <Verified className="w-5 h-5 text-blue-500" />
            )}
            <Badge variant="secondary">Rank #{influencer.rank}</Badge>
          </div>
          <p className="text-muted-foreground">{influencer.username}</p>
          <p className="mt-2">{influencer.bio}</p>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {influencer.location}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Joined {influencer.joinedDate}
          </div>
        </div>

        {/* Stats */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="font-bold">{(influencer.stats.posts).toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Posts</div>
              </div>
              <div>
                <div className="font-bold">{(influencer.stats.followers / 1000).toFixed(1)}K</div>
                <div className="text-xs text-muted-foreground">Followers</div>
              </div>
              <div>
                <div className="font-bold">{influencer.stats.following.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Following</div>
              </div>
              <div>
                <div className="font-bold">{(influencer.stats.likes / 1000000).toFixed(1)}M</div>
                <div className="text-xs text-muted-foreground">Likes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Specialties */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {influencer.specialties.map((specialty, index) => (
                <Badge key={index} variant="secondary">
                  {specialty}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Badges & Achievements</h3>
            <div className="grid grid-cols-4 gap-3">
              {influencer.badges.map((badge, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl mb-1">{badge.icon}</div>
                  <p className="text-xs text-muted-foreground">{badge.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Achievements</h3>
            <div className="space-y-2">
              {influencer.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-secondary/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="text-sm">{achievement.title}</span>
                  </div>
                  <Badge variant="outline">{achievement.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Posts Grid */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="liked">Liked</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-4">
            <div className="grid grid-cols-3 gap-1">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="relative aspect-square cursor-pointer group"
                  onClick={() => onViewPost(post.id)}
                >
                  <ImageWithFallback
                    src={post.image}
                    alt="Post"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
                    <div className="flex items-center gap-1">
                      <Heart className="w-5 h-5" />
                      <span className="text-sm">{post.likes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">{post.comments}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="liked" className="mt-4">
            <div className="text-center py-12 text-muted-foreground">
              <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Liked posts are private</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}