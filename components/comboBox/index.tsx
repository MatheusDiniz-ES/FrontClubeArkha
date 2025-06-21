'use client'
import * as Popover from '@radix-ui/react-popover'
import { LuChevronDown } from 'react-icons/lu'
import { Dispatch, SetStateAction } from "react"
import { AiOutlineSearch } from 'react-icons/ai'
import { Input } from '../Input'
import clsx from 'clsx'

interface ValuesProps {
  text: string,
  value: string | number
  [key: string]: any;
}

interface ComboBoxProps {
  values: ValuesProps[],
  selectValue: (value: ValuesProps) => void;
  query?: string,
  setQuery?: Dispatch<SetStateAction<string>>
  active?: boolean
  placeholder?: string
}

export function ComboBox({ values, query = '', setQuery, placeholder, active, selectValue }: ComboBoxProps) {

  const filteredValue =
    query === ''
      ? values
      : values.filter((value) => {
        return value.text.toLowerCase().includes(query.toLowerCase())
      })

  return (
    <>
      <Popover.Root>
        <Popover.Trigger className='w-full xs:w-fit' >
          <div className="flex border w-full justify-center border-gray-300 rounded py-2 px-4 gap-2 h-12 items-center dark:border-gray-600 bg-white shadow text-gray-700 dark:bg-gray-750 dark:text-gray-400 ">
            {placeholder}
            <LuChevronDown className="w-5 h-5 ml-4" />
          </div>
        </Popover.Trigger>
        <Popover.Portal 
        // @ts-ignore
        className="w-full">
          <Popover.Content className="w-full py-4 px-2 flex flex-col bg-white shadow-lg rounded-[8px] dark:bg-gray-750 text-gray-700 dark:text-gray-300 gap-4 dark:border dark:border-gray-600 dark:drop-shadow-lg z-[9999]" sideOffset={5} side='bottom' align='end'>
            {setQuery && (
              <Input
                inputFieldProps={{
                  testID: 'search',
                  input: {
                    placeholder: 'Pesquisar...',
                    value: query,
                    onChange: e => setQuery(e.target.value),
                    disabled: !active
                  }
                }}
                rightIcon={<AiOutlineSearch size={18} className="w-6 h-6" />}
              />
            )}
            <div className="flex flex-col gap-4 max-h-[40vh] overflow-auto">
              {filteredValue.map((value) => (
                <div
                  data-test-id="option"
                  className={clsx("flex h-12 w-full items-center hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-300 rounded px-2 cursor-pointer", {
                    "!cursor-default": !active
                  })}
                  onClick={() => active ? selectValue(value) : ''}
                  key={value.value}
                >
                  {value.text}
                </div>
              ))}
              {!!!filteredValue.length && (
                <div
                  className={clsx("flex h-12 w-full items-center dark:hover:bg-gray-800 transition-colors duration-300 rounded px-2 cursor-default")}
                >
                  Sem mais nenhuma opção disponível
                </div>
              )}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root >
    </>
  )
}
