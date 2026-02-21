import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { User, ScanResult } from '../types';
import { Camera, RotateCcw, Zap, AlertCircle, SwitchCamera, X, Upload, Info, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { useAppTranslation } from '../hooks/useAppTranslation';
import { SkinduAnalyzer, SkinduAnalysisResult, getSkinduBranding } from '../services/skinduAnalyzer';
import { api } from '../services/api';

interface CameraInterfaceProps {
  user: User;
  onScanComplete: (result: ScanResult) => void;
  onViewProducts: () => void;
  onUpgrade: () => void;
}

export default function CameraInterface({ user, onScanComplete, onViewProducts, onUpgrade }: CameraInterfaceProps) {
  const { t, isRTL, spacing, flexDir } = useAppTranslation();
  const [isScanning, setIsScanning] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string>('');
  const [showPermissionHelp, setShowPermissionHelp] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canScan = user.scansToday < user.maxScans;

  useEffect(() => {
    return () => {
      // Cleanup camera stream on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera not supported on this device');
        toast.error('Camera not supported. Please use file upload instead.');
        return;
      }

      setCameraError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      
      setStream(mediaStream);
      setCameraActive(true);
      setShowPermissionHelp(false);
    } catch (error: any) {
      // Log for debugging (this is expected behavior when permission is denied)
      console.log('[Camera] Access error:', error.name, '-', error.message);
      
      let errorMessage = 'Unable to access camera';
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = 'Camera permission denied';
        setCameraError('permission_denied');
        setShowPermissionHelp(true);
        toast.error('Camera access denied. See instructions below or use upload option.', {
          duration: 5000,
        });
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage = 'No camera found on this device';
        setCameraError('no_camera');
        toast.error('No camera detected. Please use file upload instead.');
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage = 'Camera is already in use';
        setCameraError('camera_busy');
        toast.error('Camera is being used by another application. Please close it and try again.');
      } else {
        setCameraError('unknown');
        toast.error(errorMessage + '. Please try the upload option.');
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const switchCamera = async () => {
    stopCamera();
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    setTimeout(() => startCamera(), 100);
  };

  const capturePhoto = () => {
    if (!canScan) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(imageData);
        setShowPreview(true);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setCapturedImage(imageData);
      setShowPreview(true);
      setCameraError('');
    };
    reader.readAsDataURL(file);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  /**
   * Convert Skindu analysis result to ScanResult format
   */
  const convertSkinduToScanResult = (skinduResult: SkinduAnalysisResult, imageData: string): ScanResult => {
    return {
      id: skinduResult.analysisId,
      date: skinduResult.timestamp,
      imageUrl: imageData,
      
      // Overall metrics
      overallScore: skinduResult.overallScore,
      estimatedAge: skinduResult.estimatedSkinAge,
      actualAge: user.skinProfile?.lifestyle ? 30 : undefined,
      
      // Skin health metrics from Skindu
      hydration: skinduResult.healthMetrics.hydration,
      moisture: skinduResult.healthMetrics.moisture,
      oiliness: skinduResult.healthMetrics.oiliness,
      evenness: skinduResult.healthMetrics.evenness,
      texture: skinduResult.healthMetrics.texture,
      clarity: skinduResult.healthMetrics.clarity,
      firmness: skinduResult.healthMetrics.firmness,
      elasticity: skinduResult.healthMetrics.elasticity,
      poreSize: skinduResult.healthMetrics.poreSize,
      smoothness: skinduResult.healthMetrics.smoothness,
      radiance: skinduResult.healthMetrics.radiance,
      
      // Skin concerns from Skindu
      acne: skinduResult.concerns.acne,
      wrinkles: skinduResult.concerns.wrinkles,
      darkCircles: skinduResult.concerns.darkCircles,
      darkSpots: skinduResult.concerns.darkSpots,
      redness: skinduResult.concerns.redness,
      
      // Additional analysis
      skinType: skinduResult.skinType,
      uvDamage: skinduResult.concerns.uvDamage,
      
      // Recommendations from Skindu
      recommendations: skinduResult.recommendations.map(r => r.title),
      aiAnalysis: skinduResult.skinSummary + '\n\nPowered by Skindu AI',
      
      // AI Face Detection Overlay
      overlayImageUrl: skinduResult.overlayImageUrl,
      faceDetected: skinduResult.faceDetected,
      faceLandmarksCount: skinduResult.faceLandmarksCount,
    };
  };

  /**
   * Analyze skin using Skindu Smart Skin Analyzer
   * Powered by Skindu - Advanced AI Skin Analysis Technology
   * Results are saved to backend API
   */
  const analyzeSkinWithAI = async (imageData: string): Promise<ScanResult> => {
    try {
      // Initialize Skindu Analyzer
      const skinduAnalyzer = SkinduAnalyzer.getInstance({
        enableDebug: import.meta.env.DEV,
      });
      
      // Perform analysis with Skindu
      const skinduResult = await skinduAnalyzer.analyze({
        base64Image: imageData,
        userId: user.id,
        metadata: {
          deviceType: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
          captureTime: new Date().toISOString(),
          lightingCondition: 'unknown',
          cameraType: facingMode === 'user' ? 'front' : 'back',
        },
      });
      
      console.log('[Skindu] Analysis complete:', {
        analysisId: skinduResult.analysisId,
        confidence: skinduResult.confidence,
        processingTime: skinduResult.processingTime,
        poweredBy: skinduResult.poweredBy,
      });
      
      // Convert to ScanResult format
      const scanResult = convertSkinduToScanResult(skinduResult, imageData);
      
      // Save scan to backend API (non-blocking)
      try {
        const apiScan = await api.createScan({
          imageBase64: imageData,
          skinType: scanResult.skinType || user.skinProfile?.skinType || 'normal',
          overallScore: scanResult.overallScore,
          hydrationLevel: skinduResult.metrics.hydration,
          oilinessLevel: skinduResult.metrics.oiliness,
          acneLevel: skinduResult.metrics.acne,
          wrinkleLevel: skinduResult.metrics.wrinkles,
          pigmentationLevel: skinduResult.metrics.pigmentation,
          sensitivityLevel: skinduResult.metrics.sensitivity,
          poreSize: 'medium',
          analysisNotes: scanResult.aiAnalysis || '',
        });
        console.log('[API] Scan saved to backend:', apiScan.id);
        // Update scan result with API ID
        scanResult.id = apiScan.id;
      } catch (apiError) {
        console.warn('[API] Failed to save scan to backend (offline mode):', apiError);
        // Continue with local scan result
      }
      
      return scanResult;
      
    } catch (error) {
      console.error('[Skindu] Analysis error:', error);
      toast.error(t('errors.analysisFailedRetry', 'Analysis failed. Please try again.'));
      throw error;
    }
  };

  const generateRecommendations = (user: User): string[] => {
    const recommendations: string[] = [];
    const skinType = user.skinProfile?.skinType;
    const concern = user.skinProfile?.skinConcerns;
    
    if (skinType === 'dry' || concern === 'dryness') {
      recommendations.push('Hyaluronic Acid Deep Hydration Serum');
      recommendations.push('Rich Moisturizing Cream with Ceramides');
    }
    
    if (skinType === 'oily' || concern === 'acne') {
      recommendations.push('Salicylic Acid Cleanser');
      recommendations.push('Niacinamide Pore Refining Serum');
    }
    
    if (concern === 'aging') {
      recommendations.push('Retinol Night Treatment');
      recommendations.push('Peptide Firming Cream');
      recommendations.push('Vitamin C Brightening Serum');
    }
    
    if (concern === 'pigmentation') {
      recommendations.push('Alpha Arbutin Dark Spot Corrector');
      recommendations.push('Vitamin C + Kojic Acid Serum');
    }
    
    if (user.skinProfile?.sunExposure && user.skinProfile.sunExposure !== 'minimal') {
      recommendations.push('SPF 50+ Broad Spectrum Sunscreen');
    }
    
    // Always add basic essentials if not enough recommendations
    if (recommendations.length < 3) {
      recommendations.push('Gentle Cleanser');
      recommendations.push('Hydrating Moisturizer');
      recommendations.push('SPF 30 Daily Sunscreen');
    }
    
    return recommendations.slice(0, 5);
  };

  const generateAIAnalysis = (user: User): string => {
    const analyses: string[] = [
      'Your skin shows good hydration levels. Continue with your current moisturizing routine.',
      'We detected some areas that could benefit from targeted treatments.',
      'Your skin texture appears healthy with minor improvements recommended.',
      'Consider adding antioxidant protection to combat environmental stressors.',
    ];
    
    if (user.skinProfile?.lifestyle === 'sleep') {
      analyses.push('Limited sleep may be affecting your skin recovery. Aim for 7-8 hours.');
    }
    
    if (user.skinProfile?.lifestyle === 'stress') {
      analyses.push('Stress can impact skin health. Consider stress-reduction techniques.');
    }
    
    return analyses[Math.floor(Math.random() * analyses.length)];
  };

  const startScan = async () => {
    if (!capturedImage) {
      console.error('[Skindu] No captured image available');
      toast.error('No image captured. Please take a photo first.');
      return;
    }
    
    console.log('[Skindu] Starting analysis with image size:', capturedImage.length);
    setIsScanning(true);
    
    try {
      const result = await analyzeSkinWithAI(capturedImage);
      console.log('[Skindu] Analysis successful:', result.id);
      setIsScanning(false);
      setShowPreview(false);
      onScanComplete(result);
    } catch (error) {
      console.error('[Skindu] Analysis error in startScan:', error);
      setIsScanning(false);
      toast.error('Analysis failed. Please try again.');
    }
  };

  const retakePhoto = () => {
    setShowPreview(false);
    setCapturedImage('');
    startCamera();
  };

  // Scanning/Processing Screen
  if (isScanning) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-sm">
          <motion.div
            className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Zap className="w-12 h-12 text-primary" />
          </motion.div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">{t('camera.analyzing')}</h3>
            <p className="text-muted-foreground text-sm">
              {t('camera.processingParams', 'AI is processing 15+ skin parameters...')}
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="w-full bg-secondary rounded-full h-2">
              <motion.div
                className="bg-primary h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {t('camera.analyzingMetrics', 'Analyzing hydration, texture, clarity, age markers...')}
            </p>
          </div>
          
          {/* Skindu Branding */}
          <div className="flex items-center justify-center gap-2 pt-4 border-t border-border mt-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground font-medium">
              {t('camera.poweredBySkindu', 'Powered by Skindu')}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Preview Screen
  if (showPreview) {
    return (
      <div className="min-h-screen bg-background p-4 space-y-4">
        <div className={`flex items-center justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h2 className="text-lg font-semibold">{t('camera.reviewPhoto', 'Review Your Photo')}</h2>
          <Badge variant="outline">{t('common.preview', 'Preview')}</Badge>
        </div>
        
        <Card>
          <CardContent className="p-4">
            <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden mb-4 relative">
              {capturedImage ? (
                <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Camera className="w-16 h-16 text-muted-foreground" />
                </div>
              )}
            </div>
            
            <Alert className="mb-4">
              <Info className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              <AlertDescription className="text-xs">
                {t('camera.faceVisibleTip', 'Make sure your face is clearly visible and well-lit for accurate analysis')}
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              <Button onClick={startScan} className="w-full" size="lg" disabled={!canScan}>
                {canScan ? (
                  <>
                    <Zap className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t('camera.startAnalysis', 'Start AI Analysis')}
                  </>
                ) : (
                  t('camera.scanLimitReached')
                )}
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={retakePhoto} variant="outline" className="w-full">
                  <RotateCcw className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('camera.retake')}
                </Button>
                <Button onClick={triggerFileUpload} variant="outline" className="w-full">
                  <Upload className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('common.upload')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Camera Screen
  if (cameraActive) {
    return (
      <div className="min-h-screen bg-black relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Camera Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Face Guide */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-80 border-2 border-white rounded-[40px] relative">
              <div className="absolute inset-2 border border-white/50 rounded-[36px]" />
              
              {/* Corner Markers */}
              <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-primary rounded-tl-[12px]" />
              <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-primary rounded-tr-[12px]" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-primary rounded-bl-[12px]" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-primary rounded-br-[12px]" />
            </div>
          </div>
          
          {/* Top Instructions */}
          <div className="absolute top-6 left-0 right-0 px-4">
            <div className="bg-black/70 backdrop-blur-sm text-white text-sm p-3 rounded-lg text-center">
              <p className="font-medium">Position your face within the frame</p>
              <p className="text-xs text-white/80 mt-1">Ensure good lighting for best results</p>
            </div>
          </div>
        </div>
        
        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={stopCamera}
              variant="ghost"
              size="icon"
              className="bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 h-12 w-12 rounded-full"
            >
              <X className="w-6 h-6" />
            </Button>
            
            <Button
              onClick={switchCamera}
              variant="ghost"
              size="icon"
              className="bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 h-12 w-12 rounded-full"
            >
              <SwitchCamera className="w-6 h-6" />
            </Button>
          </div>
          
          <div className="flex justify-center">
            <motion.button
              onClick={capturePhoto}
              disabled={!canScan}
              className="w-20 h-20 bg-white rounded-full border-4 border-primary flex items-center justify-center disabled:opacity-50 shadow-lg"
              whileTap={{ scale: 0.9 }}
              animate={canScan ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Camera className="w-8 h-8 text-primary" />
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // Initial Screen - Ready to Start
  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Badge variant={user.type === 'member' ? 'default' : 'secondary'} className="text-sm">
                {user.type === 'member' ? '⭐ Member' : '👤 Guest'}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">{t('camera.title')}</h2>
              <p className="text-muted-foreground text-sm">
                {t('camera.subtitle')}
              </p>
            </div>
            
            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <div className="p-3 bg-primary/5 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Age Detection</p>
                <p className="text-sm font-medium">AI Powered</p>
              </div>
              <div className="p-3 bg-primary/5 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Parameters</p>
                <p className="text-sm font-medium">15+ Metrics</p>
              </div>
              <div className="p-3 bg-primary/5 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Analysis Time</p>
                <p className="text-sm font-medium">~3 seconds</p>
              </div>
              <div className="p-3 bg-primary/5 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Accuracy</p>
                <p className="text-sm font-medium">95%+</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Camera Permission Info (show when no error yet) */}
      {!cameraError && !showPermissionHelp && (
        <Alert className="border-primary/20 bg-primary/5">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm">
            <p className="font-medium mb-1">Camera Access Required</p>
            <p className="text-xs text-muted-foreground">
              When you click "Start Camera", your browser will ask for permission to access your camera. 
              Please click "Allow" to continue. Don't worry - we only access the camera when you're actively scanning.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Permission Help Alert */}
      {showPermissionHelp && (
        <Alert className="border-orange-200 bg-orange-50">
          <Info className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-sm text-orange-900">
            <p className="font-medium mb-2">Camera access was denied</p>
            <div className="space-y-1 text-xs">
              <p><strong>To enable camera:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Click the camera icon in your browser's address bar</li>
                <li>Select "Allow" for camera access</li>
                <li>Refresh the page and try again</li>
              </ul>
              <p className="mt-2">Or use the "Upload Photo" option below</p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Camera Error Alert */}
      {cameraError && cameraError !== 'permission_denied' && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-sm text-orange-900">
            {cameraError === 'no_camera' && 'No camera detected on this device. Please use the upload option below.'}
            {cameraError === 'camera_busy' && 'Camera is being used by another application. Please close it and try again.'}
            {cameraError === 'unknown' && 'Unable to access camera. Please try uploading a photo instead.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button 
          onClick={startCamera} 
          className="w-full" 
          size="lg"
          disabled={!canScan}
        >
          {canScan ? (
            <>
              <Camera className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('camera.startCamera')}
            </>
          ) : (
            t('camera.scanLimitReached')
          )}
        </Button>

        {/* File Upload Alternative */}
        <Button 
          onClick={triggerFileUpload} 
          variant="outline"
          className="w-full" 
          size="lg"
          disabled={!canScan}
        >
          <Upload className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('camera.uploadPhoto')}
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Scan Limit Warning */}
      {!canScan && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-1 flex-1">
                <p className="text-sm font-medium text-orange-900">
                  {user.type === 'guest' ? 'Free scan used' : 'Daily limit reached'}
                </p>
                <p className="text-xs text-orange-700">
                  {user.type === 'guest' 
                    ? 'Sign up to get 3 scans per day + track your skin progress'
                    : user.type === 'member'
                    ? 'Upgrade to Pro for unlimited scans'
                    : 'You can scan again tomorrow.'
                  }
                </p>
              </div>
            </div>
            
            {user.type === 'guest' && (
              <Button className="w-full mt-3 bg-[#00B4D8] hover:bg-[#00B4D8]/90" onClick={onUpgrade}>
                Sign Up Free
              </Button>
            )}
            
            {user.type === 'member' && (
              <Button className="w-full mt-3 bg-gradient-to-r from-amber-500 to-orange-500" onClick={onUpgrade}>
                Upgrade to Pro
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tips Card */}
      <Card>
        <CardContent className="p-4">
          <h3 className={`font-medium mb-3 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Zap className="w-4 h-4 text-primary" />
            {t('camera.tips')}
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Allow camera access when prompted by your browser</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Ensure your face is well-lit with natural or bright lighting</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Remove makeup for more accurate skin analysis</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Look directly at the camera and remain still</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Position your entire face within the frame guides</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Alternatively, upload a clear selfie photo</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* FAQ / Common Issues */}
      {cameraError && (
        <Card className="border-muted">
          <CardContent className="p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-primary" />
              Common Issues & Solutions
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium mb-1">Camera Permission Denied?</p>
                <p className="text-xs text-muted-foreground">
                  Click the camera/lock icon in your browser's address bar, select "Allow" for camera, then refresh the page.
                </p>
              </div>
              <div>
                <p className="font-medium mb-1">No Camera Available?</p>
                <p className="text-xs text-muted-foreground">
                  No problem! Use the "Upload Photo" button to select a selfie from your device.
                </p>
              </div>
              <div>
                <p className="font-medium mb-1">Camera Already in Use?</p>
                <p className="text-xs text-muted-foreground">
                  Close other apps that might be using your camera (Zoom, Teams, etc.) and try again.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
