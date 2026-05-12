# Feedback Submission Troubleshooting Guide

## Common Issues & Solutions

### 1. Check Console Debug Output

Open your browser console when submitting feedback. You should see:

```
=== Feedback System Debug ===
Supabase URL: https://your-project.supabase.co
Supabase Anon Key exists: true
Feedback table access: {data: [...], error: null}
Insert test successful: {...}
=== End Debug ===
```

**What to look for:**
- ✅ Supabase URL should show your project URL
- ✅ Anon Key should exist
- ✅ Table access should succeed (not null)
- ✅ Insert test should succeed

### 2. Common Issues & Solutions

#### Issue: Policy Already Exists
**Error**: `policy "Allow public access to images" for table "objects" already exists`
**Solution**: ✅ Already fixed - storage setup script now handles existing policies

#### Issue: Feedback Table Not Created
**Error**: `relation "feedbacks" does not exist`
**Solution**: Run `FEEDBACK_TABLE_SETUP.sql` in Supabase SQL Editor

#### Issue: RLS Policies Blocking Insert
**Error**: `new row violates row-level security policy`
**Solution**: RLS policies should allow public inserts

#### Issue: Missing Environment Variables
**Error**: `Supabase URL is undefined`
**Solution**: Check `.env` file has correct variables

#### Issue: Network/CORS Issues
**Error**: `CORS policy would block this request`
**Solution**: Supabase setup should handle CORS automatically

### 3. Manual Debug Steps

1. **Test Direct API Call**:
```javascript
// In browser console
const { data, error } = await supabase
  .from('feedbacks')
  .insert({
    customer_name: 'Test User',
    message: 'Test message',
    rating: 5
  })
  .select()
  .single();

console.log('Direct test result:', { data, error });
```

2. **Check Table Structure**:
```sql
-- In Supabase SQL Editor
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'feedbacks';
```

3. **Verify RLS Policies**:
```sql
-- In Supabase SQL Editor  
SELECT schemaname, tablename, cmd, qual, with_check, policyname, roles
FROM pg_policies 
WHERE tablename = 'feedbacks';
```

### 4. Quick Fix Checklist

- [ ] Run `FEEDBACK_TABLE_SETUP.sql` completely
- [ ] Check Supabase Dashboard → Table Editor → feedbacks table exists
- [ ] Check Supabase Dashboard → Authentication → RLS policies enabled
- [ ] Verify `.env` file has correct Supabase credentials
- [ ] Test with browser console open

### 5. If Still Not Working

Try this simplified feedback service:

```typescript
// Temporary test - replace createFeedback function temporarily
export const createFeedback = async (feedback: {
  customer_name: string;
  message: string;
  rating: number;
}): Promise<Feedback> => {
  console.log('Attempting to insert:', feedback);
  
  try {
    const { data, error } = await supabase
      .from('feedbacks')
      .insert(feedback)
      .select()
      .single();
      
    console.log('Insert result:', { data, error });
    
    if (error) {
      console.error('Detailed error:', error);
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error('Catch error:', err);
    throw err;
  }
};
```

### 6. Common Error Messages & Meanings

- `400 Bad Request` → Missing required fields or invalid data
- `401 Unauthorized` → Missing or invalid API key  
- `403 Forbidden` → RLS policy blocking the operation
- `500 Internal Server Error` → Supabase server issue

### 7. Network Debugging

1. Open **Network tab** in browser dev tools
2. Submit feedback and watch for:
   - Request URL
   - Request method (POST)
   - Request payload
   - Response status code
   - Response body

### 8. Final Steps

1. **Clear browser cache** and refresh
2. **Try incognito mode** to rule out extensions
3. **Check Supabase logs** in Dashboard
4. **Test with minimal data** (just rating and message)

If you're still seeing issues after running all these checks, the problem is likely in the Supabase configuration or RLS policies.
