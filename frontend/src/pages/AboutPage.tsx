import React from "react";
import {
  Truck,
  Users,
  Shield,
  Clock,
  MapPin,
  Star,
  Heart,
  Target,
  Award,
} from "lucide-react";

const AboutPage: React.FC = () => {
  const features = [
    {
      icon: Truck,
      title: "Frota Diversificada",
      description:
        "Conectamos você com uma ampla variedade de veículos para atender todas as suas necessidades de transporte.",
    },
    {
      icon: Shield,
      title: "Segurança Garantida",
      description:
        "Todos os transportadores são verificados e avaliados pela nossa comunidade para garantir a máxima segurança.",
    },
    {
      icon: Clock,
      title: "Entrega Rápida",
      description:
        "Sistema otimizado para encontrar as melhores rotas e prazos de entrega para sua carga.",
    },
    {
      icon: MapPin,
      title: "Cobertura Nacional",
      description:
        "Atendemos todo o território brasileiro, conectando cidades e regiões de norte a sul.",
    },
    {
      icon: Star,
      title: "Avaliações Reais",
      description:
        "Sistema de avaliações transparente que ajuda você a escolher os melhores parceiros.",
    },
    {
      icon: Users,
      title: "Comunidade Ativa",
      description:
        "Milhares de embarcadores e transportadores conectados em uma plataforma confiável.",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Usuários Ativos" },
    { number: "50,000+", label: "Viagens Realizadas" },
    { number: "500+", label: "Cidades Atendidas" },
    { number: "4.8", label: "Avaliação Média" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Sobre o Cargo Connect
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Conectando embarcadores e transportadores em todo o Brasil
            </p>
            <p className="text-lg text-blue-100 max-w-3xl mx-auto">
              Somos uma plataforma inovadora que revoluciona o setor de
              logística, facilitando a conexão entre quem precisa transportar
              cargas e quem oferece serviços de transporte de qualidade.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-text-primary">
                  Nossa Missão
                </h3>
                <p className="text-text-secondary">
                  Simplificar e otimizar o transporte de cargas no Brasil,
                  conectando pessoas e empresas de forma eficiente e segura.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-text-primary">
                  Nossos Valores
                </h3>
                <p className="text-text-secondary">
                  Transparência, confiabilidade, inovação e compromisso com a
                  excelência em cada transporte realizado.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-text-primary">
                  Nossa Visão
                </h3>
                <p className="text-text-secondary">
                  Ser a principal plataforma de logística do Brasil,
                  transformando a forma como as cargas são transportadas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Números que Impressionam
            </h2>
            <p className="text-text-secondary">
              Nosso crescimento reflete a confiança dos usuários na plataforma
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-text-secondary">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Por que Escolher o Cargo Connect?
            </h2>
            <p className="text-text-secondary">
              Oferecemos as melhores ferramentas e recursos para facilitar seu
              transporte
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-text-primary">
                  {feature.title}
                </h3>
                <p className="text-text-secondary">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para Começar?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Junte-se a milhares de usuários que já confiam no Cargo Connect
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Cadastrar como Embarcador
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors">
              Cadastrar como Transportador
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
