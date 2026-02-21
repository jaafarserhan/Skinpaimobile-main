import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Check, Crown, Sparkles, TrendingUp, Bell, 
  Calendar, Award, Heart, Zap, Shield, X
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { User } from '../types';

interface UpgradeMemberProps {
  onUpgrade: () => void;
  onNavigate: (screen: string) => void;
}

export default function UpgradeMember({ onUpgrade, onNavigate }: UpgradeMemberProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  const features = [
    { icon: TrendingUp, text: '5 scans per day (vs 1 for guests)', highlight: true },
    { icon: Calendar, text: 'Advanced progress tracking', highlight: true },
    { icon: Bell, text: 'Smart routine reminders', highlight: false },
    { icon: Award, text: 'Achievements & badges', highlight: false },
    { icon: Heart, text: 'Personalized recommendations', highlight: false },
    { icon: Sparkles, text: 'Priority customer support', highlight: false },
    { icon: Zap, text: 'Early access to new features', highlight: false },
    { icon: Shield, text: 'Data backup & history', highlight: false },
  ];

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: 9.99,
      period: '/month',
      savings: null,
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: 79.99,
      period: '/year',
      savings: 'Save 33%',
      popular: true,
    },
  ];

  const handleUpgrade = () => {
    toast.success('Subscription activated! Welcome to SkinPAI Premium! 🎉');
    onUpgrade();
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 py-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent-foreground mb-4">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold">Upgrade to Member</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Unlock premium features and take your skincare journey to the next level
        </p>
      </div>

      {/* Plan Selection */}
      <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`cursor-pointer transition-all relative ${
              selectedPlan === plan.id
                ? 'border-primary border-2 shadow-lg'
                : 'hover:border-primary/50'
            }`}
            onClick={() => setSelectedPlan(plan.id as 'monthly' | 'yearly')}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-white">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              </div>
            )}
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">{plan.name}</h3>
              <div className="mb-2">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
              {plan.savings && (
                <Badge variant="secondary" className="text-xs">
                  {plan.savings}
                </Badge>
              )}
              {selectedPlan === plan.id && (
                <div className="mt-3">
                  <div className="w-6 h-6 rounded-full bg-primary mx-auto flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features List */}
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>What's Included</CardTitle>
          <CardDescription>Everything you need for perfect skin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                feature.highlight ? 'bg-primary' : 'bg-secondary'
              }`}>
                <Check className={`w-3 h-3 ${
                  feature.highlight ? 'text-white' : 'text-foreground'
                }`} />
              </div>
              <p className={`flex-1 ${feature.highlight ? 'font-medium' : ''}`}>
                {feature.text}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Guest vs Member Comparison */}
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Guest vs Member</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
              <span className="text-sm">Daily Scans</span>
              <div className="flex gap-4">
                <span className="text-sm text-muted-foreground">Guest: 1</span>
                <span className="text-sm font-medium text-primary">Member: 5</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
              <span className="text-sm">Progress Tracking</span>
              <div className="flex gap-4">
                <X className="w-5 h-5 text-muted-foreground" />
                <Check className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
              <span className="text-sm">Routine Reminders</span>
              <div className="flex gap-4">
                <X className="w-5 h-5 text-muted-foreground" />
                <Check className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
              <span className="text-sm">Achievements</span>
              <div className="flex gap-4">
                <X className="w-5 h-5 text-muted-foreground" />
                <Check className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="max-w-lg mx-auto space-y-3">
        <Button 
          size="lg" 
          className="w-full"
          onClick={handleUpgrade}
        >
          <Crown className="w-5 h-5 mr-2" />
          Start Free 7-Day Trial
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          Cancel anytime. No questions asked.
        </p>
        <Button 
          variant="ghost" 
          className="w-full"
          onClick={() => onNavigate('camera')}
        >
          Maybe Later
        </Button>
      </div>

      {/* Trust Indicators */}
      <div className="max-w-lg mx-auto">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">10K+</p>
            <p className="text-xs text-muted-foreground">Members</p>
          </div>
          <div>
            <p className="text-2xl font-bold">4.9</p>
            <p className="text-xs text-muted-foreground">Rating</p>
          </div>
          <div>
            <p className="text-2xl font-bold">98%</p>
            <p className="text-xs text-muted-foreground">Satisfaction</p>
          </div>
        </div>
      </div>
    </div>
  );
}