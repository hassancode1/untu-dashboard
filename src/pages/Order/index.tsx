import TableSearchInput from '@/components/shared/table-search-input';
import DataTable from '@/components/shared/data-table';
import {  useState , useEffect, useMemo} from 'react';
import { Order } from '@/constants/data';
import supabase from '@/lib/supabase';
import { Ordercolumns } from './OrderTable/columns';
import { useToast } from '@/components/ui/use-toast';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';

export default function OrderTable() {

  const  {toast} = useToast()
  const [loadingData, setLoadingData] =useState<boolean>(false)
  const [order , setOrder] = useState<Order[]>([])


  
  const fetchData = async () => {
    try {
      setLoadingData(true);
      const { data, error } = await supabase.from('Order').select('*').order('created_at')
      if (error) {
        return;
      }
      setOrder(data);
    } catch (error) {
    } finally {
      setLoadingData(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const toggleDelivery = async (deliveryStatus:boolean ,orderId:string) => {
    const { error } = await supabase.from('Order').update({ deliveryStatus }).eq('id', orderId);
    if (error) {
      toast({
        className:
          'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4',
        title: `${error.details || 'something wrong happened'}`,
        variant: 'destructive'
      });
    } else {
      setOrder(prevOrders => {
        return prevOrders.map(order => {
          if (order.id === orderId) {
            return { ...order, deliveryStatus };
          }
          return order;
        });
      });
      toast({
        className:
          'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4',
        title: 'delivery status changed ',
        variant: 'default'
      });
    }
  }
  const columns = useMemo(() => Ordercolumns({ toggleDelivery}), []);
  if (loadingData) {
    return (
      <div className="p-5">
        <DataTableSkeleton
          columnCount={10}
          filterableColumnCount={2}
          searchableColumnCount={1}
        />
      </div>
    );
  }
console.log(order)
  return (
    <>
      <div className="mx-4 flex items-center justify-between py-5">
        <div className="flex flex-1 justify-between gap-4">
          <TableSearchInput placeholder="Product" />
        </div>
        
        </div>
      <div className="mx-auto mt-5 w-[85%]">
        <DataTable columns={columns} data={order} pageCount={1} />
        
      </div>
    </>
  );
}
