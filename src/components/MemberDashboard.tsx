import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { User, ScanResult, RoutineItem, Reminder, ProgressWidget, Achievement } from '../types';
import { 
  TrendingUp, Calendar, Target, CheckCircle, Circle, Bell, Clock, 
  Droplets, Sun, Flame, Award, Zap, Heart, Volume2, Smartphone,
  TrendingDown, Minus, Plus, Save, Settings, Trophy, Star,
  Activity, BarChart3, Sparkles, Shield, Coffee, Moon, Sunrise,
  Trash2, Edit, X
} from 'lucide-react';
import { toast } from 'sonner';
import { useLocalStorage, STORAGE_KEYS } from '../hooks/useLocalStorage';
import { useAppTranslation } from '../hooks/useAppTranslation';
import api, { SkinProgressDto } from '../services/api';

interface MemberDashboardProps {
  user: User;
  scanHistory: ScanResult[];
  onNavigate?: (screen: string) => void;
  onViewScan?: (scan: ScanResult) => void;
}

export default function MemberDashboard({ user, scanHistory, onNavigate, onViewScan }: MemberDashboardProps) {
  const { t, isRTL, direction, flexDir, textAlign } = useAppTranslation();
  
  // Skin progress data from API
  const [skinProgress, setSkinProgress] = useState<SkinProgressDto | null>(null);
  const [progressLoading, setProgressLoading] = useState(true);

  // Load skin progress from API
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const { data, error } = await api.getSkinProgress(30);
        if (data && !error) {
          setSkinProgress(data);
        }
      } catch (err) {
        console.error('Failed to load skin progress:', err);
      } finally {
        setProgressLoading(false);
      }
    };
    loadProgress();
  }, []);

  const [routineItems, setRoutineItems] = useLocalStorage<RoutineItem[]>(
    'skinpai_routine_items',
    [
      { id: 1, name: 'Morning Cleanser', time: 'AM', completed: true, reminderTime: '07:00', reminderEnabled: true },
      { id: 2, name: 'Vitamin C Serum', time: 'AM', completed: true, reminderTime: '07:05', reminderEnabled: true },
      { id: 3, name: 'SPF 50 Sunscreen', time: 'AM', completed: false, reminderTime: '07:10', reminderEnabled: false },
      { id: 4, name: 'Evening Cleanser', time: 'PM', completed: false, reminderTime: '21:00', reminderEnabled: true },
      { id: 5, name: 'Retinol Treatment', time: 'PM', completed: false, reminderTime: '21:30', reminderEnabled: true },
      { id: 6, name: 'Night Moisturizer', time: 'PM', completed: false, reminderTime: '21:35', reminderEnabled: false }
    ]
  );

  const [reminders, setReminders] = useLocalStorage<Reminder[]>(
    'skinpai_reminders',
    [
      {
        id: 'rem-1',
        routineItemId: 1,
        time: '07:00',
        frequency: 'daily',
        enabled: true,
        soundEnabled: true,
        vibrationEnabled: true
      }
    ]
  );

  const [selectedRoutineItem, setSelectedRoutineItem] = useState<RoutineItem | null>(null);
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [addRoutineDialogOpen, setAddRoutineDialogOpen] = useState(false);
  const [editRoutineDialogOpen, setEditRoutineDialogOpen] = useState(false);
  const [newRoutineItem, setNewRoutineItem] = useState<Partial<RoutineItem>>({
    name: '',
    time: 'AM',
    completed: false,
    reminderTime: '07:00',
    reminderEnabled: false
  });
  
  // Reminder form state
  const [reminderForm, setReminderForm] = useState({
    time: '07:00',
    frequency: 'daily' as 'daily' | 'weekly' | 'custom',
    soundEnabled: true,
    vibrationEnabled: true,
    enabled: true
  });

  // Helper to calculate trend from progress data
  const calculateTrend = (progressData: { date: string; value: number }[] | undefined): { trend: 'up' | 'down' | 'stable'; value: number } => {
    if (!progressData || progressData.length < 2) return { trend: 'stable', value: 0 };
    const latest = progressData[progressData.length - 1]?.value || 0;
    const previous = progressData[progressData.length - 2]?.value || 0;
    const diff = latest - previous;
    if (diff > 0) return { trend: 'up', value: Math.round(diff) };
    if (diff < 0) return { trend: 'down', value: Math.round(Math.abs(diff)) };
    return { trend: 'stable', value: 0 };
  };

  // Get hydration trend from API or fallback
  const hydrationTrend = calculateTrend(skinProgress?.hydrationProgress);
  const acneTrend = calculateTrend(skinProgress?.acneProgress);
  const overallTrend = { 
    trend: (skinProgress?.scoreChange || 0) > 0 ? 'up' : (skinProgress?.scoreChange || 0) < 0 ? 'down' : 'stable',
    value: Math.abs(Math.round(skinProgress?.scoreChange || 0))
  } as const;

  // Progress widgets data - using API data with fallback to scan history
  const latestHydration = skinProgress?.hydrationProgress?.slice(-1)[0]?.value ?? scanHistory[0]?.hydration ?? 0;
  const latestAcne = skinProgress?.acneProgress?.slice(-1)[0]?.value ?? scanHistory[0]?.acne ?? 0;
  const averageScore = skinProgress?.averageScore ?? scanHistory[0]?.overallScore ?? 0;

  const progressWidgets: ProgressWidget[] = [
    {
      id: 'hydration',
      title: 'Hydration Level',
      value: Math.round(latestHydration),
      maxValue: 100,
      unit: '%',
      trend: hydrationTrend.trend,
      trendValue: hydrationTrend.value,
      color: 'text-blue-600',
      icon: 'droplets',
      description: 'Skin moisture retention'
    },
    {
      id: 'evenness',
      title: 'Skin Evenness',
      value: scanHistory[0]?.evenness || 0,
      maxValue: 100,
      unit: '%',
      trend: 'up',
      trendValue: 3,
      color: 'text-green-600',
      icon: 'activity',
      description: 'Skin tone uniformity'
    },
    {
      id: 'clarity',
      title: 'Clarity Score',
      value: scanHistory[0]?.clarity || 0,
      maxValue: 100,
      unit: '%',
      trend: 'stable',
      trendValue: 0,
      color: 'text-purple-600',
      icon: 'sparkles',
      description: 'Skin transparency and radiance'
    },
    {
      id: 'firmness',
      title: 'Firmness',
      value: scanHistory[0]?.firmness || 0,
      maxValue: 100,
      unit: '%',
      trend: 'up',
      trendValue: 2,
      color: 'text-orange-600',
      icon: 'shield',
      description: 'Skin elasticity and strength'
    },
    {
      id: 'overall-score',
      title: 'Overall Score',
      value: Math.round(averageScore),
      maxValue: 100,
      unit: '%',
      trend: overallTrend.trend as 'up' | 'down' | 'stable',
      trendValue: overallTrend.value,
      color: 'text-emerald-600',
      icon: 'bar-chart-3',
      description: skinProgress ? `Based on ${skinProgress.totalScans} scans` : 'Overall skin health'
    },
    {
      id: 'routine-streak',
      title: 'Routine Streak',
      value: 12,
      maxValue: 30,
      unit: 'days',
      trend: 'up',
      trendValue: 1,
      color: 'text-red-600',
      icon: 'flame',
      description: 'Consecutive days following routine'
    },
    {
      id: 'weekly-scans',
      title: 'Weekly Progress',
      value: 2,
      maxValue: 3,
      unit: 'scans',
      trend: 'stable',
      trendValue: 0,
      color: 'text-indigo-600',
      icon: 'bar-chart-3',
      description: 'Skin analysis frequency'
    },
    {
      id: 'product-usage',
      title: 'Product Consistency',
      value: 85,
      maxValue: 100,
      unit: '%',
      trend: 'up',
      trendValue: 7,
      color: 'text-pink-600',
      icon: 'heart',
      description: 'Skincare product adherence'
    },
    {
      id: 'uv-protection',
      title: 'UV Protection',
      value: 6,
      maxValue: 7,
      unit: 'days',
      trend: 'down',
      trendValue: 1,
      color: 'text-yellow-600',
      icon: 'sun',
      description: 'Daily sunscreen application'
    },
    {
      id: 'sleep-quality',
      title: 'Sleep Impact',
      value: 7.5,
      maxValue: 10,
      unit: 'hrs',
      trend: 'up',
      trendValue: 0.5,
      color: 'text-violet-600',
      icon: 'moon',
      description: 'Sleep quality affecting skin'
    },
    {
      id: 'hydration-intake',
      title: 'Water Intake',
      value: 2.1,
      maxValue: 3.0,
      unit: 'L',
      trend: 'stable',
      trendValue: 0,
      color: 'text-cyan-600',
      icon: 'coffee',
      description: 'Daily water consumption'
    }
  ];

  // Achievements data
  const achievements: Achievement[] = [
    {
      id: 'first-scan',
      title: 'First Scan',
      description: 'Complete your first skin analysis',
      icon: '🎯',
      earned: true,
      earnedDate: '2024-12-01',
      progress: 1,
      maxProgress: 1
    },
    {
      id: 'week-streak',
      title: 'Week Warrior',
      description: 'Maintain routine for 7 days',
      icon: '🔥',
      earned: true,
      earnedDate: '2024-12-08',
      progress: 7,
      maxProgress: 7
    },
    {
      id: 'month-streak',
      title: 'Monthly Master',
      description: 'Maintain routine for 30 days',
      icon: '👑',
      earned: false,
      progress: 12,
      maxProgress: 30
    },
    {
      id: 'improvement',
      title: 'Glow Up',
      description: 'Improve overall score by 10 points',
      icon: '✨',
      earned: false,
      progress: 6,
      maxProgress: 10
    }
  ];

  const getProgressTrend = () => {
    if (scanHistory.length < 2) return null;
    const latest = scanHistory[0].overallScore;
    const previous = scanHistory[1].overallScore;
    const diff = latest - previous;
    return {
      value: Math.abs(diff),
      isPositive: diff > 0,
      text: diff > 0 ? 'improvement' : 'decline'
    };
  };

  const trend = getProgressTrend();

  const renderIcon = (iconName: string, className: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      droplets: <Droplets className={className} />,
      activity: <Activity className={className} />,
      sparkles: <Sparkles className={className} />,
      shield: <Shield className={className} />,
      flame: <Flame className={className} />,
      'bar-chart-3': <BarChart3 className={className} />,
      heart: <Heart className={className} />,
      sun: <Sun className={className} />,
      moon: <Moon className={className} />,
      coffee: <Coffee className={className} />
    };
    return iconMap[iconName] || <Circle className={className} />;
  };

  const renderProgressWidget = (widget: ProgressWidget) => (
    <Card key={widget.id} className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {renderIcon(widget.icon, `w-5 h-5 ${widget.color}`)}
          <h4 className="font-medium text-sm">{widget.title}</h4>
        </div>
        <div className="flex items-center gap-1 text-xs">
          {widget.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-500" />}
          {widget.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-500" />}
          {widget.trend === 'stable' && <Minus className="w-3 h-3 text-gray-500" />}
          {widget.trendValue > 0 && (
            <span className={widget.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
              {widget.trend === 'up' ? '+' : '-'}{widget.trendValue}
            </span>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-baseline gap-1">
          <span className={`text-2xl font-bold ${widget.color}`}>
            {widget.value}
          </span>
          <span className="text-sm text-muted-foreground">
            /{widget.maxValue} {widget.unit}
          </span>
        </div>
        
        <Progress 
          value={(widget.value / widget.maxValue) * 100} 
          className="h-2" 
        />
        
        <p className="text-xs text-muted-foreground">
          {widget.description}
        </p>
      </div>
    </Card>
  );

  const handleSetReminder = (routineItem: RoutineItem) => {
    setSelectedRoutineItem(routineItem);
    setReminderDialogOpen(true);
  };

  const handleSaveReminder = () => {
    if (!selectedRoutineItem) return;
    
    // Update routine item with reminder settings
    setRoutineItems(prev => prev.map(item => 
      item.id === selectedRoutineItem.id 
        ? { ...item, reminderEnabled: true, reminderTime: selectedRoutineItem.reminderTime }
        : item
    ));
    
    setReminderDialogOpen(false);
    setSelectedRoutineItem(null);
  };

  const toggleRoutineItemCompletion = (itemId: number) => {
    setRoutineItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleAddRoutineItem = () => {
    setAddRoutineDialogOpen(true);
  };

  const handleSaveNewRoutineItem = () => {
    if (!newRoutineItem.name) {
      toast.error('Product name is required');
      return;
    }

    const newId = routineItems.length > 0 ? routineItems[routineItems.length - 1].id + 1 : 1;
    setRoutineItems(prev => [...prev, { ...newRoutineItem, id: newId } as RoutineItem]);
    setAddRoutineDialogOpen(false);
    setNewRoutineItem({
      name: '',
      time: 'AM',
      completed: false,
      reminderTime: '07:00',
      reminderEnabled: false
    });
  };

  const handleEditRoutineItem = (item: RoutineItem) => {
    setSelectedRoutineItem(item);
    setEditRoutineDialogOpen(true);
  };

  const handleSaveEditRoutineItem = () => {
    if (!selectedRoutineItem) return;
    if (!selectedRoutineItem.name) {
      toast.error('Product name is required');
      return;
    }

    setRoutineItems(prev => prev.map(item => 
      item.id === selectedRoutineItem.id ? { ...selectedRoutineItem } : item
    ));
    
    setEditRoutineDialogOpen(false);
    setSelectedRoutineItem(null);
  };

  const handleDeleteRoutineItem = (itemId: number) => {
    setRoutineItems(prev => prev.filter(item => item.id !== itemId));
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6" dir={direction}>
      {/* Welcome Section */}
      <Card>
        <CardContent className="p-6">
          <div className={`flex items-center justify-between mb-4 ${flexDir()}`}>
            <div>
              <h2 className={`text-2xl font-semibold ${textAlign()}`}>{t('dashboard.welcomeBack', { name: user.name })}</h2>
              <p className={`text-muted-foreground ${textAlign()}`}>{t('dashboard.trackJourney')}</p>
            </div>
            <Badge variant="default">{t('dashboard.member')}</Badge>
          </div>
          
          {scanHistory.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{scanHistory[0].overallScore}</div>
                <div className="text-sm text-muted-foreground">{t('dashboard.latestScore')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{scanHistory.length}</div>
                <div className="text-sm text-muted-foreground">{t('dashboard.totalScans')}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Creator Station Quick Access */}
      {user.hasStation && user.stationData && (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent-foreground/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{user.stationData.stationName}</h3>
                <p className="text-sm text-muted-foreground">{t('dashboard.yourCreatorStation')}</p>
              </div>
              <Button 
                size="sm"
                onClick={() => onNavigate?.('station-view')}
              >
                {t('common.view')}
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-primary/10">
              <div className="text-center">
                <div className="font-semibold text-sm">0</div>
                <div className="text-xs text-muted-foreground">{t('community.posts')}</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-sm">0</div>
                <div className="text-xs text-muted-foreground">{t('community.followers')}</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-sm">0%</div>
                <div className="text-xs text-muted-foreground">{t('community.engagement')}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="progress" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="progress">{t('dashboard.progress')}</TabsTrigger>
          <TabsTrigger value="routine">{t('dashboard.routine')}</TabsTrigger>
          <TabsTrigger value="history">{t('dashboard.history')}</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-4">
          {/* Progress Metrics Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Skin Health Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {progressWidgets.slice(0, 4).map(renderProgressWidget)}
              </div>
            </CardContent>
          </Card>

          {/* Lifestyle & Habits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Lifestyle Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {progressWidgets.slice(4, 8).map(renderProgressWidget)}
              </div>
            </CardContent>
          </Card>

          {/* Environmental & Habits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Daily Habits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {progressWidgets.slice(8, 10).map(renderProgressWidget)}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {achievements.map(achievement => (
                  <div 
                    key={achievement.id} 
                    className={`p-3 rounded-lg border ${
                      achievement.earned 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{achievement.icon}</span>
                      <h4 className="font-medium text-sm">{achievement.title}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {achievement.description}
                    </p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                        {achievement.earned && (
                          <Badge variant="default" className="text-xs">
                            Earned
                          </Badge>
                        )}
                      </div>
                      <Progress 
                        value={(achievement.progress / achievement.maxProgress) * 100} 
                        className="h-1" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Overall Trend */}
          {trend && (
            <Card>
              <CardContent className="p-4">
                <div className={`p-3 rounded-lg ${trend.isPositive ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className={`w-4 h-4 ${trend.isPositive ? 'text-green-600' : 'text-red-600 rotate-180'}`} />
                    <span className={trend.isPositive ? 'text-green-800' : 'text-red-800'}>
                      {trend.value} point {trend.text} since last scan
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="routine" className="space-y-4">
          {/* Daily Routine */}
          <Card>
            <CardHeader>
              <CardTitle>
                <span>Today's Routine</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Sunrise className="w-5 h-5 text-yellow-600" />
                      <h4 className="font-medium">Morning Routine</h4>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setNewRoutineItem({...newRoutineItem, time: 'AM'});
                        handleAddRoutineItem();
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {routineItems.filter(item => item.time === 'AM').map((item) => (
                    <div key={item.id} className="flex items-center gap-3 py-2 group">
                      <button
                        onClick={() => toggleRoutineItemCompletion(item.id)}
                        className="focus:outline-none"
                      >
                        {item.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground" />
                        )}
                      </button>
                      <span className={`flex-1 ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {item.name}
                      </span>
                      <div className="flex items-center gap-1">
                        {item.reminderEnabled && (
                          <Badge variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {item.reminderTime}
                          </Badge>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditRoutineItem(item)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteRoutineItem(item.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSetReminder(item)}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Moon className="w-5 h-5 text-indigo-600" />
                      <h4 className="font-medium">Evening Routine</h4>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setNewRoutineItem({...newRoutineItem, time: 'PM'});
                        handleAddRoutineItem();
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {routineItems.filter(item => item.time === 'PM').map((item) => (
                    <div key={item.id} className="flex items-center gap-3 py-2 group">
                      <button
                        onClick={() => toggleRoutineItemCompletion(item.id)}
                        className="focus:outline-none"
                      >
                        {item.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground" />
                        )}
                      </button>
                      <span className={`flex-1 ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {item.name}
                      </span>
                      <div className="flex items-center gap-1">
                        {item.reminderEnabled && (
                          <Badge variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {item.reminderTime}
                          </Badge>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditRoutineItem(item)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteRoutineItem(item.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSetReminder(item)}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add Routine Item Dialog */}
          <Dialog open={addRoutineDialogOpen} onOpenChange={setAddRoutineDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Routine Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Product Name</Label>
                  <Input 
                    value={newRoutineItem.name || ''}
                    onChange={(e) => setNewRoutineItem(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Time of Day</Label>
                  <Select 
                    value={newRoutineItem.time || 'AM'} 
                    onValueChange={(value) => 
                      setNewRoutineItem(prev => ({ ...prev, time: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AM">Morning</SelectItem>
                      <SelectItem value="PM">Evening</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Reminder Time</Label>
                  <Select 
                    value={newRoutineItem.reminderTime || '07:00'} 
                    onValueChange={(value) => 
                      setNewRoutineItem(prev => ({ ...prev, reminderTime: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({length: 24}, (_, i) => {
                        const hour = String(i).padStart(2, '0');
                        return (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Reminder Enabled</Label>
                  <Switch 
                    checked={newRoutineItem.reminderEnabled || false}
                    onCheckedChange={(checked) => 
                      setNewRoutineItem(prev => ({ ...prev, reminderEnabled: checked }))
                    }
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveNewRoutineItem} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setAddRoutineDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Routine Item Dialog */}
          <Dialog open={editRoutineDialogOpen} onOpenChange={setEditRoutineDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Routine Item</DialogTitle>
              </DialogHeader>
              {selectedRoutineItem && (
                <div className="space-y-4">
                  <div>
                    <Label>Product Name</Label>
                    <Input 
                      value={selectedRoutineItem.name || ''}
                      onChange={(e) => setSelectedRoutineItem(prev => prev ? {...prev, name: e.target.value} : null)}
                    />
                  </div>
                  <div>
                    <Label>Time of Day</Label>
                    <Select 
                      value={selectedRoutineItem.time || 'AM'} 
                      onValueChange={(value) => 
                        setSelectedRoutineItem(prev => prev ? {...prev, time: value as 'AM' | 'PM'} : null)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AM">Morning</SelectItem>
                        <SelectItem value="PM">Evening</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Reminder Time</Label>
                    <Select 
                      value={selectedRoutineItem.reminderTime || '07:00'} 
                      onValueChange={(value) => 
                        setSelectedRoutineItem(prev => prev ? {...prev, reminderTime: value} : null)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 24}, (_, i) => {
                          const hour = String(i).padStart(2, '0');
                          return (
                            <SelectItem key={hour} value={`${hour}:00`}>
                              {hour}:00
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Reminder Enabled</Label>
                    <Switch 
                      checked={selectedRoutineItem.reminderEnabled || false}
                      onCheckedChange={(checked) => 
                        setSelectedRoutineItem(prev => prev ? {...prev, reminderEnabled: checked} : null)
                      }
                    />
                  </div>
                </div>
              )}
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveEditRoutineItem} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setEditRoutineDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Set Reminder Dialog */}
          <Dialog open={reminderDialogOpen} onOpenChange={setReminderDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Set Reminder</DialogTitle>
              </DialogHeader>
              {selectedRoutineItem && (
                <div className="space-y-4">
                  <div>
                    <Label>Product: {selectedRoutineItem.name}</Label>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Reminder Time</Label>
                    <Select 
                      value={selectedRoutineItem.reminderTime || '07:00'} 
                      onValueChange={(value) => 
                        setSelectedRoutineItem(prev => prev ? {...prev, reminderTime: value} : null)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 24}, (_, i) => {
                          const hour = String(i).padStart(2, '0');
                          return (
                            <SelectItem key={hour} value={`${hour}:00`}>
                              {hour}:00
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Notification Settings</Label>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4" />
                        <span className="text-sm">Sound</span>
                      </div>
                      <Switch 
                        checked={reminderForm.soundEnabled}
                        onCheckedChange={(checked) => 
                          setReminderForm(prev => ({...prev, soundEnabled: checked}))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        <span className="text-sm">Vibration</span>
                      </div>
                      <Switch 
                        checked={reminderForm.vibrationEnabled}
                        onCheckedChange={(checked) => 
                          setReminderForm(prev => ({...prev, vibrationEnabled: checked}))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <Select 
                      value={reminderForm.frequency}
                      onValueChange={(value) => 
                        setReminderForm(prev => ({...prev, frequency: value as 'daily' | 'weekly' | 'custom'}))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSaveReminder} className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      Save Reminder
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setReminderDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Routine Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Routine Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-secondary/20 rounded-lg">
                  <div className="text-lg font-semibold text-green-600">83%</div>
                  <div className="text-sm text-muted-foreground">This Week</div>
                </div>
                <div className="text-center p-3 bg-secondary/20 rounded-lg">
                  <div className="text-lg font-semibold text-blue-600">12</div>
                  <div className="text-sm text-muted-foreground">Day Streak</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {/* Scan History */}
          <Card>
            <CardHeader>
              <CardTitle>Scan History</CardTitle>
            </CardHeader>
            <CardContent>
              {scanHistory.length > 0 ? (
                <div className="space-y-4">
                  {scanHistory.map((scan) => (
                    <div key={scan.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <img 
                        src={scan.imageUrl} 
                        alt="Scan" 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">Score: {scan.overallScore}</span>
                          <Badge variant="outline" className="text-xs">
                            {new Date(scan.date).toLocaleDateString()}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          H:{scan.hydration} E:{scan.evenness} C:{scan.clarity} F:{scan.firmness}
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onViewScan?.(scan)}
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No scan history available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}