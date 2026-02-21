import React, { useState, useEffect, useRef } from 'react';
import api from './services/api';
import AuthScreen from './components/AuthScreen';
import CreateAccount from './components/CreateAccount';
import CameraInterface from './components/CameraInterface';
import ScanResults from './components/ScanResults';
import MemberDashboard from './components/MemberDashboard';
import ProDashboard from './components/ProDashboard';
import CommunityFeed from './components/CommunityFeed';
import ProductRecommendations from './components/ProductRecommendations';
import ProfileSettings from './components/ProfileSettings';
import Notifications from './components/Notifications';
import UpgradeMember from './components/UpgradeMember';
import UpgradeProMember from './components/UpgradeProMember';
import HelpSupport from './components/HelpSupport';
import SkinQuestionnaire from './components/SkinQuestionnaire';
import CreatePost from './components/community/CreatePost';
import PostDetail from './components/community/PostDetail';
import InfluencerProfile from './components/community/InfluencerProfile';
import BrandProfile from './components/community/BrandProfile';
import CampaignDetail from './components/community/CampaignDetail';
import CreateStation from './components/community/CreateStation';
import StationView from './components/community/StationView';
import Favorites from './components/Favorites';
import AppHeader from './components/navigation/AppHeader';
import BottomNav from './components/navigation/BottomNav';
import LiveChat from './components/LiveChat';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { useNavigation } from './hooks/useNavigation';
import { useSwipeNavigation } from './hooks/useSwipeNavigation';
import { useLocalStorage, STORAGE_KEYS, localStorageUtils } from './hooks/useLocalStorage';
import { User, ScanResult, Screen, StationData } from './types';
import { useRTL } from './contexts/RTLContext';
import { useAuth } from './contexts/AuthContext';

