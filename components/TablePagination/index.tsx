'use client'
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'
import { Button } from '../Button';
import { useEffect } from 'react';

interface TablePaginationProps {
  count: number,
  limit: number,
  page: number,
  onChangePage: (e: number) => void;
  // loading: boolean
}

export function TablePagination(props: TablePaginationProps) {

  useEffect(() => {
    if(typeof window != 'undefined' && (Math.ceil(props.count / props.limit) < props.page)) {
      props.onChangePage(1)
    }
  }, [props.limit])

  return (
    <>
      <div className="w-full flex flex-wrap gap-8 items-center justify-center sm:justify-between">
        <span className="text-gray-700 dark:text-gray-300 text-base text-center">
          Exibindo <strong>{(props.limit * (props.page - 1)) + 1} - {props.page == 1 ? props.limit : (props.limit * (props.page - 1)) + props.limit}</strong> de <strong>{props.count}</strong> Resultados
        </span>
        <div className="flex items-center">
          <Button
            testID="voltar"
            type='secondary'
            onClick={() => props.onChangePage(props.page - 1)}
            disabled={props.page == 1}
            className='rounded-se-none rounded-ee-none border-r-0 !w-12 px-0'
          >
            <BsChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            testID="page"
            type='secondary'
            className='!cursor-default !rounded-none !w-12 px-0'
          >
            {props.page}
          </Button>
          <Button
            testID="proxima"
            type='secondary'
            className='rounded-es-none rounded-ss-none border-l-0 !w-12 px-0'
            onClick={() => props.onChangePage(props.page + 1)}
            disabled={(((props.page - 1) * props.limit) + props.limit) >= (props.count)}
          >
            <BsChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  )
}