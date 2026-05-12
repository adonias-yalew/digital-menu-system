import { supabase } from '@/lib/supabase';
import { MenuItem, Item, CATEGORY_MAP } from '@/types/menu';

// Transform database MenuItem to frontend Item format
export const transformMenuItemToItem = (menuItem: MenuItem): Item => {
  return {
    id: menuItem.id,
    name: {
      en: menuItem.name_en,
      am: menuItem.name_am,
      om: menuItem.name_om,
    },
    price: menuItem.price,
    img: menuItem.image_url,
    description: {
      en: menuItem.description_en,
      am: menuItem.description_am,
      om: menuItem.description_om,
    },
    category: menuItem.category,
    weight: menuItem.weight,
    isPopular: menuItem.is_popular,
    isSpicy: menuItem.is_spicy,
    isVeg: menuItem.is_vegetarian,
    isNew: menuItem.is_new,
  };
};

// Transform frontend Item to database MenuItem format
export const transformItemToMenuItem = (item: Item): Omit<MenuItem, 'id' | 'created_at' | 'updated_at'> => {
  return {
    name_en: item.name.en,
    name_am: item.name.am,
    name_om: item.name.om,
    description_en: item.description.en,
    description_am: item.description.am,
    description_om: item.description.om,
    price: item.price,
    category: item.category,
    is_spicy: item.isSpicy,
    is_popular: item.isPopular,
    is_vegetarian: item.isVeg,
    is_new: item.isNew,
    image_url: item.img,
    weight: item.weight,
  };
};

// Get all menu items
export const getMenuItems = async (): Promise<Item[]> => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(transformMenuItemToItem);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }
};

// Get menu items by category
export const getMenuItemsByCategory = async (category: string): Promise<Item[]> => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(transformMenuItemToItem);
  } catch (error) {
    console.error('Error fetching menu items by category:', error);
    throw error;
  }
};

// Create a new menu item
export const createMenuItem = async (item: Item): Promise<Item> => {
  try {
    const menuItemData = transformItemToMenuItem(item);
    
    const { data, error } = await supabase
      .from('menu_items')
      .insert(menuItemData)
      .select()
      .single();

    if (error) throw error;
    
    return transformMenuItemToItem(data);
  } catch (error) {
    console.error('Error creating menu item:', error);
    throw error;
  }
};

// Update a menu item
export const updateMenuItem = async (id: string, item: Partial<Item>): Promise<Item> => {
  try {
    const menuItemData = transformItemToMenuItem(item as Item);
    
    const { data, error } = await supabase
      .from('menu_items')
      .update(menuItemData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    return transformMenuItemToItem(data);
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
};

// Delete a menu item
export const deleteMenuItem = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
};

// Delete a menu item by name (for convenience)
export const deleteMenuItemByName = async (name: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('name_en', name);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting menu item by name:', error);
    throw error;
  }
};

// Get a single menu item by ID
export const getMenuItemById = async (id: string): Promise<Item | null> => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows returned
      throw error;
    }
    
    return transformMenuItemToItem(data);
  } catch (error) {
    console.error('Error fetching menu item by ID:', error);
    throw error;
  }
};
