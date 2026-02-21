import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  ArrowLeft, Settings, Share2, MoreVertical, 
  MapPin, Calendar, Award, Users, TrendingUp,
  Instagram, Youtube, Twitter, Globe, Mail,
  Edit, Trash2, BarChart3, Heart, MessageCircle,
  Eye, Sparkles, Star, Crown, CheckCircle
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import CommentSystem, { Comment } from '../shared/CommentSystem';

interface StationData {
  stationName: string;
  stationUsername: string;
  bio: string;
  description: string;
  location: string;
  coverImage: string;
  avatarImage: string;
  specialties: string[];
  theme: string;
  socialLinks: {
    instagram: string;
    youtube: string;
    twitter: string;
    website: string;
    email: string;
  };
  certifications: string[];
  experience: string;
  contentFrequency: string;
  createdDate: string;
}

interface StationViewProps {
  station: StationData;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function StationView({ station, onBack, onEdit, onDelete }: StationViewProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [postComments, setPostComments] = useState<{ [key: string]: Comment[] }>({
    '1': [
      {
        id: 'c1',
        author: {
          name: 'Alice Johnson',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b7a1?w=150&h=150&fit=crop',
          verified: false,
        },
        content: 'This product changed my life! 🌟',
        timestamp: '2h ago',
        likes: 15,
        liked: false,
      },
      {
        id: 'c2',
        author: {
          name: 'Beauty Expert',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
          verified: true,
          isInfluencer: true,
        },
        content: 'Great review! I love seeing real results like this.',
        timestamp: '1h ago',
        likes: 8,
        liked: false,
        replies: [
          {
            id: 'c2-1',
            author: {
              name: 'Alice Johnson',
              avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b7a1?w=150&h=150&fit=crop',
              verified: false,
            },
            content: 'Thank you! Your tips helped so much!',
            timestamp: '30m ago',
            likes: 3,
            liked: false,
          }
        ]
      }
    ],
    '2': [],
    '3': []
  });
  const [postLikes, setPostLikes] = useState<{ [key: string]: boolean }>({});

  // Mock stats
  const stats = {
    followers: 1234,
    following: 567,
    posts: 45,
    likes: 8932,
    views: 24567,
    engagement: 8.5
  };

  // Mock posts
  const posts = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
      likes: 234,
      comments: 12,
      views: 1234
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop',
      likes: 189,
      comments: 8,
      views: 987
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
      likes: 345,
      comments: 21,
      views: 1567
    }
  ];

  const handleShare = () => {
    toast.success('Station link copied to clipboard!');
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast.success(isFollowing ? 'Unfollowed station' : 'Following station!');
  };

  const handleDeleteConfirm = () => {
    if (window.confirm('Are you sure you want to delete your station? This action cannot be undone.')) {
      onDelete();
    }
  };

  const themes = {
    educational: { name: 'Educational', icon: '📚' },
    routine: { name: 'Routine Focused', icon: '🗓️' },
    reviews: { name: 'Product Reviews', icon: '⭐' },
    transformation: { name: 'Transformations', icon: '✨' },
    lifestyle: { name: 'Lifestyle', icon: '💫' },
    professional: { name: 'Professional', icon: '👨‍⚕️' }
  };

  const contentFrequencyLabels = {
    daily: 'Daily',
    '3-5': '3-5 times/week',
    '1-2': '1-2 times/week',
    occasional: 'Occasional'
  };

  const handleAddComment = (postId: string, content: string, parentId?: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      author: {
        name: 'You',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
        verified: false,
      },
      content,
      timestamp: 'Just now',
      likes: 0,
      liked: false,
      isOwner: true,
    };

    setPostComments(prev => {
      const comments = prev[postId] || [];
      
      if (parentId) {
        const addReply = (comments: Comment[]): Comment[] => {
          return comments.map(comment => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newComment]
              };
            }
            if (comment.replies) {
              return {
                ...comment,
                replies: addReply(comment.replies)
              };
            }
            return comment;
          });
        };
        return { ...prev, [postId]: addReply(comments) };
      } else {
        return { ...prev, [postId]: [newComment, ...comments] };
      }
    });
  };

  const handleLikeComment = (postId: string, commentId: string) => {
    setPostComments(prev => {
      const comments = prev[postId] || [];
      const toggleLike = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              liked: !comment.liked,
              likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
            };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: toggleLike(comment.replies)
            };
          }
          return comment;
        });
      };
      return { ...prev, [postId]: toggleLike(comments) };
    });
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    setPostComments(prev => {
      const comments = prev[postId] || [];
      const deleteComment = (comments: Comment[]): Comment[] => {
        return comments.filter(comment => {
          if (comment.id === commentId) {
            return false;
          }
          if (comment.replies) {
            comment.replies = deleteComment(comment.replies);
          }
          return true;
        });
      };
      return { ...prev, [postId]: deleteComment(comments) };
    });
  };

  const handleEditComment = (postId: string, commentId: string, newContent: string) => {
    setPostComments(prev => {
      const comments = prev[postId] || [];
      const editComment = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              content: newContent,
            };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: editComment(comment.replies)
            };
          }
          return comment;
        });
      };
      return { ...prev, [postId]: editComment(comments) };
    });
  };

  const handlePostClick = (postId: string) => {
    setSelectedPost(postId);
  };

  const handleLikePost = (postId: string) => {
    setPostLikes(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
    toast.success(postLikes[postId] ? 'Like removed' : 'Post liked!');
  };

  const selectedPostData = posts.find(p => p.id === selectedPost);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header with back button */}
      <div className="sticky top-16 bg-background border-b border-border z-10 p-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold">Creator Station</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share Station
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Station
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleDeleteConfirm}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Station
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative">
        <ImageWithFallback
          src={station.coverImage}
          alt="Cover"
          className="w-full h-48 object-cover"
        />
        <div className="absolute -bottom-16 left-4">
          <ImageWithFallback
            src={station.avatarImage}
            alt="Avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-background shadow-lg"
          />
          <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2">
            <Crown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="p-4 pt-20">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold">{station.stationName}</h2>
              <CheckCircle className="w-5 h-5 text-primary fill-primary" />
            </div>
            <p className="text-muted-foreground">@{station.stationUsername}</p>
          </div>
          <Button onClick={onEdit} size="sm" variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Manage
          </Button>
        </div>

        <p className="text-sm mb-3">{station.bio}</p>

        {/* Location & Theme */}
        <div className="flex flex-wrap gap-3 mb-4">
          {station.location && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {station.location}
            </div>
          )}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            Joined {new Date(station.createdDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span>{themes[station.theme as keyof typeof themes]?.icon}</span>
            <span className="text-muted-foreground">{themes[station.theme as keyof typeof themes]?.name}</span>
          </div>
        </div>

        {/* Specialties */}
        <div className="flex flex-wrap gap-2 mb-4">
          {station.specialties.map((specialty, idx) => (
            <Badge key={idx} variant="secondary">
              {specialty}
            </Badge>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="font-bold text-lg">{stats.posts}</div>
            <div className="text-xs text-muted-foreground">Posts</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg">{stats.followers.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Followers</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg">{stats.likes.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Likes</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg">{stats.engagement}%</div>
            <div className="text-xs text-muted-foreground">Engagement</div>
          </div>
        </div>

        {/* Social Links */}
        {Object.values(station.socialLinks).some(link => link.trim()) && (
          <div className="flex gap-3 mb-4 pb-4 border-b border-border">
            {station.socialLinks.instagram && (
              <a href={`https://instagram.com/${station.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <Instagram className="w-5 h-5" />
                </Button>
              </a>
            )}
            {station.socialLinks.youtube && (
              <a href={station.socialLinks.youtube} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <Youtube className="w-5 h-5" />
                </Button>
              </a>
            )}
            {station.socialLinks.twitter && (
              <a href={`https://twitter.com/${station.socialLinks.twitter}`} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <Twitter className="w-5 h-5" />
                </Button>
              </a>
            )}
            {station.socialLinks.website && (
              <a href={station.socialLinks.website} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <Globe className="w-5 h-5" />
                </Button>
              </a>
            )}
            {station.socialLinks.email && (
              <a href={`mailto:${station.socialLinks.email}`}>
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <Mail className="w-5 h-5" />
                </Button>
              </a>
            )}
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <TabsContent value="posts" className="mt-4">
            {posts.length > 0 ? (
              <div className="grid grid-cols-3 gap-1">
                {posts.map((post) => (
                  <div 
                    key={post.id} 
                    className="relative aspect-square group cursor-pointer"
                    onClick={() => handlePostClick(post.id)}
                  >
                    <ImageWithFallback
                      src={post.image}
                      alt="Post"
                      className="w-full h-full object-cover rounded"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center gap-3">
                      <div className="flex items-center gap-1 text-white text-sm">
                        <Heart className="w-4 h-4 fill-white" />
                        {post.likes}
                      </div>
                      <div className="flex items-center gap-1 text-white text-sm">
                        <MessageCircle className="w-4 h-4" />
                        {postComments[post.id]?.length || 0}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Sparkles className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">No posts yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start creating content to build your station!
                  </p>
                  <Button onClick={() => toast.info('Create Post feature coming soon!')}>
                    Create Your First Post
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="mt-4 space-y-4">
            {station.description && (
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{station.description}</p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Credentials</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium mb-2">Certifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {station.certifications.map((cert, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        <Award className="w-3 h-3 mr-1" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {station.experience && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Experience</h4>
                    <p className="text-sm text-muted-foreground">{station.experience}</p>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium mb-2">Posting Frequency</h4>
                  <p className="text-sm text-muted-foreground">
                    {contentFrequencyLabels[station.contentFrequency as keyof typeof contentFrequencyLabels]}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Total Views</span>
                    </div>
                    <div className="text-2xl font-bold">{stats.views.toLocaleString()}</div>
                    <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" />
                      +12% this week
                    </div>
                  </div>

                  <div className="p-4 bg-accent-foreground/5 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-4 h-4 text-accent-foreground" />
                      <span className="text-sm font-medium">Engagement</span>
                    </div>
                    <div className="text-2xl font-bold">{stats.engagement}%</div>
                    <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" />
                      +2.3% this week
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-medium mb-3">Growth Stats</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Follower Growth</span>
                        <span className="font-medium">+89 this month</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-3/4" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Content Performance</span>
                        <span className="font-medium">Excellent</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-4/5" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">Pro Tip</h4>
                    <p className="text-sm text-muted-foreground">
                      Post consistently at peak times (7-9 PM) to maximize engagement with your audience!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Post Detail Dialog with Comments */}
      {selectedPost && selectedPostData && (
        <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
            <div className="relative">
              <ImageWithFallback
                src={selectedPostData.image}
                alt="Post"
                className="w-full h-64 object-cover"
              />
            </div>

            <div className="p-6 space-y-4">
              {/* Post Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => handleLikePost(selectedPost)}
                  >
                    <Heart className={`w-5 h-5 ${postLikes[selectedPost] ? 'fill-red-500 text-red-500' : ''}`} />
                    <span>{selectedPostData.likes.toLocaleString()}</span>
                  </Button>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm">{postComments[selectedPost]?.length || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    <span className="text-sm">{selectedPostData.views.toLocaleString()}</span>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => toast.success('Link copied to clipboard!')}
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="font-semibold mb-4">
                  Comments ({postComments[selectedPost]?.length || 0})
                </h3>

                <CommentSystem
                  comments={postComments[selectedPost] || []}
                  onAddComment={(content, parentId) => handleAddComment(selectedPost, content, parentId)}
                  onLikeComment={(commentId) => handleLikeComment(selectedPost, commentId)}
                  onDeleteComment={(commentId) => handleDeleteComment(selectedPost, commentId)}
                  onEditComment={(commentId, newContent) => handleEditComment(selectedPost, commentId, newContent)}
                  placeholder="Add a comment..."
                  showReplies={true}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}