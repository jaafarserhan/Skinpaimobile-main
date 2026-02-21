import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Crown, Zap, Camera, Users, BarChart3, Infinity, Check } from 'lucide-react';

interface UpgradePromptModalProps {
  open: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  reason: 'scan_limit' | 'community_post' | 'history' | 'analytics' | 'general';
  currentTier: 'guest' | 'member' | 'pro';
}

const tierColors = {
  guest: 'bg-gray-500',
  member: 'bg-blue-500',
  pro: 'bg-gradient-to-r from-amber-500 to-orange-500'
};

const upgradeReasons = {
  scan_limit: {
    title: "You've Reached Your Scan Limit",
    description: "Upgrade to get more scans and track your skin health journey.",
    icon: Camera,
  },
  community_post: {
    title: "Creators Only Feature",
    description: "Become a Pro Creator to share content with the community.",
    icon: Users,
  },
  history: {
    title: "Save Your History",
    description: "Upgrade to keep track of all your scans and see your progress over time.",
    icon: BarChart3,
  },
  analytics: {
    title: "Advanced Analytics",
    description: "Get detailed insights about your skin health trends.",
    icon: BarChart3,
  },
  general: {
    title: "Unlock Premium Features",
    description: "Get the most out of SkinPAI with a premium membership.",
    icon: Crown,
  },
};

const memberBenefits = [
  { icon: Camera, text: '3 scans per day' },
  { icon: BarChart3, text: 'Progress tracking' },
  { icon: Check, text: 'Save scan history' },
  { icon: Check, text: 'Personalized routines' },
];

const proBenefits = [
  { icon: Infinity, text: 'Unlimited scans' },
  { icon: Users, text: 'Create community posts' },
  { icon: Zap, text: 'Creator Station access' },
  { icon: BarChart3, text: 'Advanced analytics' },
  { icon: Crown, text: 'Priority support' },
];

export default function UpgradePromptModal({ 
  open, 
  onClose, 
  onUpgrade, 
  reason = 'general',
  currentTier = 'guest'
}: UpgradePromptModalProps) {
  const reasonConfig = upgradeReasons[reason];
  const ReasonIcon = reasonConfig.icon;
  
  const targetTier = currentTier === 'guest' ? 'member' : 'pro';
  const benefits = targetTier === 'member' ? memberBenefits : proBenefits;
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className={`w-16 h-16 rounded-full ${tierColors[targetTier]} flex items-center justify-center`}>
              <ReasonIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl">
            {reasonConfig.title}
          </DialogTitle>
          <DialogDescription className="text-center">
            {reasonConfig.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="capitalize">{currentTier}</Badge>
            <span className="text-muted-foreground">→</span>
            <Badge className={`${tierColors[targetTier]} text-white capitalize`}>
              {targetTier === 'pro' && <Crown className="w-3 h-3 mr-1" />}
              {targetTier}
            </Badge>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <p className="text-sm font-medium text-center">
              {targetTier === 'member' ? 'Member Benefits' : 'Pro Benefits'}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <benefit.icon className="w-4 h-4 text-primary" />
                  <span>{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Scan limits info */}
          <div className="text-center text-xs text-muted-foreground">
            {currentTier === 'guest' && (
              <p>Guest: 1 scan per week • Member: 3 scans per day</p>
            )}
            {currentTier === 'member' && (
              <p>Member: 3 scans per day • Pro: Unlimited scans</p>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button 
            onClick={onUpgrade} 
            className={`w-full ${targetTier === 'pro' ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600' : ''}`}
          >
            {targetTier === 'pro' && <Crown className="w-4 h-4 mr-2" />}
            Upgrade to {targetTier === 'member' ? 'Member' : 'Pro'}
          </Button>
          <Button variant="ghost" onClick={onClose} className="w-full">
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
