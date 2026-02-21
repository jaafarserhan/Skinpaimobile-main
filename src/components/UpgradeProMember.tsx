import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { 
  Check, Crown, Sparkles, TrendingUp, Bell, 
  Calendar, Award, Heart, Zap, Shield, X, CreditCard,
  Wallet, Lock, Radio, Users, BarChart3, Settings,
  DollarSign, ArrowRight, Star, Infinity
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { User } from '../types';

interface UpgradeProMemberProps {
  user: User | null;
  onUpgrade: (membershipType: 'member' | 'pro') => void;
  onNavigate: (screen: string) => void;
}

export default function UpgradeProMember({ user, onUpgrade, onNavigate }: UpgradeProMemberProps) {
  const [selectedTier, setSelectedTier] = useState<'member' | 'pro'>('pro');
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet'>('card');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Payment form states
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [walletAmount, setWalletAmount] = useState(user?.walletBalance || 0);

  const memberFeatures = [
    { icon: TrendingUp, text: '5 scans per day', included: true },
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
    { icon: Users, text: 'Audience insights', included: true, highlight: true },
    { icon: DollarSign, text: 'Monetization tools', included: true },
    { icon: Sparkles, text: 'Priority support', included: true },
    { icon: Zap, text: 'Early feature access', included: true },
    { icon: Settings, text: 'Custom branding', included: true },
    { icon: Star, text: 'Verified badge', included: true },
    { icon: Shield, text: 'Advanced data export', included: true },
  ];

  const plans = {
    member: {
      monthly: 9.99,
      yearly: 79.99,
      yearlyMonthly: 6.67
    },
    pro: {
      monthly: 29.99,
      yearly: 239.99,
      yearlyMonthly: 19.99
    }
  };

  const getCurrentPrice = () => {
    if (selectedPeriod === 'yearly') {
      return plans[selectedTier].yearly;
    }
    return plans[selectedTier].monthly;
  };

  const getSavings = () => {
    if (selectedPeriod === 'yearly') {
      const yearlyPrice = plans[selectedTier].yearly;
      const monthlyPrice = plans[selectedTier].monthly * 12;
      return monthlyPrice - yearlyPrice;
    }
    return 0;
  };

  const handleProceedToPayment = () => {
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = () => {
    const price = getCurrentPrice();
    
    if (paymentMethod === 'wallet') {
      if (walletAmount < price) {
        toast.error('Insufficient wallet balance!', {
          description: `You need $${price.toFixed(2)} but only have $${walletAmount.toFixed(2)} in your wallet.`
        });
        return;
      }
    }

    // Process payment (mock)
    toast.success(`🎉 Payment successful!`, {
      description: `Welcome to SkinPAI ${selectedTier === 'pro' ? 'Pro' : 'Member'}!`
    });
    
    setShowPaymentModal(false);
    onUpgrade(selectedTier);
  };

  const handleAddToWallet = () => {
    // Mock adding funds to wallet
    toast.success('Add funds to wallet feature coming soon!');
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 py-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#00B4D8] to-[#006D77] mb-4">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold">Choose Your Plan</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Unlock premium features and take your skincare journey to the next level
        </p>
      </div>

      {/* Tier Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {/* Member Tier */}
        <Card
          className={`cursor-pointer transition-all border-2 ${
            selectedTier === 'member'
              ? 'border-[#006D77] shadow-xl'
              : 'border-muted hover:border-[#006D77]/50'
          }`}
          onClick={() => setSelectedTier('member')}
        >
          <CardHeader className="text-center pb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#006D77] to-[#003D5C] rounded-full mx-auto mb-3 flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl">Member</CardTitle>
            <CardDescription>Essential features for dedicated users</CardDescription>
            <div className="mt-4">
              <div className="text-4xl font-bold text-[#006D77]">
                ${selectedPeriod === 'monthly' ? plans.member.monthly : plans.member.yearlyMonthly}
              </div>
              <div className="text-sm text-muted-foreground">
                {selectedPeriod === 'monthly' ? 'per month' : 'per month, billed yearly'}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {memberFeatures.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                {feature.included ? (
                  <Check className="w-5 h-5 text-[#00B4D8] flex-shrink-0 mt-0.5" />
                ) : (
                  <X className="w-5 h-5 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
                )}
                <span className={`text-sm ${!feature.included ? 'text-muted-foreground line-through' : ''}`}>
                  {feature.text}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pro Tier */}
        <Card
          className={`cursor-pointer transition-all border-2 relative ${
            selectedTier === 'pro'
              ? 'border-[#FF6B35] shadow-xl'
              : 'border-muted hover:border-[#FF6B35]/50'
          }`}
          onClick={() => setSelectedTier('pro')}
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-white border-0">
              <Sparkles className="w-3 h-3 mr-1" />
              RECOMMENDED
            </Badge>
          </div>
          <CardHeader className="text-center pb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] rounded-full mx-auto mb-3 flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl">Pro</CardTitle>
            <CardDescription>For creators and power users</CardDescription>
            <div className="mt-4">
              <div className="text-4xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] bg-clip-text text-transparent">
                ${selectedPeriod === 'monthly' ? plans.pro.monthly : plans.pro.yearlyMonthly}
              </div>
              <div className="text-sm text-muted-foreground">
                {selectedPeriod === 'monthly' ? 'per month' : 'per month, billed yearly'}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {proFeatures.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${feature.highlight ? 'text-[#FF6B35]' : 'text-[#00B4D8]'}`} />
                <span className={`text-sm ${feature.highlight ? 'font-semibold' : ''}`}>
                  {feature.text}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Billing Period */}
      <Card className="max-w-4xl mx-auto">
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

      {/* Summary & CTA */}
      <Card className="max-w-4xl mx-auto bg-gradient-to-r from-[#00B4D8]/10 to-[#006D77]/10 border-[#00B4D8]/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">
                {selectedTier === 'pro' ? 'Pro' : 'Member'} - {selectedPeriod === 'monthly' ? 'Monthly' : 'Yearly'}
              </h3>
              {selectedPeriod === 'yearly' && (
                <p className="text-sm text-green-600 font-medium">
                  💰 Save ${getSavings().toFixed(2)} per year!
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-[#006D77]">
                ${getCurrentPrice()}
              </div>
              <div className="text-xs text-muted-foreground">
                {selectedPeriod === 'yearly' ? 'billed annually' : 'billed monthly'}
              </div>
            </div>
          </div>
          <Separator className="my-4" />
          <Button 
            onClick={handleProceedToPayment}
            className="w-full h-12 text-lg bg-gradient-to-r from-[#00B4D8] to-[#006D77] hover:from-[#00B4D8]/90 hover:to-[#006D77]/90"
          >
            Proceed to Payment
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </CardContent>
      </Card>

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Payment</DialogTitle>
            <DialogDescription>
              Choose your payment method to activate your {selectedTier === 'pro' ? 'Pro' : 'Member'} subscription
            </DialogDescription>
          </DialogHeader>

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
            <TabsContent value="card" className="space-y-4">
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
                <Lock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Your payment is secure and encrypted</span>
              </div>
            </TabsContent>

            {/* Wallet Payment */}
            <TabsContent value="wallet" className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-[#00B4D8]/10 to-[#006D77]/10 rounded-lg border border-[#00B4D8]/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Wallet Balance</span>
                  <div className="text-2xl font-bold text-[#006D77]">
                    ${walletAmount.toFixed(2)}
                  </div>
                </div>
                <Separator className="my-3" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Amount to Pay</span>
                  <div className="text-xl font-bold">
                    ${getCurrentPrice()}
                  </div>
                </div>
                {walletAmount < getCurrentPrice() && (
                  <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                    Insufficient balance! Need ${(getCurrentPrice() - walletAmount).toFixed(2)} more.
                  </div>
                )}
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleAddToWallet}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Add Funds to Wallet
              </Button>
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
            onClick={handleConfirmPayment}
            className="w-full h-12 bg-gradient-to-r from-[#00B4D8] to-[#006D77] hover:from-[#00B4D8]/90 hover:to-[#006D77]/90"
            disabled={paymentMethod === 'wallet' && walletAmount < getCurrentPrice()}
          >
            <Lock className="w-4 h-4 mr-2" />
            Confirm Payment ${getCurrentPrice()}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}