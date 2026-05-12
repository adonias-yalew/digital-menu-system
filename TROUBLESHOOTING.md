# Image Loading Issues Troubleshooting

## "Failed to load resource: net::ERR_FAILED" Debug Guide

This error typically indicates one of these issues:

### 1. Supabase Storage Bucket Not Set Up ⚠️

**Most Common Cause**: The `menu-images` bucket doesn't exist or isn't public.

**Fix**:
```sql
-- Run this in Supabase SQL Editor
-- Copy contents from SUPABASE_STORAGE_SETUP.sql
```

**Verify in Dashboard**:
1. Go to Supabase Dashboard → Storage
2. Check if `menu-images` bucket exists
3. Click bucket → Settings → Ensure "Public" is enabled

### 2. Environment Variables Missing ⚠️

**Check your `.env` file**:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Test in browser console**:
```javascript
console.log(import.meta.env.VITE_SUPABASE_URL);
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY);
```

### 3. CORS Issues ⚠️

**Supabase Storage URLs may be blocked by CORS**.

**Fix**: Run the SQL setup script which includes proper CORS policies.

### 4. Network/Authentication Issues ⚠️

**Symptoms**: Images work in Supabase dashboard but fail in app.

**Debug Steps**:
1. Open browser DevTools → Network tab
2. Look for failed image requests
3. Check the URL format - should be:
   ```
   https://your-project.supabase.co/storage/v1/object/public/menu-images/filename.jpg
   ```

### 5. File Path Issues ⚠️

**Incorrect URL formats**:
- ❌ `./assets/image.jpg` (local path)
- ❌ `https://supabase.co/storage/v1/object/menu-images/file.jpg` (missing `/public`)
- ✅ `https://project.supabase.co/storage/v1/object/public/menu-images/file.jpg`

## Quick Debug Checklist

### Step 1: Check Console Logs
Open your app and check browser console for:
- `=== Image System Debug ===` output
- Supabase connection status
- Bucket availability
- File listing results

### Step 2: Test URL Directly
1. Find an image URL from console logs
2. Paste directly in browser address bar
3. If it fails, the issue is with Supabase setup

### Step 3: Verify Database
Check your `menu_items` table:
```sql
SELECT id, name_en, image_url FROM menu_items LIMIT 5;
```

### Step 4: Test Upload
1. Go to `/admin/login` → `/admin/menu`
2. Try uploading a new image
3. Check if upload succeeds and URL is generated

## Common Solutions

### Solution A: Run SQL Setup
```bash
# Copy entire contents of SUPABASE_STORAGE_SETUP.sql
# Paste in Supabase SQL Editor
# Run the script
```

### Solution B: Recreate Bucket
1. Delete existing `menu-images` bucket in Supabase Dashboard
2. Run the SQL setup script again
3. Test upload functionality

### Solution C: Update Environment
1. Get fresh credentials from Supabase Dashboard → Settings → API
2. Update your `.env` file
3. Restart development server

### Solution D: Clear Browser Cache
```bash
# Clear browser cache and localStorage
# Or use incognito/private browsing mode
```

## Testing the Fix

After applying fixes:

1. **Open browser console** - should see "Image System Debug" output
2. **Check network tab** - image requests should succeed (200 status)
3. **Test upload** - admin panel should upload and display images
4. **Verify URLs** - should be Supabase Storage URLs

## If Still Failing

1. **Check Supabase Logs**: Dashboard → Settings → Logs
2. **Verify RLS Policies**: Storage → Policies tab
3. **Test with Simple URL**: Create a test file and try accessing it
4. **Network Check**: Ensure no firewall/proxy blocking Supabase URLs

## Emergency Fallback

If images still don't work, the app will show placeholder icons instead of broken images, so the app remains functional.

## Support Commands

For immediate debugging, open browser console and run:
```javascript
// Test Supabase connection
fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/`)
  .then(r => console.log('Supabase API status:', r.status))
  .catch(e => console.error('Supabase connection failed:', e));
```
