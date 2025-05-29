import HeroSection from '@/components/home/HeroSection';
import SearchSection from '@/components/home/SearchSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full">
        <HeroSection />
        <SearchSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;