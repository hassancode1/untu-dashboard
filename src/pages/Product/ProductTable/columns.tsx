import { Checkbox } from '@/components/ui/checkbox';
import { Product } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

interface ProductcolumnsProps {
  openEdit: (Product: Product) => void;
  onDelete: (Product: Product) => void;
}
export const Productcolumns = ({
  openEdit,
  onDelete
}: ProductcolumnsProps): ColumnDef<Product>[] => [
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
    accessorKey: 'size',
    header: 'SIZE'
  },
  {
    accessorKey: 'category',
    header: 'CATEGORY'
  },
  {
    accessorKey: 'price',
    header: 'PRICE'
  },
  {
    accessorKey: 'quantity',
    header: 'QUANTITY'
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <CellAction data={row.original} onDelete={onDelete} onEdit={openEdit} />
    )
  }
];
