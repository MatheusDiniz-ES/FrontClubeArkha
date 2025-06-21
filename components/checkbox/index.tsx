import { useThemeStore } from '@/stores/theme';
import * as CheckboxRadix from '@radix-ui/react-checkbox';
import clsx from 'clsx';
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { BsCheck } from 'react-icons/bs';

interface CheckboxProps {
  checked: boolean
  testID: string
  setChecked?: (checked: CheckboxRadix.CheckedState) => void
  disabled?: boolean
  id?: string
}

export function Checkbox(props: CheckboxProps) {
  return (
    <CheckboxRadix.Root data-test-id={props.testID} id={props.id} disabled={props.disabled} checked={props.checked} onCheckedChange={props.setChecked} className={clsx(`rounded bg-white dark:bg-gray-600 dark:border-gray-600 border border-1 border-gray-300 w-4 h-4 p-0 flex items-center justify-center text-main-500 dark:text-gray-300`, {
      "!bg-gray-400 !text-white dark:!bg-gray-600 dark:!text-gray-300": props.disabled && props.checked,
      "!bg-transparent dark:!bg-transparent": !props.checked,
    })}>
        <CheckboxRadix.Indicator>
          <BsCheck className='w-4 h-4'/>
        </CheckboxRadix.Indicator>
      </CheckboxRadix.Root>
  )
}