'use client'

import { useThemeStore } from "@/stores/theme";
import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { IoMdClose } from "react-icons/io";
import cx from 'classnames'
import { DragEventHandler } from "react";
import { MdPercent } from "react-icons/md";

interface CardFlagProps {
  text: React.ReactNode,
  active: boolean
  removeClick?: () => void;
  isWhite?: boolean
  draggable?: boolean
  onDragStart?: DragEventHandler<HTMLDivElement>
  onDragEnd?: DragEventHandler<HTMLDivElement>
  onDragEnter?: DragEventHandler<HTMLDivElement>
  onDragOver?: DragEventHandler<HTMLDivElement>
  flagged?: boolean
  styleWidth?: boolean;
  noAlloed?: boolean
}

export function CardFlag(props: CardFlagProps) {
  return (
    <>
      <div style={props.styleWidth === true ? {width: "100%"} : {} } draggable={props.draggable} onDragEnter={props.onDragEnter} onDragOver={props.onDragOver} onDragStart={props.onDragStart} onDragEnd={props.onDragEnd} className={clsx(`flex items-center justify-center rounded border py-3 px-4 gap-3 transition-all duration-300 text-sm font-medium w-full xs:w-fit cursor-default`, {
        'bg-main-50 border-main-500 text-main-700 dark:bg-main-700 dark:text-main-300': props.active && !props.isWhite,
        "bg-white dark:bg-gray-750 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600": !props.active,
        "bg-white dark:bg-gray-750 text-main-700 dark:text-main-400": props.active && props.isWhite,
        "!cursor-move": props.draggable, "!cursor-not-allowed" : props.noAlloed
      })}>
        {props.text}
        {props.flagged && (
          <div className="p-1 rounded border border-gray-300 dark:border-gray-700 bg-main-200 dark:bg-main-800">
            <MdPercent className="w-5 h-5 text-main-500" />
          </div>
        )}
        {props.removeClick && (
          <Transition
            show={props.active}
            enter="transition-all duration-300"
            enterFrom="opacity-0 w-0 overflow-hidden"
            enterTo="opacity-100 w-5"
            leave="transition-all duration-300"
            leaveFrom="opacity-100 w-5"
            leaveTo="opacity-0 w-0 overflow-hidden"
          >
            <IoMdClose className="w-5 h-5 cursor-pointer" onClick={props.removeClick} />
          </Transition>
        )}
      </div>
    </>
  )
}