import TableSearchInput from '@/components/shared/table-search-input';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/shared/data-table';
import { useMemo, useState , useEffect} from 'react';
import { Productcolumns } from '../Product/ProductTable/columns';
import { Product } from '@/constants/data';
import { Modal } from '@/components/ui/modal';
import supabase from '@/lib/supabase';
import CreateProduct from './ProductForm/ProductForm';
import { useToast } from '@/components/ui/use-toast';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';

export default function ProductTable() {
  const [openProduct, setOpenProduct] = useState<{
    data: Product | object;
    show: boolean;
  }>({ data: {}, show: false });
  const  {toast} = useToast()
  const [loadingData, setLoadingData] =useState<boolean>(false)
  const [product , setProduct] = useState<Product[]>([])

 

  const openModal = () => {
    setOpenProduct({ data: {}, show: true });
  };

  const openEdit = (data) => {
    setOpenProduct({ data: data, show: true });
  };

  const onClose = () => {
    setOpenProduct({ data: {}, show: false });
  };

  const onDelete = async (data) => {
    const { error } = await supabase
    .from('Product')
    .delete()
    .eq('id', data.id);
  if (error) {
    throw error;
  } else {
    toast({
      className:
        'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4',
      title: 'product deleted',
      variant: 'destructive'
    });
  }
  fetchData();
  };
  const columns = useMemo(() => Productcolumns({ openEdit, onDelete }), []);

  
  const fetchData = async () => {
    try {
      setLoadingData(true);
      const { data, error } = await supabase.from('Product').select('*');
      if (error) {
        return;
      }
      setProduct(data);
    } catch (error) {
    } finally {
      setLoadingData(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
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

  return (
    <>
      <div className="mx-4 flex items-center justify-between py-5">
        <div className="flex flex-1 justify-between gap-4">
          <TableSearchInput placeholder="Product" />
        </div>
        <div className="flex  gap-3">
          <Button
            className="flex items-center text-xs md:text-sm"
            onClick={() => openModal()}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </div>
        
        <Modal
          isOpen={openProduct.show}
          onClose={onClose}
          className={'!bg-background !px-1'}
        >
          
          <div className="h-[80vh] px-6  py-4  overflow-y-auto">
            <CreateProduct modalClose={onClose} openProduct={openProduct} fetchData={fetchData} />
          </div>
        </Modal>
        </div>
      <div className="mx-auto mt-5 w-[85%]">
        <DataTable columns={columns} data={product} pageCount={1} />
      </div>
    </>
  );
}
