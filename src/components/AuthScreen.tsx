import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { User } from '../types';
import { Sparkles, Users, Zap, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { useRTL } from '../contexts/RTLContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';
import SocialLoginButtons from './shared/SocialLoginButtons';

interface AuthScreenProps {
  onAuth: (user: User) => void;
  onCreateAccount?: () => void;
}

export default function AuthScreen({ onAuth, onCreateAccount }: AuthScreenProps) {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  const { login, guestLogin, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError('');
    
    const { success, error } = await guestLogin();
    
    if (success) {
      onAuth({
        id: 'guest-' + Date.now(),
        type: 'guest',
        scansToday: 0,
        maxScans: 1
      });
    } else {
      setError(error || 'Failed to login as guest');
      toast.error(error || 'Failed to login as guest');
    }
    
    setIsLoading(false);
  };

  const handleMemberLogin = async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      toast.error('Please enter email and password');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    const { success, error } = await login(email, password);
    
    if (success) {
      onAuth({
        id: 'member-' + Date.now(),
        type: 'member',
        scansToday: 0,
        maxScans: 5,
        name: name || 'Member',
        email: email
      });
    } else {
      setError(error || 'Login failed');
      toast.error(error || 'Login failed');
    }
    
    setIsLoading(false);
  };

  const loading = isLoading || authLoading;

  const handleSocialLoginSuccess = (user: any) => {
    toast.success(`Welcome${user.isNewUser ? '' : ' back'}, ${user.name}!`);
    onAuth({
      id: user.id,
      type: user.type || 'member',
      scansToday: 0,
      maxScans: user.type === 'pro' ? 999 : user.type === 'member' ? 3 : 1,
      name: user.name,
      email: user.email,
      questionnaireCompleted: user.questionnaireCompleted,
    });
  };

  const handleSocialLoginError = (error: string) => {
    setError(error);
    toast.error(error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md space-y-6">
        <div className="absolute top-4 right-4">
          <LanguageSwitcher />
        </div>
        
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold mb-4" style={{ color: '#00b4d8' }}>
            {t('auth.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('auth.subtitle')}
          </p>
        </div>

        <Tabs defaultValue="guest" className="w-full">
          <TabsList className="grid w-full grid-cols-2 glass">
            <TabsTrigger value="guest">{t('auth.guest')}</TabsTrigger>
            <TabsTrigger value="member">{t('auth.member')}</TabsTrigger>
          </TabsList>

          <TabsContent value="guest" className="space-y-4">
            <Card className="glass border-0">
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Zap className="w-5 h-5" />
                  {t('auth.quickStart')}
                </CardTitle>
                <CardDescription>
                  {t('auth.trySkinPAI')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-secondary/20 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium">{t('auth.guestFeatures')}</h4>
                  <ul className={`text-sm text-muted-foreground space-y-1 ${isRTL ? 'text-right' : ''}`}>
                    <li>• {t('auth.guestFeature1')}</li>
                    <li>• {t('auth.guestFeature2')}</li>
                    <li>• {t('auth.guestFeature3')}</li>
                    <li>• {t('auth.guestFeature4')}</li>
                  </ul>
                </div>
                <Button onClick={handleGuestLogin} className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {t('auth.continueAsGuest')}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="member" className="space-y-4">
            <Card className="glass border-0">
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Users className="w-5 h-5" />
                  {t('auth.memberAccess')}
                </CardTitle>
                <CardDescription>
                  {t('auth.signInForFeatures')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-primary/10 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium">{t('auth.memberBenefits')}</h4>
                  <ul className={`text-sm text-muted-foreground space-y-1 ${isRTL ? 'text-right' : ''}`}>
                    <li>• {t('auth.memberBenefit1')}</li>
                    <li>• {t('auth.memberBenefit2')}</li>
                    <li>• {t('auth.memberBenefit3')}</li>
                    <li>• {t('auth.memberBenefit4')}</li>
                    <li>• {t('auth.memberBenefit5')}</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <Input
                    type="text"
                    placeholder={t('auth.name')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                  <Input
                    type="email"
                    placeholder={t('auth.email')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    dir="ltr"
                  />
                  <Input
                    type="password"
                    placeholder={t('auth.password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    dir="ltr"
                  />
                </div>
                
                <div className="space-y-2">
                  {error && (
                    <p className="text-sm text-destructive text-center">{error}</p>
                  )}
                  <Button onClick={handleMemberLogin} className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    {t('common.signIn')}
                  </Button>
                  <Button variant="outline" className="w-full" onClick={onCreateAccount}>
                    {t('auth.createAccount')}
                  </Button>
                </div>
                
                {/* Social Login Options */}
                <SocialLoginButtons 
                  onSuccess={handleSocialLoginSuccess}
                  onError={handleSocialLoginError}
                  disabled={loading}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="text-xs text-center text-muted-foreground">
          {t('auth.termsAgreement')}
        </p>
      </div>
    </div>
  );
}