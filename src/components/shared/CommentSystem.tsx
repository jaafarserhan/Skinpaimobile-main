import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { 
  ThumbsUp, Send, MessageCircle, Verified, MoreVertical,
  Trash2, Flag, Edit3, ChevronDown, ChevronUp
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
    verified?: boolean;
    isInfluencer?: boolean;
    isBrand?: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  liked?: boolean;
  replies?: Comment[];
  isOwner?: boolean;
}

interface CommentSystemProps {
  comments: Comment[];
  onAddComment: (content: string, parentId?: string) => void;
  onLikeComment: (commentId: string) => void;
  onDeleteComment?: (commentId: string) => void;
  onEditComment?: (commentId: string, newContent: string) => void;
  placeholder?: string;
  showReplies?: boolean;
  maxDepth?: number;
  currentDepth?: number;
}

export default function CommentSystem({ 
  comments,
  onAddComment,
  onLikeComment,
  onDeleteComment,
  onEditComment,
  placeholder = "Add a comment...",
  showReplies = true,
  maxDepth = 3,
  currentDepth = 0
}: CommentSystemProps) {
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    
    onAddComment(commentText);
    setCommentText('');
    toast.success('Comment posted!');
  };

  const handleAddReply = (parentId: string) => {
    if (!replyText.trim()) return;
    
    onAddComment(replyText, parentId);
    setReplyText('');
    setReplyingTo(null);
    
    // Expand the parent comment to show the new reply
    setExpandedReplies(prev => new Set(prev).add(parentId));
    
    toast.success('Reply posted!');
  };

  const handleEdit = (commentId: string, currentContent: string) => {
    setEditingComment(commentId);
    setEditText(currentContent);
  };

  const handleSaveEdit = (commentId: string) => {
    if (!editText.trim() || !onEditComment) return;
    
    onEditComment(commentId, editText);
    setEditingComment(null);
    setEditText('');
    toast.success('Comment updated!');
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditText('');
  };

  const handleDelete = (commentId: string) => {
    if (!onDeleteComment) return;
    
    onDeleteComment(commentId);
    toast.success('Comment deleted');
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const renderComment = (comment: Comment, depth: number = 0) => {
    const isExpanded = expandedReplies.has(comment.id);
    const hasReplies = comment.replies && comment.replies.length > 0;
    const canReply = showReplies && depth < maxDepth;

    return (
      <div key={comment.id} className={`${depth > 0 ? 'ml-8 mt-3' : 'mt-4'}`}>
        <div className="flex gap-3">
          {/* Avatar */}
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage src={comment.author.avatar} />
            <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            {/* Comment bubble */}
            <div className="bg-secondary/20 rounded-lg p-3">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{comment.author.name}</span>
                  {comment.author.verified && (
                    <Verified className="w-3 h-3 text-blue-500 flex-shrink-0" />
                  )}
                  {comment.author.isInfluencer && (
                    <Badge variant="default" className="text-xs bg-[#00B4D8] h-4 px-1">Creator</Badge>
                  )}
                  {comment.author.isBrand && (
                    <Badge variant="secondary" className="text-xs h-4 px-1">Brand</Badge>
                  )}
                  <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                </div>

                {/* Comment menu */}
                {(comment.isOwner || onDeleteComment) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreVertical className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {comment.isOwner && onEditComment && (
                        <DropdownMenuItem onClick={() => handleEdit(comment.id, comment.content)}>
                          <Edit3 className="w-3 h-3 mr-2" />
                          Edit
                        </DropdownMenuItem>
                      )}
                      {comment.isOwner && onDeleteComment && (
                        <DropdownMenuItem 
                          onClick={() => handleDelete(comment.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-3 h-3 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      )}
                      {!comment.isOwner && (
                        <DropdownMenuItem onClick={() => toast.info('Report submitted')}>
                          <Flag className="w-3 h-3 mr-2" />
                          Report
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {/* Comment content (editable or display) */}
              {editingComment === comment.id ? (
                <div className="space-y-2">
                  <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="text-sm"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleSaveEdit(comment.id)}>
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm break-words">{comment.content}</p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 mt-1 ml-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-auto py-1 px-2 text-xs"
                onClick={() => onLikeComment(comment.id)}
              >
                <ThumbsUp className={`w-3 h-3 mr-1 ${comment.liked ? 'fill-current text-[#00B4D8]' : ''}`} />
                {comment.likes > 0 && <span>{comment.likes}</span>}
              </Button>

              {canReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto py-1 px-2 text-xs"
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Reply
                </Button>
              )}

              {/* Show/hide replies button */}
              {hasReplies && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto py-1 px-2 text-xs"
                  onClick={() => toggleReplies(comment.id)}
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-3 h-3 mr-1" />
                      Hide {comment.replies!.length} {comment.replies!.length === 1 ? 'reply' : 'replies'}
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3 mr-1" />
                      View {comment.replies!.length} {comment.replies!.length === 1 ? 'reply' : 'replies'}
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Reply input */}
            {replyingTo === comment.id && (
              <div className="flex gap-2 mt-3">
                <Avatar className="w-6 h-6">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder={`Reply to ${comment.author.name}...`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddReply(comment.id)}
                    className="text-sm"
                    autoFocus
                  />
                  <Button size="sm" onClick={() => handleAddReply(comment.id)}>
                    <Send className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}

            {/* Nested replies */}
            {hasReplies && isExpanded && (
              <div className="mt-2">
                {comment.replies!.map(reply => renderComment(reply, depth + 1))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Add new comment (only show at root level) */}
      {currentDepth === 0 && (
        <div className="flex gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1 flex gap-2">
            <Input
              placeholder={placeholder}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
            />
            <Button size="icon" onClick={handleAddComment}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-1">
        {comments.map(comment => renderComment(comment, currentDepth))}
      </div>

      {comments.length === 0 && currentDepth === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-20" />
          <p className="text-sm">No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  );
}
