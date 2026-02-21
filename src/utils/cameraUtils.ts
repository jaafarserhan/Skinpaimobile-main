/**
 * Camera Utilities
 * Helper functions for camera access and troubleshooting
 */

export interface CameraSupport {
  isSupported: boolean;
  isSecureContext: boolean;
  hasMediaDevices: boolean;
  error?: string;
}

/**
 * Check if camera is supported in current environment
 */
export function checkCameraSupport(): CameraSupport {
  const result: CameraSupport = {
    isSupported: false,
    isSecureContext: window.isSecureContext,
    hasMediaDevices: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
  };

  // Check secure context (HTTPS or localhost)
  if (!window.isSecureContext) {
    result.error = 'Camera requires HTTPS or localhost';
    return result;
  }

  // Check if MediaDevices API exists
  if (!navigator.mediaDevices) {
    result.error = 'MediaDevices API not supported';
    return result;
  }

  // Check if getUserMedia exists
  if (!navigator.mediaDevices.getUserMedia) {
    result.error = 'getUserMedia not supported';
    return result;
  }

  result.isSupported = true;
  return result;
}

/**
 * Get user-friendly error message for camera errors
 */
export function getCameraErrorMessage(error: any): string {
  const errorName = error?.name || error?.message || '';

  switch (errorName) {
    case 'NotAllowedError':
    case 'PermissionDeniedError':
      return 'Camera access denied. Please allow camera permissions in your browser settings.';
    
    case 'NotFoundError':
    case 'DevicesNotFoundError':
      return 'No camera found. Please ensure your device has a camera or use the upload option.';
    
    case 'NotReadableError':
    case 'TrackStartError':
      return 'Camera is already in use. Please close other applications using the camera.';
    
    case 'OverconstrainedError':
      return 'Camera settings not supported. Please try with different settings.';
    
    case 'SecurityError':
      return 'Camera access requires HTTPS. Please use a secure connection.';
    
    case 'AbortError':
      return 'Camera access was cancelled.';
    
    case 'TypeError':
      return 'Camera API not supported in this browser.';
    
    default:
      return 'Unable to access camera. Please try the upload option instead.';
  }
}

/**
 * Get available camera devices
 */
export async function getAvailableCameras(): Promise<MediaDeviceInfo[]> {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === 'videoinput');
  } catch (error) {
    console.error('Error enumerating devices:', error);
    return [];
  }
}

/**
 * Check if device has multiple cameras (front/back)
 */
export async function hasMultipleCameras(): Promise<boolean> {
  const cameras = await getAvailableCameras();
  return cameras.length > 1;
}

/**
 * Request camera permission (for testing purposes)
 */
export async function requestCameraPermission(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    // Stop the stream immediately - we just wanted to check permission
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.error('Camera permission denied:', error);
    return false;
  }
}

/**
 * Get optimal camera constraints for skin analysis
 */
export function getOptimalCameraConstraints(facingMode: 'user' | 'environment' = 'user'): MediaStreamConstraints {
  return {
    video: {
      facingMode: facingMode,
      width: { ideal: 1280, min: 640 },
      height: { ideal: 720, min: 480 },
      aspectRatio: { ideal: 1.7777777778 } // 16:9
    },
    audio: false
  };
}

/**
 * Compress image to reduce size before sending to API
 */
export function compressImage(
  base64Image: string, 
  maxWidth: number = 1024,
  quality: number = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      
      // Calculate new dimensions while maintaining aspect ratio
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = base64Image;
  });
}

/**
 * Validate if image is suitable for face analysis
 * (Basic checks - actual face detection should be done by AI API)
 */
export function validateImageForAnalysis(base64Image: string): Promise<{
  valid: boolean;
  error?: string;
  dimensions?: { width: number; height: number };
}> {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      const { width, height } = img;
      
      // Check minimum dimensions
      if (width < 200 || height < 200) {
        resolve({
          valid: false,
          error: 'Image is too small. Please use a higher resolution image.',
          dimensions: { width, height }
        });
        return;
      }
      
      // Check aspect ratio (should be roughly portrait or square)
      const aspectRatio = width / height;
      if (aspectRatio > 2 || aspectRatio < 0.5) {
        resolve({
          valid: false,
          error: 'Image aspect ratio seems incorrect. Please use a portrait photo.',
          dimensions: { width, height }
        });
        return;
      }
      
      resolve({
        valid: true,
        dimensions: { width, height }
      });
    };
    
    img.onerror = () => {
      resolve({
        valid: false,
        error: 'Failed to load image. Please try a different image.'
      });
    };
    
    img.src = base64Image;
  });
}

/**
 * Convert File to base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      resolve(reader.result as string);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Get browser and device information for debugging
 */
export function getDeviceInfo(): {
  browser: string;
  platform: string;
  isMobile: boolean;
  supportsCamera: boolean;
} {
  const userAgent = navigator.userAgent;
  
  let browser = 'Unknown';
  if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Safari')) browser = 'Safari';
  else if (userAgent.includes('Edge')) browser = 'Edge';
  
  const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
  
  return {
    browser,
    platform: navigator.platform,
    isMobile,
    supportsCamera: checkCameraSupport().isSupported
  };
}
