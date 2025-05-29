import { useState, useEffect } from 'react';
import TestimonialCard from './TestimonialCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { mockTestimonials } from '@/lib/data';

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  
  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % mockTestimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoplay]);

  const handleNext = () => {
    setAutoplay(false);
    setActiveIndex((current) => (current + 1) % mockTestimonials.length);
  };

  const handlePrev = () => {
    setAutoplay(false);
    setActiveIndex((current) => (current - 1 + mockTestimonials.length) % mockTestimonials.length);
  };

  const handleDotClick = (index: number) => {
    setAutoplay(false);
    setActiveIndex(index);
  };

  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">O que Nossos Usuários Dizem</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Não é só o que dizemos. Veja o que milhares de remetentes e transportadores satisfeitos têm a dizer sobre o CargoConnect.
          </p>
        </div>
        
        <div className="relative">
          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTestimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`transition-all duration-500 ${
                  index === activeIndex ? 'opacity-100 scale-100' : 'opacity-40 scale-95'
                }`}
              >
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </div>
          
          {/* Navigation Arrows */}
          <div className="flex justify-center mt-8 items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={handlePrev}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            {/* Dots */}
            <div className="flex gap-2">
              {mockTestimonials.map((_, index) => (
                <button
                  key={index}
                  className={`h-2.5 w-2.5 rounded-full transition-all ${
                    index === activeIndex
                      ? 'bg-blue-600 w-5'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  onClick={() => handleDotClick(index)}
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={handleNext}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;