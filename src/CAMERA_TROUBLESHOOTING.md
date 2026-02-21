# Camera Troubleshooting Guide

## Common Issues and Solutions

### 1. "Camera Permission Denied" Error

**Cause:** The browser blocked camera access or you clicked "Block" when prompted.

**Solutions:**

#### Chrome/Edge:
1. Click the camera icon (or lock icon) in the address bar
2. Click "Site settings"
3. Find "Camera" and change to "Allow"
4. Refresh the page

#### Firefox:
1. Click the lock icon in the address bar
2. Click the arrow next to "Blocked" or "Permissions"
3. Find Camera and select "Allow"
4. Refresh the page

#### Safari (Mac):
1. Go to Safari → Settings → Websites → Camera
2. Find your site and change to "Allow"
3. Refresh the page

#### Safari (iOS):
1. Go to Settings → Safari → Camera
2. Select "Allow"
3. Or: Settings → [Your App Name] → Camera → Enable

#### Chrome (Android):
1. Open Chrome → Menu (three dots) → Settings
2. Site Settings → Camera
3. Find your site and enable camera
4. Refresh the page

### 2. "No Camera Found" Error

**Cause:** Your device doesn't have a camera or it's not detected.

**Solutions:**
- Check if your device has a camera
- For laptops: Ensure external webcam is properly connected
- Try the "Upload Photo" option instead
- Check if camera works in other apps

### 3. "Camera is Already in Use" Error

**Cause:** Another application is using the camera.

**Solutions:**
- Close other apps that might be using the camera (Zoom, Teams, Skype, etc.)
- Close other browser tabs that might be using the camera
- Restart your browser
- Restart your device if the issue persists

### 4. Camera Opens But Shows Black Screen

**Cause:** Driver issues or permission problems.

**Solutions:**
- Update your browser to the latest version
- Update camera drivers (Windows: Device Manager)
- Try a different browser
- Restart your device

### 5. HTTPS Required Error

**Cause:** Camera access requires a secure connection.

**Note:** Modern browsers only allow camera access on:
- `https://` websites (secure)
- `localhost` (development)

**Solutions:**
- Use HTTPS for your website
- For development: Use `localhost` instead of your IP address
- Use services like ngrok for testing on mobile devices

## Browser Compatibility

### ✅ Fully Supported
- Chrome 53+
- Firefox 36+
- Safari 11+
- Edge 79+
- Chrome Mobile (Android)
- Safari Mobile (iOS 11+)

### ⚠️ Limited Support
- Internet Explorer: **Not supported** (no getUserMedia API)
- Older browsers: May not support all features

## Testing Camera Access

### Quick Test:
Open your browser console and run:
```javascript
navigator.mediaDevices.getUserMedia({ video: true })
  .then(() => console.log('✅ Camera access works!'))
  .catch((error) => console.error('❌ Camera error:', error.name));
```

## Alternative: Upload Photo

If camera access doesn't work:
1. Take a photo with your phone camera
2. Click "Upload Photo Instead" button
3. Select the photo from your gallery
4. Continue with the analysis

## Development Setup

### Local Testing (localhost):
```bash
# Works without HTTPS
npm run dev
# Access at: http://localhost:5173
```

### Network Testing (requires HTTPS):
```bash
# Option 1: Use ngrok
ngrok http 5173

# Option 2: Use local HTTPS
# Create SSL certificate for development
```

### Test on Mobile Device:
1. Ensure both devices are on same network
2. Use ngrok or HTTPS
3. Access the ngrok URL from mobile browser

## Security Notes

### Why Camera Permissions Are Needed:
- **Required by browsers** for user privacy and security
- Camera access is only requested when you click "Start Camera"
- No data is sent to servers without your explicit action
- Images are processed locally or sent only when you start analysis

### What Happens to Camera Data:
1. Camera stream is displayed in your browser only
2. When you capture, image is stored temporarily in browser memory
3. Analysis sends image to AI API only when you click "Start AI Analysis"
4. No continuous recording or background access

## Performance Tips

### For Best Camera Quality:
- Use rear camera on phones (usually better quality)
- Ensure good lighting
- Clean your camera lens
- Use latest browser version
- Close unnecessary apps to free up resources

### If Camera is Slow/Laggy:
- Close other browser tabs
- Disable browser extensions temporarily
- Clear browser cache
- Use a more powerful device if possible
- Try reducing quality settings (modify code if needed)

## Technical Details

### Camera Resolution:
Default settings request:
- Width: 1280px (ideal)
- Height: 720px (ideal)
- Browsers will use closest available resolution

### Supported Image Formats:
- JPEG (recommended for upload)
- PNG
- WebP
- HEIC (iOS, converted automatically)

## Deployment Considerations

### Production Checklist:
- ✅ Use HTTPS (required for camera)
- ✅ Valid SSL certificate
- ✅ Test on multiple browsers
- ✅ Test on mobile devices
- ✅ Add camera permission instructions in UI
- ✅ Provide upload alternative

### Hosting Platforms (HTTPS by default):
- Vercel ✅
- Netlify ✅
- GitHub Pages (with custom domain) ✅
- AWS S3 + CloudFront ✅
- Firebase Hosting ✅

## Still Having Issues?

### Check Browser Console:
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for error messages
4. Copy error message for debugging

### Common Error Messages:

| Error Name | Meaning | Solution |
|------------|---------|----------|
| `NotAllowedError` | Permission denied | Enable camera in browser settings |
| `NotFoundError` | No camera detected | Check device, try upload instead |
| `NotReadableError` | Camera in use | Close other apps using camera |
| `OverconstrainedError` | Requested settings unavailable | Browser will auto-adjust |
| `SecurityError` | HTTPS required | Use HTTPS or localhost |
| `AbortError` | User canceled | Try again |

### Report an Issue:
If problems persist:
1. Note your browser and version
2. Note your device (phone/laptop/tablet)
3. Note the exact error message
4. Use the "Upload Photo" workaround meanwhile

## Privacy Information

### What We Access:
- Camera stream (only when you start camera)
- Single photo capture (only when you click capture button)

### What We DON'T Access:
- ❌ Continuous camera feed
- ❌ Camera when app is not active
- ❌ Photos from your gallery (unless you upload)
- ❌ Camera without your permission

### Data Handling:
- Camera stream: **Not saved**, displayed in browser only
- Captured image: **Temporarily stored** in browser memory
- After analysis: **Optionally saved** to your device (your choice)
- Upload option: **You control** which photo to use