export default function App() {
  const { currentScreen, setCurrentScreen, handleBack } = useNavigation();
  const { isRTL, direction } = useRTL();
  const { user: authUser, logout: authLogout, updateUser: updateAuthUser, isLoading: authLoading } = useAuth();
  const swipeContainerRef = useRef<HTMLDivElement>(null);
  
  // Use localStorage for persistent state - sync with auth context
  const [user, setUser] = useLocalStorage<User | null>(STORAGE_KEYS.USER, null);
  const [currentScan, setCurrentScan] = useLocalStorage<ScanResult | null>(STORAGE_KEYS.CURRENT_SCAN, null);
  const [scanHistory, setScanHistory] = useLocalStorage<ScanResult[]>(STORAGE_KEYS.SCAN_HISTORY, []);
  
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedInfluencerId, setSelectedInfluencerId] = useState<string | null>(null);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  
  // Sync auth context user with local user state
  useEffect(() => {
    if (authUser && !authLoading) {
      setUser(prevUser => ({
        ...authUser,
        // Use API values first, fallback to local state only if API doesn't have them
        questionnaireCompleted: authUser.questionnaireCompleted ?? prevUser?.questionnaireCompleted,
        skinProfile: authUser.skinProfile ?? prevUser?.skinProfile,
        stationData: prevUser?.stationData, // stationData is local-only
      }));
    }
  }, [authUser, authLoading]);
  
  // Live Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  // Load scan history from API when user logs in
  useEffect(() => {
    const loadScanHistory = async () => {
      if (user?.type === 'member' || user?.type === 'pro') {
        try {
          const { data, error } = await api.getScans();
          if (data && data.length > 0) {
            // Map API scans to local ScanResult format
            const scans: ScanResult[] = data.map(scan => ({
              id: scan.scanId,
              date: scan.scanDate,
              imageUrl: scan.scanImageUrl || '',
              overallScore: scan.overallScore,
              estimatedAge: scan.estimatedAge || 0,
              hydration: scan.analysis?.hydrationLevel || 0,
              moisture: scan.analysis?.moistureLevel || 0,
              oiliness: scan.analysis?.oilLevel || 0,
              evenness: scan.analysis?.evennessScore || 0,
              texture: scan.analysis?.textureScore || 0,
              clarity: scan.analysis?.clarityScore || 0,
              firmness: scan.analysis?.firmnessScore || 0,
              elasticity: scan.analysis?.elasticityScore || 0,
              poreSize: scan.analysis?.poreSizeScore || 0,
              smoothness: scan.analysis?.smoothnessScore || 0,
              radiance: scan.analysis?.radianceScore || 0,
              acne: scan.analysis?.acneSeverity || 0,
              wrinkles: scan.analysis?.wrinkleScore || 0,
              darkCircles: scan.analysis?.darkCircleScore || 0,
              darkSpots: scan.analysis?.darkSpotScore || 0,
              redness: scan.analysis?.rednessLevel || 0,
              skinType: (scan.analysis?.skinType as ScanResult['skinType']) || 'normal',
              uvDamage: scan.analysis?.uvDamageScore || 0,
              recommendations: scan.analysis?.recommendations || [],
              aiAnalysis: scan.analysis?.aiSummary,
            }));
            setScanHistory(scans);
          }
          // No fallback to mock data - show empty state instead
        } catch (err) {
          console.error('Failed to load scan history:', err);
          // No fallback to mock data - just log error
        }
      }
    };
    loadScanHistory();
  }, [user?.type, user?.id]);

  // Auto-save user data whenever it changes
  useEffect(() => {
    if (user) {
      localStorageUtils.setItem(STORAGE_KEYS.USER, user);
    }
  }, [user]);

  const handleAuth = (userData: User) => {
    setUser(userData);
    // Check if user needs to complete questionnaire
    if (!userData.questionnaireCompleted) {
      setCurrentScreen('questionnaire');
    } else {
      setCurrentScreen('camera');
    }
  };

  const handleScanComplete = (result: ScanResult) => {
    setCurrentScan(result);
    if (user) {
      setUser({ ...user, scansToday: user.scansToday + 1 });
      if (user.type === 'member') {
        setScanHistory(prev => [result, ...prev]);
      }
    }
    setCurrentScreen('results');
  };

  const handleUpgrade = (membershipType: 'member' | 'pro') => {
    if (user) {
      const maxScans = membershipType === 'pro' ? 9999 : 5; // Unlimited for pro
      const updatedUser: User = {
        ...user,
        type: membershipType,
        maxScans: maxScans,
        subscriptionStatus: 'active',
        subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        walletBalance: user.walletBalance || 0
      };
      setUser(updatedUser);
      setCurrentScreen(membershipType === 'pro' ? 'pro-dashboard' : 'dashboard');
    }
  };

  const handleLogout = async () => {
    // Logout from API
    await authLogout();
    
    // Clear all user-related data from localStorage
    localStorageUtils.removeItem(STORAGE_KEYS.USER);
    localStorageUtils.removeItem(STORAGE_KEYS.CURRENT_SCAN);
    localStorageUtils.removeItem(STORAGE_KEYS.SCAN_HISTORY);
    localStorageUtils.removeItem('skinpai_current_screen');
    
    // Reset state
    setUser(null);
    setCurrentScan(null);
    setScanHistory([]);
    setCurrentScreen('auth');
    
    toast.success('Successfully logged out');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleQuestionnaireComplete = async (answers: Record<string, string>) => {
    if (user) {
      try {
        // Save answers to backend API
        const { data, error } = await api.updateSkinProfile({
          skinType: answers.skinType,
          skinConcerns: answers.skinConcerns,
          currentRoutine: answers.currentRoutine,
          sunExposure: answers.sunExposure,
          lifestyle: answers.lifestyle,
        });

        if (error) {
          console.error('Failed to save skin profile:', error);
          toast.error('Failed to save skin profile');
        }

        // Update local user state
        const updatedUser = {
          ...user,
          questionnaireCompleted: true,
          skinProfile: {
            skinType: answers.skinType,
            skinConcerns: answers.skinConcerns,
            currentRoutine: answers.currentRoutine,
            sunExposure: answers.sunExposure,
            lifestyle: answers.lifestyle,
          }
        };
        setUser(updatedUser);
        setCurrentScreen('camera');
      } catch (err) {
        console.error('Error saving skin profile:', err);
        toast.error('Failed to save skin profile');
      }
    }
  };

  // Screens that require authentication (not available to anonymous guests)
  // A guest WITH an email is a registered user and should have access
  const protectedScreens: Screen[] = ['dashboard', 'pro-dashboard', 'profile', 'favorites', 'notifications'];
  
  // Check if user is an anonymous guest (no email = used "Continue as Guest")
  const isAnonymousGuest = user?.type === 'guest' && !user?.email;
  
  const handleNavigate = (screen: string) => {
    const targetScreen = screen as Screen;
    
    // Check if anonymous guest is trying to access protected screen
    if (isAnonymousGuest && protectedScreens.includes(targetScreen)) {
      toast.error('🔒 Sign up to access this feature', {
        description: 'Create an account to unlock full access',
        action: {
          label: 'Sign Up',
          onClick: () => setCurrentScreen('auth'),
        },
      });
      return;
    }
    
    // Pro-only screens
    if (targetScreen === 'create-station' && user?.type !== 'pro') {
      toast.error('🔒 Creator Stations are Pro-exclusive', {
        description: 'Upgrade to Pro to create your own station',
        action: {
          label: 'Upgrade',
          onClick: () => setCurrentScreen('upgrade'),
        },
      });
      return;
    }
    
    setCurrentScreen(targetScreen);
  };

  const handleCreatePost = (content: string, media: string[], hashtags: string[]) => {
    // Handle post creation
    console.log('Creating post:', { content, media, hashtags });
    setCurrentScreen('community');
  };

  const handleViewPost = (postId: string) => {
    setSelectedPostId(postId);
    setCurrentScreen('post-detail');
  };

  const handleViewInfluencer = (influencerId: string) => {
    setSelectedInfluencerId(influencerId);
    setCurrentScreen('influencer-profile');
  };

  const handleViewBrand = (brandId: string) => {
    setSelectedBrandId(brandId);
    setCurrentScreen('brand-profile');
  };

  const handleViewCampaign = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setCurrentScreen('campaign-detail');
  };

  const handleViewProduct = (productId: string) => {
    console.log('Viewing product:', productId);
    setCurrentScreen('products');
  };

  const handleCreateStation = () => {
    // Check if user is Pro member
    if (user?.type !== 'pro') {
      toast.error('🔒 Creator Stations are exclusive to Pro members!', {
        description: 'Upgrade to Pro to create your own station and grow your community.',
        action: {
          label: 'Upgrade to Pro',
          onClick: () => setCurrentScreen('upgrade'),
        },
      });
      return;
    }

    // Check if user already has a station
    if (user?.hasStation) {
      toast.error('You already have a station. You can only create one station per account.');
      setCurrentScreen('station-view');
      return;
    }
    setCurrentScreen('create-station');
  };

  const handleStationComplete = (stationData: StationData) => {
    // Save station data to user
    if (user) {
      const updatedUser = {
        ...user,
        hasStation: true,
        stationData: {
          ...stationData,
          createdDate: new Date().toISOString()
        }
      };
      setUser(updatedUser);
      toast.success('🎉 Your Creator Station is now live!');
      setCurrentScreen('station-view');
    }
  };

  const handleEditStation = () => {
    if (user?.hasStation) {
      // In a real app, we'd populate the form with existing data
      toast.info('Station editing will be available soon!');
    }
  };

  const handleDeleteStation = () => {
    if (user) {
      const updatedUser = {
        ...user,
        hasStation: false,
        stationData: undefined
      };
      setUser(updatedUser);
      toast.success('Station deleted successfully');
      setCurrentScreen('community');
    }
  };

  const handleViewStation = () => {
    if (user?.hasStation) {
      setCurrentScreen('station-view');
    } else {
      toast.error('You don\'t have a station yet');
      setCurrentScreen('community');
    }
  };

  // Define main screens that can be navigated with swipe
  const mainScreens: Screen[] = ['camera', 'shop', 'dashboard', 'community'];
  
  // Swipe navigation logic
  const handleSwipeLeft = () => {
    // Only allow swipe on main screens
    if (!mainScreens.includes(currentScreen)) return;
    
    const currentIndex = mainScreens.indexOf(currentScreen);
    if (currentIndex < mainScreens.length - 1) {
      const nextScreen = mainScreens[currentIndex + 1];
      
      // Special handling for dashboard - check user type
      if (nextScreen === 'dashboard' && user?.type === 'pro') {
        setCurrentScreen('pro-dashboard');
      } else {
        setCurrentScreen(nextScreen);
      }
      
      // Provide haptic feedback if available
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
    }
  };

  const handleSwipeRight = () => {
    // Only allow swipe on main screens (including pro-dashboard)
    const currentScreenToCheck = currentScreen === 'pro-dashboard' ? 'dashboard' : currentScreen;
    if (!mainScreens.includes(currentScreenToCheck)) return;
    
    const currentIndex = mainScreens.indexOf(currentScreenToCheck);
    if (currentIndex > 0) {
      const prevScreen = mainScreens[currentIndex - 1];
      setCurrentScreen(prevScreen);
      
      // Provide haptic feedback if available
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
    }
  };

  // Setup swipe navigation
  useSwipeNavigation(swipeContainerRef, {
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    minSwipeDistance: 75,
    maxVerticalMovement: 100,
  });

  return (
    <div className="min-h-screen relative" dir={direction}>
      <AppHeader 
        currentScreen={currentScreen}
        user={user}
        onBack={handleBack}
        onNavigate={handleNavigate}
        onOpenChat={() => {
          setIsChatOpen(true);
          setHasUnreadMessages(false);
        }}
        hasUnreadMessages={hasUnreadMessages}
      />
      
      <div 
        ref={swipeContainerRef}
        className={`${
          currentScreen !== 'auth' && currentScreen !== 'questionnaire' && currentScreen !== 'create-account' 
            ? 'fixed top-16 bottom-16 left-0 right-0 overflow-y-auto scrollbar-hide' 
            : ''
        } max-w-md mx-auto`}
      >
        <div className="px-2">
          {currentScreen === 'auth' && (
            <AuthScreen onAuth={handleAuth} onCreateAccount={() => setCurrentScreen('create-account')} />
          )}

          {currentScreen === 'create-account' && (
            <CreateAccount 
              onAccountCreated={handleAuth}
              onBack={() => setCurrentScreen('auth')}
            />
          )}

          {currentScreen === 'questionnaire' && user && (
            <SkinQuestionnaire 
              onComplete={handleQuestionnaireComplete}
              userName={user.name}
            />
          )}
          
          {currentScreen === 'camera' && user && (
            <CameraInterface 
              user={user} 
              onScanComplete={handleScanComplete}
              onViewProducts={() => setCurrentScreen('products')}
              onUpgrade={() => setCurrentScreen('upgrade')}
            />
          )}
          
          {currentScreen === 'results' && currentScan && (
            <ScanResults 
              result={currentScan} 
              onViewProducts={() => setCurrentScreen('products')}
              user={user}
            />
          )}
          
          {(currentScreen === 'products' || currentScreen === 'shop') && (
            <ProductRecommendations 
              recommendations={currentScan?.recommendations || []}
            />
          )}
          
          {currentScreen === 'dashboard' && user && (
            <MemberDashboard 
              user={user}
              scanHistory={scanHistory}
              onNavigate={handleNavigate}
              onViewScan={(scan) => {
                setCurrentScan(scan);
                setCurrentScreen('results');
              }}
            />
          )}
          
          {currentScreen === 'dashboard' && user?.type === 'pro' && (
            <ProDashboard 
              user={user} 
              scanHistory={scanHistory}
              onNavigate={handleNavigate}
            />
          )}
          
          {currentScreen === 'pro-dashboard' && user?.type === 'pro' && (
            <ProDashboard 
              user={user} 
              scanHistory={scanHistory}
              onNavigate={handleNavigate}
            />
          )}
          
          {currentScreen === 'community' && (
            <CommunityFeed 
              user={user}
              onCreatePost={() => setCurrentScreen('create-post')}
              onCreateStation={handleCreateStation}
              onViewPost={handleViewPost}
              onViewInfluencer={handleViewInfluencer}
              onViewBrand={handleViewBrand}
              onViewCampaign={handleViewCampaign}
              userHasStation={user?.hasStation}
              onViewStation={handleViewStation}
              onUpgrade={() => setCurrentScreen('upgrade')}
            />
          )}

          {currentScreen === 'create-post' && (
            <CreatePost 
              onClose={() => setCurrentScreen('community')}
              onPost={handleCreatePost}
            />
          )}

          {currentScreen === 'post-detail' && selectedPostId && (
            <PostDetail 
              post={{
                id: selectedPostId,
                type: 'image',
                author: {
                  name: 'Sarah Beauty',
                  username: '@sarahbeauty',
                  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b7a1?w=150&h=150&fit=crop',
                  verified: true,
                  isInfluencer: true,
                },
                content: {
                  media: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
                  caption: '✨ Day 15 of #GlowChallenge30! The vitamin C serum is working wonders! My skin has never looked better! 💫',
                  products: ['Vitamin C Serum', 'Hyaluronic Moisturizer']
                },
                engagement: {
                  likes: 1247,
                  comments: 89,
                  shares: 34,
                  liked: false,
                  saved: false,
                },
                timestamp: '2h'
              }}
              onBack={() => setCurrentScreen('community')}
            />
          )}

          {currentScreen === 'influencer-profile' && selectedInfluencerId && (
            <InfluencerProfile 
              influencerId={selectedInfluencerId}
              onBack={() => setCurrentScreen('community')}
              onViewPost={handleViewPost}
            />
          )}

          {currentScreen === 'brand-profile' && selectedBrandId && (
            <BrandProfile 
              brandId={selectedBrandId}
              onBack={() => setCurrentScreen('community')}
              onViewProduct={handleViewProduct}
            />
          )}

          {currentScreen === 'campaign-detail' && selectedCampaignId && (
            <CampaignDetail 
              campaignId={selectedCampaignId}
              onBack={() => setCurrentScreen('community')}
            />
          )}

          {currentScreen === 'create-station' && (
            <CreateStation 
              onBack={() => setCurrentScreen('community')}
              onComplete={handleStationComplete}
            />
          )}

          {currentScreen === 'station-view' && user?.stationData && (
            <StationView 
              station={user.stationData}
              onBack={() => setCurrentScreen('community')}
              onEdit={handleEditStation}
              onDelete={handleDeleteStation}
            />
          )}

          {(currentScreen === 'profile' || currentScreen === 'settings') && user && (
            <ProfileSettings 
              user={user}
              onNavigate={handleNavigate}
              onUpdateUser={handleUpdateUser}
              onLogout={handleLogout}
            />
          )}

          {currentScreen === 'favorites' && (
            <Favorites 
              onNavigate={handleNavigate}
              onViewProduct={(product) => {
                console.log('View product:', product);
                setCurrentScreen('products');
              }}
            />
          )}

          {currentScreen === 'notifications' && (
            <Notifications onNavigate={handleNavigate} />
          )}

          {currentScreen === 'upgrade' && (
            <UpgradeProMember 
              user={user}
              onUpgrade={handleUpgrade}
              onNavigate={handleNavigate}
            />
          )}

          {currentScreen === 'help' && (
            <HelpSupport />
          )}
        </div>
      </div>
      
      <BottomNav 
        user={user}
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
      />

      {/* Live Chat Modal - Available on all screens except auth */}
      {user && currentScreen !== 'auth' && currentScreen !== 'create-account' && (
        <LiveChat 
          open={isChatOpen}
          onOpenChange={setIsChatOpen}
        />
      )}

      <Toaster />
    </div>
  );
}