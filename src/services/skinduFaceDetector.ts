/**
 * Skindu Face Detection Engine
 * 
 * Powered by Skindu - Using MediaPipe Face Mesh for accurate face landmark detection
 * 
 * This module provides face detection and landmark extraction using
 * MediaPipe's Face Mesh model through TensorFlow.js
 * 
 * @version 2.0.0
 * @author SkinPAI Team
 * @powered-by Skindu with MediaPipe
 */

import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface FaceLandmark {
  x: number;
  y: number;
  z?: number;
}

export interface FaceZoneBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DetectedFaceZones {
  forehead: FaceZoneBounds;
  leftCheek: FaceZoneBounds;
  rightCheek: FaceZoneBounds;
  nose: FaceZoneBounds;
  tZone: FaceZoneBounds;
  leftEye: FaceZoneBounds;
  rightEye: FaceZoneBounds;
  jawline: FaceZoneBounds;
  lips: FaceZoneBounds;
  fullFace: FaceZoneBounds;
}

export interface FaceDetectionResult {
  detected: boolean;
  landmarks: FaceLandmark[];
  zones: DetectedFaceZones;
  boundingBox: FaceZoneBounds;
  faceAngle: {
    roll: number;
    pitch: number;
    yaw: number;
  };
  confidence: number;
}

export interface ZoneColorAnalysis {
  avgRed: number;
  avgGreen: number;
  avgBlue: number;
  avgBrightness: number;
  variance: number;
  rednessScore: number;
  oilinessIndicator: number;
  textureScore: number;
}

export interface FaceAnalysisData {
  detection: FaceDetectionResult;
  zoneAnalysis: {
    forehead: ZoneColorAnalysis;
    leftCheek: ZoneColorAnalysis;
    rightCheek: ZoneColorAnalysis;
    nose: ZoneColorAnalysis;
    tZone: ZoneColorAnalysis;
    underEyes: ZoneColorAnalysis;
    jawline: ZoneColorAnalysis;
  };
  overallMetrics: {
    symmetry: number;
    skinToneness: number;
    textureUniformity: number;
    oilDistribution: number;
    rednessDistribution: number;
  };
}

// ============================================================================
// MEDIAPIPE LANDMARK INDICES
// ============================================================================

// Key landmark indices from MediaPipe Face Mesh (468 landmarks)
const FACE_MESH_LANDMARKS = {
  // Forehead region
  forehead: [10, 67, 69, 104, 108, 151, 297, 299, 332, 333, 334, 338],
  
  // Left cheek
  leftCheek: [36, 47, 50, 101, 116, 117, 118, 119, 123, 187, 205, 206, 207, 213],
  
  // Right cheek  
  rightCheek: [266, 280, 329, 347, 346, 345, 330, 411, 427, 436, 426, 423],
  
  // Nose
  nose: [1, 2, 4, 5, 6, 19, 44, 45, 51, 94, 125, 141, 197, 274, 275, 281, 354, 370],
  
  // T-Zone (forehead + nose)
  tZone: [4, 6, 10, 151, 168, 193, 197, 417],
  
  // Left eye area
  leftEye: [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246],
  
  // Right eye area
  rightEye: [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398],
  
  // Under eyes (dark circles area)
  underEyes: [111, 117, 118, 119, 121, 116, 346, 347, 348, 349, 350, 357],
  
  // Jawline
  jawline: [132, 58, 172, 136, 150, 149, 176, 148, 152, 377, 400, 378, 379, 365, 397, 288, 361],
  
  // Lips
  lips: [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146],
  
  // Face oval
  faceOval: [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 
             377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109],
};

// ============================================================================
// FACE DETECTOR CLASS
// ============================================================================

class SkinduFaceDetector {
  private model: faceLandmarksDetection.FaceLandmarksDetector | null = null;
  private isInitialized: boolean = false;
  private isInitializing: boolean = false;
  private static instance: SkinduFaceDetector;
  
  private constructor() {}
  
  static getInstance(): SkinduFaceDetector {
    if (!SkinduFaceDetector.instance) {
      SkinduFaceDetector.instance = new SkinduFaceDetector();
    }
    return SkinduFaceDetector.instance;
  }
  
