import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  Target, Calendar, Trophy, Hash, Users, TrendingUp,
  Share2, Heart, MessageCircle, CheckCircle, Verified,
  Gift, Sparkles, ExternalLink
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

interface CampaignDetailProps {
  campaignId: string;
  onBack: () => void;
}

export default function CampaignDetail({ campaignId, onBack }: CampaignDetailProps) {
  const [isParticipating, setIsParticipating] = useState(false);

  // Mock campaign data
  const campaign = {
    id: campaignId,
    title: '#GlowChallenge30',
    brandName: 'SkinGlow Naturals',
    brandLogo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop',
    campaignImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=400&fit=crop',
    description: 'Join our 30-day skincare challenge and transform your skin! Share your daily routine using our products and track your progress. Win amazing prizes!',
    longDescription: `
🌟 About the Challenge:
Transform your skin in just 30 days with our comprehensive skincare challenge. Follow the daily routine, track your progress, and share your journey with the community.

📅 How to Participate:
1. Purchase any SkinGlow product
2. Post daily updates with #GlowChallenge30
3. Tag @skinglow in your posts
4. Complete the 30-day journey

🎁 Prizes:
• Grand Prize: $500 product bundle + Feature on our website
• 5 Runner-ups: $100 gift cards
• 20 Participants: Free full-size products

📊 Requirements:
• Post at least 20 updates during the 30 days
• Use our hashtag and tag our brand
• Share honest reviews and results
    `,
    hashtag: '#GlowChallenge30',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    prize: 'Win up to $500 in products + Feature',
    participantCount: 15600,
    totalEngagement: 234000,
    featured: true,
    requirements: [
      'Must use SkinGlow products',
      'Post daily progress for 30 days',
      'Use campaign hashtag',
      'Tag brand in posts',
      'Share honest reviews',
    ],
    benefits: [
      'Free product samples',
      'Featured on brand page',
      'Exclusive discounts',
      'Community support',
      'Expert tips',
    ],
  };

  const topParticipants = [
    {
      id: '1',
      name: 'Sarah Beauty',
      username: '@sarahbeauty',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b7a1?w=150&h=150&fit=crop',
      posts: 28,
      engagement: 45600,
      verified: true,
    },
    {
      id: '2',
      name: 'Emma Glow',
      username: '@emmaglow',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      posts: 27,
      engagement: 38900,
      verified: false,
    },
    {
      id: '3',
      name: 'Jessica Lee',
      username: '@jessicalee',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop',
      posts: 26,
      engagement: 35200,
      verified: false,
    },
  ];

  const recentPosts = [
    {
      id: '1',
      author: 'Sarah Beauty',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b7a1?w=150&h=150&fit=crop',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
      caption: 'Day 28! My skin is glowing ✨ #GlowChallenge30',
      likes: 1247,
      comments: 89,
    },
    {
      id: '2',
      author: 'Emma Glow',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop',
      caption: 'Day 27 progress 💚 Love these products!',
      likes: 892,
      comments: 54,
    },
  ];

  const handleJoin = () => {
    setIsParticipating(!isParticipating);
    toast.success(isParticipating 
      ? 'Left campaign' 
      : `Joined ${campaign.title}! Start posting to participate! 🎉`
    );
  };

  const handleShare = () => {
    toast.success('Campaign link copied to clipboard!');
  };

  const daysLeft = Math.ceil((new Date(campaign.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const progress = ((30 - daysLeft) / 30) * 100;

  return (
    <div className="min-h-screen bg-background pb-4">
      {/* Hero Image */}
      <div className="relative h-48">
        <ImageWithFallback
          src={campaign.campaignImage}
          alt={campaign.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        {campaign.featured && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-primary text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              Featured Campaign
            </Badge>
          </div>
        )}
      </div>

      <div className="px-4 -mt-8 relative z-10 space-y-4">
        {/* Brand Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={campaign.brandLogo} />
                <AvatarFallback>{campaign.brandName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{campaign.brandName}</h3>
                  <Verified className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-sm text-muted-foreground">Verified Brand</p>
              </div>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>

            <h1 className="text-2xl font-bold mb-2">{campaign.title}</h1>
            <p className="text-muted-foreground mb-4">{campaign.description}</p>

            {/* Campaign Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-secondary/20 rounded-lg">
                <div className="text-xl font-bold text-primary">
                  {campaign.participantCount.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Participants</div>
              </div>
              <div className="text-center p-3 bg-secondary/20 rounded-lg">
                <div className="text-xl font-bold text-green-600">
                  {campaign.totalEngagement.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Total Engagement</div>
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Campaign Progress</span>
                <span className="font-medium">{daysLeft} days left</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Key Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Hash className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{campaign.hashtag}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>
                  {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span>{campaign.prize}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                className="flex-1"
                variant={isParticipating ? 'outline' : 'default'}
                onClick={handleJoin}
              >
                {isParticipating ? (
                  <><CheckCircle className="w-4 h-4 mr-2" /> Participating</>
                ) : (
                  <><Target className="w-4 h-4 mr-2" /> Join Campaign</>
                )}
              </Button>
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Details */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Campaign Details</h3>
            <div className="whitespace-pre-line text-sm text-muted-foreground">
              {campaign.longDescription}
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Requirements</h3>
            <div className="space-y-2">
              {campaign.requirements.map((req, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{req}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary" />
              Participant Benefits
            </h3>
            <div className="space-y-2">
              {campaign.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-accent-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Participants */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Top Participants
            </h3>
            <div className="space-y-3">
              {topParticipants.map((participant, index) => (
                <div key={participant.id} className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={participant.avatar} />
                      <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-1 -left-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{participant.name}</span>
                      {participant.verified && (
                        <Verified className="w-3 h-3 text-blue-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{participant.posts} posts</span>
                      <span>{(participant.engagement / 1000).toFixed(1)}K engagement</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Posts */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Recent Posts</h3>
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <div key={post.id} className="border rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={post.image}
                    alt="Post"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={post.avatar} />
                        <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{post.author}</span>
                    </div>
                    <p className="text-sm mb-2">{post.caption}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {post.likes.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {post.comments}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}