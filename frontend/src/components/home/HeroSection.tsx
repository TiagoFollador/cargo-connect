import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { TruckIcon, ShieldCheck, Clock, Award } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCTAClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">

      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1427541/pexels-photo-1427541.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)',
          transform: `translateY(${offsetY * 0.5}px)`,
          filter: 'brightness(0.6)'
        }}
      />
      

      <div className="container mx-auto px-4 relative z-10 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="text-white" data-aos="fade-right">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Connecting Shippers & Carriers Nationwide
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              The smarter way to manage your logistics with real-time tracking, verified carriers, and competitive rates.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-12">
              <Button size="lg" onClick={handleCTAClick} className="bg-blue-600 hover:bg-blue-700 text-white">
                Get Started Now
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Learn More
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex justify-center mb-2">
                  <ShieldCheck className="h-6 w-6 text-blue-400" />
                </div>
                <div className="text-lg font-semibold">Verified Carriers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex justify-center mb-2">
                  <Clock className="h-6 w-6 text-blue-400" />
                </div>
                <div className="text-lg font-semibold">24/7 Support</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex justify-center mb-2">
                  <TruckIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div className="text-lg font-semibold">5,000+ Vehicles</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex justify-center mb-2">
                  <Award className="h-6 w-6 text-blue-400" />
                </div>
                <div className="text-lg font-semibold">4.9 Rating</div>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block">

          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;