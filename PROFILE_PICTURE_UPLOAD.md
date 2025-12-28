# Profile Picture Upload Feature

## Overview
Users can now upload custom profile pictures directly from their profile page. The feature uses base64 encoding to store images without requiring external file storage services.

## Features

### 1. **Upload Functionality**
- **Location**: Profile page, visible only when viewing your own profile
- **Trigger**: Click the camera icon button on the bottom-right of the profile picture
- **Supported Formats**: All common image formats (JPEG, PNG, GIF, WebP, etc.)
- **File Size Limit**: 5MB maximum
- **Encoding**: Images are converted to base64 and stored in the database

### 2. **User Experience**
- Click the camera icon overlay on the profile picture
- Select an image from your device
- Image is validated and uploaded automatically
- Success/error toast notification appears
- Profile picture updates instantly
- Changes are reflected across the entire application

### 3. **Validation**
- **File Type Check**: Only image files are accepted
- **Size Validation**: Maximum 5MB file size
- **Format Validation**: Server validates that the photo URL is either:
  - A base64 data URL (starts with `data:image/`)
  - A regular HTTP/HTTPS URL

### 4. **Visual Feedback**
- Loading spinner shown during upload
- Preview of selected image before upload completes
- Success message: "Profile picture updated successfully!"
- Error messages for validation failures

## Technical Implementation

### Frontend Components

#### ProfilePage.jsx Updates
1. **New State Variables**:
   ```jsx
   const [uploadingPhoto, setUploadingPhoto] = useState(false);
   const [previewPhoto, setPreviewPhoto] = useState(null);
   ```

2. **Upload Handler**: `handlePhotoUpload(event)`
   - Reads the file from input
   - Validates file type and size
   - Converts to base64 using FileReader API
   - Sends to backend via `updateUserProfile`
   - Updates local state and auth context

3. **UI Elements**:
   - Hidden file input with accept="image/*"
   - Camera icon button overlay on profile picture
   - Loading spinner during upload
   - Preview image support

#### AuthContext Updates
- Added `updateUser(updatedUserData)` function
- Updates both state and localStorage
- Ensures profile picture changes persist across sessions
- Syncs changes across all components

### Backend Components

#### User Controller Updates (`userController.js`)
Enhanced `updateUserProfile` function:
```javascript
// Validates photo URL format
if (req.body.photoUrl) {
  const isDataUrl = req.body.photoUrl.startsWith('data:image/');
  const isRegularUrl = req.body.photoUrl.startsWith('http://') || 
                       req.body.photoUrl.startsWith('https://');
  
  if (isDataUrl || isRegularUrl) {
    user.photoUrl = req.body.photoUrl;
  } else {
    return res.status(400).json({ message: 'Invalid photo URL format' });
  }
}
```

#### User Model
- `photoUrl` field stores either:
  - Default avatar URL (dicebear API)
  - User-uploaded base64 image string
  - External image URL

### Data Flow

1. **User Action**: Click camera icon → Select file
2. **Frontend Processing**:
   - Validate file type and size
   - Convert to base64 using FileReader
   - Show preview
3. **API Request**: POST to `/api/users/profile` with base64 string
4. **Backend Processing**:
   - Validate URL format
   - Save to user document
   - Return updated user data
5. **Frontend Update**:
   - Update component state
   - Update auth context
   - Update localStorage
   - Show success message

## Security Considerations

### File Size Limit
- 5MB maximum prevents excessive storage usage
- Reasonable for profile pictures
- Client-side check provides immediate feedback
- Server-side validation recommended for production

### File Type Validation
- Client accepts only image/* MIME types
- Browser automatically filters file picker
- Additional server-side validation checks data URL format

### Storage
- Base64 encoding increases data size by ~33%
- MongoDB documents can handle base64 images well
- Alternative: Use cloud storage (S3, Cloudinary) for production at scale

## Usage Instructions

### For Users
1. Navigate to your profile page
2. Look for the camera icon on your profile picture
3. Click the camera icon
4. Select an image file (max 5MB)
5. Wait for upload confirmation
6. Your new profile picture appears everywhere in the app

### Error Messages
- **"Please upload an image file"** - Selected file is not an image
- **"Image size should be less than 5MB"** - File too large
- **"Failed to read the image file"** - Browser couldn't read the file
- **"Failed to upload photo"** - Server error during upload
- **"Invalid photo URL format"** - Server validation failed

## Files Modified

### Created
- *(No new files - feature integrated into existing files)*

### Modified
1. **src/pages/ProfilePage.jsx**
   - Added photo upload state management
   - Added `handlePhotoUpload` function
   - Updated UI with camera icon button and file input
   - Added preview support

2. **src/context/AuthContext.jsx**
   - Added `updateUser` function
   - Enables syncing profile changes to auth state

3. **server/controllers/userController.js**
   - Enhanced `updateUserProfile` with photo validation
   - Added support for base64 image URLs

## Future Enhancements

1. **Image Optimization**
   - Resize images on client-side before upload
   - Compress images to reduce size
   - Generate thumbnails

2. **Cloud Storage Integration**
   - Integrate with AWS S3 or Cloudinary
   - Better for production scalability
   - Reduces database size

3. **Image Cropping**
   - Allow users to crop/adjust image before upload
   - Ensure consistent aspect ratios
   - Better control over final appearance

4. **Multiple Photos**
   - Photo gallery for fixers
   - Before/after repair photos
   - Portfolio images

5. **Avatar Editor**
   - Built-in avatar customization
   - Preset avatar options
   - Color themes and styles

## Testing Checklist

- [ ] Upload a JPEG image < 5MB
- [ ] Upload a PNG image < 5MB
- [ ] Try to upload a file > 5MB (should fail with error)
- [ ] Try to upload a non-image file (should fail)
- [ ] Verify loading spinner appears during upload
- [ ] Check success toast notification
- [ ] Verify profile picture updates immediately
- [ ] Navigate to another page and back - picture persists
- [ ] Logout and login - picture persists
- [ ] View profile from another account - picture visible
- [ ] Check profile picture in navbar updates
- [ ] Check profile picture in listing cards
- [ ] Check profile picture in messages

## Browser Compatibility

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

All modern browsers support:
- FileReader API
- Base64 encoding
- File input with accept attribute
