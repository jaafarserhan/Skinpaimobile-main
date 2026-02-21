# Quick Start: Camera Features

## 🚀 Get Started in 2 Minutes

### Step 1: Run the App
```bash
npm install
npm run dev
```

### Step 2: Open in Browser
```
http://localhost:5173
```
✅ Camera works on `localhost` without HTTPS!

### Step 3: Test Camera
1. Login as guest or member
2. Complete questionnaire (if first time)
3. Navigate to "Scan" tab
4. Click "Start Camera"
5. Allow camera permission when prompted
6. Position face in guide
7. Click capture button
8. Review and click "Start AI Analysis"

## 📸 Two Ways to Scan

### Option 1: Use Camera
- Click "Start Camera"
- Allow permissions
- Capture live photo
- Best for real-time scanning

### Option 2: Upload Photo
- Click "Upload Photo Instead"
- Select existing photo
- From gallery or files
- Best for pre-existing images

## ⚠️ Troubleshooting

### "Permission Denied"
**Quick Fix:**
1. Click camera icon in address bar
2. Select "Allow"
3. Refresh page

**Alternative:**
- Use "Upload Photo Instead" button

### "No Camera Found"
- Your device doesn't have a camera
- Use upload option instead

### Camera Shows Black Screen
- Close other apps using camera
- Refresh browser
- Try different browser

## 🔧 For Developers

### Camera Component Location:
```
/components/CameraInterface.tsx
```

### Key Functions:
```typescript
// Start camera
const startCamera = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'user' }
  });
  // ...
}

// Capture photo
const capturePhoto = () => {
  ctx.drawImage(video, 0, 0);
  const imageData = canvas.toDataURL('image/jpeg');
  // ...
}

// Handle upload
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  // Convert to base64
}
```

### Error Handling:
```typescript
try {
  await startCamera();
} catch (error) {
  if (error.name === 'NotAllowedError') {
    // Permission denied
  } else if (error.name === 'NotFoundError') {
    // No camera
  }
  // Show upload option
}
```

### Utilities Available:
```typescript
import { 
  checkCameraSupport,
  getCameraErrorMessage,
  compressImage,
  validateImageForAnalysis 
} from './utils/cameraUtils';
```

## 🧪 Testing Checklist

Quick tests to run:

- [ ] Camera opens successfully
- [ ] Can capture photo
- [ ] Can switch cameras (mobile)
- [ ] Upload works as alternative
- [ ] Permission denied handled gracefully
- [ ] Works on mobile browser
- [ ] Analysis starts after capture

## 📱 Test on Mobile

### Option 1: Localhost (WiFi)
```bash
# Find your IP address
# Windows: ipconfig
# Mac/Linux: ifconfig

# Access from mobile on same network:
http://YOUR_IP:5173
```
⚠️ Won't work - camera requires HTTPS!

### Option 2: Use ngrok (Recommended)
```bash
# Install ngrok
npm install -g ngrok

# In one terminal:
npm run dev

# In another terminal:
ngrok http 5173

# Use the https:// URL on mobile
```
✅ Works - ngrok provides HTTPS!

## 🔒 Production Deploy

### Requirements:
1. **HTTPS Required** - No camera without it
2. Valid SSL certificate
3. Proper domain configuration

### Deployment Platforms:
All provide HTTPS automatically:
- Vercel ✅
- Netlify ✅  
- GitHub Pages (custom domain) ✅
- Firebase Hosting ✅

### Deploy to Vercel:
```bash
npm install -g vercel
vercel
# Follow prompts
# Camera will work automatically! ✅
```

## 🎯 Next: Integrate AI

The camera captures real photos. Now integrate AI:

1. See: `/API_INTEGRATION_GUIDE.md`
2. Choose AI provider (Face++ recommended)
3. Get API credentials
4. Update `analyzeSkinWithAI()` function
5. Map API response to ScanResult

Current mock generates realistic-looking data for testing UI.

## 📚 More Documentation

- **User Help**: `CAMERA_TROUBLESHOOTING.md`
- **Full Details**: `CAMERA_IMPLEMENTATION_SUMMARY.md`
- **AI Setup**: `API_INTEGRATION_GUIDE.md`

## 💡 Pro Tips

### Development:
- Use localhost - camera works without HTTPS
- Check browser console for errors
- Test permission denied scenario
- Always provide upload fallback

### Production:
- Always use HTTPS
- Test on real mobile devices
- Add analytics for camera errors
- Monitor permission grant rates

### User Experience:
- Show clear instructions
- Provide upload alternative
- Handle errors gracefully
- Explain why camera is needed

## 🎨 Customization

### Change Camera Quality:
```typescript
// In CameraInterface.tsx
const mediaStream = await navigator.mediaDevices.getUserMedia({
  video: {
    width: { ideal: 1920 },  // Change this
    height: { ideal: 1080 }  // And this
  }
});
```

### Change Image Compression:
```typescript
// In capturePhoto()
const imageData = canvas.toDataURL('image/jpeg', 0.95); // 0.0 - 1.0
```

### Add Flash/Torch:
```typescript
const track = stream.getVideoTracks()[0];
await track.applyConstraints({
  advanced: [{ torch: true }]
});
```

## ❓ Quick FAQ

**Q: Why is camera blocked?**
A: Need HTTPS in production. Use localhost for dev.

**Q: How to test on phone?**
A: Use ngrok for HTTPS tunnel to localhost.

**Q: Can I use rear camera?**
A: Yes, change `facingMode: 'environment'`

**Q: How to compress images?**
A: Use `compressImage()` from cameraUtils

**Q: What if user has no camera?**
A: Upload option is always available as fallback

**Q: Is data secure?**
A: Yes, camera stream stays in browser. Photo sent only when user clicks analyze.

## ✅ You're Ready!

Camera implementation is complete. Just:
1. Test locally ✅
2. Deploy with HTTPS ✅  
3. Integrate AI API 🔄
4. Launch! 🚀

---

**Need Help?** Check the other documentation files or browser console for errors.
