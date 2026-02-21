import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowLeft, Bell, User, MessageCircle } from 'lucide-react';
import { User as UserType, Screen } from '../../types';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher';
import { useRTL } from '../../contexts/RTLContext';

interface AppHeaderProps {
  currentScreen: Screen;
  user: UserType | null;
  onBack: () => void;
  onNavigate: (screen: string) => void;
  onOpenChat?: () => void;
  hasUnreadMessages?: boolean;
}

export default function AppHeader({ currentScreen, user, onBack, onNavigate, onOpenChat, hasUnreadMessages }: AppHeaderProps) {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  
  if (currentScreen === 'auth') return null;

  const screenTitles: Record<string, string> = {
    camera: t('navigation.camera'),
    results: t('navigation.results'),
    products: t('navigation.products'),
    shop: t('navigation.shop'),
    dashboard: t('navigation.dashboard'),
    community: t('navigation.community'),
    profile: t('navigation.profile'),
    settings: t('navigation.settings'),
    notifications: t('navigation.notifications'),
    upgrade: t('navigation.upgrade'),
    help: t('navigation.help'),
  };

  const showBackButton = !['camera', 'dashboard', 'community', 'shop'].includes(currentScreen);

  return (
    <div className="fixed top-0 left-0 right-0 glass border-b z-50">
      <div className="flex items-center justify-between p-4 max-w-md mx-auto">
        <div className={`flex items-center gap-2 flex-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {showBackButton && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
            </Button>
          )}
          {currentScreen === 'camera' && !showBackButton ? (
            <h1 className="text-2xl font-bold" style={{ color: '#00b4d8' }}>
              {t('common.appName')}
            </h1>
          ) : (
            <h1 className="text-lg font-medium">{screenTitles[currentScreen] || t('common.appName')}</h1>
          )}
        </div>
        
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <LanguageSwitcher />
          
          {user && currentScreen === 'camera' && (
            <div className="text-sm text-muted-foreground">
              {user.scansToday}/{user.maxScans}
            </div>
          )}
          
          {user && (
            <>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onNavigate('notifications')}
                className="relative"
              >
                <Bell className="w-7 h-7" />
                <Badge 
                  className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
                  variant="destructive"
                >
                  3
                </Badge>
              </Button>
              
              {onOpenChat && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={onOpenChat}
                  className="relative"
                >
                  <MessageCircle className="w-7 h-7" />
                  {hasUnreadMessages && (
                    <Badge 
                      className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
                      variant="destructive"
                    >
                      1
                    </Badge>
                  )}
                </Button>
              )}
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onNavigate('profile')}
              >
                <User className="w-7 h-7" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}