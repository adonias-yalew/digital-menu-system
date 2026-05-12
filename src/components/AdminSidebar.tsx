import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Utensils, 
  MessageSquare,
  LogOut,
  Home,
  Menu as MenuIcon,
  ChevronLeft
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      active: location.pathname === '/admin/dashboard'
    },
    {
      name: 'Menu Management',
      href: '/admin/menu',
      icon: Utensils,
      active: location.pathname === '/admin/menu'
    },
    {
      name: 'Feedback',
      href: '/admin/feedback',
      icon: MessageSquare,
      active: location.pathname === '/admin/feedback'
    }
  ];

  const handleNavigation = (href: string) => {
    navigate(href);
    if (window.innerWidth < 1024) {
      onClose(); // Close mobile sidebar after navigation
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex h-full flex flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b">
            <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`
                    w-full flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors
                    ${item.active
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t p-4 space-y-2">
            <button
              onClick={() => handleNavigation('/')}
              className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Home className="h-4 w-4" />
              View Site
            </button>
            
            <button
              onClick={() => {
                // Handle logout - you might want to implement this in your auth service
                navigate('/admin/login');
              }}
              className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