  /**
   * Initialize the face detection model
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    if (this.isInitializing) {
      // Wait for initialization to complete (with timeout)
      const maxWait = 30000; // 30 seconds
      const startWait = Date.now();
      while (this.isInitializing && Date.now() - startWait < maxWait) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return;
    }
    
    this.isInitializing = true;
    
    try {
      // Set TensorFlow.js backend with fallback
      try {
        await tf.setBackend('webgl');
        await tf.ready();
        console.log('[Skindu] TensorFlow.js initialized with backend:', tf.getBackend());
      } catch (webglError) {
        console.warn('[Skindu] WebGL backend failed, trying CPU:', webglError);
        await tf.setBackend('cpu');
        await tf.ready();
        console.log('[Skindu] TensorFlow.js initialized with CPU backend');
      }
      
      // Load MediaPipe Face Mesh model with timeout
      const modelPromise = faceLandmarksDetection.createDetector(
        faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
        {
          runtime: 'tfjs',
          refineLandmarks: true,
          maxFaces: 1,
        }
      );
      
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Model loading timeout')), 30000)
      );
      
      this.model = await Promise.race([modelPromise, timeoutPromise]);
      
      this.isInitialized = true;
      console.log('[Skindu] MediaPipe Face Mesh model loaded successfully');
      
    } catch (error) {
      console.error('[Skindu] Failed to initialize face detector:', error);
      throw error;
    } finally {
      this.isInitializing = false;
    }
  }
  
  /**
   * Detect face and extract landmarks from image
   */
  async detectFace(imageElement: HTMLImageElement | HTMLCanvasElement): Promise<FaceDetectionResult | null> {
    if (!this.isInitialized || !this.model) {
      await this.initialize();
    }
    
    try {
      const faces = await this.model!.estimateFaces(imageElement, {
        flipHorizontal: false,
      });
      
      if (faces.length === 0) {
        console.log('[Skindu] No face detected');
        return null;
      }
      
      const face = faces[0];
      const keypoints = face.keypoints;
      
      // Convert keypoints to FaceLandmark array
      const landmarks: FaceLandmark[] = keypoints.map(kp => ({
        x: kp.x,
        y: kp.y,
        z: kp.z,
      }));
      
      // Calculate face zones based on landmarks
      const zones = this.calculateFaceZones(landmarks, imageElement.width, imageElement.height);
      
      // Calculate bounding box
      const boundingBox = this.calculateBoundingBox(landmarks);
      
      // Estimate face angle
      const faceAngle = this.estimateFaceAngle(landmarks);
      
      // Calculate detection confidence
      const confidence = this.calculateConfidence(face, landmarks);
      
      return {
        detected: true,
        landmarks,
        zones,
        boundingBox,
        faceAngle,
        confidence,
      };
      
    } catch (error) {
      console.error('[Skindu] Face detection error:', error);
      return null;
    }
  }
  
  /**
   * Calculate face zones from landmarks
   */
  private calculateFaceZones(
    landmarks: FaceLandmark[], 
    imageWidth: number, 
    imageHeight: number
  ): DetectedFaceZones {
    const getZoneBounds = (indices: number[]): FaceZoneBounds => {
      const points = indices.map(i => landmarks[i]).filter(p => p);
      if (points.length === 0) {
        return { x: 0, y: 0, width: 0, height: 0 };
      }
      
      const xs = points.map(p => p.x);
      const ys = points.map(p => p.y);
      
      const minX = Math.max(0, Math.min(...xs));
      const maxX = Math.min(imageWidth, Math.max(...xs));
      const minY = Math.max(0, Math.min(...ys));
      const maxY = Math.min(imageHeight, Math.max(...ys));
      
      return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
      };
    };
    
