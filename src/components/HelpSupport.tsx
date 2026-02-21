import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { 
  HelpCircle, Mail, MessageCircle, Book, Video, 
  Send, Search, Phone, Globe, FileText, Shield
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import LiveChat from './LiveChat';
import VideoTutorials from './VideoTutorials';

export default function HelpSupport() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showVideoTutorials, setShowVideoTutorials] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  // If showing video tutorials, render that component
  if (showVideoTutorials) {
    return (
      <div>
        <Button 
          variant="ghost" 
          onClick={() => setShowVideoTutorials(false)}
          className="mb-4"
        >
          ← Back to Help & Support
        </Button>
        <VideoTutorials />
      </div>
    );
  }

  const faqs = [
    {
      question: 'How accurate is the skin analysis?',
      answer: 'Our AI-powered skin analysis uses advanced computer vision technology with 95%+ accuracy. Results are based on multiple skin health indicators including hydration, evenness, clarity, and firmness.',
    },
    {
      question: 'How many scans can I do per day?',
      answer: 'Guest users get 1 scan per day, while Members get 5 scans per day. We recommend scanning at consistent times for best tracking results.',
    },
    {
      question: 'Can I cancel my membership anytime?',
      answer: 'Yes! You can cancel your membership at any time from your account settings. No questions asked, and you\'ll retain access until the end of your billing period.',
    },
    {
      question: 'How do product recommendations work?',
      answer: 'Our AI analyzes your skin scan results and matches them with products that address your specific concerns. We partner with verified brands and distributors to provide accurate recommendations.',
    },
    {
      question: 'Is my data secure and private?',
      answer: 'Absolutely. We use bank-level encryption for all data. Your scan images and personal information are never shared with third parties without your explicit consent.',
    },
    {
      question: 'How do I set up routine reminders?',
      answer: 'Go to your Dashboard > Routine tab, and click on any routine item to set custom reminders. You can configure time, frequency, and notification preferences.',
    },
    {
      question: 'What should I do before scanning?',
      answer: 'For best results: 1) Clean your face, 2) Use natural lighting, 3) Remove makeup, 4) Hold camera at eye level, 5) Keep face centered in the frame.',
    },
    {
      question: 'Can I track progress over time?',
      answer: 'Yes! Members can access full scan history and progress tracking in the Dashboard. View trends in your skin metrics over days, weeks, and months.',
    },
    {
      question: 'How do I follow influencers?',
      answer: 'Visit the Community tab, browse influencer profiles, and tap the Follow button. You\'ll see their posts in your feed and get notifications when they share new content.',
    },
    {
      question: 'Are product links affiliated?',
      answer: 'Some product links may be affiliated, which helps us keep the app free. All products are independently recommended based on your skin analysis.',
    },
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.email || !contactForm.message) {
      toast.error('Please fill in required fields');
      return;
    }
    toast.success('Message sent! We\'ll respond within 24 hours.');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 py-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <HelpCircle className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground">
          We're here to help you get the most out of SkinPAI
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => toast.info('User guide coming soon!')}>
          <CardContent className="p-4 text-center">
            <Book className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">User Guide</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowVideoTutorials(true)}>
          <CardContent className="p-4 text-center">
            <Video className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">Video Tutorials</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setIsChatOpen(true)}>
          <CardContent className="p-4 text-center">
            <MessageCircle className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">Live Chat</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => toast.info('Community forum coming soon!')}>
          <CardContent className="p-4 text-center">
            <Globe className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">Community</p>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Find quick answers to common questions</CardDescription>
          
          {/* Search */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {filteredFaqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          {filteredFaqs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No FAQs found matching "{searchQuery}"</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Form */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Still need help?</CardTitle>
          <CardDescription>Send us a message and we'll get back to you</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitContact} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="your@email.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                placeholder="How can we help?"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                required
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Describe your issue or question..."
                rows={5}
              />
            </div>
            
            <Button type="submit" className="w-full">
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Additional Resources */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Additional Resources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Terms of Service
            </span>
          </Button>
          <Button variant="outline" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Privacy Policy
            </span>
          </Button>
          <Button variant="outline" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              support@skinpai.app
            </span>
          </Button>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <div className="max-w-2xl mx-auto text-center text-sm text-muted-foreground space-y-2">
        <p>Need immediate assistance? We're available 24/7</p>
        <div className="flex items-center justify-center gap-4">
          <a href="mailto:support@skinpai.app" className="flex items-center gap-1 hover:text-primary">
            <Mail className="w-4 h-4" />
            Email
          </a>
          <span>•</span>
          <button onClick={() => setIsChatOpen(true)} className="flex items-center gap-1 hover:text-primary">
            <MessageCircle className="w-4 h-4" />
            Live Chat
          </button>
          <span>•</span>
          <a href="#" className="flex items-center gap-1 hover:text-primary">
            <Phone className="w-4 h-4" />
            Call
          </a>
        </div>
      </div>

      {/* Live Chat Modal */}
      <LiveChat 
        open={isChatOpen} 
        onOpenChange={setIsChatOpen}
        onShowVideoTutorials={() => {
          setIsChatOpen(false);
          setShowVideoTutorials(true);
        }}
      />
    </div>
  );
}