import { useThemeStore } from '@/stores/theme';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { MdErrorOutline } from 'react-icons/md';
import { ClassNameValue } from 'tailwind-merge/dist/lib/tw-join';

interface RadioButtonProps {
  id: string
  value: string
  className?: ClassNameValue
  classNameIndicator?: ClassNameValue
  label?: React.ReactNode
}

export function RadioButton({
  className = '',
  classNameIndicator = '',
  ...props
}: RadioButtonProps) {

  return (
    <>
      <div
        className={`flex items-center gap-2 ${className} cursor-pointer`}
      >
        <RadioGroup.Item
          className="bg-white rounded-full justify-center dark:bg-gray-750 border-slate-200 dark:border-slate-300 border flex items-center w-4 h-4"
          value={props.value}
          id={props.id}
        >
          <RadioGroup.Indicator
            className={`w-2 h-2 rounded-full bg-main-500 ${classNameIndicator}`}
          />
        </RadioGroup.Item>
        {props.label && (
          <label 
            className="text-gray-600 dark:text-gray-300 text-sm cursor-pointer"
            htmlFor={props.id}
          >
            {props.label}
          </label>
        )}
      </div>
    </>
  )
}

interface RadioButtonRootProps {
  children: React.ReactNode
  className?: ClassNameValue
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  errorMessage?: React.ReactNode;
}

export function RadioButtonContainer({
  className = '',
  value,
  defaultValue,
  onValueChange,
  ...props
}: RadioButtonRootProps) {
  return (
    <>
      <RadioGroup.Root
        className={'flex items-center gap-4 flex-wrap w-fit ' + className}
        defaultValue={defaultValue}
        value={value}
        onValueChange={onValueChange}
        disabled={props.disabled}
      >
        {props.children}
      </RadioGroup.Root>
      {props.errorMessage && (
        <small className="mt-1 w-full text-xs flex gap-2 items-center font-semibold text-red-500 dark:text-red-300">
          <MdErrorOutline className="w-4 h-4" />
          {props.errorMessage}
        </small>
      )}
    </>
  )
}