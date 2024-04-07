import { useState, useEffect } from 'react';
import { Order } from '@/constants/data';
import supabase from '@/lib/supabase';
import { useParams } from 'react-router-dom';
import DataTable from '@/components/shared/data-table';
import { Ordercolumns } from './columns';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import { User  , ShoppingCartIcon} from 'lucide-react';


export default function Orderdetails() {

  const { id } = useParams()

  const [loadingData, setLoadingData] = useState<boolean>(false)
  const [order, setOrder] = useState<Order>({} as Order);


  const fetchData = async () => {
    try {
      setLoadingData(true);
      const { data, error } = await supabase.from('Order').select("*").order('created_at').eq('id', id).single();
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
  console.log(order)

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
  const product = order.product ? JSON.parse(order.product) : [];
  console.log(product)

  return (
    <>
      <div className="mx-4 flex items-center justify-between py-5 px-5">
        <div className="flex flex-1 flex-col gap-4">
          <h2 className='font-medium text-[1.7rem]'> Order Details</h2>

          <div className=' py-3 px-3 rounded-lg mt-4'>
            <div className="mb-3 grid grid-cols-2 gap-x-2 gap-y-4 ">
              <div className='flex gap-4'>
                <div className='border border-gray-300 rounded-full h-[3.5rem] py-3 px-3 text-center flex items-center justify-center'>
                  <User className=" h-8 w-8" />
                </div>
                <div>
                  <h2 className='font-medium text-[1.3rem]'>Customer</h2>
                  <div>
                    <span>Name:</span>
                    <span className='font-medium mr-2'>{order.firstName}</span>
                  </div>
                  <div>
                    <span>Email:</span>
                    <span className='font-medium mr-2'>{order.email}</span>
                  </div>
                  <div>
                    <span>phone no:</span>
                    <span className='font-medium mr-2'>{order.phoneNo}</span>
                  </div>
                </div>
              </div>
              <div className='flex gap-4 '>
                <div className='border border-gray-300 rounded-full h-[3.5rem] py-3 px-3 text-center flex items-center justify-center'>
                  <ShoppingCartIcon className=" h-8 w-8" />
                </div>
                <div>
                  <h2 className='font-medium text-[1.3rem]'>Shipping Details</h2>
                  <div className='flex gap-2 items-center justify-center ml-[-1.8rem]'>
                    <span>delivery status:</span>
                    {order.deliveryStatus ?
                      <div className='px-2 py-1 border border-green-600 rounded-2xl text-green-600 text-[14px]'>
                        delivered
                       </div>
                      :
                      <div className='px-2 py-1 border border-yellow-600 rounded-2xl text-yellow-600 text-[14px]'>
                        pending
                       </div>
                    }
                    
                  </div>
                  <div>
                    <span>state:</span>
                    <span className='font-medium mr-2'>{order.state}</span>
                  </div>
                  <div>
                    <span>address:</span>
                    <span className='font-medium mr-2'>{order.address}</span>
                  </div>
                </div>
              </div>
              <div className='col-span-2 mt-8 max-w-[1024px]'>
              <DataTable columns={Ordercolumns()} data={product}  pageCount={1} />
              </div>
            </div>
          </div>
        </div>


      </div>

    </>
  );
}
