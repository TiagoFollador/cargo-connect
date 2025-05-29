import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import { Button } from '@/components/ui/button';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const DashboardLayout = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Close sidebar by default on mobile
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-950">
      {/* Sidebar - hidden on mobile when closed */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block fixed md:relative z-30 h-full`}>
        <DashboardSidebar />
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white dark:bg-gray-900 shadow-sm h-16 flex items-center px-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex-1"></div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative bg-gray-200 dark:bg-gray-800">
              <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              {currentUser && currentUser.notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                  {currentUser.notificationCount}
                </Badge>
              )}
            </Button>
            
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                <AvatarFallback>{currentUser?.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{currentUser?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{currentUser?.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

