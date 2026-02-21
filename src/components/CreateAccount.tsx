import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { 
  User, Mail, Lock, Eye, EyeOff, Sparkles, Crown, 
  Check, X, ArrowLeft, Calendar, Phone, CreditCard,
  Wallet, Shield, Zap, TrendingUp, Bell, Award,
  Heart, Radio, BarChart3, Users as UsersIcon, DollarSign,
  Star, Infinity, Settings, Loader2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { User as UserType } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface CreateAccountProps {
  onAccountCreated: (user: UserType) => void;
  onBack: () => void;
}

export default function CreateAccount({ onAccountCreated, onBack }: CreateAccountProps) {
  const { register } = useAuth();
  const [step, setStep] = useState<'info' | 'membership' | 'payment'>('info');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Account Info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  // Membership Selection
  const [selectedTier, setSelectedTier] = useState<'guest' | 'member' | 'pro'>('guest');
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'yearly'>('monthly');
  
  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const plans = {
    guest: { monthly: 0, yearly: 0 },
    member: { monthly: 9.99, yearly: 79.99, yearlyMonthly: 6.67 },
    pro: { monthly: 29.99, yearly: 239.99, yearlyMonthly: 19.99 }
  };

  const memberFeatures = [
    { icon: TrendingUp, text: '5 scans', included: true },
    { icon: Calendar, text: 'Progress tracking', included: true },
    { icon: Bell, text: 'Routine reminders', included: true },
    { icon: Award, text: 'Achievements', included: true },
    { icon: Heart, text: 'Personalized tips', included: true },
    { icon: Shield, text: 'Data backup', included: true },
    { icon: Radio, text: 'Creator Station', included: false },
    { icon: BarChart3, text: 'Analytics Dashboard', included: false },
  ];

  const proFeatures = [
    { icon: Infinity, text: 'Unlimited scans', included: true, highlight: true },
    { icon: Radio, text: 'Create Creator Station', included: true, highlight: true },
    { icon: BarChart3, text: 'Advanced Analytics Dashboard', included: true, highlight: true },
    { icon: UsersIcon, text: 'Audience insights', included: true, highlight: true },
    { icon: DollarSign, text: 'Monetization tools', included: true },
    { icon: Sparkles, text: 'Priority support', included: true },
    { icon: Zap, text: 'Early feature access', included: true },
    { icon: Settings, text: 'Custom branding', included: true },
    { icon: Star, text: 'Verified badge', included: true },
    { icon: Shield, text: 'Advanced data export', included: true },
  ];

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleAccountInfoSubmit = () => {
    // Validation
    if (!firstName || !lastName) {
      toast.error('Please enter your full name');
      return;
    }
    
    if (!email || !validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    if (!password || !validatePassword(password)) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (!agreeToTerms) {
      toast.error('Please agree to the Terms of Service and Privacy Policy');
      return;
    }
    
    setStep('membership');
  };

  const handleMembershipSelection = async () => {
    if (selectedTier === 'guest') {
      // Create guest account directly
      await handleCreateAccount();
    } else {
      // Proceed to payment
      setStep('payment');
    }
  };

  const handleCreateAccount = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Register via API
      const user = await register({
        email,
        password,
        firstName,
        lastName,
        dateOfBirth: dateOfBirth || undefined,
        phoneNumber: phoneNumber || undefined,
      });

      toast.success('🎉 Account created successfully!', {
        description: `Welcome to SkinPAI, ${firstName}!`
      });

      onAccountCreated(user);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create account';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (paymentMethod === 'card') {
      if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
        toast.error('Please fill in all payment details');
        return;
      }
    }

    const amount = selectedPeriod === 'yearly' 
      ? plans[selectedTier].yearly 
      : plans[selectedTier].monthly;

    toast.success(`💳 Payment of $${amount} processed successfully!`);
    setShowPaymentModal(false);
    await handleCreateAccount();
  };

  const getCurrentPrice = () => {
    if (selectedTier === 'guest') return 0;
    return selectedPeriod === 'yearly' 
      ? plans[selectedTier].yearly 
      : plans[selectedTier].monthly;
  };

  const getSavings = () => {
    if (selectedPeriod === 'yearly' && selectedTier !== 'guest') {
      const yearlyPrice = plans[selectedTier].yearly;
      const monthlyPrice = plans[selectedTier].monthly * 12;
      return monthlyPrice - yearlyPrice;
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <Button
          variant="ghost"
          onClick={step === 'info' ? onBack : () => setStep(step === 'payment' ? 'membership' : 'info')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step === 'info' ? 'bg-[#00B4D8] text-white' : 'bg-[#00B4D8] text-white'
          }`}>
            {step === 'info' ? '1' : <Check className="w-4 h-4" />}
          </div>
          <div className={`w-16 h-0.5 ${step === 'membership' || step === 'payment' ? 'bg-[#00B4D8]' : 'bg-muted'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step === 'membership' ? 'bg-[#00B4D8] text-white' : step === 'payment' ? 'bg-[#00B4D8] text-white' : 'bg-muted text-muted-foreground'
          }`}>
            {step === 'payment' ? <Check className="w-4 h-4" /> : '2'}
          </div>
          <div className={`w-16 h-0.5 ${step === 'payment' ? 'bg-[#00B4D8]' : 'bg-muted'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step === 'payment' ? 'bg-[#00B4D8] text-white' : 'bg-muted text-muted-foreground'
          }`}>
            3
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#00b4d8' }}>
            SkinPAI
          </h1>
          <h2 className="text-3xl font-bold mb-2">Create Your Account</h2>
          <p className="text-muted-foreground">
            {step === 'info' && 'Tell us about yourself'}
            {step === 'membership' && 'Choose your membership plan'}
            {step === 'payment' && 'Complete your payment'}
          </p>
        </div>
      </div>

      {/* Step 1: Account Information */}
      {step === 'info' && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Create your SkinPAI account to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth (Optional)</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              {password && (
                <div className="text-xs space-y-1">
                  <div className={`flex items-center gap-2 ${password.length >= 8 ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {password.length >= 8 ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    At least 8 characters
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              {confirmPassword && (
                <div className={`text-xs flex items-center gap-2 ${password === confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                  {password === confirmPassword ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  {password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                </div>
              )}
            </div>

            <div className="flex items-start space-x-2 pt-4">
              <Checkbox
                id="terms"
                checked={agreeToTerms}
                onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                I agree to the{' '}
                <span className="text-[#00B4D8] hover:underline cursor-pointer">Terms of Service</span>
                {' '}and{' '}
                <span className="text-[#00B4D8] hover:underline cursor-pointer">Privacy Policy</span>
              </Label>
            </div>

            <Button
              onClick={handleAccountInfoSubmit}
              className="w-full h-12 bg-gradient-to-r from-[#00B4D8] to-[#006D77] hover:from-[#00B4D8]/90 hover:to-[#006D77]/90"
            >
              Continue to Membership Selection
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Membership Selection */}
      {step === 'membership' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Choose Your Plan</CardTitle>
              <CardDescription className="text-center">
                Select the plan that best fits your skincare journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedTier} onValueChange={(value) => setSelectedTier(value as 'guest' | 'member' | 'pro')} className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted">
                  <TabsTrigger value="guest" className="flex flex-col items-center gap-1 py-3">
                    <Zap className="w-5 h-5" />
                    <span className="font-semibold">Guest</span>
                    <span className="text-xs text-muted-foreground">Free</span>
                  </TabsTrigger>
                  <TabsTrigger value="member" className="flex flex-col items-center gap-1 py-3">
                    <Crown className="w-5 h-5" />
                    <span className="font-semibold">Member</span>
                    <span className="text-xs text-muted-foreground">
                      ${selectedPeriod === 'monthly' ? plans.member.monthly : plans.member.yearlyMonthly}/mo
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="pro" className="flex flex-col items-center gap-1 py-3 relative">
                    <Badge className="absolute -top-1 -right-1 bg-[#FF6B35] text-[10px] px-1.5 py-0.5">HOT</Badge>
                    <Crown className="w-5 h-5" />
                    <span className="font-semibold">Pro</span>
                    <span className="text-xs text-muted-foreground">
                      ${selectedPeriod === 'monthly' ? plans.pro.monthly : plans.pro.yearlyMonthly}/mo
                    </span>
                  </TabsTrigger>
                </TabsList>

                {/* Guest Tab Content */}
                <TabsContent value="guest" className="space-y-4 mt-6">
                  <div className="text-center space-y-2 mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#C0D6DF] to-[#006D77] mb-2">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">Guest Plan</h3>
                    <p className="text-muted-foreground">Try it out for free</p>
                    <div className="text-4xl font-bold text-[#006D77] mt-4">$0</div>
                    <div className="text-sm text-muted-foreground">Forever free</div>
                  </div>

                  <div className="space-y-3 max-w-md mx-auto">
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <Check className="w-5 h-5 text-[#00B4D8] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">1 scan per day</p>
                        <p className="text-sm text-muted-foreground">Basic skin analysis</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <Check className="w-5 h-5 text-[#00B4D8] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">AI analysis</p>
                        <p className="text-sm text-muted-foreground">Get instant skin insights</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <Check className="w-5 h-5 text-[#00B4D8] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Product recommendations</p>
                        <p className="text-sm text-muted-foreground">Discover products for your skin</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <Check className="w-5 h-5 text-[#00B4D8] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Community access</p>
                        <p className="text-sm text-muted-foreground">Join the SkinPAI community</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Member Tab Content */}
                <TabsContent value="member" className="space-y-4 mt-6">
                  <div className="text-center space-y-2 mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#006D77] to-[#003D5C] mb-2">
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">Member Plan</h3>
                    <p className="text-muted-foreground">Essential features for dedicated users</p>
                    <div className="text-4xl font-bold text-[#006D77] mt-4">
                      ${selectedPeriod === 'monthly' ? plans.member.monthly : plans.member.yearlyMonthly}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {selectedPeriod === 'monthly' ? 'per month' : 'per month, billed yearly'}
                    </div>
                  </div>

                  <div className="space-y-3 max-w-md mx-auto">
                    {memberFeatures.slice(0, 6).map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <Check className="w-5 h-5 text-[#00B4D8] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">{feature.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Pro Tab Content */}
                <TabsContent value="pro" className="space-y-4 mt-6">
                  <div className="text-center space-y-2 mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] mb-2">
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] bg-clip-text text-transparent">
                      Pro Plan
                    </h3>
                    <p className="text-muted-foreground">For creators and power users</p>
                    <div className="text-4xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] bg-clip-text text-transparent mt-4">
                      ${selectedPeriod === 'monthly' ? plans.pro.monthly : plans.pro.yearlyMonthly}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {selectedPeriod === 'monthly' ? 'per month' : 'per month, billed yearly'}
                    </div>
                  </div>

                  <div className="space-y-3 max-w-md mx-auto">
                    {proFeatures.slice(0, 8).map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${feature.highlight ? 'text-[#FF6B35]' : 'text-[#00B4D8]'}`} />
                        <div>
                          <p className={`font-medium ${feature.highlight ? 'text-[#FF6B35]' : ''}`}>{feature.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Billing Period (only show for paid tiers) */}
          {selectedTier !== 'guest' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Billing Period</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as 'monthly' | 'yearly')}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedPeriod === 'monthly' ? 'border-[#00B4D8] bg-[#00B4D8]/5' : 'border-muted'
                      }`}
                      onClick={() => setSelectedPeriod('monthly')}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <RadioGroupItem value="monthly" id="monthly" />
                        <Label htmlFor="monthly" className="cursor-pointer font-medium">
                          Monthly
                        </Label>
                      </div>
                      <div className="ml-7">
                        <div className="text-sm text-muted-foreground mb-2">Pay month by month</div>
                        <div className="font-bold text-lg">${plans[selectedTier].monthly}/mo</div>
                      </div>
                    </div>

                    <div
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all relative ${
                        selectedPeriod === 'yearly' ? 'border-[#00B4D8] bg-[#00B4D8]/5' : 'border-muted'
                      }`}
                      onClick={() => setSelectedPeriod('yearly')}
                    >
                      <Badge className="absolute -top-2 -right-2 bg-[#FF6B35]">
                        Save {Math.round((getSavings() / (plans[selectedTier].monthly * 12)) * 100)}%
                      </Badge>
                      <div className="flex items-center space-x-3 mb-3">
                        <RadioGroupItem value="yearly" id="yearly" />
                        <Label htmlFor="yearly" className="cursor-pointer font-medium">
                          Yearly
                        </Label>
                      </div>
                      <div className="ml-7">
                        <div className="text-sm text-muted-foreground mb-2">
                          ${plans[selectedTier].yearlyMonthly}/month billed annually
                        </div>
                        <div className="flex items-baseline gap-2">
                          <div className="font-bold text-lg">${plans[selectedTier].yearly}/yr</div>
                          <div className="text-xs text-muted-foreground line-through">
                            ${plans[selectedTier].monthly * 12}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          {/* Summary & CTA */}
          <Card className="bg-gradient-to-r from-[#00B4D8]/10 to-[#006D77]/10 border-[#00B4D8]/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {selectedTier === 'pro' ? 'Pro' : selectedTier === 'member' ? 'Member' : 'Guest'}
                    {selectedTier !== 'guest' && ` - ${selectedPeriod === 'monthly' ? 'Monthly' : 'Yearly'}`}
                  </h3>
                  {selectedPeriod === 'yearly' && selectedTier !== 'guest' && (
                    <p className="text-sm text-green-600 font-medium">
                      💰 Save ${getSavings().toFixed(2)} per year!
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-[#006D77]">
                    ${getCurrentPrice()}
                  </div>
                  {selectedTier !== 'guest' && (
                    <div className="text-xs text-muted-foreground">
                      {selectedPeriod === 'yearly' ? 'billed annually' : 'billed monthly'}
                    </div>
                  )}
                </div>
              </div>
              <Separator className="my-4" />
              <Button 
                onClick={handleMembershipSelection}
                className="w-full h-12 text-lg bg-gradient-to-r from-[#00B4D8] to-[#006D77] hover:from-[#00B4D8]/90 hover:to-[#006D77]/90"
              >
                {selectedTier === 'guest' ? 'Create Free Account' : 'Continue to Payment'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Payment */}
      {step === 'payment' && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Complete Your Payment</CardTitle>
            <CardDescription>
              Secure payment for your {selectedTier === 'pro' ? 'Pro' : 'Member'} subscription
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="card" value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'card' | 'wallet')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="card">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Card
                </TabsTrigger>
                <TabsTrigger value="wallet">
                  <Wallet className="w-4 h-4 mr-2" />
                  Wallet
                </TabsTrigger>
              </TabsList>

              {/* Card Payment */}
              <TabsContent value="card" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    maxLength={19}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardHolder">Card Holder Name</Label>
                  <Input
                    id="cardHolder"
                    placeholder="John Doe"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      type="password"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      maxLength={4}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg text-sm">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Your payment is secure and encrypted</span>
                </div>
              </TabsContent>

              {/* Wallet Payment */}
              <TabsContent value="wallet" className="space-y-4 mt-6">
                <div className="p-4 bg-gradient-to-r from-[#00B4D8]/10 to-[#006D77]/10 rounded-lg border border-[#00B4D8]/20 text-center">
                  <p className="text-sm text-muted-foreground mb-2">Wallet payment coming soon!</p>
                  <p className="text-xs text-muted-foreground">Please use card payment for now.</p>
                </div>
              </TabsContent>
            </Tabs>

            {/* Payment Summary */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${getCurrentPrice()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">$0.00</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold text-[#006D77]">${getCurrentPrice()}</span>
              </div>
            </div>

            {/* Confirm Button */}
            <Button 
              onClick={handlePayment}
              className="w-full h-12 bg-gradient-to-r from-[#00B4D8] to-[#006D77] hover:from-[#00B4D8]/90 hover:to-[#006D77]/90"
            >
              <Shield className="w-4 h-4 mr-2" />
              Complete Payment ${getCurrentPrice()}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}