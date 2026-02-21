import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScanResult, User } from '../types';
import { 
  Sparkles, TrendingUp, ShoppingBag, Download, Share, 
  Droplets, Zap, Eye, Shield, AlertCircle, Calendar,
  Activity, Sun, Wind, Heart
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAppTranslation } from '../hooks/useAppTranslation';

interface ScanResultsProps {
  result: ScanResult;
  onViewProducts: () => void;
  user: User | null;
}

export default function ScanResults({ result, onViewProducts, user }: ScanResultsProps) {
  const { t, isRTL, formatDate, formatNumber } = useAppTranslation();
  const [activeTab, setActiveTab] = useState('overview');

  // Health metrics (higher is better)
  const healthMetrics = [
    { name: t('results.hydration'), value: result.hydration, icon: Droplets, color: 'bg-blue-500', description: t('results.hydrationDesc', 'Skin water content') },
    { name: t('results.moisture'), value: result.moisture, icon: Droplets, color: 'bg-cyan-500', description: t('results.moistureDesc', 'Surface moisture level') },
    { name: t('results.texture'), value: result.texture, icon: Activity, color: 'bg-green-500', description: t('results.textureDesc', 'Skin smoothness') },
    { name: t('results.clarity'), value: result.clarity, icon: Eye, color: 'bg-purple-500', description: t('results.clarityDesc', 'Skin transparency') },
    { name: t('results.firmness'), value: result.firmness, icon: Shield, color: 'bg-orange-500', description: t('results.firmnessDesc', 'Skin structure') },
    { name: t('results.elasticity'), value: result.elasticity, icon: Wind, color: 'bg-pink-500', description: t('results.elasticityDesc', 'Skin bounce') },
    { name: t('results.evenness'), value: result.evenness, icon: Sparkles, color: 'bg-indigo-500', description: t('results.evennessDesc', 'Tone uniformity') },
    { name: t('results.smoothness'), value: result.smoothness, icon: Heart, color: 'bg-rose-500', description: t('results.smoothnessDesc', 'Surface quality') },
    { name: t('results.radiance'), value: result.radiance, icon: Sun, color: 'bg-yellow-500', description: t('results.radianceDesc', 'Skin glow') },
    { name: t('results.poreQuality', 'Pore Quality'), value: 100 - result.poreSize, icon: Zap, color: 'bg-teal-500', description: t('results.poreDesc', 'Pore refinement') },
  ];

  // Concern metrics (lower is better - inverted for display)
  const concernMetrics = [
    { name: t('results.acne'), severity: result.acne, icon: AlertCircle, color: 'bg-red-500' },
    { name: t('results.wrinkles'), severity: result.wrinkles, icon: Activity, color: 'bg-orange-500' },
    { name: t('results.darkCircles'), severity: result.darkCircles, icon: Eye, color: 'bg-purple-500' },
    { name: t('results.darkSpots'), severity: result.darkSpots, icon: Sparkles, color: 'bg-amber-500' },
    { name: t('results.redness'), severity: result.redness, icon: Heart, color: 'bg-rose-500' },
    { name: t('results.uvDamage'), severity: result.uvDamage, icon: Sun, color: 'bg-yellow-600' },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { text: t('results.excellent', 'Excellent'), variant: 'default' as const, color: 'bg-green-500' };
    if (score >= 60) return { text: t('results.good', 'Good'), variant: 'secondary' as const, color: 'bg-yellow-500' };
    return { text: t('results.needsCare', 'Needs Care'), variant: 'outline' as const, color: 'bg-orange-500' };
  };

  const getSeverityLevel = (severity: number) => {
    if (severity < 20) return { text: t('results.minimal', 'Minimal'), color: 'bg-green-500' };
    if (severity < 40) return { text: t('results.mild', 'Mild'), color: 'bg-yellow-500' };
    if (severity < 60) return { text: t('results.moderate', 'Moderate'), color: 'bg-orange-500' };
    return { text: t('results.significant', 'Significant'), color: 'bg-red-500' };
  };

  const ageDifference = result.actualAge 
    ? result.estimatedAge - result.actualAge 
    : 0;

  return (
    <div className={`min-h-screen bg-background p-4 space-y-4 pb-20 ${isRTL ? 'text-right' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Overall Score Header */}
      <Card className="border-primary/20">
        <CardContent className="p-6">
          <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="flex-1">
              <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">{t('results.overallScore')}</h2>
              </div>
              <p className="text-xs text-muted-foreground">
                {formatDate(result.date)}
              </p>
            </div>
            <div className="text-center">
              <motion.div 
                className={`text-5xl font-bold ${getScoreColor(result.overallScore)}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
              >
                {formatNumber(result.overallScore)}
              </motion.div>
              <p className="text-xs text-muted-foreground mt-1">{t('results.outOf', 'out of 100')}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Badge {...getScoreBadge(result.overallScore)}>
              {getScoreBadge(result.overallScore).text}
            </Badge>
            
            {/* Age Display */}
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>{t('results.skinAge', 'Skin Age')}: <strong className="font-bold text-primary">{result.estimatedAge}</strong></span>
              {result.actualAge && ageDifference !== 0 && (
                <Badge variant={ageDifference < 0 ? 'default' : 'outline'} className="text-xs">
                  {ageDifference < 0 ? `${Math.abs(ageDifference)} years younger` : `${ageDifference} years older`}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analyzed Image with AI Overlay */}
      <Card>
        <CardContent className="p-4">
          {/* Face Detection Badge */}
          {result.faceDetected && (
            <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Badge variant="default" className="bg-green-500">
                <Sparkles className="w-3 h-3 mr-1" />
                {t('results.faceDetected', 'Face Detected')}
              </Badge>
              {result.faceLandmarksCount && (
                <span className="text-xs text-muted-foreground">
                  {result.faceLandmarksCount} {t('results.landmarks', 'landmarks')}
                </span>
              )}
            </div>
          )}
          
          <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden">
            {/* Show AI-generated overlay if available, otherwise original image */}
            <img 
              src={result.overlayImageUrl || result.imageUrl} 
              alt="Skin analysis" 
              className="w-full h-full object-cover"
            />
            
            {/* Toggle Original/Overlay View */}
            {result.overlayImageUrl && (
              <div className="absolute top-2 right-2 z-10">
                <Badge variant="secondary" className="bg-black/60 text-white text-xs backdrop-blur-sm">
                  <Eye className="w-3 h-3 mr-1" />
                  {t('results.aiOverlay', 'AI Analysis')}
                </Badge>
              </div>
            )}
            
            {/* Analysis Overlay Markers (fallback when no ML overlay) */}
            {!result.overlayImageUrl && (
            <div className="absolute inset-0 pointer-events-none">
              {result.hydration < 60 && (
                <div className="absolute top-1/4 left-1/4 w-8 h-8">
                  <div className="w-full h-full border-2 border-blue-400 rounded-full bg-blue-400/20 animate-pulse" />
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs bg-blue-500 text-white px-2 py-1 rounded whitespace-nowrap">
                    Low Hydration
                  </div>
                </div>
              )}
              
              {result.darkSpots > 30 && (
                <div className="absolute top-1/3 right-1/4 w-6 h-6">
                  <div className="w-full h-full border-2 border-amber-400 rounded-full bg-amber-400/20" />
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs bg-amber-500 text-white px-2 py-1 rounded whitespace-nowrap">
                    Pigmentation
                  </div>
                </div>
              )}
              
              {result.wrinkles > 25 && (
                <div className="absolute bottom-1/3 left-1/3 w-10 h-2">
                  <div className="w-full h-full border-2 border-orange-400 rounded bg-orange-400/20" />
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs bg-orange-500 text-white px-2 py-1 rounded whitespace-nowrap">
                    Fine Lines
                  </div>
                </div>
              )}

              {result.redness > 30 && (
                <div className="absolute top-1/2 right-1/3 w-10 h-10">
                  <div className="w-full h-full border-2 border-rose-400 rounded-full bg-rose-400/20" />
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs bg-rose-500 text-white px-2 py-1 rounded">
                    Redness
                  </div>
                </div>
              )}
            </div>
            )}
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis Tabs */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5" />
            Detailed Analysis
          </CardTitle>
          <CardDescription>
            15+ skin parameters analyzed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="concerns">Concerns</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-3">
              {/* Skin Type & Oiliness */}
              <div className="p-3 bg-secondary/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Skin Type</span>
                  <Badge variant="outline" className="capitalize">
                    {result.skinType}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Oiliness Level</span>
                    <span className="font-medium">{result.oiliness}/100</span>
                  </div>
                  <Progress value={result.oiliness} className="h-1.5" />
                </div>
              </div>

              {/* Health Metrics Grid */}
              <div className="space-y-3">
                {healthMetrics.map((metric, index) => {
                  const Icon = metric.icon;
                  return (
                    <motion.div
                      key={metric.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 ${metric.color} rounded-lg flex items-center justify-center`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{metric.name}</p>
                            <p className="text-xs text-muted-foreground">{metric.description}</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold">{metric.value}/100</span>
                      </div>
                      <Progress value={metric.value} className="h-2" />
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="concerns" className="space-y-3">
              <p className="text-xs text-muted-foreground mb-3">
                Lower values indicate better skin condition
              </p>
              
              {concernMetrics.map((concern, index) => {
                const Icon = concern.icon;
                const severityInfo = getSeverityLevel(concern.severity);
                
                return (
                  <motion.div
                    key={concern.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-3 bg-secondary/20 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 ${concern.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium">{concern.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{concern.severity}/100</span>
                        <Badge 
                          variant="outline" 
                          className={`${severityInfo.color} text-white border-0 text-xs`}
                        >
                          {severityInfo.text}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={concern.severity} className="h-2" />
                  </motion.div>
                );
              })}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* AI Analysis Insight */}
      {result.aiAnalysis && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="w-4 h-4" />
              AI Insight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {result.aiAnalysis}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Personalized Recommendations
          </CardTitle>
          <CardDescription>
            {result.recommendations.length} products matched to your skin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-4">
            {result.recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">{index + 1}</span>
                </div>
                <span className="text-sm flex-1">{rec}</span>
              </motion.div>
            ))}
          </div>
          
          <Button onClick={onViewProducts} className="w-full" size="lg">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Shop Recommended Products
          </Button>
        </CardContent>
      </Card>

      {/* Upgrade prompt for guests */}
      {user?.type === 'guest' && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold mb-2">{t('results.trackJourney', 'Track Your Skin Journey')}</h4>
            <p className="text-sm text-muted-foreground mb-4">
              {t('results.upgradePrompt', 'Upgrade to Member for scan history, progress tracking, and personalized routines')}
            </p>
            <Button className="w-full">
              {t('results.upgradeToMember', 'Upgrade to Member')}
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* Skindu Branding Footer */}
      <div className={`flex items-center justify-center gap-2 py-4 border-t border-border ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-xs text-muted-foreground font-medium">
          {t('results.poweredBySkindu', 'Analysis powered by Skindu')}
        </span>
      </div>
    </div>
  );
}
