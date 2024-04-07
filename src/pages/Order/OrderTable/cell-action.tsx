import { AlertModal } from '@/components/shared/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Order } from '@/constants/data';
import {  MoreHorizontal, ViewIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';


interface CellActionProps {
  data: Order;
}

export const CellAction: React.FC<CellActionProps> = ({
  data,
 
}) => {
  const [loading] = useState(false);
  const [open, setOpen] = useState(false);

  const onConfirm = async () => {};

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem >
            <ViewIcon className="mr-2 h-4 w-4" />
        <Link to={`/order/${data.id}`}>  View</Link> 
          </DropdownMenuItem>
       
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