    return {
      forehead: getZoneBounds(FACE_MESH_LANDMARKS.forehead),
      leftCheek: getZoneBounds(FACE_MESH_LANDMARKS.leftCheek),
      rightCheek: getZoneBounds(FACE_MESH_LANDMARKS.rightCheek),
      nose: getZoneBounds(FACE_MESH_LANDMARKS.nose),
      tZone: getZoneBounds(FACE_MESH_LANDMARKS.tZone),
      leftEye: getZoneBounds(FACE_MESH_LANDMARKS.leftEye),
      rightEye: getZoneBounds(FACE_MESH_LANDMARKS.rightEye),
      jawline: getZoneBounds(FACE_MESH_LANDMARKS.jawline),
      lips: getZoneBounds(FACE_MESH_LANDMARKS.lips),
      fullFace: getZoneBounds(FACE_MESH_LANDMARKS.faceOval),
    };
  }
  
  /**
   * Calculate bounding box for all landmarks
   */
  private calculateBoundingBox(landmarks: FaceLandmark[]): FaceZoneBounds {
    const xs = landmarks.map(l => l.x);
    const ys = landmarks.map(l => l.y);
    
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }
  
  /**
   * Estimate face angle from landmarks
   */
  private estimateFaceAngle(landmarks: FaceLandmark[]): { roll: number; pitch: number; yaw: number } {
    // Use key facial landmarks to estimate orientation
    // Nose tip: 1, Left eye outer: 33, Right eye outer: 263
    const noseTip = landmarks[1];
    const leftEye = landmarks[33];
    const rightEye = landmarks[263];
    
    if (!noseTip || !leftEye || !rightEye) {
      return { roll: 0, pitch: 0, yaw: 0 };
    }
    
    // Calculate roll (head tilt) from eye positions
    const eyeDeltaY = rightEye.y - leftEye.y;
    const eyeDeltaX = rightEye.x - leftEye.x;
    const roll = Math.atan2(eyeDeltaY, eyeDeltaX) * (180 / Math.PI);
    
    // Calculate yaw (horizontal rotation) from nose position relative to eyes
    const eyeMidX = (leftEye.x + rightEye.x) / 2;
    const yawOffset = (noseTip.x - eyeMidX) / (rightEye.x - leftEye.x);
    const yaw = yawOffset * 45; // Approximate conversion to degrees
    
    // Calculate pitch (vertical rotation) from nose and eye positions
    const eyeMidY = (leftEye.y + rightEye.y) / 2;
    const noseEyeDist = noseTip.y - eyeMidY;
    const expectedDist = (rightEye.x - leftEye.x) * 0.6;
    const pitchOffset = (noseEyeDist - expectedDist) / expectedDist;
    const pitch = pitchOffset * 30;
    
    return { roll, pitch, yaw };
  }
  
  /**
   * Calculate detection confidence
   */
  private calculateConfidence(face: any, landmarks: FaceLandmark[]): number {
    let confidence = 85;
    
    // Boost confidence if we have all landmarks
    if (landmarks.length >= 468) {
      confidence += 5;
    }
    
    // Check face symmetry
    const leftEye = landmarks[33];
    const rightEye = landmarks[263];
    const nose = landmarks[1];
    
    if (leftEye && rightEye && nose) {
      // Face should be reasonably symmetric
      const leftDist = Math.sqrt(Math.pow(leftEye.x - nose.x, 2) + Math.pow(leftEye.y - nose.y, 2));
      const rightDist = Math.sqrt(Math.pow(rightEye.x - nose.x, 2) + Math.pow(rightEye.y - nose.y, 2));
      const symmetryRatio = Math.min(leftDist, rightDist) / Math.max(leftDist, rightDist);
      
      if (symmetryRatio > 0.85) {
        confidence += 5;
      }
    }
    
    // Use face score if available
    if (face.score) {
      confidence = Math.round((confidence + face.score * 100) / 2);
    }
    
    return Math.min(98, Math.max(60, confidence));
  }
  
  /**
   * Analyze skin in each zone from image data
   */
  async analyzeZones(
    imageElement: HTMLImageElement | HTMLCanvasElement,
    zones: DetectedFaceZones
  ): Promise<FaceAnalysisData['zoneAnalysis']> {
    const canvas = document.createElement('canvas');
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(imageElement, 0, 0);
    
    const analyzeZone = (zone: FaceZoneBounds): ZoneColorAnalysis => {
      if (zone.width === 0 || zone.height === 0) {
        return this.getDefaultZoneAnalysis();
      }
      
      const imageData = ctx.getImageData(
        Math.max(0, Math.floor(zone.x)),
        Math.max(0, Math.floor(zone.y)),
        Math.min(canvas.width - zone.x, Math.ceil(zone.width)),
        Math.min(canvas.height - zone.y, Math.ceil(zone.height))
      );
      
      return this.analyzeZonePixels(imageData);
    };
    
    // Combine left and right eye zones for under-eye analysis
    const underEyeZone = {
      x: Math.min(zones.leftEye.x, zones.rightEye.x),
      y: Math.max(zones.leftEye.y + zones.leftEye.height * 0.7, zones.rightEye.y + zones.rightEye.height * 0.7),
      width: Math.max(zones.leftEye.x + zones.leftEye.width, zones.rightEye.x + zones.rightEye.width) - 
             Math.min(zones.leftEye.x, zones.rightEye.x),
      height: zones.leftEye.height * 0.5,
    };
    
    return {
      forehead: analyzeZone(zones.forehead),
      leftCheek: analyzeZone(zones.leftCheek),
      rightCheek: analyzeZone(zones.rightCheek),
      nose: analyzeZone(zones.nose),
      tZone: analyzeZone(zones.tZone),
      underEyes: analyzeZone(underEyeZone),
      jawline: analyzeZone(zones.jawline),
    };
  }
  
  /**
   * Analyze pixel data for a zone
   */
  private analyzeZonePixels(imageData: ImageData): ZoneColorAnalysis {
    const data = imageData.data;
    const pixelCount = data.length / 4;
    
    if (pixelCount === 0) {
      return this.getDefaultZoneAnalysis();
    }
    
    let totalRed = 0, totalGreen = 0, totalBlue = 0;
    let totalBrightness = 0;
    const brightnessValues: number[] = [];
    let highBrightnessCount = 0;
    let rednessCount = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      totalRed += r;
      totalGreen += g;
      totalBlue += b;
      
      const brightness = (r * 0.299 + g * 0.587 + b * 0.114);
      totalBrightness += brightness;
      brightnessValues.push(brightness);
      
      // Detect high brightness (oiliness indicator)
      if (brightness > 200) {
        highBrightnessCount++;
      }
      
      // Detect redness
      if (r > g + 15 && r > b + 15 && brightness > 80) {
        rednessCount++;
      }
    }
    
    const avgRed = totalRed / pixelCount;
    const avgGreen = totalGreen / pixelCount;
    const avgBlue = totalBlue / pixelCount;
    const avgBrightness = totalBrightness / pixelCount;
    
    // Calculate variance (texture indicator)
    let varianceSum = 0;
    for (const b of brightnessValues) {
      varianceSum += Math.pow(b - avgBrightness, 2);
    }
    const variance = varianceSum / pixelCount;
    
    return {
      avgRed,
      avgGreen,
      avgBlue,
      avgBrightness,
      variance,
      rednessScore: (rednessCount / pixelCount) * 100,
      oilinessIndicator: (highBrightnessCount / pixelCount) * 100,
      textureScore: Math.max(0, 100 - Math.sqrt(variance) * 2),
    };
  }
  
  private getDefaultZoneAnalysis(): ZoneColorAnalysis {
    return {
      avgRed: 180,
      avgGreen: 160,
      avgBlue: 150,
      avgBrightness: 165,
      variance: 400,
      rednessScore: 10,
      oilinessIndicator: 15,
      textureScore: 70,
    };
  }
  
  /**
   * Generate overlay canvas with face zones
   */
  generateOverlayCanvas(
    imageElement: HTMLImageElement | HTMLCanvasElement,
    detection: FaceDetectionResult,
    analysisResults?: any
  ): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    const ctx = canvas.getContext('2d')!;
    
    // Draw original image
    ctx.drawImage(imageElement, 0, 0);
    
    // Draw face zones with semi-transparent overlays
    const zones = detection.zones;
    
    // Zone color mapping
    const zoneColors: Record<string, { fill: string; stroke: string; label: string }> = {
      forehead: { fill: 'rgba(64, 224, 208, 0.25)', stroke: '#40E0D0', label: 'Forehead' },
      leftCheek: { fill: 'rgba(255, 107, 53, 0.25)', stroke: '#FF6B35', label: 'L-Cheek' },
      rightCheek: { fill: 'rgba(255, 107, 53, 0.25)', stroke: '#FF6B35', label: 'R-Cheek' },
      nose: { fill: 'rgba(0, 180, 216, 0.25)', stroke: '#00B4D8', label: 'T-Zone' },
      jawline: { fill: 'rgba(147, 51, 234, 0.25)', stroke: '#9333EA', label: 'Jawline' },
    };
    
    // Draw each zone
    Object.entries(zoneColors).forEach(([zoneName, colors]) => {
      const zone = zones[zoneName as keyof DetectedFaceZones];
      if (zone && zone.width > 0 && zone.height > 0) {
        // Fill
        ctx.fillStyle = colors.fill;
        ctx.beginPath();
        ctx.roundRect(zone.x, zone.y, zone.width, zone.height, 8);
        ctx.fill();
        
        // Stroke
        ctx.strokeStyle = colors.stroke;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Label
        ctx.fillStyle = colors.stroke;
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(colors.label, zone.x + zone.width / 2, zone.y - 5);
      }
    });
    
    // Draw under-eye zones
    const leftUnderEye = {
      x: zones.leftEye.x,
      y: zones.leftEye.y + zones.leftEye.height * 0.7,
      width: zones.leftEye.width,
      height: zones.leftEye.height * 0.4,
    };
    const rightUnderEye = {
      x: zones.rightEye.x,
      y: zones.rightEye.y + zones.rightEye.height * 0.7,
      width: zones.rightEye.width,
      height: zones.rightEye.height * 0.4,
    };
    
    [leftUnderEye, rightUnderEye].forEach((zone, i) => {
      ctx.fillStyle = 'rgba(139, 92, 246, 0.25)';
      ctx.strokeStyle = '#8B5CF6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(
        zone.x + zone.width / 2,
        zone.y + zone.height / 2,
        zone.width / 2,
        zone.height / 2,
        0, 0, Math.PI * 2
      );
      ctx.fill();
      ctx.stroke();
      
      if (i === 0) {
        ctx.fillStyle = '#8B5CF6';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText('Under-Eye', zone.x + zone.width / 2, zone.y - 3);
      }
    });
    
    // Draw confidence badge
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.beginPath();
    ctx.roundRect(10, 10, 120, 30, 8);
    ctx.fill();
    
    ctx.fillStyle = '#00B4D8';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Confidence: ${detection.confidence}%`, 18, 30);
    
    // Draw "Powered by Skindu" badge
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.beginPath();
    ctx.roundRect(canvas.width - 130, canvas.height - 35, 120, 25, 8);
    ctx.fill();
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Powered by Skindu', canvas.width - 70, canvas.height - 18);
    
    return canvas;
  }
  
  /**
   * Check if model is ready
   */
  isReady(): boolean {
    return this.isInitialized && this.model !== null;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const faceDetector = SkinduFaceDetector.getInstance();

export async function initializeFaceDetector(): Promise<void> {
  await faceDetector.initialize();
}

export async function detectFaceInImage(
  imageSource: HTMLImageElement | HTMLCanvasElement | string
): Promise<FaceDetectionResult | null> {
  // If string (base64), convert to image element
  if (typeof imageSource === 'string') {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    return new Promise((resolve) => {
      img.onload = async () => {
        const result = await faceDetector.detectFace(img);
        resolve(result);
      };
      img.onerror = () => resolve(null);
      img.src = imageSource;
    });
  }
  
  return faceDetector.detectFace(imageSource);
}

export async function analyzeFaceZones(
  imageSource: HTMLImageElement | HTMLCanvasElement | string,
  zones: DetectedFaceZones
): Promise<FaceAnalysisData['zoneAnalysis']> {
  if (typeof imageSource === 'string') {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    return new Promise((resolve) => {
      img.onload = async () => {
        const result = await faceDetector.analyzeZones(img, zones);
        resolve(result);
      };
      img.onerror = () => resolve({
        forehead: faceDetector['getDefaultZoneAnalysis'](),
        leftCheek: faceDetector['getDefaultZoneAnalysis'](),
        rightCheek: faceDetector['getDefaultZoneAnalysis'](),
        nose: faceDetector['getDefaultZoneAnalysis'](),
        tZone: faceDetector['getDefaultZoneAnalysis'](),
        underEyes: faceDetector['getDefaultZoneAnalysis'](),
        jawline: faceDetector['getDefaultZoneAnalysis'](),
      });
      img.src = imageSource;
    });
  }
  
  return faceDetector.analyzeZones(imageSource, zones);
}

export function generateFaceOverlay(
  imageSource: HTMLImageElement | HTMLCanvasElement | string,
  detection: FaceDetectionResult
): Promise<string> {
  return new Promise((resolve) => {
    if (typeof imageSource === 'string') {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          const canvas = faceDetector.generateOverlayCanvas(img, detection);
          resolve(canvas.toDataURL('image/jpeg', 0.9));
        } catch (error) {
          console.warn('[Skindu] Failed to generate overlay:', error);
          resolve(''); // Return empty string on failure
        }
      };
      img.onerror = () => {
        console.warn('[Skindu] Failed to load image for overlay');
        resolve(''); // Return empty string instead of rejecting
      };
      img.src = imageSource;
    } else {
      try {
        const canvas = faceDetector.generateOverlayCanvas(imageSource, detection);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      } catch (error) {
        console.warn('[Skindu] Failed to generate overlay:', error);
        resolve(''); // Return empty string on failure
      }
    }
  });
}

export { SkinduFaceDetector, FACE_MESH_LANDMARKS };
