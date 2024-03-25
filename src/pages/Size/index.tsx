import { useMemo, useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { ScrollArea } from '@/components/ui/scroll-area';
import TableSearchInput from '@/components/shared/table-search-input';
import CreateSize from './sizeforms/CreateSize';
import { Sizecolumns } from './size-table/columns';
import DataTable from '@/components/shared/data-table';
import { Size } from '@/constants/data';
import supabase from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';

export default function StudentTableActions() {
  const [openSize, setOpenSize] = useState<{ data: Size | object; show: boolean }>({ data: {}, show: false })
  const [tableData, setTableData] = useState<Size[]>([])
const [loadingData,setLoadingData] = useState<boolean>(false)
  const openEdit = (data) => {
    setOpenSize({ data: data, show: true })
  }
  const openModal = () =>{
    setOpenSize({data:{}, show:true})
  }
  const onClose = () => {
    setOpenSize({ data: {}, show: false })
  }
  
  const onDelete = async (data) => { 
  const {error} =  await supabase.from('Size').delete().eq('id',data.id);
  if(error){
    throw error
  }
  fetchData()
  }
  

  const columns = useMemo(() => Sizecolumns({ openEdit, onDelete }), [])
 
  const fetchData = async () => {
    try {
      setLoadingData(true);
      const { data, error } = await supabase.from('Category').select('*');
      if (error) {
        return;
      }
      setTableData(data);
    } catch (error) {
      // Handle error
    } finally {
      setLoadingData(false); 
    }
  };
  useEffect(() =>{
    fetchData()
  },[])
 
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
      <div className="flex items-center justify-between py-5 mx-4">
        <div className="flex flex-1 gap-4">
          <TableSearchInput placeholder="Search Size Here" />
        </div>
        <div className="flex gap-3">
        <Button className="text-xs md:text-sm" onClick={() => openModal()}>
        <Plus className="mr-2 h-4 w-4" /> Add New
      </Button>
     
        </div>
      </div>
      <Modal
        isOpen={openSize.show}
        onClose={onClose}
        className={'!bg-background !px-1'}
      >
        <ScrollArea className="h-[80dvh] px-6  ">
          <CreateSize modalClose={onClose} openSize={openSize}  fetchData={fetchData}/>
          </ScrollArea>
      </Modal>
      <div className=' w-[85%] mx-auto mt-5'>
        <DataTable columns={columns} data={tableData} pageCount={1} />

      </div>
    </>
  );
}
