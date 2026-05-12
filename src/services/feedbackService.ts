import { supabase } from '@/lib/supabase';
import { Feedback } from '@/types/menu';

// Get all feedbacks (admin only)
export const getFeedbacks = async (): Promise<Feedback[]> => {
  try {
    const { data, error } = await supabase
      .from('feedbacks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    throw error;
  }
};

// Create a new feedback (public)
export const createFeedback = async (feedback: {
  customer_name: string;
  message: string;
  rating: number;
}): Promise<Feedback> => {
  try {
    const { data, error } = await supabase
      .from('feedbacks')
      .insert(feedback)
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error creating feedback:', error);
    throw error;
  }
};

// Delete a feedback (admin only)
export const deleteFeedback = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('feedbacks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting feedback:', error);
    throw error;
  }
};

// Get feedback statistics
export const getFeedbackStats = async () => {
  try {
    const { data, error } = await supabase
      .from('feedbacks')
      .select('rating');

    if (error) throw error;

    if (!data || data.length === 0) {
      return {
        total: 0,
        average: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      };
    }

    const total = data.length;
    const average = data.reduce((sum, item) => sum + item.rating, 0) / total;
    const distribution = data.reduce((acc, item) => {
      acc[item.rating as keyof typeof acc] = (acc[item.rating as keyof typeof acc] || 0) + 1;
      return acc;
    }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

    return {
      total,
      average: Math.round(average * 10) / 10,
      distribution
    };
  } catch (error) {
    console.error('Error fetching feedback stats:', error);
    throw error;
  }
};
