# AI Skin Analysis API Integration Guide

This guide explains how to integrate real AI skin analysis APIs into the SkinPAI application.

## Current Implementation

The app currently uses **mock data** for skin analysis. The camera functionality is **real** and captures actual photos from the device camera. You need to integrate a real AI API to analyze the captured images.

## Where to Integrate

The main integration point is in `/components/CameraInterface.tsx` in the `analyzeSkinWithAI` function (line ~94).

```typescript
const analyzeSkinWithAI = async (imageData: string) => {
  // Replace this with your real API call
  // See examples below
}
```

## Recommended AI Skin Analysis Services

### 1. Face++ (Recommended - Easiest to Start)

**Why Choose:**
- Free tier available (1000 calls/month)
- Comprehensive skin analysis
- Easy to integrate
- Good documentation

**Features:**
- Age detection
- Skin type classification
- Acne detection
- Wrinkle analysis
- Dark spots and pigmentation
- Skin texture analysis
- Pore size estimation

**Setup:**
1. Sign up at https://www.faceplusplus.com/
2. Get your API Key and API Secret
3. Add to your environment variables:
```bash
FACEPP_API_KEY=your_api_key
FACEPP_API_SECRET=your_api_secret
```

**Integration Example:**
```typescript
const analyzeSkinWithAI = async (imageData: string) => {
  const API_KEY = import.meta.env.VITE_FACEPP_API_KEY;
  const API_SECRET = import.meta.env.VITE_FACEPP_API_SECRET;
  
  const formData = new FormData();
  formData.append('api_key', API_KEY);
  formData.append('api_secret', API_SECRET);
  formData.append('image_base64', imageData.split(',')[1]);
  formData.append('return_attributes', 'age,skin_status');
  
  const response = await fetch('https://api-us.faceplusplus.com/facepp/v1/skinanalyze', {
    method: 'POST',
    body: formData
  });
  
  const data = await response.json();
  
  // Transform to your ScanResult format
  return {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    imageUrl: imageData,
    overallScore: calculateScore(data),
    estimatedAge: data.faces[0]?.attributes?.age?.value || 25,
    // ... map other fields
  };
};
```

### 2. Microsoft Azure Face API

**Why Choose:**
- Reliable and scalable
- Good accuracy
- Part of Azure ecosystem
- Free tier: 30,000 calls/month

**Features:**
- Age detection
- Face attributes
- Emotion detection
- Face landmarks

**Note:** Azure provides age detection but limited skin metrics. Best combined with other APIs.

**Setup:**
1. Create Azure account
2. Create a Face API resource
3. Get your endpoint and key

**Integration Example:**
```typescript
const analyzeSkinWithAI = async (imageData: string) => {
  const AZURE_KEY = import.meta.env.VITE_AZURE_FACE_KEY;
  const AZURE_ENDPOINT = import.meta.env.VITE_AZURE_ENDPOINT;
  
  // Convert base64 to blob
  const blob = await fetch(imageData).then(r => r.blob());
  
  const response = await fetch(
    `${AZURE_ENDPOINT}/face/v1.0/detect?returnFaceAttributes=age`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Ocp-Apim-Subscription-Key': AZURE_KEY
      },
      body: blob
    }
  );
  
  const data = await response.json();
  
  return {
    // ... transform response
  };
};
```

### 3. Haut.AI (Enterprise - Most Comprehensive)

**Why Choose:**
- Most comprehensive skin analysis (100+ parameters)
- Medical-grade accuracy
- Suitable for professional applications
- Custom model training available

**Features:**
- All skin metrics
- Advanced pigmentation analysis
- Personalized recommendations
- Trend tracking

**Setup:**
Contact Haut.AI for enterprise pricing and API access.

### 4. Perfect Corp YouCam AI

**Why Choose:**
- AR/Beauty focused
- Virtual try-on capabilities
- Real-time analysis
- Good for e-commerce

**Setup:**
Contact Perfect Corp for SDK access.

### 5. OpenCV + TensorFlow.js (Custom Solution)

**Why Choose:**
- Free and open-source
- Full control
- Offline capable
- No API costs

**Challenges:**
- Requires ML expertise
- Need to train/fine-tune models
- More development time

**Resources:**
- Face detection: `face-api.js`
- Skin analysis models: Train custom models or use pre-trained
- TensorFlow.js models: https://www.tensorflow.org/js

## Integration Steps

### Step 1: Choose Your API Provider

Based on your needs:
- **Just starting / Testing?** → Face++ (free tier)
- **Need reliable, scalable solution?** → Azure Face API
- **Building professional product?** → Haut.AI
- **Want full control?** → Custom TensorFlow.js

### Step 2: Get API Credentials

1. Sign up for your chosen service
2. Create an application/project
3. Get API keys/credentials

### Step 3: Store Credentials Securely

Create a `.env` file (DO NOT commit to git):
```bash
# .env
VITE_FACEPP_API_KEY=your_key_here
VITE_FACEPP_API_SECRET=your_secret_here
```

Or use environment variables in your deployment platform (Vercel, Netlify, etc.)

### Step 4: Update CameraInterface.tsx

Replace the mock implementation in `analyzeSkinWithAI` function with your real API call.

### Step 5: Transform API Response

Map the API response to the `ScanResult` interface:

