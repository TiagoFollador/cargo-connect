import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Testimonial } from '@/lib/types';

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  return (
    <Card className="h-full transition-all duration-300 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
            <AvatarFallback>{testimonial.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{testimonial.name}</div>
            <div className="text-sm text-gray-500">
              {testimonial.company ? `${testimonial.company}, ` : ''}
              <span className="capitalize">{testimonial.role}</span>
            </div>
            <div className="flex mt-1">
              {renderStars(testimonial.rating)}
            </div>
          </div>
        </div>
        <div className="italic text-gray-600 dark:text-gray-300">
          "{testimonial.text}"
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;