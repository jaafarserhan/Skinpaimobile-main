import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Bell, Heart, MessageCircle, UserPlus, ShoppingBag, 
  TrendingUp, Award, Sparkles, CheckCheck, Trash2, Settings
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'product' | 'achievement' | 'scan' | 'routine';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  avatar?: string;
  actionUrl?: string;
}

interface NotificationsProps {
  onNavigate: (screen: string) => void;
}

export default function Notifications({ onNavigate }: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'scan',
      title: 'Daily Scan Reminder',
      message: "Don't forget to complete your daily skin scan!",
      timestamp: '10 min ago',
      read: false,
    },
    {
      id: '2',
      type: 'like',
      title: 'Sarah Beauty liked your post',
      message: 'Your skincare routine post received a new like',
      timestamp: '1h ago',
      read: false,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b7a1?w=150&h=150&fit=crop',
    },
    {
      id: '3',
      type: 'achievement',
      title: 'Achievement Unlocked! 🏆',
      message: 'You earned the "Week Warrior" badge for maintaining your routine for 7 days!',
      timestamp: '2h ago',
      read: false,
    },
    {
      id: '4',
      type: 'product',
      title: 'Special Offer: 25% Off',
      message: 'Limited time discount on Vitamin C Serum - Your recommended product!',
      timestamp: '3h ago',
      read: true,
    },
    {
      id: '5',
      type: 'comment',
      title: 'New comment on your post',
      message: 'Alex Johnson commented: "This routine looks amazing! What serum do you use?"',
      timestamp: '5h ago',
      read: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    },
    {
      id: '6',
      type: 'follow',
      title: 'Jessica Skin started following you',
      message: 'You have a new follower in the community',
      timestamp: '1d ago',
      read: true,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    },
    {
      id: '7',
      type: 'routine',
      title: 'Evening Routine Reminder',
      message: "It's time for your evening skincare routine!",
      timestamp: '1d ago',
      read: true,
    },
    {
      id: '8',
      type: 'scan',
      title: 'Scan Analysis Complete',
      message: 'Your skin scan results are ready to view. Overall score: 87/100',
      timestamp: '2d ago',
      read: true,
    },
  ]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-green-500" />;
      case 'product':
        return <ShoppingBag className="w-5 h-5 text-purple-500" />;
      case 'achievement':
        return <Award className="w-5 h-5 text-yellow-500" />;
      case 'scan':
        return <TrendingUp className="w-5 h-5 text-cyan-500" />;
      case 'routine':
        return <Sparkles className="w-5 h-5 text-pink-500" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    if (confirm('Are you sure you want to clear all notifications?')) {
      setNotifications([]);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const readNotifications = notifications.filter(n => n.read);
  const unreadNotifications = notifications.filter(n => !n.read);

  const NotificationItem = ({ notification }: { notification: Notification }) => (
    <Card 
      className={`mb-3 cursor-pointer transition-all hover:shadow-md ${
        !notification.read ? 'border-l-4 border-l-primary bg-accent/10' : ''
      }`}
      onClick={() => markAsRead(notification.id)}
    >
      <CardContent className="p-4">
        <div className="flex gap-3">
          {notification.avatar ? (
            <Avatar className="w-10 h-10">
              <AvatarImage src={notification.avatar} />
              <AvatarFallback>{notification.title.charAt(0)}</AvatarFallback>
            </Avatar>
          ) : (
            <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center">
              {getNotificationIcon(notification.type)}
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="font-medium text-sm">{notification.title}</h4>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {notification.timestamp}
              </span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {notification.message}
            </p>
            {!notification.read && (
              <Badge variant="default" className="mt-2 text-xs">
                New
              </Badge>
            )}
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteNotification(notification.id);
            }}
            className="text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground">
              You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onNavigate('settings')}
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      {/* Action Buttons */}
      {notifications.length > 0 && (
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={markAllAsRead}
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark all as read
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={clearAll}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear all
          </Button>
        </div>
      )}

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">No notifications</h3>
              <p className="text-sm text-muted-foreground">
                You're all caught up! Check back later for new updates.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread ({unreadCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            {notifications.map(notification => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </TabsContent>

          <TabsContent value="unread" className="mt-4">
            {unreadNotifications.length > 0 ? (
              unreadNotifications.map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
              ))
            ) : (
              <Card>
                <CardContent className="p-8">
                  <div className="text-center">
                    <CheckCheck className="w-12 h-12 mx-auto mb-3 text-green-500" />
                    <h3 className="font-medium mb-1">All caught up!</h3>
                    <p className="text-sm text-muted-foreground">
                      No unread notifications
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
