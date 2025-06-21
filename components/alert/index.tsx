'use cliente'
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Alert } from './useAlert';
import clsx from 'clsx';
import { MdCheckCircle } from 'react-icons/md';
import { IoMdClose, IoMdPower } from 'react-icons/io';

interface AlertProps {
  alert: Alert | null;
  hideAlert: () => void;
}

const Alert = ({ alert, hideAlert }: AlertProps) => {
  useEffect(() => {

    const timer = setTimeout(() => {
      hideAlert();
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [hideAlert]);

  if (!alert) {
    return null;
  }

  if (alert.type == 'success') {
    return (
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: '0%', opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-2 md:bottom-4 right-2 md:right-4 max-w-[280px] xs:max-w-md w-full p-4 justify-stretch bg-green-100 dark:bg-green-700 flex gap-4 rounded-lg z-[500]"
      >
        {alert.customIcon ? (
          <alert.customIcon className = 'w-5 h-5 text-green-400 dark:text-green-50' />
        ): (
          <MdCheckCircle className='w-5 h-5 text-green-400 dark:text-green-50' />
        )}
        <div className="flex-1 flex flex-col">
          <div className="flex flex-col">
            <h3 className='text-green-600 dark:text-green-200 font-semibold text-sm'>
              {alert.title}
            </h3>
            {alert.description && (
              <p className="text-green-500 dark:text-green-50 text-xs">
                {alert.description}
              </p>
            )}
          </div>
          {alert.action && (
            <div
              className="mt-4 text-green-600 dark:text-green-200 font-semibold text-xs cursor-pointer"
              onClick={hideAlert}
            >
              {alert.action}
            </div>
          )}
        </div>
        <IoMdClose className='w-5 h-5 text-green-600 dark:text-green-200 font-semibold cursor-pointer' onClick={hideAlert} />
      </motion.div>
    )
  }

  if (alert.type == 'error') {
    return (
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: '0%', opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-2 md:bottom-4 right-2 md:right-4 max-w-[280px] xs:max-w-md w-full p-4 justify-stretch bg-red-100 dark:bg-red-700 flex gap-4 rounded-lg z-[500]"
      >
        {alert.customIcon ? (
          <alert.customIcon className = 'w-5 h-5 text-red-400 dark:text-red-50' />
        ): (
            <IoMdPower className = 'w-5 h-5 text-red-400 dark:text-red-50' />
        )}
        <div className="flex-1 flex flex-col">
          <div className="flex flex-col">
            <h3 className='text-red-600 dark:text-red-200 font-semibold text-sm'>
              {alert.title}
            </h3>
            {alert.description && (
              <p className="text-red-500 dark:text-red-50 text-xs">
                {alert.description}
              </p>
            )}
          </div>
          {alert.action && (
            <div
              className="mt-4 text-red-600 dark:text-red-200 font-semibold text-xs cursor-pointer"
              onClick={hideAlert}
            >
              {alert.action}
            </div>
          )}
        </div>
        <IoMdClose className='w-5 h-5 text-red-600 dark:text-red-200 font-semibold cursor-pointer' onClick={hideAlert} />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: '0%', opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-2 md:bottom-4 right-2 md:right-4 max-w-[280px] xs:max-w-xs w-full p-4 justify-stretch bg-green-100 dark:bg-green-300 flex gap-4 rounded-lg z-[500]"
    >
      <MdCheckCircle className='w-5 h-5 text-green-400' />
      <div className="flex-1 flex flex-col">
        <div className="flex flex-col">
          <h3 className='text-green-600 font-semibold text-sm'>
            {alert.title}
          </h3>
          {alert.description && (
            <p className="text-green-500 text-xs">
              {alert.description}
            </p>
          )}
        </div>
        {alert.action && (
          <div
            className="mt-4 text-green-600 font-semibold text-xs cursor-pointer"
            onClick={hideAlert}
          >
            {alert.action}
          </div>
        )}
      </div>
      <IoMdClose className='w-5 h-5 text-green-600 font-semibold cursor-pointer' onClick={hideAlert} />
    </motion.div>
  );
};

export default Alert;
