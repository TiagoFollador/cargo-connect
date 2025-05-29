import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatsCard = ({ title, value, icon, trend }: StatsCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        </div>
        
        {trend && (
          <div className="flex items-center mt-4 text-sm">
            <div className={`flex items-center ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {trend.isPositive ? (
                <ArrowUpIcon className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 mr-1" />
              )}
              <span>{trend.value}%</span>
            </div>
            <span className="text-muted-foreground ml-2">
              {trend.isPositive ? 'desde o último mês' : 'desde o último mês'}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
