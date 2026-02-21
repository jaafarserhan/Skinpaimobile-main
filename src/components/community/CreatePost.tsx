import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  Image, Video, Smile, Hash, AtSign, X, Camera, 
  Upload, Sparkles, Send
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface CreatePostProps {
  onClose: () => void;
  onPost: (content: string, media: string[], hashtags: string[]) => void;
}

export default function CreatePost({ onClose, onPost }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);

  const popularHashtags = [
    '#skincare', '#glowup', '#routine', '#selfcare', '#beauty',
    '#skincareroutine', '#healthyskin', '#skincaretips', '#glowing',
    '#skinpaicommunity', '#skincarejourney', '#skincarelover'
  ];

  const handlePost = () => {
    if (!content.trim() && mediaFiles.length === 0) {
      toast.error('Please add content or media to your post');
      return;
    }

    onPost(content, mediaFiles, selectedHashtags);
    toast.success('Post shared successfully! 🎉');
    onClose();
  };

  const toggleHashtag = (tag: string) => {
    if (selectedHashtags.includes(tag)) {
      setSelectedHashtags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedHashtags(prev => [...prev, tag]);
    }
  };

  const handleMediaUpload = () => {
    // Simulate media upload
    toast.success('Media uploaded!');
    setMediaFiles(prev => [...prev, 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop']);
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create Post</h1>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Author Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">Your Name</p>
              <p className="text-sm text-muted-foreground">@username</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Input */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <Textarea
            placeholder="Share your skincare journey, tips, or results... ✨"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="resize-none"
          />

          {/* Media Preview */}
          {mediaFiles.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {mediaFiles.map((media, index) => (
                <div key={index} className="relative">
                  <img 
                    src={media} 
                    alt="Upload" 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setMediaFiles(prev => prev.filter((_, i) => i !== index))}
                    className="absolute top-2 right-2 p-1 bg-destructive rounded-full text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Media Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleMediaUpload}>
              <Image className="w-4 h-4 mr-2" />
              Photo
            </Button>
            <Button variant="outline" size="sm" onClick={handleMediaUpload}>
              <Video className="w-4 h-4 mr-2" />
              Video
            </Button>
            <Button variant="outline" size="sm">
              <Smile className="w-4 h-4 mr-2" />
              Emoji
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Hashtags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Hash className="w-5 h-5" />
            Add Hashtags
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {popularHashtags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedHashtags.includes(tag) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => toggleHashtag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
          {selectedHashtags.length > 0 && (
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground mb-2">Selected:</p>
              <div className="flex flex-wrap gap-2">
                {selectedHashtags.map((tag) => (
                  <Badge key={tag} variant="default">
                    {tag}
                    <button
                      onClick={() => toggleHashtag(tag)}
                      className="ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Tips for a great post:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Share your honest experience</li>
                <li>• Use relevant hashtags</li>
                <li>• Tag products you're using</li>
                <li>• Engage with comments</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 pb-4">
        <Button variant="outline" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button className="flex-1" onClick={handlePost}>
          <Send className="w-4 h-4 mr-2" />
          Post
        </Button>
      </div>
    </div>
  );
}