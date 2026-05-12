import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '@/services/menuService';

interface Item {
  id: string;
  name: {
    en: string;
    am: string;
    om: string;
  };
  description: {
    en: string;
    am: string;
    om: string;
  };
  price: number;
  category: string;
  img: string;
  isPopular: boolean;
  isSpicy: boolean;
  isVeg: boolean;
  isNew: boolean;
}

export default function MenuManager() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const menuItems = await getMenuItems();
      setItems(menuItems);
    } catch (error) {
      console.error('Error loading menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async (item: Item) => {
    try {
      await createMenuItem(item);
      await loadItems();
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  const handleUpdateItem = async (item: Item) => {
    try {
      await updateMenuItem(item);
      await loadItems();
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      await deleteMenuItem(id);
      await loadItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.name.am.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.name.om.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Menu Management</h1>
        <p className="text-gray-600">Manage your restaurant menu items</p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="all">All Categories</option>
          <option value="burgers">Burgers</option>
          <option value="sides">Sides</option>
          <option value="drinks">Drinks</option>
          <option value="chicken">Chicken</option>
          <option value="desserts">Desserts</option>
          <option value="breakfast">Breakfast</option>
        </select>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No menu items found
          </div>
        ) : (
          <div className="grid gap-4 p-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition">
                <div className="flex items-start gap-4">
                  {item.img && (
                    <img
                      src={item.img}
                      alt={item.name.en}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{item.name.en}</h3>
                        <p className="text-gray-600 text-sm">{item.description.en}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-bold text-lg">ETB {item.price}</span>
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs capitalize">
                            {item.category}
                          </span>
                          {item.isPopular && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                              Popular
                            </span>
                          )}
                          {item.isNew && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                              New
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-600 transition hover:bg-blue-100"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="flex items-center justify-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 transition hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {(isCreating || editingItem) && (
        <MenuItemForm
          item={editingItem}
          onSave={isCreating ? handleCreateItem : handleUpdateItem}
          onCancel={() => {
            setIsCreating(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}

interface MenuItemFormProps {
  item: Item | null;
  onSave: (item: Item) => Promise<void>;
  onCancel: () => void;
}

function MenuItemForm({
  item,
  onSave,
  onCancel,
}: MenuItemFormProps) {
  const [formData, setFormData] = useState<Item>(() => {
    if (item) return item;

    return {
      id: crypto.randomUUID(),

      name: {
        en: '',
        am: '',
        om: '',
      },

      description: {
        en: '',
        am: '',
        om: '',
      },

      price: 0,
      category: 'burgers',

      isPopular: false,
      isSpicy: false,
      isVeg: false,
      isNew: false,

      img: '',
    };
  });

  // -------------------------
  // Helpers
  // -------------------------
  function updateField(field: keyof Item, value: any) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function updateNestedField(
    parent: 'name' | 'description',
    field: 'en' | 'am' | 'om',
    value: string
  ) {
    setFormData((prev) => ({  
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Basic validation (important for production)
    if (!formData.name.en.trim()) {
      alert('English name is required');
      return;
    }

    if (formData.price < 0) {
      alert('Price cannot be negative');
      return;
    }

    await onSave(formData);
  }

  // -------------------------
  // UI
  // -------------------------
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">

        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black/50"
          onClick={onCancel}
        />

        {/* Modal */}
        <div className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">

          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {item ? 'Edit Menu Item' : 'Create Menu Item'}
            </h2>

            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NAME */}
            <div className="grid gap-3 md:grid-cols-3">
              <input
                type="text"
                placeholder="English Name"
                value={formData.name.en}
                onChange={(e) =>
                  updateNestedField('name', 'en', e.target.value)
                }
                className="rounded-lg border px-3 py-2"
                required
              />

              <input
                type="text"
                placeholder="Amharic Name"
                value={formData.name.am}
                onChange={(e) =>
                  updateNestedField('name', 'am', e.target.value)
                }
                className="rounded-lg border px-3 py-2"
              />

              <input
                type="text"
                placeholder="Oromo Name"
                value={formData.name.om}
                onChange={(e) =>
                  updateNestedField('name', 'om', e.target.value)
                }
                className="rounded-lg border px-3 py-2"
              />
            </div>

            {/* DESCRIPTION */}
            <textarea
              placeholder="English Description"
              value={formData.description.en}
              onChange={(e) =>
                updateNestedField('description', 'en', e.target.value)
              }
              className="w-full rounded-lg border px-3 py-2"
              rows={3}
              required
            />

            {/* PRICE + CATEGORY */}
            <div className="grid gap-3 md:grid-cols-2">

              <input
                type="number"
                placeholder="Price (ETB)"
                value={formData.price}
                onChange={(e) =>
                  updateField('price', Number(e.target.value) || 0)
                }
                className="rounded-lg border px-3 py-2"
                required
              />

              <select
                value={formData.category}
                onChange={(e) =>
                  updateField('category', e.target.value)
                }
                className="rounded-lg border px-3 py-2"
              >
                <option value="burgers">Burgers</option>
                <option value="sides">Sides</option>
                <option value="drinks">Drinks</option>
                <option value="chicken">Chicken</option>
                <option value="desserts">Desserts</option>
                <option value="breakfast">Breakfast</option>
              </select>
            </div>

            {/* IMAGE */}
            <input
              type="text"
              placeholder="Image URL (Supabase Storage)"
              value={formData.img}
              onChange={(e) => updateField('img', e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
            />

            {/* FLAGS */}
            <div className="flex flex-wrap gap-4 text-sm">

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isPopular}
                  onChange={(e) =>
                    updateField('isPopular', e.target.checked)
                  }
                />
                Popular
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isSpicy}
                  onChange={(e) =>
                    updateField('isSpicy', e.target.checked)
                  }
                />
                Spicy
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isVeg}
                  onChange={(e) =>
                    updateField('isVeg', e.target.checked)
                  }
                />
                Vegetarian
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isNew}
                  onChange={(e) =>
                    updateField('isNew', e.target.checked)
                  }
                />
                New
              </label>

            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 pt-4">

              <button
                type="button"
                onClick={onCancel}
                className="flex-1 rounded-lg border px-4 py-2"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 rounded-lg bg-black px-4 py-2 text-white"
              >
                {item ? 'Update' : 'Create'}
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
}