import { supabase } from '@/lib/supabase';

export const debugFeedbackSystem = async () => {
  console.log('=== Feedback System Debug ===');
  
  // 1. Check Supabase connection
  console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
  console.log('Supabase Anon Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
  
  // 2. Test feedback table access
  try {
    const { data, error } = await supabase
      .from('feedbacks')
      .select('count')
      .limit(1);
    
    console.log('Feedback table access:', { data, error });
  } catch (error) {
    console.error('Error accessing feedbacks table:', error);
  }
  
  // 3. Test insert permission with dummy data
  try {
    const testData = {
      customer_name: 'Debug User',
      message: 'Debug message for testing',
      rating: 5
    };
    
    console.log('Testing insert with:', testData);
    
    const { data, error } = await supabase
      .from('feedbacks')
      .insert(testData)
      .select()
      .single();
    
    if (error) {
      console.error('Insert test failed:', error);
    } else {
      console.log('Insert test successful:', data);
      // Clean up the test data
      await supabase
        .from('feedbacks')
        .delete()
        .eq('id', data.id);
    }
  } catch (error) {
    console.error('Error testing insert:', error);
  }
  
  console.log('=== End Debug ===');
};
