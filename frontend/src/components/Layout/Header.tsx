import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Truck, User, Menu, X, LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const publicNavLinks = [
    { name: "Início", path: "/" },
    { name: "Viagens", path: "/trips" },
    { name: "Sobre", path: "/about" },
  ];

  const authenticatedNavLinks = [
    { name: "Início", path: "/" },
    { name: "Viagens", path: "/trips" },
    { name: "Painel", path: "/dashboard" },
    { name: "Minhas Viagens", path: "/my-trips" },
    { name: "Sobre", path: "/about" },
  ];

  const navLinks = isAuthenticated ? authenticatedNavLinks : publicNavLinks;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-white/95"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Truck size={28} className="text-primary" />
              <span className="text-xl font-bold text-primary">
                CargoConnect
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.path
                    ? "text-primary font-semibold"
                    : "text-text-secondary"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors"
                >
                  <User size={20} />
                  <span>{user?.name}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-text-secondary hover:bg-background"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Meu Perfil
                    </Link>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-text-secondary hover:bg-background"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Painel
                    </Link>
                    <Link
                      to="/my-trips"
                      className="block px-4 py-2 text-sm text-text-secondary hover:bg-background"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Minhas Viagens
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                        navigate("/");
                      }}
                      className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-background"
                    >
                      <div className="flex items-center space-x-2">
                        <LogOut size={16} />
                        <span>Sair</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Entrar
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Cadastrar
                </Link>
              </div>
            )}
          </div>

          <button
            className="inline-flex md:hidden items-center justify-center rounded-md p-2 text-text-secondary hover:bg-background hover:text-primary"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block py-2 px-3 rounded-md text-base font-medium ${
                  location.pathname === link.path
                    ? "bg-primary/10 text-primary"
                    : "text-text-secondary hover:bg-background hover:text-primary"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                to="/profile"
                className="flex items-center space-x-2 py-2 px-3 rounded-md text-base font-medium text-text-secondary hover:bg-background hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                <User size={20} />
                <span>Perfil</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
