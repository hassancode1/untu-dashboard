import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Plus } from 'lucide-react';
import { Category } from '@/constants/data';
import { ScrollArea } from '../ui/scroll-area';

type TPopupModalProps = {
  onConfirm?: () => void;
  loading?: boolean;
  setOpenCategory:(x:{data:Category | object;show:boolean}) => void
  openCategory:({data:Category | object;show:boolean})
  renderModal: (onClose: () => void) => React.ReactNode;
};
export default function PopupModal({ renderModal, setOpenCategory, openCategory }: TPopupModalProps) {
  // const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setOpenCategory({data:{}, show:false});
  return (
    <>
      <Button className="text-xs md:text-sm" onClick={() => setOpenCategory({data:{}, show:true})}>
        <Plus className="mr-2 h-4 w-4" /> Add New
      </Button>
      <Modal
        isOpen={openCategory.show}
        onClose={onClose}
        className={'!bg-background !px-1'}
      >
        <ScrollArea className="h-[80dvh] px-6  ">
          {renderModal(onClose)}
        </ScrollArea>
      </Modal>
    </>
  );
}
