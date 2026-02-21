# Skindu Smart Skin Analyzer Integration

**Powered by Skindu - Advanced AI Skin Analysis Technology**

This document provides comprehensive documentation for the Skindu Smart Skin Analyzer integration in the SkinPAI mobile application.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Installation & Setup](#installation--setup)
4. [API Reference](#api-reference)
5. [Skin Parameters](#skin-parameters)
6. [Usage Examples](#usage-examples)
7. [Configuration](#configuration)
8. [Error Handling](#error-handling)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## Overview

### What is Skindu?

Skindu is an advanced AI-powered skin analysis technology that provides comprehensive skin health assessment through computer vision and machine learning algorithms. The Skindu analyzer processes facial images to detect and measure over 20 skin parameters with high accuracy.

### Key Features

- **MediaPipe Face Mesh**: 468 facial landmark detection for precise zone mapping
- **TensorFlow.js Runtime**: Client-side ML inference for privacy-first analysis
- **Real-time Analysis**: Process skin images in 2-4 seconds
- **Visual Zone Overlay**: AI-generated face map showing analyzed regions
- **15+ Health Metrics**: Hydration, texture, clarity, firmness, and more
- **8+ Concern Detection**: Acne, wrinkles, dark circles, dark spots, etc.
- **Zone-based Analysis**: Detailed analysis by facial region (forehead, T-zone, cheeks, etc.)
- **AI Insights**: Intelligent recommendations based on detected conditions
- **Multi-language Support**: English and Arabic with RTL support

### Integration Points

```
┌─────────────────────────────────────────────────────────────┐
│                    SkinPAI Application                       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────────────────────┐ │
│  │ CameraInterface │───▶│      Skindu Analyzer            │ │
│  │  (Capture/Upload)│    │ ┌─────────────────────────────┐ │ │
│  └─────────────────┘    │ │  Image Processing           │ │ │
│                         │ │  • Feature Extraction       │ │ │
│  ┌─────────────────┐    │ │  • Pixel Analysis           │ │ │
│  │  ScanResults    │◀───│ │  • Zone Detection           │ │ │
│  │  (Display)      │    │ └─────────────────────────────┘ │ │
│  └─────────────────┘    │ ┌─────────────────────────────┐ │ │
│                         │ │  AI Analysis Engine         │ │ │
│                         │ │  • Health Metrics           │ │ │
│                         │ │  • Concern Detection        │ │ │
│                         │ │  • Recommendations          │ │ │
│                         │ └─────────────────────────────┘ │ │
│                         └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Architecture

### File Structure

```
src/
├── services/
│   ├── skinduAnalyzer.ts       # Core Skindu analyzer service
│   └── skinduFaceDetector.ts   # MediaPipe Face Mesh integration
├── components/
│   ├── CameraInterface.tsx     # Camera capture with Skindu integration
│   └── ScanResults.tsx         # Results display with AI overlay
└── types/
    └── index.ts                # ScanResult type definitions
```

### ML Dependencies

```json
{
  "@tensorflow/tfjs": "^4.x",
  "@tensorflow-models/face-landmarks-detection": "^1.x",
  "@mediapipe/face_mesh": "^0.4.x"
}
```

### Class Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                      SkinduAnalyzer                          │
├──────────────────────────────────────────────────────────────┤
│ - config: SkinduAnalysisConfig                               │
│ - static instance: SkinduAnalyzer                            │
├──────────────────────────────────────────────────────────────┤
│ + static getInstance(config?): SkinduAnalyzer                │
│ + analyze(input: SkinduImageInput): Promise<SkinduResult>    │
│ - validateImageInput(input): void                            │
│ - analyzeWithAPI(input): Promise<SkinduResult>               │
│ - analyzeLocally(input, startTime): Promise<SkinduResult>    │
│ - extractImageFeatures(base64): Promise<ImageFeatures>       │
│ - calculateHealthMetrics(features): SkinduHealthMetrics      │
│ - calculateConcerns(features): SkinduConcerns                │
│ - calculateZoneAnalysis(features): SkinduZoneAnalysis        │
│ - generateInsights(...): string[]                            │
│ - generateRecommendations(...): SkinduRecommendation[]       │
└──────────────────────────────────────────────────────────────┘
```

---

## Installation & Setup

### Prerequisites

- Node.js 18+ 
- React 18+
- TypeScript 5+

### Integration Steps

1. **Import the Skindu Analyzer**

```typescript
import { 
  SkinduAnalyzer, 
  SkinduAnalysisResult,
  getSkinduBranding 
} from '../services/skinduAnalyzer';
```

2. **Initialize the Analyzer**

```typescript
const analyzer = SkinduAnalyzer.getInstance({
  enableDebug: true,  // Enable console logging
  timeout: 30000,     // API timeout in ms
});
```

3. **Perform Analysis**

```typescript
const result = await analyzer.analyze({
  base64Image: imageData,
  userId: 'user-123',
  metadata: {
    deviceType: 'mobile',
    captureTime: new Date().toISOString(),
    lightingCondition: 'natural',
    cameraType: 'front',
  },
});
```

### Environment Variables (Optional)

For cloud API integration, configure the following:

```env
VITE_SKINDU_API_KEY=your_api_key_here
VITE_SKINDU_ENDPOINT=https://api.skindu.ai/v1
```

---

## API Reference

### SkinduAnalyzer Class

#### `getInstance(config?)`

Returns singleton instance of the Skindu Analyzer.

```typescript
const analyzer = SkinduAnalyzer.getInstance({
  apiKey: 'optional-api-key',
  endpoint: 'optional-endpoint',
  enableDebug: false,
  timeout: 30000,
  retryAttempts: 3,
});
```

#### `analyze(input)`

Analyzes a skin image and returns comprehensive results.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `base64Image` | `string` | Yes | Base64-encoded image data |
| `userId` | `string` | No | User identifier for tracking |
| `metadata` | `object` | No | Additional capture metadata |

**Returns:** `Promise<SkinduAnalysisResult>`

### Type Definitions

#### `SkinduAnalysisResult`

```typescript
interface SkinduAnalysisResult {
  // Metadata
  analysisId: string;
  timestamp: string;
  processingTime: number;
  confidence: number;
  poweredBy: 'Skindu';
  
  // Core Results
  overallScore: number;        // 0-100
  estimatedSkinAge: number;    // Years
  skinType: 'oily' | 'dry' | 'combination' | 'normal' | 'sensitive';
  skinTone: 'fair' | 'light' | 'medium' | 'tan' | 'deep';
  
  // Detailed Metrics
  healthMetrics: SkinduHealthMetrics;
  concerns: SkinduConcerns;
  zoneAnalysis: SkinduZoneAnalysis;
  
  // AI Insights
  insights: string[];
  recommendations: SkinduRecommendation[];
  skinSummary: string;
  
  // Comparison
  comparedToAverage: {
    overallScore: 'better' | 'average' | 'below';
    percentile: number;
  };
}
```

#### `SkinduHealthMetrics`

```typescript
interface SkinduHealthMetrics {
  hydration: number;     // 0-100: Skin moisture content
  moisture: number;      // 0-100: Surface moisture level
  oiliness: number;      // 0-100: Sebum production level
  evenness: number;      // 0-100: Skin tone uniformity
  texture: number;       // 0-100: Surface smoothness
  clarity: number;       // 0-100: Skin transparency/radiance
  firmness: number;      // 0-100: Skin density and structure
  elasticity: number;    // 0-100: Ability to snap back
  poreSize: number;      // 0-100: Pore visibility (lower = better)
  smoothness: number;    // 0-100: Overall surface quality
  radiance: number;      // 0-100: Natural glow level
}
```

#### `SkinduConcerns`

```typescript
interface SkinduConcerns {
  acne: number;          // 0-100: Acne severity
  wrinkles: number;      // 0-100: Wrinkle depth and count
  darkCircles: number;   // 0-100: Under-eye darkness
  darkSpots: number;     // 0-100: Hyperpigmentation
  redness: number;       // 0-100: Inflammatory redness
  uvDamage: number;      // 0-100: Sun damage indicators
  sensitivity: number;   // 0-100: Skin reactivity
  dehydration: number;   // 0-100: Trans-epidermal water loss
}
```

---

## Skin Parameters

### Health Metrics (Higher = Better)

| Metric | Description | Optimal Range |
|--------|-------------|---------------|
| **Hydration** | Internal skin moisture content | 70-100 |
| **Moisture** | Surface-level moisture | 65-100 |
| **Oiliness** | Sebum production level | 30-60 (balanced) |
| **Evenness** | Skin tone uniformity | 75-100 |
| **Texture** | Surface smoothness | 70-100 |
| **Clarity** | Transparency and radiance | 75-100 |
| **Firmness** | Skin density/structure | 70-100 |
| **Elasticity** | Bounce-back ability | 70-100 |
| **Pore Size** | Pore visibility | 0-40 (smaller = better) |
| **Smoothness** | Overall surface quality | 70-100 |
| **Radiance** | Natural skin glow | 65-100 |

### Skin Concerns (Lower = Better)

| Concern | Description | Severity Levels |
|---------|-------------|-----------------|
| **Acne** | Active breakouts and blemishes | <20: Minimal, <40: Mild |
| **Wrinkles** | Fine lines and deep wrinkles | <20: Minimal, <40: Mild |
| **Dark Circles** | Under-eye discoloration | <25: Minimal, <50: Mild |
| **Dark Spots** | Hyperpigmentation spots | <20: Minimal, <40: Mild |
| **Redness** | Inflammatory redness | <20: Minimal, <40: Mild |
| **UV Damage** | Sun damage indicators | <25: Minimal, <45: Mild |
| **Sensitivity** | Skin reactivity level | <20: Low, <40: Moderate |
| **Dehydration** | Water loss indicators | <25: Minimal, <45: Mild |

### Zone Analysis

| Zone | Metrics Analyzed |
|------|------------------|
| **Forehead** | Oiliness, Wrinkles, Texture |
| **T-Zone** | Oiliness, Pore Size |
| **Cheeks** | Hydration, Redness, Evenness |
| **Under-Eye** | Dark Circles, Puffiness, Wrinkles |
| **Jawline** | Acne, Texture |
| **Nose** | Oiliness, Pore Size, Blackheads |

---

## Usage Examples

### Basic Analysis

```typescript
import { analyzeSkin } from '../services/skinduAnalyzer';

async function performSkinAnalysis(imageBase64: string) {
  try {
    const result = await analyzeSkin(imageBase64);
    
    console.log('Overall Score:', result.overallScore);
    console.log('Skin Type:', result.skinType);
    console.log('Estimated Age:', result.estimatedSkinAge);
    
    // Display insights
    result.insights.forEach(insight => {
      console.log('Insight:', insight);
    });
    
    return result;
  } catch (error) {
    console.error('Analysis failed:', error);
    throw error;
  }
}
```

### With Full Configuration

```typescript
import { SkinduAnalyzer } from '../services/skinduAnalyzer';

const analyzer = SkinduAnalyzer.getInstance({
  enableDebug: process.env.NODE_ENV === 'development',
  timeout: 45000,
  retryAttempts: 3,
});

const result = await analyzer.analyze({
  base64Image: capturedImage,
  userId: currentUser.id,
  metadata: {
    deviceType: isMobile ? 'mobile' : 'desktop',
    captureTime: new Date().toISOString(),
    lightingCondition: 'natural',
    cameraType: 'front',
  },
});
```

### Converting to ScanResult

```typescript
function convertToScanResult(
  skinduResult: SkinduAnalysisResult, 
  imageData: string
): ScanResult {
  return {
    id: skinduResult.analysisId,
    date: skinduResult.timestamp,
    imageUrl: imageData,
    overallScore: skinduResult.overallScore,
    estimatedAge: skinduResult.estimatedSkinAge,
    
    // Health metrics
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
    
    // Concerns
    acne: skinduResult.concerns.acne,
    wrinkles: skinduResult.concerns.wrinkles,
    darkCircles: skinduResult.concerns.darkCircles,
    darkSpots: skinduResult.concerns.darkSpots,
    redness: skinduResult.concerns.redness,
    
    // Additional
    skinType: skinduResult.skinType,
    uvDamage: skinduResult.concerns.uvDamage,
    recommendations: skinduResult.recommendations.map(r => r.title),
    aiAnalysis: skinduResult.skinSummary,
  };
}
```

---

## Configuration

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | `string` | `''` | Skindu Cloud API key |
| `endpoint` | `string` | `'https://api.skindu.ai/v1'` | API endpoint URL |
| `enableDebug` | `boolean` | `false` | Enable console logging |
| `timeout` | `number` | `30000` | Request timeout in ms |
| `retryAttempts` | `number` | `3` | Number of retry attempts |

### Analysis Modes

1. **Local Analysis Mode** (Default)
   - No API key required
   - Uses image processing heuristics
   - Analysis time: 2-4 seconds
   - Suitable for development and offline use

2. **Cloud API Mode**
   - Requires valid API key
   - More accurate AI-powered analysis
   - Analysis time: 1-2 seconds
   - Recommended for production

---

## Error Handling

### Error Types

```typescript
class SkinduError extends Error {
  code: string;
  originalError?: any;
}
```

### Error Codes

| Code | Description | Resolution |
|------|-------------|------------|
| `MISSING_IMAGE` | No image provided | Ensure base64Image is passed |
| `INVALID_FORMAT` | Invalid image format | Use data:image/* format |
| `LOW_QUALITY` | Image quality too low | Use higher resolution image |
| `ANALYSIS_FAILED` | Analysis processing failed | Retry the analysis |
| `API_ERROR` | Cloud API returned error | Check API key and network |
| `TIMEOUT` | Request timed out | Increase timeout or retry |

### Error Handling Example

```typescript
import { SkinduError } from '../services/skinduAnalyzer';

try {
  const result = await analyzer.analyze({ base64Image: image });
} catch (error) {
  if (error instanceof SkinduError) {
    switch (error.code) {
      case 'LOW_QUALITY':
        toast.error('Please capture a clearer image');
        break;
      case 'TIMEOUT':
        toast.error('Analysis timed out. Please try again.');
        break;
      default:
        toast.error('Analysis failed. Please try again.');
    }
  }
}
```

---

## Best Practices

### Image Quality Guidelines

1. **Lighting**: Natural, even lighting works best
2. **Resolution**: Minimum 480x640 pixels recommended
3. **Face Position**: Center face in frame
4. **Distance**: 30-50cm from camera
5. **Makeup**: Remove makeup for most accurate results
6. **Filters**: Avoid using camera filters

### Performance Optimization

1. **Singleton Pattern**: Use `getInstance()` to reuse analyzer
2. **Image Compression**: Compress large images before analysis
3. **Caching**: Cache results to avoid re-analysis
4. **Error Recovery**: Implement retry logic for transient failures

### Code Quality

```typescript
// ✅ Good: Use singleton instance
const analyzer = SkinduAnalyzer.getInstance();

// ❌ Bad: Creating new instances
const analyzer = new SkinduAnalyzer(); // This will fail (private constructor)

// ✅ Good: Handle errors properly
try {
  const result = await analyzer.analyze({ base64Image });
} catch (error) {
  // Handle error
}

// ❌ Bad: Ignoring errors
const result = await analyzer.analyze({ base64Image }); // May throw
```

---

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Analysis returns same results | Using local mode without image variation | Results are based on actual image features |
| Low confidence score | Poor image quality | Improve lighting and camera angle |
| "Analysis failed" error | Image processing error | Try with a different image |
| Slow analysis | Large image size | Compress image before analysis |
| RTL layout issues | Missing direction prop | Ensure RTL context is provided |

### Debug Mode

Enable debug mode to see detailed logs:

```typescript
const analyzer = SkinduAnalyzer.getInstance({
  enableDebug: true,
});
```

Console output:
```
[Skindu] Starting analysis...
[Skindu] Image validated: 256KB
[Skindu] Processing features...
[Skindu] Analysis complete: {
  analysisId: "skindu_1708527600000_abc123",
  confidence: 92,
  processingTime: 2345
}
```

---

## Branding

### Display Requirements

When displaying Skindu analysis results, include the following branding:

```tsx
<div className="flex items-center gap-2">
  <Sparkles className="w-4 h-4 text-primary" />
  <span className="text-sm text-muted-foreground">
    Powered by Skindu
  </span>
</div>
```

### Branding Helper

```typescript
import { getSkinduBranding } from '../services/skinduAnalyzer';

const branding = getSkinduBranding();
// {
//   poweredBy: 'Powered by Skindu',
//   version: '1.0.0',
//   trademark: '© Skindu AI Technology'
// }
```

---

## License & Attribution

This integration is powered by **Skindu AI Technology**.

- Documentation Version: 1.0.0
- Last Updated: February 2026
- Maintained by: SkinPAI Team

---

*Powered by Skindu - Advanced AI Skin Analysis Technology*
