import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  History,
  Settings,
  Truck,
  MapPin,
  User,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const SidebarLink = ({ to, icon, label, isActive }: SidebarLinkProps) => {
  return (
    <Link to={to}>
      <Button
        variant="ghost"
        className={cn(
          'w-full justify-start mb-1',
          isActive 
            ? 'bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700 dark:bg-blue-950 dark:text-blue-400 dark:hover:bg-blue-950' 
            : 'text-gray-600 bg-gray-200 dark:bg-gray-900 hover:text-blue-700 dark:text-gray-400'
        )}
      >
        {icon}
        <span className="ml-2">{label}</span>
      </Button>
    </Link>
  );
};

const DashboardSidebar = () => {
  const location = useLocation();
  const { logout, currentUser } = useAuth();
  const pathname = location.pathname;

  const isLinkActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <div className="w-64 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <Link to="/" className="flex items-center gap-2">
          <Truck className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-bold text-blue-600">CargoConnect</span>
        </Link>
      </div>

      <div className="flex-1 py-6 px-4 overflow-y-auto">
        <div className="mb-8">
          <h3 className="text-xs uppercase text-gray-500 dark:text-gray-400 font-medium mb-3 px-2">
            Principal
          </h3>
          <SidebarLink
            to="/dashboard"
            icon={<LayoutDashboard size={18} />}
            label="Painel"
            isActive={isLinkActive('/dashboard')}
          />
          <SidebarLink
            to="/shipments"
            icon={<Package size={18} />}
            label="Buscar Cargas"
            isActive={isLinkActive('/shipments')}
          />
          <SidebarLink
            to="/dashboard/active"
            icon={<Truck size={18} />}
            label={currentUser?.role === 'shipper' ? 'Cargas Ativas' : 'Transportes Ativos'}
            isActive={isLinkActive('/dashboard/active')}
          />
          <SidebarLink
            to="/dashboard/pending"
            icon={<ClipboardList size={18} />}
            label="Ofertas Pendentes"
            isActive={isLinkActive('/dashboard/pending')}
          />
          <SidebarLink
            to="/dashboard/history"
            icon={<History size={18} />}
            label="Histórico"
            isActive={isLinkActive('/dashboard/history')}
          />
        </div>

        <div className="mb-8">
          <h3 className="text-xs uppercase text-gray-500 dark:text-gray-400 font-medium mb-3 px-2">
            Conta
          </h3>
          <SidebarLink
            to="/profile"
            icon={<User size={18} />}
            label="Perfil"
            isActive={isLinkActive('/profile')}
          />
          <SidebarLink
            to="/dashboard/settings"
            icon={<Settings size={18} />}
            label="Configurações"
            isActive={isLinkActive('/dashboard/settings')}
          />
          <Button
            variant="ghost"
            className="w-full justify-start mb-1 text-red-500 bg-red-100 hover:margin-red hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 dark:hover:text-red-400"
            onClick={logout}
          >
            <LogOut size={18} />
            <span className="ml-2">Sair</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;