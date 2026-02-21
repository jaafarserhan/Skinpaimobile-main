import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  Crown, TrendingUp, Users, Eye, Heart, MessageCircle, 
  DollarSign, BarChart3, Calendar, Award, Star, Zap,
  Video, Image as ImageIcon, FileText, Settings, 
  ArrowUpRight, ArrowDownRight, Radio, Target, Sparkles
} from 'lucide-react';
import { User, ScanResult } from '../types';

interface ProDashboardProps {
  user: User;
  scanHistory: ScanResult[];
  onNavigate: (screen: string) => void;
}

export default function ProDashboard({ user, scanHistory, onNavigate }: ProDashboardProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  // Mock analytics data - in a real app, this would come from backend
  const analytics = {
    stationViews: 12547,
    stationViewsGrowth: 23.5,
    followers: 3842,
    followersGrowth: 15.2,
    engagement: 8.7,
    engagementGrowth: 5.3,
    totalRevenue: 2847.50,
    revenueGrowth: 18.9,
    posts: 47,
    totalLikes: 18924,
    totalComments: 3421,
    avgEngagementRate: 8.7,
    topPerformingPosts: [
      { id: '1', title: 'Morning Skincare Routine 2024', views: 2341, likes: 456, comments: 89 },
      { id: '2', title: '5 Tips for Glowing Skin', views: 1987, likes: 398, comments: 72 },
      { id: '3', title: 'Product Review: Vitamin C Serum', views: 1654, likes: 312, comments: 58 },
    ]
  };

  const subscriptionInfo = {
    plan: 'Pro',
    monthlyPrice: 29.99,
    nextBillingDate: '2024-01-15',
    daysRemaining: 12,
    features: [
      'Unlimited Skin Scans',
      'Creator Station Access',
      'Advanced Analytics Dashboard',
      'Priority Support',
      'Ad-Free Experience',
      'Export Data & Reports',
      'Custom Branding',
      'Monetization Tools'
    ]
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Pro Header */}
      <Card className="bg-gradient-to-r from-[#00B4D8]/10 via-[#006D77]/10 to-[#003D5C]/10 border-[#00B4D8]/30">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00B4D8] to-[#006D77] rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Pro Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {user.name}!</p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-white border-0">
              <Sparkles className="w-3 h-3 mr-1" />
              PRO
            </Badge>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <div className="bg-background/50 p-3 rounded-lg border border-[#00B4D8]/20">
              <div className="flex items-center gap-2 mb-1">
                <Eye className="w-4 h-4 text-[#00B4D8]" />
                <span className="text-xs text-muted-foreground">Views</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold">{analytics.stationViews.toLocaleString()}</span>
                <span className="text-xs text-green-600 flex items-center">
                  <ArrowUpRight className="w-3 h-3" />
                  {analytics.stationViewsGrowth}%
                </span>
              </div>
            </div>

            <div className="bg-background/50 p-3 rounded-lg border border-[#00B4D8]/20">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-[#00B4D8]" />
                <span className="text-xs text-muted-foreground">Followers</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold">{analytics.followers.toLocaleString()}</span>
                <span className="text-xs text-green-600 flex items-center">
                  <ArrowUpRight className="w-3 h-3" />
                  {analytics.followersGrowth}%
                </span>
              </div>
            </div>

            <div className="bg-background/50 p-3 rounded-lg border border-[#00B4D8]/20">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-4 h-4 text-[#00B4D8]" />
                <span className="text-xs text-muted-foreground">Engagement</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold">{analytics.engagement}%</span>
                <span className="text-xs text-green-600 flex items-center">
                  <ArrowUpRight className="w-3 h-3" />
                  {analytics.engagementGrowth}%
                </span>
              </div>
            </div>

            <div className="bg-background/50 p-3 rounded-lg border border-[#00B4D8]/20">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-[#00B4D8]" />
                <span className="text-xs text-muted-foreground">Revenue</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold">${analytics.totalRevenue.toLocaleString()}</span>
                <span className="text-xs text-green-600 flex items-center">
                  <ArrowUpRight className="w-3 h-3" />
                  {analytics.revenueGrowth}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Status */}
      <Card className="border-[#FF6B35]/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-[#FF6B35]" />
              Pro Membership
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onNavigate('profile')}
            >
              Manage
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Next billing date</p>
                <p className="font-semibold">{subscriptionInfo.nextBillingDate}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Monthly plan</p>
                <p className="text-2xl font-bold text-[#006D77]">${subscriptionInfo.monthlyPrice}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Time remaining</span>
                <span className="text-sm font-medium">{subscriptionInfo.daysRemaining} days</span>
              </div>
              <Progress value={(subscriptionInfo.daysRemaining / 30) * 100} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {subscriptionInfo.features.slice(0, 4).map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <Zap className="w-3 h-3 text-[#00B4D8]" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted">
          <TabsTrigger value="analytics">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="content">
            <FileText className="w-4 h-4 mr-2" />
            Content
          </TabsTrigger>
          <TabsTrigger value="audience">
            <Users className="w-4 h-4 mr-2" />
            Audience
          </TabsTrigger>
        </TabsList>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4 mt-4">
          {/* Performance Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Performance Overview</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={timeRange === 'week' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimeRange('week')}
                  >
                    Week
                  </Button>
                  <Button
                    variant={timeRange === 'month' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimeRange('month')}
                  >
                    Month
                  </Button>
                  <Button
                    variant={timeRange === 'year' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimeRange('year')}
                  >
                    Year
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Total Posts</span>
                  </div>
                  <p className="text-2xl font-bold">{analytics.posts}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Total Likes</span>
                  </div>
                  <p className="text-2xl font-bold">{analytics.totalLikes.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Total Comments</span>
                  </div>
                  <p className="text-2xl font-bold">{analytics.totalComments.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Avg Engagement</span>
                  </div>
                  <p className="text-2xl font-bold">{analytics.avgEngagementRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Posts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Top Performing Posts
              </CardTitle>
              <CardDescription>Your best content this {timeRange}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.topPerformingPosts.map((post, idx) => (
                  <div key={post.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#00B4D8] to-[#006D77] rounded-full flex items-center justify-center text-white font-bold">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{post.title}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {post.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {post.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {post.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>Manage your posts and station content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start bg-[#00B4D8] hover:bg-[#00B4D8]/90"
                onClick={() => onNavigate('create-post')}
              >
                <FileText className="w-4 h-4 mr-2" />
                Create New Post
              </Button>
              
              <Button 
                variant="outline"
                className="w-full justify-start"
                onClick={() => onNavigate('station-view')}
              >
                <Radio className="w-4 h-4 mr-2" />
                Manage Station
              </Button>

              <Button 
                variant="outline"
                className="w-full justify-start"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Media Library
              </Button>

              <Button 
                variant="outline"
                className="w-full justify-start"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Content Calendar
              </Button>
            </CardContent>
          </Card>

          {/* Content Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Content Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#00B4D8]" />
                    <span className="text-sm">Image Posts</span>
                  </div>
                  <span className="font-semibold">32</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-[#00B4D8]" />
                    <span className="text-sm">Video Posts</span>
                  </div>
                  <span className="font-semibold">15</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#00B4D8]" />
                    <span className="text-sm">Article Posts</span>
                  </div>
                  <span className="font-semibold">8</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audience Tab */}
        <TabsContent value="audience" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Audience Insights</CardTitle>
              <CardDescription>Understand your followers better</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Follower Growth */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Follower Growth</span>
                    <span className="text-sm text-green-600 flex items-center">
                      <ArrowUpRight className="w-3 h-3" />
                      +{analytics.followersGrowth}% this {timeRange}
                    </span>
                  </div>
                  <Progress value={analytics.followersGrowth * 3} className="h-3" />
                </div>

                {/* Demographics */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Top Demographics</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">Ages 25-34</span>
                      <span className="text-sm font-semibold">45%</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">Ages 18-24</span>
                      <span className="text-sm font-semibold">32%</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">Ages 35-44</span>
                      <span className="text-sm font-semibold">18%</span>
                    </div>
                  </div>
                </div>

                {/* Peak Engagement Times */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Peak Engagement Times</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">Weekdays 6-9 PM</span>
                      <Badge variant="secondary">High</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">Weekends 12-3 PM</span>
                      <Badge variant="secondary">High</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">Mornings 7-9 AM</span>
                      <Badge variant="secondary">Medium</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2"
            onClick={() => onNavigate('community')}
          >
            <Users className="w-5 h-5 text-[#00B4D8]" />
            <span className="text-xs">Community</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2"
            onClick={() => onNavigate('camera')}
          >
            <Sparkles className="w-5 h-5 text-[#00B4D8]" />
            <span className="text-xs">New Scan</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2"
            onClick={() => onNavigate('products')}
          >
            <Award className="w-5 h-5 text-[#00B4D8]" />
            <span className="text-xs">Products</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2"
            onClick={() => onNavigate('profile')}
          >
            <Settings className="w-5 h-5 text-[#00B4D8]" />
            <span className="text-xs">Settings</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
