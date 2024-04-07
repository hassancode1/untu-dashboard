import { Checkbox } from '@/components/ui/checkbox';
import { Order } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';




const formatAmount = (amount: number): string => {
  if (amount === null) {
    return "N/A"; 
  }
  const formattedAmount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `₦${formattedAmount}`;
};
interface ProductcolumnsProps {
  toggleDelivery: (x:boolean,y:string) => void;
}
export const Ordercolumns = ({
  toggleDelivery,
}: ProductcolumnsProps): ColumnDef<Order>[] => [
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
    accessorKey: 'firstName',
    header: 'firstName'
  },
  {
    accessorKey: 'email',
    header: 'email'
  },
  {
    accessorKey: 'paymentStatus',
    header: () => (
      <div className='payment-status-header'>
        Payment Status
      </div>
    ),
    cell: ({ row }) => (
      <div className=" py-1 px-1 text-center rounded-xl border border-green-800">
        {row.original.paymentStatus && "paid"}
      </div>
    ),
  },
  {
    accessorKey: 'total',
    header: 'Amount',
    cell: ({ row }) => (
      <div className="">
        {formatAmount(row.original.total)}
      </div>
    ),
  },
  {
    accessorKey: 'deliveryStatus',
    header: 'delivery status',
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <Switch
        id="delivery"
          checked={row.original.deliveryStatus}
          onCheckedChange={(value) => toggleDelivery(value,row.original.id)}
        />
        <Label htmlFor="delivery">{row.original.deliveryStatus ? "delivered" : "pending"}</Label>
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <CellAction data={row.original}  />
    )
  }
];
