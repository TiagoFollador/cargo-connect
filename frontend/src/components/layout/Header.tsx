import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { 
  Truck, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Bell, 
  Package 
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const Header = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isLanding = location.pathname === '/';
  const headerClass = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 mb-3 ${
    isScrolled || !isLanding 
      ? 'bg-white dark:bg-gray-900 shadow-md py-2' 
      : 'bg-transparent py-4'
  }`;

  return (
    <header className={headerClass}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Truck className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-blue-600">CargoConnect</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
            Home
          </Link>
          <Link to="/shipments" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
            Shipments
          </Link>
          <Link to="/contact" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
            Contact
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="relative">
                  <Package className="h-5 w-5 mr-1" />
                  <span>Dashboard</span>
                </Button>
              </Link>
              
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {currentUser && currentUser.notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                    {currentUser.notificationCount}
                  </Badge>
                )}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                      <AvatarFallback>{currentUser?.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign up</Link>
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 focus:outline-none"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-200 dark:text-gray-200" />
          ) : (
            <Menu className="h-6 w-6 text-gray-200 dark:text-gray-200" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg absolute top-full left-0 right-0 py-4 px-4 flex flex-col space-y-4">
          <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2">
            Home
          </Link>
          <Link to="/shipments" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2">
            Shipments
          </Link>
          <Link to="/contact" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2">
            Contact
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2 flex items-center gap-2">
                <Package className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link to="/profile" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2 flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
              <button
                onClick={logout}
                className="text-red-500 hover:text-red-700 font-medium py-2 flex items-center gap-2"
              >
                <LogOut className="h-5 w-5" />
                <span>Log out</span>
              </button>
            </>
          ) : (
            <div className="flex flex-col space-y-2 pt-2">
              <Button asChild variant="outline" className="w-full">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild className="w-full">
                <Link to="/register">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;