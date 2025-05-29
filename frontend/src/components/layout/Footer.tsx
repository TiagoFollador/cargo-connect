import { Link } from 'react-router-dom';
import { Truck, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Informações da Empresa */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Truck className="h-7 w-7 text-blue-400" />
              <span className="text-xl font-bold">CargoConnect</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-xs">
              Conectando remetentes e transportadores em todo o país com nossa plataforma inovadora de logística [[9]].
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition duration-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition duration-300">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition duration-300">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-blue-400 transition duration-300">Início</Link>
              </li>
              <li>
                <Link to="/shipments" className="text-gray-400 hover:text-blue-400 transition duration-300">Encontrar Envios</Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-blue-400 transition duration-300">Painel</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-blue-400 transition duration-300">Contate-nos</Link>
              </li>
            </ul>
          </div>

          {/* Ajuda e Suporte */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Ajuda e Suporte</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition duration-300">Perguntas Frequentes</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition duration-300">Termos de Serviço</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition duration-300">Política de Privacidade</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition duration-300">Centro de Suporte</a>
              </li>
            </ul>
          </div>

          {/* Informações de Contato */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contate-nos</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-blue-400 flex-shrink-0" />
                <span className="text-gray-400">1155, Rua Imaculada Conceição, Curitiba, PR 80000-000</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-blue-400 flex-shrink-0" />
                <span className="text-gray-400">(41) 98742-3303</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-blue-400 flex-shrink-0" />
                <span className="text-gray-400">info@cargoconnect.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
          <p>© {currentYear} CargoConnect. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;