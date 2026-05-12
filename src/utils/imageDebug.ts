import { supabase } from '@/lib/supabase';

export const debugImageSystem = async () => {
  console.log('=== Image System Debug ===');
  
  // 1. Check Supabase connection
  console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
  console.log('Supabase Anon Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
  
  // 2. Check bucket access
  try {
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    console.log('Available buckets:', buckets);
    console.log('Bucket error:', bucketError);
    
    const menuImagesBucket = buckets?.find(b => b.name === 'menu-images');
    console.log('Menu images bucket exists:', !!menuImagesBucket);
    console.log('Bucket is public:', menuImagesBucket?.public);
  } catch (error) {
    console.error('Error checking buckets:', error);
  }
  
  // 3. Test a simple public URL format
  const testUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/menu-images/test.jpg`;
  console.log('Test URL format:', testUrl);
  
  // 4. Try to list files in bucket
  try {
    const { data: files, error: filesError } = await supabase.storage
      .from('menu-images')
      .list();
    console.log('Files in bucket:', files);
    console.log('Files error:', filesError);
  } catch (error) {
    console.error('Error listing files:', error);
  }
  
  console.log('=== End Debug ===');
};

export const testImageUrl = (url: string) => {
  console.log('Testing image URL:', url);
  
  const img = new Image();
  img.onload = () => console.log('✅ Image loaded successfully');
  img.onerror = (e) => console.error('❌ Image failed to load:', e);
  img.src = url;
};
