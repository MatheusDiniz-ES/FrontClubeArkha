'use cliente'
import { useState } from 'react';
import { IconType } from 'react-icons/lib';

export type AlertType = 'success' | 'info' | 'warning' | 'error';

export interface Alert {
  title: React.ReactNode;
  type?: AlertType;
  description?: React.ReactNode
  action?: React.ReactNode;
  customIcon?: IconType
}

const useAlert = () => {
  const [alert, setAlert] = useState<Alert | null>(null);

  const showAlert = ({title,description, action, type = "success", customIcon}: Alert) => {
    setAlert({ title, type, description, action, customIcon });
  };

  const hideAlert = () => {
    setAlert(null);
  };

  return {
    alert,
    showAlert,
    hideAlert,
  };
};

export default useAlert;
