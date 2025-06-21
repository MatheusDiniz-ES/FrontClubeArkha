'use client'
import { Dialog as Modal, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { Button } from '../Button'
import clsx from 'clsx'
import { Dialog as dialog } from './useDialog';
import { useThemeStore } from '@/stores/theme'

interface DialogProps {
  dialog: dialog | null;
  hideDialog: () => void;
}

export function Dialog({ dialog, hideDialog }: DialogProps) {

  if (!dialog) {
    return null;
  }

  const close = () => {
    dialog.setIsOpen(false)
  }

  return (
    <Transition appear show={dialog.isOpen} as={Fragment}>
      <Modal as="div" className="relative z-10" onClose={dialog.withoutOutsideClick ? () => '' : close}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Modal.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all flex items-center flex-col gap-2">
                <div className=''>
                  {
                    dialog.closeButton && (
                      <div 
                       {...dialog.closeButton}
                          onClick={() => {
                            if (!dialog.disabledAutoClose) close()
                            if (dialog?.closeButton?.onClick) dialog.closeButton.onClick()
                          }}
                        className='w-full ml-[390px] cursor-pointer'
                      >
                          {dialog.closeButton.children}
                      </div>
                    )
                  }

                </div>
                <div className="flex items-center gap-2">
                  {dialog.icon && (
                    <div className={clsx(`flex items-center text-main-500`, {
                      'text-red-500': dialog.error,
                      'text-green-500': dialog.success,
                    })}>
                      {dialog.icon}
                    </div>
                  )}
                  <Modal.Title
                    as="h3"
                    className="text-base md:text-lg font-bold text-gray-800 dark:text-gray-300"
                  >
                    {dialog.title}
                  </Modal.Title>
                </div>
                {dialog.subtitle && (
                  <p className="text-xs text-gray-500 dark:text-gray-200 text-center">
                    {dialog.subtitle}
                  </p>
                )}

                {/* border-t border-solid border-t-gray-300 pt-6 */}
                {dialog.children && (
                  <div className="flex flex-col gap-4 w-full">
                    {dialog.children}
                  </div>
                )}

                <div className="mt-4 flex items-center gap-4">
                  {dialog.secondButton && (
                    <Button
                      {...dialog.secondButton}
                      onClick={() => {
                        if (!dialog.disabledAutoClose) close()
                        if (dialog?.secondButton?.onClick) dialog.secondButton.onClick()
                      }}
                    >
                      {dialog.secondButton.children}
                    </Button>
                  )}
                  {dialog.button && (
                    <Button
                      {...dialog.button}
                      onClick={() => {
                        if (!dialog.disabledAutoClose) close()
                        if (dialog?.button?.onClick) dialog.button.onClick()
                      }}
                    >
                      {dialog.button.children}
                    </Button>
                  )}
                </div>
              </Modal.Panel>
            </Transition.Child>
          </div>
        </div>
      </Modal>
    </Transition>
  )
}