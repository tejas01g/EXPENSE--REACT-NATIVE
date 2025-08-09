import { Platform } from 'react-native';

// Image validation and compression utilities
export const validateImage = (image) => {
  if (!image || !image.assets || image.assets.length === 0) {
    return { isValid: false, error: 'No image selected' };
  }

  const asset = image.assets[0];
  
  // Check file size (max 5MB)
  if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
    return { isValid: false, error: 'Image size must be less than 5MB' };
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (asset.type && !allowedTypes.includes(asset.type)) {
    return { isValid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
  }

  return { isValid: true, asset };
};

export const getImagePickerOptions = () => ({
  mediaType: 'photo',
  quality: 0.8,
  maxWidth: 1024,
  maxHeight: 1024,
  includeBase64: false,
  selectionLimit: 1,
  includeExtra: false,
});

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};



// Platform-specific image handling
export const getPlatformImageUri = (uri) => {
  if (Platform.OS === 'ios') {
    return uri.replace('file://', '');
  }
  return uri;
};

// Generate unique filename for Firebase Storage
export const generateImageFileName = (userId, extension = 'jpg') => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  return `profile_${userId}_${timestamp}_${randomString}.${extension}`;
};

// Firebase Storage path generator
export const getStoragePath = (userId, fileName) => {
  return `profile-images/${userId}/${fileName}`;
}; 