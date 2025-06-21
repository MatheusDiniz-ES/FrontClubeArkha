'use client'
import * as Popover from '@radix-ui/react-popover';
import { Button } from '../Button';
import { FiSliders } from 'react-icons/fi';
import { LuTrash2 } from 'react-icons/lu';
import { Divisor } from '../Divisor';

interface FilterProps {
  cleanupFilter: () => void,
  children?: React.ReactNode
}

export function Filter(props: FilterProps) {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button
          testID='filter'
          type='secondary'
        >
          <FiSliders className="w-6 h-6" />
          Filtro
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="flex z-50 flex-col gap-4 bg-white shadow-lg drop-shadow-lg rounded-[8px] dark:bg-gray-750 text-gray-700 dark:text-gray-300 tall:pb-6 tall:p-4 p-8 w-[300px] sm:w-[400px] 2xl:w-[600px] dark:border dark:border-gray-600 max-h-[55vh] overflow-auto" sideOffset={5} side='bottom' align='end'>
          <div className="flex w-full justify-between items-center">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-400 font-semibold text-base">
              <FiSliders className="w-5 h-5" />
              Filtro
            </div>
            <Popover.Close aria-label="Close">
              <Button
                testID='limparFiltro'
                type='secondary'
                onClick={props.cleanupFilter}
              >
                <LuTrash2 className='w-4 h-4' />
                Limpar
              </Button>
            </Popover.Close>
          </div>
          <Divisor className='mb-2' />
          {props.children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}