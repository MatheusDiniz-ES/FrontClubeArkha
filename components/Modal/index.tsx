'use client'
import { Dialog as Modal, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from "react"
import { CheckCircle } from 'lucide-react';
import api from '@/lib/api';
import { Alert } from '@/components/alert/useAlert';;

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  showAlert: ({ title, description, action, type, customIcon }: Alert) => void
}


export function ModalExport(props: ModalProps) {

  return (
    <>
      <Transition appear show={props.isOpen} as={Fragment}>
        <Modal as="div" className="relative z-10" onClose={props.onClose}>
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
                <Modal.Panel className="transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left shadow-xl transition-all flex flex-col gap-2 w-[900px]">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center rounded-full p-4 bg-primary-P50-value">
                      <CheckCircle className="w-8 h-8 text-primary-P200-value" />
                    </div>
                    <Modal.Title
                      as="h3"
                      className="text-base md:text-lg font-bold text-gray-800 dark:text-gray-300"
                    >
                      Timesheet Export
                    </Modal.Title>
                  </div>
                </Modal.Panel>
              </Transition.Child>
            </div>
          </div>
        </Modal>
      </Transition>
    </>
  )
} 