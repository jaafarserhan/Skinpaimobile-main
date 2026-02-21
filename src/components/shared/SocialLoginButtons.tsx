import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Loader2 } from 'lucide-react';
import { api, SocialProvider } from '../../services/api';

// Social provider icons as SVGs
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const AppleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

interface SocialLoginButtonsProps {
  onSuccess: (user: any) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

export default function SocialLoginButtons({ onSuccess, onError, disabled }: SocialLoginButtonsProps) {
  const [loadingProvider, setLoadingProvider] = useState<SocialProvider | null>(null);

  const handleSocialLogin = async (provider: SocialProvider) => {
    setLoadingProvider(provider);
    
    try {
      // In production, you would use the real OAuth flow:
      // 1. Open OAuth popup/redirect for the provider
      // 2. Get the ID token from the OAuth callback
      // 3. Send to backend for verification
      
      // For now, we simulate OAuth by creating a mock token
      // TODO: Implement real OAuth with:
      // - Google: @react-oauth/google or expo-auth-session
      // - Apple: expo-apple-authentication or react-native-apple-authentication
      // - Facebook: @react-native-fbsdk-next or react-facebook-login
      
      // Mock implementation for development
      const mockEmail = `${provider}user${Date.now()}@${provider}.com`;
      const mockToken = `mock_${provider}_token_${Date.now()}`;
      
      const response = await api.socialLogin({
        provider,
        idToken: mockToken,
        email: mockEmail,
        firstName: provider.charAt(0).toUpperCase() + provider.slice(1),
        lastName: 'User',
      });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      if (response.data) {
        onSuccess({
          id: response.data.userId,
          email: response.data.email,
          name: `${response.data.firstName} ${response.data.lastName}`,
          type: response.data.membershipType.toLowerCase(),
          isNewUser: response.data.isNewUser,
          questionnaireCompleted: response.data.questionnaireCompleted,
        });
      }
    } catch (error: any) {
      onError(error.message || `${provider} login failed`);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">or continue with</span>
        <Separator className="flex-1" />
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <Button
          variant="outline"
          onClick={() => handleSocialLogin('google')}
          disabled={disabled || loadingProvider !== null}
          className="h-12"
        >
          {loadingProvider === 'google' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <GoogleIcon />
          )}
        </Button>
        
        <Button
          variant="outline"
          onClick={() => handleSocialLogin('apple')}
          disabled={disabled || loadingProvider !== null}
          className="h-12"
        >
          {loadingProvider === 'apple' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <AppleIcon />
          )}
        </Button>
        
        <Button
          variant="outline"
          onClick={() => handleSocialLogin('facebook')}
          disabled={disabled || loadingProvider !== null}
          className="h-12"
        >
          {loadingProvider === 'facebook' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <FacebookIcon />
          )}
        </Button>
      </div>
      
      <p className="text-xs text-center text-muted-foreground">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
}
