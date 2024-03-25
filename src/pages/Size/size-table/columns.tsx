import { Checkbox } from '@/components/ui/checkbox';
import { Size } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-actions';

interface SizecolumnsProps  {
openEdit:(category:Size)=>void;
onDelete:(category:Size)=>void;
}
  export const Sizecolumns = ({ openEdit, onDelete }: SizecolumnsProps):  ColumnDef<Size>[] => [
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
