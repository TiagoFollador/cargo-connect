import React from 'react';
import { ArrowRight, Package, Shield, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import TripPanel from '../components/Trips/TripPanel';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Seção Hero */}
      <section className="bg-primary py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">
                Conectando Cargas <br /> com Transportadores
              </h1>
              <p className="mt-6 max-w-md text-lg text-white/80">
                Encontre transporte para sua carga ou descubra cargas disponíveis para seu veículo com nossa plataforma eficiente de logística.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/trips" className="btn bg-secondary text-white hover:bg-secondary-light">
                  Encontrar Viagens
                </Link>
                <a href="#how-it-works" className="btn btn-outline border-white/30 text-white hover:bg-white/10">
                  Saiba Mais
                </a>
              </div>
            </div>
            <div className="hidden items-center justify-center md:flex">
              <img 
                src="https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg" 
                alt="Logística" 
                className="max-h-96 rounded-lg object-cover shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Painel de Viagens */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold">Últimas Viagens Disponíveis</h2>
            <p className="mt-3 text-text-secondary">
              Navegue pelas oportunidades de transporte mais recentes
            </p>
          </div>
          <TripPanel />
          <div className="mt-8 text-center">
            <Link to="/trips" className="btn btn-primary">
              Ver Todas as Viagens <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Seção de Recursos */}
      <section className="bg-background py-16" id="how-it-works">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold">Como Funciona</h2>
            <p className="mt-3 text-text-secondary">
              Nossa plataforma simplifica o processo de conectar cargas com transportadores
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="card hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Package size={24} />
              </div>
              <h3 className="text-xl font-semibold">Liste Sua Carga</h3>
              <p className="mt-2 text-text-secondary">
                Publique os detalhes da sua carga incluindo peso, dimensões, locais de coleta e entrega.
              </p>
            </div>

            <div className="card hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-semibold">Receba Ofertas</h3>
              <p className="mt-2 text-text-secondary">
                Os transportadores enviarão ofertas de transporte ou você pode aceitar viagens listadas diretamente.
              </p>
            </div>

            <div className="card hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-semibold">Transporte Seguro</h3>
              <p className="mt-2 text-text-secondary">
                Todos os transportadores são verificados quanto à confiabilidade e padrões de segurança antes de ingressar em nossa plataforma.
              </p>
            </div>

            <div className="card hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-semibold">Acompanhe a Entrega</h3>
              <p className="mt-2 text-text-secondary">
                Monitore a jornada da sua carga da coleta até a entrega com rastreamento em tempo real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção CTA */}
      <section className="bg-secondary/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">Pronto para Começar?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-text-secondary">
            Junte-se a milhares de empresas e transportadores que já estão otimizando suas operações logísticas com o CargoConnect.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/trips" className="btn btn-primary">
              Explorar Viagens Disponíveis
            </Link>
            <a href="#" className="btn btn-outline">
              Saiba Mais
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;