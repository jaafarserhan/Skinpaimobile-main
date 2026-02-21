import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import {
  MessageCircle,
  Send,
  X,
  Minimize2,
  Maximize2,
  Paperclip,
  Smile,
  MoreVertical,
  CheckCheck,
  Phone,
  Video,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
  topic?: string; // Track the topic of each message
}

interface LiveChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShowVideoTutorials?: () => void;
}

export default function LiveChat({ open, onOpenChange, onShowVideoTutorials }: LiveChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! 👋 Welcome to SkinPAI Support. I\'m Sarah, your virtual assistant. How can I help you today?',
      sender: 'agent',
      timestamp: new Date(),
      status: 'read',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [agentStatus, setAgentStatus] = useState<'online' | 'away' | 'offline'>('online');
  const [currentTopic, setCurrentTopic] = useState<keyof typeof quickActionSets>('initial');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate agent typing and responses
  const simulateAgentResponse = (userMessage: string) => {
    setIsTyping(true);
    
    // Simulate typing delay
    setTimeout(() => {
      setIsTyping(false);
      
      // Smart responses based on keywords
      let response = getSmartResponse(userMessage);
      
      const agentMessage: Message = {
        id: Date.now().toString(),
        text: response,
        sender: 'agent',
        timestamp: new Date(),
        status: 'read',
      };
      
      setMessages(prev => [...prev, agentMessage]);
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5s
  };

  const getSmartResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();
    
    // Back to main topics
    if (msg.includes('back to main') || msg.includes('main topics')) {
      return 'Sure! Here are the main topics I can help with:\n\n📸 Skin scanning & analysis\n💎 Membership & upgrades\n🛍️ Product recommendations\n👤 Account management\n👥 Community features\n💳 Billing & payments\n🔒 Privacy & security\n\nWhat would you like to know about?';
    }
    
    // Scanning - Detailed responses
    if (msg.includes('scan accuracy') || msg.includes('accuracy tips')) {
      return '📸 Tips for 95%+ accurate scans:\n\n1. Clean & dry face (no makeup)\n2. Natural lighting (face a window)\n3. Eye-level camera angle\n4. Keep still for 3 seconds\n5. Center face in frame\n6. Remove glasses/hats\n\nBest times: Morning or early afternoon!';
    }
    if (msg.includes('how many scans') || msg.includes('scans left')) {
      return '📊 Scan limits by tier:\n\n🆓 Guest: 1 scan per day\n💎 Member: 5 scans total (not per day)\n👑 Pro: Unlimited scans!\n\nYour scans reset based on your membership. Want to upgrade for more?';
    }
    if (msg.includes('scan history') || msg.includes('view scan history')) {
      return '📈 Scan history shows:\n\n• All past skin analyses\n• Progress over time\n• Trend comparisons\n• Improvement metrics\n\nMembers & Pro: Access full history in Dashboard\nGuests: Upgrade to unlock history tracking!';
    }
    if (msg.includes('best lighting') || msg.includes('lighting for scans')) {
      return '💡 Best lighting for scans:\n\n✅ Natural daylight (near window)\n✅ Bright but not harsh\n✅ Even lighting on face\n✅ Avoid direct sunlight\n\n❌ Avoid:\n• Overhead lights\n• Flash photography\n• Dark rooms\n• Colored lighting';
    }
    
    // Membership - Detailed responses
    if (msg.includes('compare') || msg.includes('membership tiers')) {
      return '💎 Membership Comparison:\n\n🆓 GUEST (Free)\n• 1 scan/day\n• Basic results\n\n💎 MEMBER ($9.99/mo)\n• 5 total scans\n• Full history tracking\n• Priority support\n\n👑 PRO ($19.99/mo)\n• UNLIMITED scans\n• Creator Station\n• Advanced analytics\n• Exclusive campaigns';
    }
    if (msg.includes('how to upgrade')) {
      return '⬆️ Upgrading is easy!\n\n1. Go to Profile → Membership\n2. Choose your tier (Member or Pro)\n3. Enter payment details\n4. Confirm & enjoy!\n\nFirst 7 days: Full refund if not satisfied!';
    }
    if (msg.includes('cancel membership')) {
      return '❌ To cancel membership:\n\n1. Profile → Settings\n2. Subscription tab\n3. Cancel Subscription\n4. Confirm cancellation\n\n• Keep access until period ends\n• No questions asked\n• Refund within 7 days\n\nNeed help? Contact support!';
    }
    if (msg.includes('membership benefits') || msg.includes('benefits')) {
      return '✨ Membership Benefits:\n\n💎 Member:\n• 5 scans (vs 1/day)\n• Progress tracking\n• Scan history\n• Priority support\n\n👑 Pro (All above +):\n• Unlimited scans\n• Creator Station\n• Advanced analytics\n• Exclusive events\n• Early access features';
    }
    if (msg.includes('payment methods') || msg.includes('payment method')) {
      return '💳 We accept:\n\n✓ Credit/Debit Cards (Visa, MC, Amex)\n✓ PayPal\n✓ Apple Pay\n✓ Google Pay\n✓ SkinPAI Wallet\n\n🔒 All payments secured with bank-level encryption!';
    }
    
    // Products - Detailed responses
    if (msg.includes('how recommendations work')) {
      return '🤖 Our AI Recommendation System:\n\n1. Analyzes your skin scan\n2. Identifies concerns (dryness, acne, etc.)\n3. Matches with verified products\n4. Prioritizes by effectiveness\n5. Considers your skin type\n\n95% accuracy • 1000+ products • Verified brands';
    }
    if (msg.includes('browse products')) {
      return '🛍️ Browse our product catalog:\n\n1. Tap "Shop" tab in bottom nav\n2. Filter by category/concern\n3. View details & ingredients\n4. Save to favorites ❤️\n5. Shop directly from brands\n\nAll products are dermatologist-approved!';
    }
    if (msg.includes('save to favorites') || msg.includes('favorites')) {
      return '❤️ Save products to Favorites:\n\n1. Tap heart icon on any product\n2. Access via Profile → Favorites\n3. Organize by category\n4. Get price drop alerts\n5. Quick reorder access\n\nPerfect for tracking your routine!';
    }
    if (msg.includes('product ingredients') || msg.includes('ingredients')) {
      return '🧪 Product Ingredients:\n\nEach product page shows:\n• Full ingredient list\n• Key actives highlighted\n• Allergen warnings\n• Clean beauty badges\n• Cruelty-free status\n\nTap any ingredient for details!';
    }
    if (msg.includes('shipping')) {
      return '📦 Shipping Info:\n\n• Products ship from brand partners\n• Delivery times vary by brand\n• Tracking provided\n• Returns: Check brand policy\n\nSkinPAI connects you to brands - we don\'t ship directly.';
    }
    
    // Account - Detailed responses
    if (msg.includes('reset password')) {
      return '🔑 Reset Password:\n\n1. Login screen → "Forgot Password"\n2. Enter your email\n3. Check email for reset link\n4. Create new password\n5. Login with new password\n\nNo email? Check spam or contact support!';
    }
    if (msg.includes('update profile')) {
      return '👤 Update Profile:\n\n1. Go to Profile → Settings\n2. Edit name, photo, bio\n3. Update skin concerns\n4. Set preferences\n5. Save changes\n\nKeep your profile updated for better recommendations!';
    }
    if (msg.includes('privacy settings')) {
      return '🔒 Privacy Settings:\n\n• Profile visibility\n• Data sharing preferences\n• Scan history privacy\n• Marketing emails\n• Push notifications\n\nAccess: Profile → Settings → Privacy';
    }
    if (msg.includes('delete account')) {
      return '⚠️ Delete Account:\n\nThis is permanent and will:\n• Delete all scan data\n• Remove saved products\n• Cancel subscriptions\n• Erase profile\n\nTo delete: Profile → Settings → Delete Account\n\nWant to keep data but pause? Try deactivating instead!';
    }
    if (msg.includes('login issues')) {
      return '🔓 Login Issues?\n\nTry these:\n1. Check email spelling\n2. Verify password\n3. Clear browser cache\n4. Try "Forgot Password"\n5. Check internet connection\n\nStill stuck? Contact support for help!';
    }
    
    // Community - Detailed responses
    if (msg.includes('follow influencers')) {
      return '✨ Follow Influencers:\n\n1. Go to Community tab\n2. Browse influencer profiles\n3. Tap "Follow" button\n4. See their posts in feed\n5. Get notifications\n\nDiscover skincare experts & beauty creators!';
    }
    if (msg.includes('create a post') || msg.includes('create post')) {
      return '📸 Create a Post:\n\n1. Community → + button\n2. Upload photo/video\n3. Write caption\n4. Add hashtags\n5. Tag products (optional)\n6. Share!\n\nShare your journey & inspire others!';
    }
    if (msg.includes('join campaigns') || msg.includes('campaigns')) {
      return '🎨 Join Campaigns:\n\n• Brand collaborations\n• Skincare challenges\n• Product testing\n• Giveaways\n• Community events\n\nFind active campaigns in Community → Campaigns tab!';
    }
    if (msg.includes('creator stations') || msg.includes('station')) {
      return '📺 Creator Stations (Pro Only!):\n\n• Your own content hub\n• Share exclusive tips\n• Build your community\n• Monetization options\n• Analytics dashboard\n\nUpgrade to Pro to create your station!';
    }
    if (msg.includes('community guidelines')) {
      return '📋 Community Guidelines:\n\n✓ Be respectful & kind\n✓ Share authentic content\n✓ No spam or promotions\n✓ Respect privacy\n✓ Report inappropriate content\n\nViolations may result in account suspension.';
    }
    
    // Billing - Detailed responses
    if (msg.includes('wallet balance') || msg.includes('view wallet')) {
      return '💰 SkinPAI Wallet:\n\nView balance: Profile → Wallet\n\nUse wallet for:\n• Membership payments\n• In-app purchases\n• Campaign prizes\n• Referral bonuses\n\nCurrent balance shown in profile!';
    }
    if (msg.includes('add funds')) {
      return '💵 Add Funds to Wallet:\n\n1. Profile → Wallet\n2. Tap "Add Funds"\n3. Enter amount ($10-$1000)\n4. Choose payment method\n5. Confirm transaction\n\nInstant credit • Secure processing!';
    }
    if (msg.includes('payment history')) {
      return '📊 Payment History:\n\nView all transactions:\n1. Profile → Wallet\n2. Transaction History tab\n3. Filter by date/type\n4. Download statements\n\nTrack subscriptions, purchases & refunds!';
    }
    if (msg.includes('refund policy') || msg.includes('refund')) {
      return '↩️ Refund Policy:\n\n• Memberships: 7-day money-back\n• Wallet funds: Non-refundable\n• Products: Contact brand directly\n• Subscriptions: Pro-rated refunds\n\nRequest refund: support@skinpai.app';
    }
    if (msg.includes('update payment method')) {
      return '💳 Update Payment Method:\n\n1. Profile → Wallet\n2. Payment Methods\n3. Add/remove cards\n4. Set default payment\n5. Update billing info\n\nAll changes are instant & secure!';
    }
    
    // Privacy - Detailed responses
    if (msg.includes('data security')) {
      return '🔐 Data Security:\n\n• AES-256 encryption\n• Secure cloud storage\n• Regular security audits\n• No third-party sharing\n• Compliant with GDPR/CCPA\n\nYour data is protected with military-grade security!';
    }
    if (msg.includes('privacy policy')) {
      return '📄 Privacy Policy:\n\nView full policy:\nProfile → Settings → Privacy Policy\n\nKey points:\n• We don\'t sell your data\n• You control your info\n• Delete anytime\n• Transparent practices\n\nQuestions? contact support!';
    }
    if (msg.includes('delete my data')) {
      return '🗑️ Delete Your Data:\n\nOptions:\n1. Delete specific scans\n2. Clear scan history\n3. Delete entire account\n\nTo delete:\nProfile → Settings → Privacy → Data Management\n\n⚠️ Deletion is permanent!';
    }
    if (msg.includes('gdpr')) {
      return '🇪🇺 GDPR Rights:\n\nYou have the right to:\n• Access your data\n• Correct inaccuracies\n• Delete information\n• Data portability\n• Withdraw consent\n\nExercise rights: support@skinpai.app';
    }
    if (msg.includes('terms of service')) {
      return '📜 Terms of Service:\n\nView terms:\nProfile → Settings → Terms of Service\n\nCovers:\n• Account usage\n• Content guidelines\n• Subscription terms\n• Liability & disclaimers\n\nUpdated: Dec 2024';
    }
    
    // General scan-related
    if (msg.includes('scan') || msg.includes('analysis')) {
      return 'For accurate skin scans:\n\n✓ Clean your face thoroughly\n✓ Use natural lighting\n✓ Remove all makeup\n✓ Hold camera at eye level\n✓ Keep face centered\n\nGuests get 1 scan/day, Members get 5 scans total. Would you like to upgrade for unlimited scans?';
    }
    
    // Membership queries
    if (msg.includes('member') || msg.includes('upgrade') || msg.includes('pro')) {
      return 'Great question! SkinPAI has 3 membership tiers:\n\n🆓 Guest: 1 scan/day\n💎 Member ($9.99/mo): 5 total scans + history tracking\n👑 Pro ($19.99/mo): Unlimited scans + Creator Station\n\nWould you like help upgrading?';
    }
    
    // Product recommendations
    if (msg.includes('product') || msg.includes('recommend')) {
      return 'Our AI recommends products based on your skin scan results! After each scan, you\'ll see personalized recommendations for:\n\n• Cleansers\n• Moisturizers\n• Serums\n• Sunscreens\n\nAll products are from verified brands. Tap "Shop" to browse!';
    }
    
    // Account/login issues
    if (msg.includes('login') || msg.includes('password') || msg.includes('account')) {
      return 'Having trouble with your account? I can help!\n\n• Forgot password? Use the "Reset Password" option\n• Can\'t log in? Check your email/password\n• New to SkinPAI? Create a free account to get started\n\nNeed more help? I can connect you to a human agent.';
    }
    
    // Community/influencer queries
    if (msg.includes('community') || msg.includes('influencer')) {
      return 'Our Community features:\n\n✨ Follow skincare influencers\n📸 Share your journey\n🎨 Join campaigns & challenges\n📺 Creator Stations (Pro only)\n\nCheck out the Community tab to explore!';
    }
    
    // Payment/billing
    if (msg.includes('pay') || msg.includes('bill') || msg.includes('wallet')) {
      return 'For billing questions:\n\n• View/update payment: Profile → Wallet\n• Cancel membership: Settings → Subscription\n• Refunds: Available within 7 days\n• Add funds: Profile → Wallet → Add Funds\n\nNeed to speak with billing? I can transfer you.';
    }
    
    // Privacy/security
    if (msg.includes('private') || msg.includes('secure') || msg.includes('data')) {
      return '🔒 Your privacy is our priority!\n\n• Bank-level encryption\n• Scans stored securely\n• Never shared without consent\n• GDPR compliant\n• Delete data anytime\n\nView our Privacy Policy in Settings for details.';
    }
    
    // Greeting
    if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey')) {
      return 'Hello! 👋 How can I assist you with SkinPAI today? I can help with:\n\n• Skin scanning tips\n• Membership upgrades\n• Product recommendations\n• Account issues\n• Community features\n\nWhat would you like to know?';
    }
    
    // Thank you
    if (msg.includes('thank') || msg.includes('thanks')) {
      return 'You\'re very welcome! 😊 Is there anything else I can help you with today?';
    }
    
    // Default response
    return 'I\'m here to help! I can assist with:\n\n📸 Skin scanning & analysis\n💎 Membership & upgrades\n🛍️ Product recommendations\n👤 Account management\n👥 Community features\n💳 Billing & payments\n\nWhat can I help you with?';
  };

  // Detect topic from user message and update quick actions
  const detectTopicAndUpdateActions = (userMessage: string) => {
    const msg = userMessage.toLowerCase();
    
    // Check for "back to main topics" to reset
    if (msg.includes('back to main') || msg.includes('main topics')) {
      setCurrentTopic('initial');
      return;
    }
    
    // Detect topic based on keywords
    if (msg.includes('scan') || msg.includes('analysis') || msg.includes('accuracy') || msg.includes('lighting')) {
      setCurrentTopic('scanning');
    } else if (msg.includes('member') || msg.includes('upgrade') || msg.includes('pro') || msg.includes('tier')) {
      setCurrentTopic('membership');
    } else if (msg.includes('product') || msg.includes('recommend') || msg.includes('ingredient') || msg.includes('shipping')) {
      setCurrentTopic('products');
    } else if (msg.includes('account') || msg.includes('login') || msg.includes('password') || msg.includes('profile')) {
      setCurrentTopic('account');
    } else if (msg.includes('community') || msg.includes('influencer') || msg.includes('station') || msg.includes('campaign')) {
      setCurrentTopic('community');
    } else if (msg.includes('wallet') || msg.includes('billing') || msg.includes('payment') || msg.includes('refund') || msg.includes('cancel')) {
      setCurrentTopic('billing');
    } else if (msg.includes('privacy') || msg.includes('security') || msg.includes('data') || msg.includes('gdpr')) {
      setCurrentTopic('privacy');
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Detect topic and update quick actions
    detectTopicAndUpdateActions(inputMessage);

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent',
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    
    // Update message status to delivered after a delay
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 500);
    
    // Simulate agent response
    simulateAgentResponse(inputMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Define quick action sets for different contexts
  const quickActionSets = {
    initial: [
      'How do I scan?',
      'Upgrade to Pro',
      'Product help',
      'Account issues',
      'Community features',
      'Wallet & Billing',
    ],
    scanning: [
      'Scan accuracy tips',
      'How many scans left?',
      'View scan history',
      'Best lighting for scans',
      'Upgrade for more scans',
      'Back to main topics',
    ],
    membership: [
      'Compare membership tiers',
      'How to upgrade?',
      'Cancel membership',
      'Membership benefits',
      'Payment methods',
      'Back to main topics',
    ],
    products: [
      'How recommendations work',
      'Browse products',
      'Save to favorites',
      'Product ingredients',
      'Shipping info',
      'Back to main topics',
    ],
    account: [
      'Reset password',
      'Update profile',
      'Privacy settings',
      'Delete account',
      'Login issues',
      'Back to main topics',
    ],
    community: [
      'Follow influencers',
      'Create a post',
      'Join campaigns',
      'Creator Stations',
      'Community guidelines',
      'Back to main topics',
    ],
    billing: [
      'View wallet balance',
      'Add funds',
      'Payment history',
      'Refund policy',
      'Update payment method',
      'Back to main topics',
    ],
    privacy: [
      'Data security',
      'Privacy policy',
      'Delete my data',
      'GDPR rights',
      'Terms of service',
      'Back to main topics',
    ],
  };

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={`max-w-md ${isMinimized ? 'h-16' : 'h-[600px]'} transition-all duration-300 flex flex-col p-0 gap-0`}
      >
        {/* Header */}
        <DialogHeader className="p-4 border-b bg-gradient-to-r from-[#00B4D8] to-[#006D77] text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border-2 border-white">
                <AvatarImage src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop" />
                <AvatarFallback>SA</AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-white text-base">SkinPAI Support</DialogTitle>
                <DialogDescription className="text-white/90 text-xs sr-only">
                  Chat with SkinPAI support assistant
                </DialogDescription>
                <div className="flex items-center gap-2 text-xs text-white/90">
                  <div className={`w-2 h-2 rounded-full ${agentStatus === 'online' ? 'bg-green-400' : 'bg-gray-400'}`} />
                  {agentStatus === 'online' ? 'Online now' : 'Away'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => onOpenChange(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {!isMinimized && (
          <>
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        message.sender === 'user'
                          ? 'bg-[#00B4D8] text-white rounded-br-none'
                          : 'bg-muted text-foreground rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className={`text-xs ${message.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'}`}>
                          {message.timestamp.toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        {message.sender === 'user' && message.status && (
                          <CheckCheck className={`w-3 h-3 ${
                            message.status === 'read' ? 'text-white' : 'text-white/50'
                          }`} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-2xl rounded-bl-none px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Quick Actions */}
            <div className="px-4 pb-2 border-t pt-3">
              <p className="text-xs text-muted-foreground mb-2">Quick actions:</p>
              <div className="flex flex-wrap gap-2">
                {quickActionSets[currentTopic].map((action, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-[#00B4D8] hover:text-white hover:border-[#00B4D8] transition-colors"
                    onClick={() => handleQuickAction(action)}
                  >
                    {action}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-muted/30">
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pr-20 resize-none"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => toast.info('Attachments coming soon!')}
                    >
                      <Paperclip className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => toast.info('Emojis coming soon!')}
                    >
                      <Smile className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
                <Button
                  size="icon"
                  className="bg-[#00B4D8] hover:bg-[#00B4D8]/90 flex-shrink-0"
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Footer Info */}
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Powered by SkinPAI AI • Available 24/7
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}