```typescript
const mockResult: ScanResult = {
  id: Date.now().toString(),
  date: new Date().toISOString(),
  imageUrl: imageData,
  overallScore: /* calculated from API */,
  estimatedAge: /* from API */,
  
  // Health metrics
  hydration: /* from API or calculated */,
  moisture: /* from API */,
  // ... etc
  
  // Concerns
  acne: /* from API */,
  wrinkles: /* from API */,
  // ... etc
  
  skinType: /* from API */,
  recommendations: /* generated based on analysis */,
  aiAnalysis: /* generated insight */
};
```

### Step 6: Error Handling

Always implement proper error handling:

```typescript
try {
  const response = await fetch(API_URL, {...});
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Validate response data
  if (!data.faces || data.faces.length === 0) {
    throw new Error('No face detected in image');
  }
  
  return transformToScanResult(data);
} catch (error) {
  console.error('Skin analysis error:', error);
  toast.error('Analysis failed. Please try again with better lighting.');
  throw error;
}
```

## Data Mapping Examples

### Face++ to SkinPAI Format

```typescript
function transformFacePlusPlusData(data: any): ScanResult {
  const face = data.faces[0];
  const skinStatus = face.attributes.skin_status;
  
  return {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    imageUrl: /* your captured image */,
    
    // Overall
    overallScore: calculateOverallScore(skinStatus),
    estimatedAge: face.attributes.age.value,
    
    // Health metrics (0-100 scale)
    hydration: skinStatus.hydration || 70,
    moisture: skinStatus.moisture || 70,
    oiliness: skinStatus.oily || 50,
    evenness: (100 - skinStatus.stain) || 70,
    texture: (100 - skinStatus.rough) || 70,
    clarity: skinStatus.clarity || 75,
    firmness: (100 - skinStatus.sagging) || 75,
    elasticity: skinStatus.elasticity || 75,
    poreSize: skinStatus.pore || 30,
    smoothness: (100 - skinStatus.rough) || 75,
    radiance: skinStatus.radiance || 70,
    
    // Concerns (0-100 severity)
    acne: skinStatus.acne || 15,
    wrinkles: skinStatus.wrinkle || 20,
    darkCircles: skinStatus.dark_circle || 25,
    darkSpots: skinStatus.stain || 20,
    redness: skinStatus.redness || 20,
    
    skinType: determineSkinType(skinStatus),
    uvDamage: skinStatus.uv_damage || 25,
    
    recommendations: generateRecommendations(skinStatus),
    aiAnalysis: generateAnalysis(skinStatus)
  };
}

function calculateOverallScore(skinStatus: any): number {
  // Average of positive metrics
  const positiveScores = [
    skinStatus.hydration,
    skinStatus.moisture,
    skinStatus.clarity,
    100 - skinStatus.wrinkle,
    100 - skinStatus.acne
  ];
  
  return Math.round(
    positiveScores.reduce((a, b) => a + b, 0) / positiveScores.length
  );
}
```

## Testing

### Test with Mock Data First
The current implementation uses mock data that simulates realistic API responses. Test all UI flows before integrating real API.

### Test Real API Integration
1. Start with a single test image
2. Verify API response structure
3. Test error cases (bad lighting, no face, etc.)
4. Test with various skin types and ages
5. Validate all metrics are properly mapped

### Rate Limiting
Implement rate limiting to avoid exceeding API quotas:

```typescript
// Simple rate limiting
let lastCallTime = 0;
const MIN_CALL_INTERVAL = 2000; // 2 seconds

const analyzeSkinWithAI = async (imageData: string) => {
  const now = Date.now();
  if (now - lastCallTime < MIN_CALL_INTERVAL) {
    toast.error('Please wait before scanning again');
    return;
  }
  lastCallTime = now;
  
  // API call...
};
```

## Cost Optimization

1. **Use Free Tiers During Development**
   - Face++: 1000 calls/month free
   - Azure: 30,000 calls/month free

2. **Implement Caching**
   - Cache results for same image
   - Store previous analyses

3. **Optimize Image Size**
   - Compress images before sending
   - Use appropriate resolution (640x480 often sufficient)

```typescript
// Compress image before sending
function compressImage(base64: string, maxWidth: number = 640): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ratio = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * ratio;
      
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.src = base64;
  });
}
```

## Security Best Practices

1. **Never expose API keys in client code**
   - Use environment variables
   - Or proxy through your backend

2. **Create a Backend Proxy (Recommended for Production)**
```typescript
// Your backend (e.g., Next.js API route)
export async function POST(request: Request) {
  const { image } = await request.json();
  
  // Call AI API with your secret key
  const result = await callAIAPI(image);
  
  return Response.json(result);
}

// Frontend
const analyzeSkinWithAI = async (imageData: string) => {
  const response = await fetch('/api/analyze-skin', {
    method: 'POST',
    body: JSON.stringify({ image: imageData })
  });
  
  return response.json();
};
```

3. **Validate and sanitize inputs**
4. **Implement rate limiting**
5. **Log errors for monitoring**

## Next Steps

1. ✅ Choose an AI provider
2. ✅ Get API credentials  
3. ✅ Test API in Postman/curl
4. ✅ Update `analyzeSkinWithAI` function
5. ✅ Test with real camera captures
6. ✅ Deploy and monitor

## Support

For API-specific questions:
- **Face++**: https://console.faceplusplus.com/documents/5671270
- **Azure**: https://docs.microsoft.com/en-us/azure/cognitive-services/face/
- **TensorFlow.js**: https://www.tensorflow.org/js

For SkinPAI-specific integration questions, refer to the code comments in:
- `/components/CameraInterface.tsx`
- `/utils/skinAnalysisAPI.ts`