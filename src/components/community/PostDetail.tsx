import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
  Verified, Send, ThumbsUp
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import CommentSystem, { Comment } from '../shared/CommentSystem';

interface Post {
  id: string;
  type: 'image' | 'video';
  author: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
    isInfluencer: boolean;
  };
  content: {
    media: string;
    caption: string;
    products?: string[];
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    liked: boolean;
    saved: boolean;
  };
  timestamp: string;
}

interface PostDetailProps {
  post: Post;
  onBack: () => void;
}

export default function PostDetail({ post, onBack }: PostDetailProps) {
  const [liked, setLiked] = useState(post.engagement.liked);
  const [saved, setSaved] = useState(post.engagement.saved);
  const [likes, setLikes] = useState(post.engagement.likes);
  
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: {
        name: 'Emma Wilson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
        verified: false,
      },
      content: 'This is so helpful! What brand is that serum? 😍',
      timestamp: '1h ago',
      likes: 12,
      liked: false,
      replies: [
        {
          id: '1-1',
          author: {
            name: 'Sarah Beauty',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b7a1?w=150&h=150&fit=crop',
            verified: true,
            isInfluencer: true,
          },
          content: 'Thanks! It\'s the Glow Serum from SkinLux! 💕',
          timestamp: '45m ago',
          likes: 5,
          liked: false,
        },
        {
          id: '1-2',
          author: {
            name: 'Emma Wilson',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
            verified: false,
          },
          content: 'Perfect, thank you so much! 🙏',
          timestamp: '30m ago',
          likes: 2,
          liked: false,
        }
      ]
    },
    {
      id: '2',
      author: {
        name: 'Dr. Skin Expert',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
        verified: true,
      },
      content: 'Great routine! Vitamin C in the morning is perfect for protection.',
      timestamp: '45m ago',
      likes: 28,
      liked: false,
    },
    {
      id: '3',
      author: {
        name: 'Jessica Lee',
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop',
        verified: false,
      },
      content: 'Your skin looks amazing! How long have you been using this routine?',
      timestamp: '30m ago',
      likes: 5,
      liked: false,
      replies: [
        {
          id: '3-1',
          author: {
            name: 'Sarah Beauty',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b7a1?w=150&h=150&fit=crop',
            verified: true,
            isInfluencer: true,
          },
          content: 'About 3 months now! Consistency is key! ✨',
          timestamp: '20m ago',
          likes: 8,
          liked: false,
        }
      ]
    },
  ]);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
    toast.success(liked ? 'Removed from likes' : 'Post liked! ❤️');
  };

  const handleSave = () => {
    setSaved(!saved);
    toast.success(saved ? 'Removed from saved' : 'Post saved! 📌');
  };

  const handleShare = () => {
    toast.success('Link copied to clipboard!');
  };

  const handleAddComment = (content: string, parentId?: string) => {
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

    if (parentId) {
      // Add as reply
      setComments(prev => {
        const addReplyToComment = (comments: Comment[]): Comment[] => {
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
                replies: addReplyToComment(comment.replies)
              };
            }
            return comment;
          });
        };
        return addReplyToComment(prev);
      });
    } else {
      // Add as top-level comment
      setComments(prev => [newComment, ...prev]);
    }
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev => {
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
      return toggleLike(prev);
    });
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(prev => {
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
      return deleteComment(prev);
    });
  };

  const handleEditComment = (commentId: string, newContent: string) => {
    setComments(prev => {
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
      return editComment(prev);
    });
  };

  return (
    <div className="min-h-screen bg-background pb-4">
      {/* Post Image/Video */}
      <div className="relative">
        <ImageWithFallback
          src={post.content.media}
          alt="Post"
          className="w-full h-96 object-cover"
        />
        {post.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button size="lg" className="rounded-full w-16 h-16">
              <MessageCircle className="w-8 h-8" />
            </Button>
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Author Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{post.author.name}</h3>
                {post.author.verified && (
                  <Verified className="w-4 h-4 text-blue-500" />
                )}
                {post.author.isInfluencer && (
                  <Badge variant="secondary" className="text-xs">Influencer</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{post.author.username} • {post.timestamp}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>

        {/* Engagement Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2"
              onClick={handleLike}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
              <span>{likes.toLocaleString()}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <MessageCircle className="w-5 h-5" />
              <span>{comments.length}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2"
              onClick={handleShare}
            >
              <Share2 className="w-5 h-5" />
              <span>{post.engagement.shares}</span>
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleSave}
          >
            <Bookmark className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {/* Caption */}
        <div>
          <p className="text-sm">
            <span className="font-semibold">{post.author.name}</span>{' '}
            {post.content.caption}
          </p>
        </div>

        {/* Tagged Products */}
        {post.content.products && post.content.products.length > 0 && (
          <Card className="bg-secondary/20">
            <CardContent className="p-3">
              <p className="text-sm font-medium mb-2">Products in this post:</p>
              <div className="flex flex-wrap gap-2">
                {post.content.products.map((product, index) => (
                  <Badge key={index} variant="outline">
                    {product}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Separator />

        {/* Comments Section */}
        <div className="space-y-4">
          <h3 className="font-semibold">Comments ({comments.length})</h3>

          <CommentSystem
            comments={comments}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
            onDeleteComment={handleDeleteComment}
            onEditComment={handleEditComment}
            placeholder="Add a comment..."
            showReplies={true}
          />
        </div>
      </div>
    </div>
  );
}