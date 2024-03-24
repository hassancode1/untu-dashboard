import { Checkbox } from '@/components/ui/checkbox';
import { Category } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-actions';

interface CategorycolumnsProps  {
openEdit:(category:Category)=>void;
onDelete:(category:Category)=>void;
}
  export const Categorycolumns = ({ openEdit, onDelete }: CategorycolumnsProps):  ColumnDef<Category>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: 'NAME'
  },
 
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} onDelete={onDelete} onEdit={openEdit}/>
  }
];
