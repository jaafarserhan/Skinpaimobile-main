import React from 'react';
import { Button } from '../ui/button';
import { Camera, Users, BarChart3, ShoppingBag, User as UserIcon, Lock, Sparkles } from 'lucide-react';
import { User, Screen } from '../../types';
import { useTranslation } from 'react-i18next';
import { useRTL } from '../../contexts/RTLContext';
import { toast } from 'sonner@2.0.3';

interface BottomNavProps {
  user: User | null;
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export default function BottomNav({ user, currentScreen, onNavigate }: BottomNavProps) {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  
  if (!user || currentScreen === 'auth') return null;

  // Anonymous guest = used "Continue as Guest" without registering (no email)
  // Registered users with Guest tier should have profile access
  const isAnonymousGuest = user.type === 'guest' && !user.email;
  const isMember = user.type === 'member';
  const isPro = user.type === 'pro';

  const handleLockedNavigation = (screen: Screen, featureName: string) => {
    if (isAnonymousGuest) {
      toast.error(`🔒 ${featureName} requires an account`, {
        description: 'Sign up to access this feature',
        action: {
          label: 'Sign Up',
          onClick: () => onNavigate('auth'),
        },
      });
      return;
    }
    onNavigate(screen);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 glass border-t">
      <div className={`flex justify-around items-center py-2 max-w-md mx-auto ${isRTL ? 'flex-row-reverse' : ''}`}>
        {/* Scan - Available to all */}
        <Button
          variant={currentScreen === 'camera' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onNavigate('camera')}
          className="flex flex-col items-center gap-1 h-auto py-2"
        >
          <Camera className="w-5 h-5" />
          <span className="text-xs">{t('navigation.scan')}</span>
        </Button>
        
        {/* Shop - Available to all */}
        <Button
          variant={currentScreen === 'shop' || currentScreen === 'products' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onNavigate('shop')}
          className="flex flex-col items-center gap-1 h-auto py-2"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-xs">{t('navigation.shop')}</span>
        </Button>
        
        {/* Dashboard - Member only (locked for guest, hidden for pro) */}
        {isMember && (
          <Button
            variant={currentScreen === 'dashboard' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onNavigate('dashboard')}
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs">{t('navigation.dashboard')}</span>
          </Button>
        )}

        {/* Pro Dashboard/Station - Pro only */}
        {isPro && (
          <Button
            variant={currentScreen === 'pro-dashboard' || currentScreen === 'station-view' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onNavigate('pro-dashboard')}
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-xs">{t('navigation.station', 'Station')}</span>
          </Button>
        )}
        
        {/* Community - View for all, full access for member/pro */}
        <Button
          variant={currentScreen === 'community' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onNavigate('community')}
          className="flex flex-col items-center gap-1 h-auto py-2 relative"
        >
          <Users className="w-5 h-5" />
          <span className="text-xs">{t('navigation.community')}</span>
        </Button>

        {/* Profile - Locked for anonymous guest, available for registered users */}
        <Button
          variant={currentScreen === 'profile' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => isAnonymousGuest ? handleLockedNavigation('profile', 'Profile') : onNavigate('profile')}
          className={`flex flex-col items-center gap-1 h-auto py-2 ${isAnonymousGuest ? 'opacity-60' : ''}`}
        >
          <div className="relative">
            <UserIcon className="w-5 h-5" />
            {isAnonymousGuest && <Lock className="w-2.5 h-2.5 absolute -top-1 -right-1 text-muted-foreground" />}
          </div>
          <span className="text-xs">{t('navigation.profile', 'Profile')}</span>
        </Button>
      </div>
    </div>
  );
}