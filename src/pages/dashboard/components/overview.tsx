import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import supabase from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { Order } from '@/constants/data';


export default function Overview() {
  const [overview , setOverview] = useState<Order[]>([])

const fetchData = async () => {
  try {
    const { data, error } = await supabase
    .from('Order')
    .select('*')
    .order('created_at')
    if (error) {
      return;
    }
      const monthlyTotals = data.reduce((acc, order) => {
        const month = new Date(order.created_at).getMonth();
        const total = acc[month] ? acc[month] + order.total : order.total;
        acc[month] = total;
        return acc;
      }, Array(12).fill(0)); 
      const formattedData = monthlyTotals.map((total, index) => ({
        name: new Date(2024, index).toLocaleString('en-us', { month: 'short' }), 
        total,
      }));
      setOverview(formattedData);
  } catch (error) {
  } 
};
useEffect(() => {
  fetchData();
}, []);



  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={overview}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `N${value}`}
        />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
