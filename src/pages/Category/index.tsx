import { useMemo, useState, useEffect } from 'react';
import TableSearchInput from '@/components/shared/table-search-input';
import CreateCategory from './categoryforms/CreateCategory';
import { Categorycolumns } from '../Category/category-table/columns';
import DataTable from '@/components/shared/data-table';
import { Category } from '@/constants/data';
import supabase from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Modal } from '@/components/ui/modal';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
export default function CategoryTable() {
  const [openCategory, setOpenCategory] = useState<{
    data: Category | object;
    show: boolean;
  }>({ data: {}, show: false });
  const [tableData, setTableData] = useState<Category[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const openEdit = (data) => {
    setOpenCategory({ data: data, show: true });
  };
  const openModal = () => {
    setOpenCategory({ data: {}, show: true });
  };
  const onClose = () => {
    setOpenCategory({ data: {}, show: false });
  };
  const { toast } = useToast();
  const onDelete = async (data) => {
    const { error } = await supabase
      .from('Category')
      .delete()
      .eq('id', data.id);
    if (error) {
      throw error;
    } else {
      toast({
        className:
          'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4',
        title: 'category deleted',
        variant: 'destructive'
      });
    }
    fetchData();
  };

  const columns = useMemo(() => Categorycolumns({ openEdit, onDelete }), []);

  const fetchData = async () => {
    try {
      setLoadingData(true);
      const { data, error } = await supabase.from('Category').select('*');
      if (error) {
        return;
      }
      setTableData(data);
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
        <div className="flex flex-1 gap-4">
          <TableSearchInput placeholder="Search Category Here" />
        </div>
        <div className="flex gap-3">
          <Button className="text-xs md:text-sm" onClick={() => openModal()}>
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </div>
      </div>
      <Modal
        isOpen={openCategory.show}
        onClose={onClose}
        className={'!bg-background !px-1'}
      >
        <ScrollArea className="h-[80dvh] px-6  ">
          <CreateCategory
            modalClose={onClose}
            openCategory={openCategory}
            fetchData={fetchData}
          />
        </ScrollArea>
      </Modal>

      <div className=" mx-auto mt-5 w-[85%]">
        <DataTable columns={columns} data={tableData} pageCount={1} />
      </div>
    </>
  );
}
