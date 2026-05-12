# Image System Setup Guide

This document explains how to set up the new Supabase Storage-based image system for your digital menu.

## Overview

The image system now uses Supabase Storage to handle all menu item images, providing:
- ✅ Production-ready image uploads
- ✅ Automatic image optimization and CDN delivery
- ✅ Fallback handling for missing/broken images
- ✅ No more local asset dependencies for menu items

## Setup Instructions

### 1. Run the SQL Setup Script

Execute the SQL commands in `SUPABASE_STORAGE_SETUP.sql` in your Supabase SQL Editor:

```sql
-- Copy and paste the contents of SUPABASE_STORAGE_SETUP.sql
```

This will:
- Create the `menu-images` storage bucket
- Set up proper Row Level Security (RLS) policies
- Configure public access for image viewing
- Allow authenticated users to upload/manage images

### 2. Configure Environment Variables

Ensure your `.env` file has the correct Supabase configuration:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Verify Bucket Configuration

In your Supabase Dashboard:
1. Go to Storage → Buckets
2. Verify `menu-images` bucket exists
3. Ensure bucket is set to "Public"
4. Check that RLS policies are enabled

## How It Works

### Image Upload Process

1. **Admin selects image** in the menu management form
2. **File validation** ensures only JPEG, PNG, WebP under 5MB
3. **Upload to Supabase Storage** with unique filename
4. **Store public URL** in the database `image_url` field
5. **Display in frontend** with automatic fallbacks

### Image Display

- **With image**: Shows the uploaded image from Supabase CDN
- **Without image**: Shows a placeholder icon with colored background
- **Error handling**: Automatic fallback if image fails to load

## File Structure

```
src/
├── services/
│   ├── imageService.ts     # Upload/delete functionality
│   └── menuService.ts     # Database operations
├── pages/
│   ├── admin/
│   │   └── MenuManager.tsx # File upload form
│   └── public/
│       └── Menu.tsx        # Image display with fallbacks
└── types/
    └── menu.ts           # Updated Item interface
```

## API Reference

### imageService.ts

```typescript
// Upload an image file
uploadImage(file: File): Promise<string>

// Delete an image by URL
deleteImage(imageUrl: string): Promise<void>

// Ensure bucket exists (called automatically)
ensureBucketExists(): Promise<void>
```

## Migration Notes

### From Local Assets

If you have existing menu items with local asset paths:

1. **Upload images manually** through the admin panel
2. **Update database records** with new Supabase URLs
3. **Remove old local assets** from the codebase

### Database Schema

The `menu_items` table should have:
```sql
image_url TEXT  -- Stores the Supabase Storage public URL
```

## Troubleshooting

### Upload Fails
- Check Supabase credentials in `.env`
- Verify bucket exists and is public
- Ensure user is authenticated
- Check file size (max 5MB) and type (JPEG/PNG/WebP)

### Images Not Displaying
- Verify `image_url` field in database
- Check RLS policies on storage bucket
- Ensure bucket is set to public access
- Check browser console for 404 errors

### Permission Errors
- Run the SQL setup script completely
- Verify RLS policies in Supabase Dashboard
- Check user authentication status

## Production Deployment

The system is production-ready:

1. **Vercel Compatible**: Works with your existing Vercel setup
2. **CDN Delivery**: Supabase provides automatic CDN
3. **Scalable**: Handles unlimited images
4. **Secure**: Proper RLS policies in place

## Best Practices

1. **Image Optimization**: Use WebP for better compression
2. **File Naming**: System generates unique names automatically
3. **Fallbacks**: Always provide visual feedback for missing images
4. **Error Handling**: Upload errors show user-friendly messages
5. **Performance**: Images are cached and optimized by Supabase CDN

## Support

If you encounter issues:

1. Check Supabase Dashboard for storage errors
2. Verify network requests in browser dev tools
3. Review console logs for detailed error messages
4. Ensure all SQL setup steps were completed
