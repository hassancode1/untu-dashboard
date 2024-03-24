import { useMemo, useState, useEffect } from 'react';
import PopupModal from '@/components/shared/popup-modal';
import TableSearchInput from '@/components/shared/table-search-input';
import CreateCategory from './categoryforms/CreateCategory';
import { Categorycolumns } from '../Category/category-table/columns';
import DataTable from '@/components/shared/data-table';
import { Category } from '@/constants/data';
import supabase from '@/lib/supabase';

export default function StudentTableActions() {
  const [openCategory, setOpenCategory] = useState<{ data: Category | object; show: boolean }>({ data: {}, show: false })
  const [tableData, setTableData] = useState<Category[]>([])
  const openEdit = (data) => {
    setOpenCategory({ data: data, show: true })
 
  }
  const onDelete = async (data) => { 
  const {error} =  await supabase.from('Category').delete().eq('id',data.id);
  if(error){
    throw error
  }
  fetchData()
  }
  

  const columns = useMemo(() => Categorycolumns({ openEdit, onDelete }), [])
 
  const fetchData = async () => {
    try {
      const { data, error } = await supabase.from('Category').select('*');
      if (error) {
        return;
      }
      console.log(data)
      setTableData(data)
    } catch (error) {
    }
  };
  useEffect(() => {
    fetchData()
  }, [])
 
  return (
    <>
      <div className="flex items-center justify-between py-5 mx-4">
        <div className="flex flex-1 gap-4">
          <TableSearchInput placeholder="Search Category Here" />
        </div>
        <div className="flex gap-3">
          <PopupModal
            openCategory={openCategory}
            setOpenCategory={setOpenCategory}
            renderModal={(onClose) => <CreateCategory modalClose={onClose} openCategory={openCategory}  fetchData={fetchData}/>}
          />
        </div>
      </div>
      <div className=' w-[85%] mx-auto mt-5'>
        <DataTable columns={columns} data={tableData} pageCount={1} />

      </div>
    </>
  );
}
