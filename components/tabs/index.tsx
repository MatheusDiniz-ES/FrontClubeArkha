import { useThemeStore } from "@/stores/theme"
import clsx from "clsx"
import { IconType } from "react-icons/lib"
import { ClassNameValue } from "tailwind-merge"

interface TabsProps {
  tabs: {
    title: string,
    icon: IconType,
    hidden?: boolean
  }[]
  currentIndex: number
  setCurrentIndex: (e: number) => void
  className?: ClassNameValue;
}

export function Tabs(props: TabsProps) {
  return (
    <>
      <div className={`text-sm font-normal text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 w-full ${props.className || ''}`}>
        <ul className="flex flex-col md:flex-row flex-wrap -mb-px">
          {props.tabs.filter(e => !e.hidden).map((tab, index) => (
            <li key={index}>
              <span
                className={clsx(`inline-block p-4 border-b-2 rounded-t-lg transition-all duration-300 ${index == props.currentIndex && `!text-main-500 !border-main-500 active !hover:text-main-500 !hover:border-main-500 cursor-default`}`, {
                  'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 cursor-pointer': index != props.currentIndex,
                })}
                onClick={() => props.setCurrentIndex(index)}
              >
                <span className="flex items-center justify-center gap-2">
                  <tab.icon className="w-5 h-5" />
                  {tab.title}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>

    </>
  )
}