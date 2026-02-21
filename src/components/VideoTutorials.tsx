import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Play, Clock, Eye, CheckCircle, BookOpen, 
  Camera, ShoppingBag, Crown, Users, Settings,
  TrendingUp, X, Volume2, VolumeX, Maximize,
  SkipBack, SkipForward, Pause
} from 'lucide-react';

interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  views: string;
  thumbnail: string;
  category: 'getting-started' | 'scanning' | 'products' | 'membership' | 'community' | 'advanced';
  completed?: boolean;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface VideoPlayerProps {
  video: VideoTutorial;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function VideoPlayer({ video, open, onOpenChange }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // Simulate progress
    if (!isPlaying) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            return 100;
          }
          return prev + 1;
        });
      }, 500);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 gap-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>{video.title}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col">
          {/* Video Player */}
          <div className="relative bg-black aspect-video">
            {/* Thumbnail/Video Background */}
            <img 
              src={video.thumbnail} 
              alt={video.title}
              className="w-full h-full object-cover"
            />
            
            {/* Play Overlay */}
            {!isPlaying && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Button
                  size="icon"
                  className="w-20 h-20 rounded-full bg-white/90 hover:bg-white text-[#00B4D8]"
                  onClick={handlePlayPause}
                >
                  <Play className="w-10 h-10 ml-1" />
                </Button>
              </div>
            )}

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="space-y-2">
                <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#00B4D8] transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                
                {/* Controls */}
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-white/20"
                      onClick={handlePlayPause}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-white/20"
                    >
                      <SkipBack className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-white/20"
                    >
                      <SkipForward className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-white/20"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs">{Math.floor(progress / 100 * 5)}:{String(Math.floor((progress / 100 * 300) % 60)).padStart(2, '0')} / {video.duration}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-white/20"
                    >
                      <Maximize className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Info */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{video.level}</Badge>
                    <Badge variant="outline">{video.category}</Badge>
                  </div>
                  <p className="text-muted-foreground">{video.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {video.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {video.views} views
                </div>
                {video.completed && (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    Completed
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">What you'll learn:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {getCourseOutline(video.category).map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#00B4D8] mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getCourseOutline(category: string): string[] {
  const outlines: Record<string, string[]> = {
    'getting-started': [
      'Create your SkinPAI account and set up your profile',
      'Navigate the main dashboard and understand key features',
      'Configure notification and privacy settings',
      'Connect with the SkinPAI community',
    ],
    'scanning': [
      'Position your face correctly for accurate scans',
      'Understand optimal lighting conditions',
      'Interpret your skin analysis results',
      'Track your skin health progress over time',
    ],
    'products': [
      'How AI generates personalized recommendations',
      'Filter products by skin concern and type',
      'Save products to your favorites list',
      'Read ingredient lists and reviews',
    ],
    'membership': [
      'Compare Guest, Member, and Pro tiers',
      'Upgrade your membership seamlessly',
      'Manage billing and payment methods',
      'Cancel or modify your subscription',
    ],
    'community': [
      'Follow skincare influencers and experts',
      'Create engaging posts and share your journey',
      'Participate in brand campaigns and challenges',
      'Build your own Creator Station (Pro only)',
    ],
    'advanced': [
      'Create and customize your skincare routines',
      'Set up automated reminders and tracking',
      'Analyze advanced skin metrics and trends',
      'Export your data and progress reports',
    ],
  };
  return outlines[category] || [];
}

export default function VideoTutorials() {
  const [selectedVideo, setSelectedVideo] = useState<VideoTutorial | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const tutorials: VideoTutorial[] = [
    {
      id: '1',
      title: 'Getting Started with SkinPAI',
      description: 'Learn the basics of SkinPAI and how to set up your account for the best skincare experience.',
      duration: '5:24',
      views: '12.5K',
      thumbnail: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=450&fit=crop',
      category: 'getting-started',
      completed: true,
      level: 'Beginner',
    },
    {
      id: '2',
      title: 'How to Scan Your Skin',
      description: 'Master the art of scanning your skin for accurate AI analysis. Tips for lighting, positioning, and more.',
      duration: '4:15',
      views: '18.2K',
      thumbnail: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&h=450&fit=crop',
      category: 'scanning',
      completed: true,
      level: 'Beginner',
    },
    {
      id: '3',
      title: 'Understanding Your Scan Results',
      description: 'Deep dive into what each metric means and how to interpret your personalized skin health score.',
      duration: '6:42',
      views: '15.8K',
      thumbnail: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=450&fit=crop',
      category: 'scanning',
      level: 'Intermediate',
    },
    {
      id: '4',
      title: 'Finding the Perfect Products',
      description: 'Discover how our AI matches you with products that target your specific skin concerns.',
      duration: '7:10',
      views: '22.1K',
      thumbnail: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=450&fit=crop',
      category: 'products',
      level: 'Beginner',
    },
    {
      id: '5',
      title: 'Membership Benefits Explained',
      description: 'Compare Guest, Member, and Pro tiers to find the perfect plan for your skincare journey.',
      duration: '3:55',
      views: '9.4K',
      thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=450&fit=crop',
      category: 'membership',
      level: 'Beginner',
    },
    {
      id: '6',
      title: 'Upgrading to Pro Membership',
      description: 'Step-by-step guide to upgrading your account and unlocking unlimited scans and Creator Stations.',
      duration: '4:30',
      views: '11.7K',
      thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=450&fit=crop',
      category: 'membership',
      level: 'Beginner',
    },
    {
      id: '7',
      title: 'Community Features Tour',
      description: 'Explore the SkinPAI community, follow influencers, and share your skincare journey.',
      duration: '5:50',
      views: '14.3K',
      thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=450&fit=crop',
      category: 'community',
      level: 'Beginner',
    },
    {
      id: '8',
      title: 'Creating Your First Post',
      description: 'Learn how to create engaging posts, add photos, tag products, and connect with the community.',
      duration: '4:20',
      views: '8.9K',
      thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=450&fit=crop',
      category: 'community',
      level: 'Beginner',
    },
    {
      id: '9',
      title: 'Setting Up Your Creator Station',
      description: 'Pro members only: Build your own content hub and start sharing exclusive skincare tips.',
      duration: '8:15',
      views: '6.2K',
      thumbnail: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=450&fit=crop',
      category: 'community',
      level: 'Advanced',
    },
    {
      id: '10',
      title: 'Advanced Routine Tracking',
      description: 'Create custom routines, set reminders, and track your progress with advanced analytics.',
      duration: '6:30',
      views: '10.1K',
      thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=450&fit=crop',
      category: 'advanced',
      level: 'Advanced',
    },
    {
      id: '11',
      title: 'Reading Ingredient Lists',
      description: 'Understand product ingredients, identify key actives, and spot potential allergens.',
      duration: '5:45',
      views: '13.6K',
      thumbnail: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&h=450&fit=crop',
      category: 'products',
      level: 'Intermediate',
    },
    {
      id: '12',
      title: 'Maximizing Scan Accuracy',
      description: 'Pro tips for getting the most accurate skin analysis results every time you scan.',
      duration: '3:40',
      views: '16.4K',
      thumbnail: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&h=450&fit=crop',
      category: 'scanning',
      level: 'Advanced',
    },
  ];

  const filteredTutorials = activeTab === 'all' 
    ? tutorials 
    : tutorials.filter(t => t.category === activeTab);

  const categories = [
    { id: 'all', label: 'All Videos', icon: BookOpen, count: tutorials.length },
    { id: 'getting-started', label: 'Getting Started', icon: Play, count: tutorials.filter(t => t.category === 'getting-started').length },
    { id: 'scanning', label: 'Skin Scanning', icon: Camera, count: tutorials.filter(t => t.category === 'scanning').length },
    { id: 'products', label: 'Products', icon: ShoppingBag, count: tutorials.filter(t => t.category === 'products').length },
    { id: 'membership', label: 'Membership', icon: Crown, count: tutorials.filter(t => t.category === 'membership').length },
    { id: 'community', label: 'Community', icon: Users, count: tutorials.filter(t => t.category === 'community').length },
    { id: 'advanced', label: 'Advanced', icon: TrendingUp, count: tutorials.filter(t => t.category === 'advanced').length },
  ];

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 py-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#00B4D8] to-[#006D77] mb-4">
          <Play className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold">Video Tutorials</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Learn everything about SkinPAI with our comprehensive video guides
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-[#00B4D8]">{tutorials.length}</div>
            <p className="text-xs text-muted-foreground">Total Videos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-[#00B4D8]">
              {tutorials.filter(t => t.completed).length}
            </div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-[#00B4D8]">45m</div>
            <p className="text-xs text-muted-foreground">Watch Time</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Tabs */}
      <div className="max-w-5xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 lg:grid-cols-7 w-full mb-6">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center gap-1 text-xs"
              >
                <category.icon className="w-3 h-3" />
                <span className="hidden sm:inline">{category.label}</span>
                <span className="sm:hidden">{category.label.split(' ')[0]}</span>
                <Badge variant="secondary" className="ml-1 text-xs px-1">
                  {category.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTutorials.map((tutorial) => (
                <Card 
                  key={tutorial.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow group overflow-hidden"
                  onClick={() => setSelectedVideo(tutorial)}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={tutorial.thumbnail}
                      alt={tutorial.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-[#00B4D8] ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      {tutorial.duration}
                    </div>
                    {tutorial.completed && (
                      <div className="absolute top-2 right-2 bg-green-600 text-white rounded-full p-1">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <CardHeader className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {tutorial.level}
                      </Badge>
                    </div>
                    <CardTitle className="text-base line-clamp-2">
                      {tutorial.title}
                    </CardTitle>
                    <CardDescription className="text-sm line-clamp-2">
                      {tutorial.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {tutorial.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {tutorial.duration}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTutorials.length === 0 && (
              <Card className="p-12">
                <div className="text-center text-muted-foreground">
                  <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No tutorials found in this category</p>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayer
          video={selectedVideo}
          open={!!selectedVideo}
          onOpenChange={(open) => !open && setSelectedVideo(null)}
        />
      )}
    </div>
  );
}
