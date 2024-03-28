import TableSearchInput from '@/components/shared/table-search-input';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/shared/data-table';
import { useMemo, useState } from 'react';
import { Productcolumns } from '../Product/ProductTable/columns';
import { Product } from '@/constants/data';
import { Modal } from '@/components/ui/modal';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import CreateProduct from './ProductForm/ProductForm';

export default function ProductTable() {
  const [openProduct, setOpenProduct] = useState<{
    data: Product | object;
    show: boolean;
  }>({ data: {}, show: false });

  const openModal = () => {
    setOpenProduct({ data: {}, show: true });
  };

  const openEdit = (data) => {
    setOpenProduct({ data: data, show: true });
  };

  const onClose = () => {
    setOpenProduct({ data: {}, show: false });
  };

  const onDelete = (data) => {};
  const columns = useMemo(() => Productcolumns({ openEdit, onDelete }), []);
  const Data: Product[] = [{ id: 'adfadf', name: 'hassan' }];

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
          <ScrollArea className="h-[80dvh] px-6  ">
            <CreateProduct modalClose={onClose} openProduct={openProduct} />
          </ScrollArea>
        </Modal>
      </div>
      <div className="mx-auto mt-5 w-[85%]">
        <DataTable columns={columns} data={Data} pageCount={1} />
      </div>
    </>
  );
}
