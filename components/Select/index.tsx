import clsx from 'clsx';
import { SelectHTMLAttributes, useEffect, useRef } from 'react'
import { MdErrorOutline } from 'react-icons/md';
import { Title } from '../Title';

interface SelectField {
  testID: string
  options: {
    value: string | number;
    text: string,
    disabled?: boolean
  }[]
  label?: string;
  select?: SelectHTMLAttributes<HTMLSelectElement>
  disabledText?: string
  errorMessage?: React.ReactNode
  message?: React.ReactNode
  className?: string
}

export function Select(props: SelectField) {


  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const handleScroll = (event: Event) => {
      const element = event.target as HTMLSelectElement;
      const isBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
      
      if (isBottom) {
        console.log('Reached the bottom');
        // Execute any additional logic when the bottom is reached
      }
    };

    const selectElement = selectRef.current;
    if (selectElement) {
      selectElement.addEventListener('scroll', handleScroll);
    }

    // Cleanup
    return () => {
      if (selectElement) {
        selectElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <>
      <div className={`w-fit flex-1 flex flex-col gap-1 ${props.className || ''}`}>
        {props.label && (
          <label htmlFor={props.select?.id || ''}>
            <Title
              size='xs'
              bold='normal'
            >
              {props.label}
            </Title>
          </label>
        )}
        <select
          ref={selectRef}
          {...props?.select}
          data-test-id={props.testID}
          className={clsx(`rounded h-12 w-full border border-gray-400 dark:border-gray-600 gap-2 px-2 bg-white dark:bg-gray-750 focus:ring-2 focus:border-none focus:ring-main-300 dark:focus:ring-main-500 focus:!bg-white dark:focus:!bg-gray-700 dark:focus:text-gray-300 focus:text-gray-500 disabled:!bg-gray-200 disabled:!ring-0 disabled:!border disabled:!border-gray-300 disabled:!text-gray-500 dark:disabled:!bg-gray-500 dark:disabled:border-gray-500 active:ring-0 active:border-0 dark:disabled:!text-gray-300 ${props.select?.className || ''}`, {
            "ring-red-500 ring-2 border-0 text-red-500 !bg-red-50 dark:!bg-gray-700 dark:ring-red-500 dark:!text-red-300": !!props.errorMessage
          })}
        >
          <option value='' selected disabled>{props.disabledText || 'Selecione uma opção'}</option>
          {props.options && props.options.map(e => (
            <option value={e.value} key={e.value} disabled={e.disabled || false}>{e.text}</option>
          ))}
        </select>
        {props.errorMessage && (
          <small className="w-full mt-1 text-xs flex gap-2 items-center font-semibold text-red-500 dark:text-red-300">
            <MdErrorOutline className="w-4 h-4" />
            {props.errorMessage}
          </small>
        )}
        {props.message && (
          <small className="mt-2 w-full text-xs font-semibold text-gray-600 dark:text-gray-300">
            {props.message}
          </small>
        )}
      </div>
    </>
  )
}