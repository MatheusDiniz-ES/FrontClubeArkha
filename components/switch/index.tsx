'use client'
import * as SwitchRdx from '@radix-ui/react-switch';
import clsx from 'clsx';

interface SwitchProps {
  testID: string
  checked: boolean
  setChecked: (checked: boolean) => void
  disabled?: boolean
  id?: string
  type?: 'success' | 'error' | 'normal'
}

export function Switch({
  type = 'normal',
  ...props
}: SwitchProps) {

  return (
    <>
      <SwitchRdx.Root 
        className={clsx(`w-12 h-6 rounded-full bg-gray-500 dark:bg-gray-500 border-0 outline-none focus:ring-2 transition-all duration-300 cursor-pointer disabled:cursor-default relative dark:border dark:border-1 dark:border-gray-600`, {
          'focus:ring-main-300 !bg-main-500 !border-0': (type == 'normal' && props.checked),
          "focus:ring-green-300 !bg-green-500 !border-0": type == 'success' && props.checked && !props.disabled,
          "focus:ring-red-300 !bg-red-500 !border-0": type == 'error' && props.checked && !props.disabled
        })}
        data-test-id={props.testID}
        id={props.id}
        checked={props.checked}
        onCheckedChange={props.setChecked}
        disabled={props.disabled}
      >
        <SwitchRdx.Thumb className={clsx("block w-5 h-5 rounded-full bg-gray-50 dark:bg-gray-200 transition-all duration-300", {
          "translate-x-[2px]": !props.checked,
          "translate-x-[26px]": props.checked
        })} />
      </SwitchRdx.Root>
    </>
  )
}