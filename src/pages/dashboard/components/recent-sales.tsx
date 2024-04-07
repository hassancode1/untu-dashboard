import { useState, useEffect } from 'react';
import { Order } from '@/constants/data';
import supabase from '@/lib/supabase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export default function RecentSales() {
  const [overview , setOverview] = useState<Order[]>([])
  const formatAmount = (amount: number): string => {
    if (amount === null) {
      return "N/A"; 
    }
    const formattedAmount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `₦${formattedAmount}`;
  };

  
  const fetchData = async () => {
    try {
      const { data, error } = await supabase
      .from('Order')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
      if (error) {
        return;
      }
      setOverview(data);
    } catch (error) {
    } finally {
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="space-y-8">
      {overview.map((recent) => {
        return (  
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback>{recent.firstName.charAt(0).toUpperCase()}{recent.lastName.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">{recent.firstName}</p>
          <p className="text-sm text-muted-foreground">
           {recent.email}
          </p>
        </div>
        <div className="ml-auto font-medium">{formatAmount(recent.total)}</div>
      </div>
     )
    })}
    </div>
  );
}
