'use client'
import { Button, ButtonProps } from "@/components/Button";
import { Transition } from "@headlessui/react";

interface ButtonsProps {
  button?: ButtonProps,
  secondButton?: ButtonProps
  customItem?: React.ReactNode
}

export function Buttons(props: ButtonsProps) {
  return (
    <>
      <div className="flex gap-4 flex-col items-center justify-center md:flex-row">
        <Transition
          show={!!props.secondButton}
          enter="transition ease-out duration-300"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-300"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          {props.secondButton && <Button {...props.secondButton} />}
        </Transition>
        <Transition
          show={!!props.customItem}
          enter="transition ease-out duration-300"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-300"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          {props.customItem}
        </Transition>
        <Transition
          show={!!props.button}
          enter="transition ease-out duration-300"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-300"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          {props.button && <Button {...props.button} />}
        </Transition>
      </div>
    </>
  )
}