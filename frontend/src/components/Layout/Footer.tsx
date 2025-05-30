import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center space-x-2">
              <Truck size={24} />
              <span className="text-lg font-bold">CargoConnect</span>
            </div>
            <p className="mt-4 text-sm text-white/80">
              Conectando proprietários de cargas com provedores de transporte para soluções logísticas eficientes.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Links Rápidos</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="text-sm text-white/80 hover:text-white transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/trips" className="text-sm text-white/80 hover:text-white transition-colors">
                  Encontrar Viagens
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-white/80 hover:text-white transition-colors">
                  Sobre Nós
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/terms" className="text-sm text-white/80 hover:text-white transition-colors">
                  Termos de Serviço
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-white/80 hover:text-white transition-colors">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Contato</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center space-x-2 text-sm text-white/80">
                <Mail size={16} />
                <span>contato@cargoconnect.com</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-white/80">
                <Phone size={16} />
                <span>+55 (41) 98742-3303</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-white/80">
                <MapPin size={16} />
                <span>São Paulo, Brasil</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/20 pt-8 text-center text-sm text-white/60">
          <p>&copy; {new Date().getFullYear()} CargoConnect. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;