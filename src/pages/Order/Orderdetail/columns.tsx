import { Checkbox } from '@/components/ui/checkbox';
import { Product } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';





const formatAmount = (amount: number): string => {
  if (amount === null) {
    return "N/A";
  }
  const formattedAmount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `₦${formattedAmount}`;
};
const imageFileUrl = `https://xwsfeqsmtvzdcxhmlvig.supabase.co/storage/v1/object/public/images/`;

export const Ordercolumns = (): ColumnDef<Product>[] => [
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
    header: 'Product Name'
  },

  {
    accessorKey: 'description',
    header: 'Description'
  },
  {
    accessorKey: 'size',
    header: 'Size'
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => (
      <div className="">
        {formatAmount(row.original.price)}
      </div>
    ),
  },
  {
    accessorKey: 'images',
    header: 'Images',
    cell: ({ row }) => (

      <div className="flex">
        {row.original.images && JSON.parse(row.original.images).map((prev, index) => (
          <div key={index} className="flex">
            <img
              src={imageFileUrl + prev}
              alt="Preview"
              className="h-[3rem] w-[3rem] rounded-full object-cover"
            />
          </div>
        ))}
      </div>

    ),
  },

  {
    id: 'actions',
    cell: ({ row }) => (
      <CellAction data={row.original} />
    )
  }
];
