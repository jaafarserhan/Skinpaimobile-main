import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  User, Mail, Bell, Moon, Sun, Lock, CreditCard, 
  HelpCircle, LogOut, Camera, Shield, Globe, 
  Smartphone, Volume2, Eye, EyeOff, Crown, 
  Sparkles, Settings as SettingsIcon, ChevronRight, Wallet, Zap, Infinity, Heart
} from 'lucide-react';
import { User as UserType } from '../types';
import { toast } from 'sonner@2.0.3';
import AddFundsModal from './AddFundsModal';
import { useAppTranslation } from '../hooks/useAppTranslation';

interface ProfileSettingsProps {
  user: UserType;
  onNavigate: (screen: string) => void;
  onUpdateUser: (user: UserType) => void;
  onLogout: () => void;
}

export default function ProfileSettings({ user, onNavigate, onUpdateUser, onLogout }: ProfileSettingsProps) {
  const { t, isRTL, direction, flexDir, textAlign } = useAppTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [profileImage, setProfileImage] = useState(user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`);
  const [notifications, setNotifications] = useState({
    scanReminders: true,
    routineReminders: true,
    productDeals: true,
    communityUpdates: false,
    influencerPosts: true,
    emailNotifications: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showActivity: true,
    allowMessages: true,
  });

  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setProfileImage(imageUrl);
        onUpdateUser({
          ...user,
          profileImage: imageUrl,
        });
        toast.success('Profile image updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    onUpdateUser({
      ...user,
      name,
      email,
    });
    toast.success('Profile updated successfully!');
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    toast.success(darkMode ? 'Light mode enabled' : 'Dark mode enabled');
  };

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success('Notification settings updated');
  };

  const handlePrivacyToggle = (key: keyof typeof privacy) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success('Privacy settings updated');
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      onLogout();
      toast.success('Logged out successfully');
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6" dir={direction}>
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className={`flex items-center gap-4 ${flexDir()}`}>
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profileImage} />
                <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <input
                type="file"
                id="profile-image-upload"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button 
                className={`absolute bottom-0 ${isRTL ? 'left-0' : 'right-0'} p-1.5 bg-primary rounded-full text-white hover:bg-primary/90 transition-colors`}
                onClick={() => document.getElementById('profile-image-upload')?.click()}
              >
                <Camera className="w-3 h-3" />
              </button>
            </div>
            <div className={`flex-1 ${textAlign()}`}>
              <h2 className="text-xl font-semibold">{user.name || t('profile.guestUser')}</h2>
              <p className="text-sm text-muted-foreground">{user.email || 'guest@skinpai.app'}</p>
              <div className={`flex gap-2 mt-2 ${flexDir()}`}>
                <Badge variant={user.type === 'pro' ? 'default' : user.type === 'member' ? 'default' : 'secondary'} className={user.type === 'pro' ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] border-0' : ''}>
                  {user.type === 'pro' ? (
                    <><Crown className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} /> {t('profile.pro')}</>
                  ) : user.type === 'member' ? (
                    <><Crown className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} /> {t('profile.member')}</>
                  ) : (
                    t('profile.guest')
                  )}
                </Badge>
                {user.type === 'guest' && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-6"
                    onClick={() => onNavigate('upgrade')}
                  >
                    <Sparkles className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                    {t('profile.upgrade')}
                  </Button>
                )}
                {user.type === 'pro' && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-6"
                    onClick={() => onNavigate('pro-dashboard')}
                  >
                    {t('dashboard.title')}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account">{t('profile.account')}</TabsTrigger>
          <TabsTrigger value="notifications">{t('profile.notifications')}</TabsTrigger>
          <TabsTrigger value="privacy">{t('profile.privacy')}</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-4">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              <Button onClick={handleSaveProfile} className="w-full">
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Membership & Wallet Section */}
          {user.type === 'pro' ? (
            <Card className="border-[#FF6B35]/30 bg-gradient-to-r from-[#FF6B35]/10 to-[#FF8C5A]/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-[#FF6B35]" />
                    Pro Membership
                  </CardTitle>
                  <Badge className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-white border-0">
                    <Sparkles className="w-3 h-3 mr-1" />
                    PRO
                  </Badge>
                </div>
                <CardDescription>You have unlimited access to all features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-background/50 rounded-lg border border-[#FF6B35]/20">
                    <div className="flex items-center gap-2 mb-1">
                      <Infinity className="w-4 h-4 text-[#FF6B35]" />
                      <span className="text-xs text-muted-foreground">Scans</span>
                    </div>
                    <span className="text-xl font-bold">Unlimited</span>
                  </div>
                  <div className="p-3 bg-background/50 rounded-lg border border-[#FF6B35]/20">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-4 h-4 text-[#FF6B35]" />
                      <span className="text-xs text-muted-foreground">Status</span>
                    </div>
                    <span className="text-sm font-bold text-green-600">Active</span>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subscription</span>
                    <span className="font-medium">Pro Plan</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next billing</span>
                    <span className="font-medium">{user.subscriptionEndDate ? new Date(user.subscriptionEndDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => toast.info('Manage subscription coming soon!')}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Manage Subscription
                </Button>
              </CardContent>
            </Card>
          ) : user.type === 'member' ? (
            <Card className="border-[#006D77]/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-[#006D77]" />
                    Member Plan
                  </CardTitle>
                  <Badge className="bg-[#006D77] text-white">MEMBER</Badge>
                </div>
                <CardDescription>Upgrade to Pro for unlimited access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-secondary/20 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Daily Scans</p>
                    <p className="text-xl font-bold">{user.scansToday}/{user.maxScans}</p>
                  </div>
                  <div className="p-3 bg-secondary/20 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <p className="text-sm font-bold text-green-600">Active</p>
                  </div>
                </div>
                <Separator />
                <Button 
                  className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] hover:from-[#FF6B35]/90 hover:to-[#FF8C5A]/90"
                  onClick={() => onNavigate('upgrade')}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-[#00B4D8]/30 bg-gradient-to-r from-[#00B4D8]/10 to-[#006D77]/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-[#00B4D8]" />
                  Unlock Premium Features
                </CardTitle>
                <CardDescription>Choose your plan and get started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Infinity className="w-4 h-4 text-[#00B4D8] mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Unlimited scans with Pro</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-[#00B4D8] mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Advanced progress tracking</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Crown className="w-4 h-4 text-[#00B4D8] mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Create your Creator Station (Pro)</span>
                  </div>
                </div>
                <Separator />
                <Button 
                  className="w-full bg-gradient-to-r from-[#00B4D8] to-[#006D77] hover:from-[#00B4D8]/90 hover:to-[#006D77]/90"
                  onClick={() => onNavigate('upgrade')}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  View Plans
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Wallet Section */}
          <Card className="border-[#00B4D8]/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-[#00B4D8]" />
                  SkinPAI Wallet
                </CardTitle>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setShowAddFundsModal(true)}
                >
                  Add Funds
                </Button>
              </div>
              <CardDescription>Manage your wallet balance and transactions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-[#00B4D8]/10 to-[#006D77]/10 rounded-lg border border-[#00B4D8]/20">
                <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
                <p className="text-3xl font-bold text-[#006D77]">${(user.walletBalance || 0).toFixed(2)}</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-between"
                  onClick={() => toast.info('Transaction history coming soon!')}
                >
                  <span>Transaction History</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-between"
                  onClick={() => toast.info('Payment methods coming soon!')}
                >
                  <span>Payment Methods</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Saved Items / Favorites */}
          <Card className="border-[#FF6B35]/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#FF6B35]" />
                Saved Items
              </CardTitle>
              <CardDescription>Your favorite products and routines</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full justify-between hover:bg-[#FF6B35]/10"
                onClick={() => onNavigate('favorites')}
              >
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#FF6B35]" />
                  <span>View Saved Products</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Skin Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Skin Profile
              </CardTitle>
              <CardDescription>
                Your personalized skin information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.skinProfile ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-secondary/20 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Skin Type</p>
                      <p className="font-medium capitalize">{user.skinProfile.skinType || 'N/A'}</p>
                    </div>
                    <div className="p-3 bg-secondary/20 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Main Concern</p>
                      <p className="font-medium capitalize">{user.skinProfile.skinConcerns || 'N/A'}</p>
                    </div>
                    <div className="p-3 bg-secondary/20 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Routine Level</p>
                      <p className="font-medium capitalize">{user.skinProfile.currentRoutine || 'N/A'}</p>
                    </div>
                    <div className="p-3 bg-secondary/20 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Sun Exposure</p>
                      <p className="font-medium capitalize">{user.skinProfile.sunExposure || 'N/A'}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => onNavigate('questionnaire')}
                  >
                    Update Skin Profile
                  </Button>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    Complete your skin profile for better recommendations
                  </p>
                  <Button 
                    className="w-full"
                    onClick={() => onNavigate('questionnaire')}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Complete Skin Profile
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Creator Station */}
          {user.hasStation ? (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-primary" />
                  My Creator Station
                </CardTitle>
                <CardDescription>
                  Manage your content and connect with your community
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">{user.stationData?.stationName}</p>
                      <p className="text-sm text-muted-foreground">@{user.stationData?.stationUsername}</p>
                    </div>
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center mt-3 pt-3 border-t border-primary/10">
                    <div>
                      <div className="font-semibold">0</div>
                      <div className="text-xs text-muted-foreground">Posts</div>
                    </div>
                    <div>
                      <div className="font-semibold">0</div>
                      <div className="text-xs text-muted-foreground">Followers</div>
                    </div>
                    <div>
                      <div className="font-semibold">0</div>
                      <div className="text-xs text-muted-foreground">Likes</div>
                    </div>
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => onNavigate('station-view')}
                >
                  View My Station
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => toast.info('Station editing coming soon!')}
                >
                  <SettingsIcon className="w-4 h-4 mr-2" />
                  Station Settings
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Become a Creator
                </CardTitle>
                <CardDescription>
                  Share your skincare expertise and build your community
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>Create your own content station</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>Build a following and earn badges</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>Collaborate with brands</span>
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => onNavigate('create-station')}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Create Your Station
                </Button>
              </CardContent>
            </Card>
          )}

          {/* App Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5" />
                App Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">Toggle dark theme</p>
                  </div>
                </div>
                <Switch checked={darkMode} onCheckedChange={handleToggleDarkMode} />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5" />
                  <div>
                    <p className="font-medium">Language</p>
                    <p className="text-sm text-muted-foreground">English (US)</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Account Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Change Password
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>
              
              {user.type === 'member' && (
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Billing & Subscription
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
              
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => onNavigate('help')}
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  Help & Support
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>
              
              <Separator />
              
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Push Notifications
              </CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Scan Reminders</p>
                  <p className="text-sm text-muted-foreground">Daily skin scan notifications</p>
                </div>
                <Switch 
                  checked={notifications.scanReminders} 
                  onCheckedChange={() => handleNotificationToggle('scanReminders')} 
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Routine Reminders</p>
                  <p className="text-sm text-muted-foreground">Skincare routine alerts</p>
                </div>
                <Switch 
                  checked={notifications.routineReminders} 
                  onCheckedChange={() => handleNotificationToggle('routineReminders')} 
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Product Deals</p>
                  <p className="text-sm text-muted-foreground">Special offers and discounts</p>
                </div>
                <Switch 
                  checked={notifications.productDeals} 
                  onCheckedChange={() => handleNotificationToggle('productDeals')} 
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Community Updates</p>
                  <p className="text-sm text-muted-foreground">Likes, comments, and shares</p>
                </div>
                <Switch 
                  checked={notifications.communityUpdates} 
                  onCheckedChange={() => handleNotificationToggle('communityUpdates')} 
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Influencer Posts</p>
                  <p className="text-sm text-muted-foreground">New content from followed influencers</p>
                </div>
                <Switch 
                  checked={notifications.influencerPosts} 
                  onCheckedChange={() => handleNotificationToggle('influencerPosts')} 
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Updates</p>
                  <p className="text-sm text-muted-foreground">Weekly summaries and newsletters</p>
                </div>
                <Switch 
                  checked={notifications.emailNotifications} 
                  onCheckedChange={() => handleNotificationToggle('emailNotifications')} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Privacy Settings
              </CardTitle>
              <CardDescription>Control who can see your information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Profile Visibility</p>
                  <p className="text-sm text-muted-foreground">Make profile visible to others</p>
                </div>
                <Switch 
                  checked={privacy.profileVisible} 
                  onCheckedChange={() => handlePrivacyToggle('profileVisible')} 
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Activity</p>
                  <p className="text-sm text-muted-foreground">Display your skincare activity</p>
                </div>
                <Switch 
                  checked={privacy.showActivity} 
                  onCheckedChange={() => handlePrivacyToggle('showActivity')} 
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Allow Messages</p>
                  <p className="text-sm text-muted-foreground">Receive messages from other users</p>
                </div>
                <Switch 
                  checked={privacy.allowMessages} 
                  onCheckedChange={() => handlePrivacyToggle('allowMessages')} 
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Data & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-between">
                <span>Download Your Data</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="w-full justify-between">
                <span>Privacy Policy</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="w-full justify-between">
                <span>Terms of Service</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Separator />
              <Button variant="destructive" className="w-full">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Add Funds Modal */}
      <AddFundsModal
        open={showAddFundsModal}
        onOpenChange={setShowAddFundsModal}
        currentBalance={user.walletBalance || 0}
        onAddFunds={(amount) => {
          onUpdateUser({
            ...user,
            walletBalance: (user.walletBalance || 0) + amount,
          });
        }}
      />
    </div>
  );
}