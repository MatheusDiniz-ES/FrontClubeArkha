'use cliente'
import { useState } from 'react';
import { ButtonProps } from '../Button';

export interface Dialog {
  title: String
  subtitle?: React.ReactNode
  button?: ButtonProps
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  withoutOutsideClick?: boolean
  secondButton?: ButtonProps
  children?: React.ReactNode[] | React.ReactNode
  icon?: React.ReactElement
  error?: boolean
  success?: boolean
  disabledAutoClose?: boolean
  closeButton?: ButtonProps
}

export const useDialog = () => {
  const [dialog, setDialog] = useState<Dialog | null>(null);

  const showDialog = (props: Dialog) => {
    setDialog({ ...props });
  };

  const hideDialog = () => {
    setDialog(null);
  };

  return {
    dialog,
    showDialog,
    hideDialog
  };
};
