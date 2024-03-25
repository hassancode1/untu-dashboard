import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';

type TPopupModalProps = {
  onConfirm?: () => void;
  loading?: boolean;
  renderModal: (onClose: () => void) => React.ReactNode;
};
export default function PopupModal({ renderModal, onConfirm }: TPopupModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const handleEditClick = () => {
    setIsOpen(true); // Open modal when Edit button is clicked
    if (onConfirm) {
      onConfirm(); // Call onConfirm handler if provided
    }
  };
  return (
    <>
      <Button className="text-xs md:text-sm" onClick={() => handleEditClick()}>
        <Plus className="mr-2 h-4 w-4" /> Add New
      </Button>
      <Modal
        isOpen={isOpen}
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