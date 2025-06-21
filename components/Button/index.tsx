import { useThemeStore } from "@/stores/theme";
import clsx from "clsx";

export interface ButtonProps {
  children: React.ReactNode;
  testID: string
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'primary' | 'secondary' | 'error' | 'success' | 'off' | '';
  loading?: boolean;
  justIcon?: boolean;
  color?: string;
}

export function Button(props: ButtonProps) {

  return (
    <>
      <button
        style={{ backgroundColor: props.color || '' }}
        data-test-id={props.testID}
        disabled={props.disabled}
        onClick={!props.loading && props.onClick || undefined}
        className={clsx(`flex items-center h-12 transition-all duration-300 justify-center py-2 px-4 rounded gap-3 disabled:opacity-20  disabled:border-gray-400 ${props.className || ''} ${(props.type == 'primary' || !props.type) ? 'bg-main-500 border-none text-white hover:[&:not(:disabled)]:!bg-main-700 focus:ring-main-300 focus:ring-2' : ''}`, {
          "bg-slate-500 border-none text-white hover:[&:not(:disabled)]:g-slate-700 focus:ring-red-300 focus:ring-2": props.type == 'off',
          "bg-red-500 border-none text-white hover:[&:not(:disabled)]:bg-red-700 focus:ring-red-300 focus:ring-2": props.type == 'error',
          "bg-green-500 border-none text-white hover:[&:not(:disabled)]:bg-green-700 focus:ring-green-300 focus:ring-2": props.type == 'success',
          [`bg-[${props.color}]`]: !props.type && props.color,
          "bg-transparent border-gray-200 border shadow-sm text-gray-700 bg-white focus:ring-gray-200 hover:[&:not(:disabled)]:bg-gray-200 dark:text-gray-300 dark:bg-gray-750 dark:border-gray-600 dark:hover:[&:not(:disabled)]:bg-transparent dark:hover:[&:not(:disabled)]:text-gray-500": props.type === 'secondary',
          "cursor-not-allowed focus:ring-0": props.loading
        })}
      >
        {props.loading && (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={"4"}></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {!(props.justIcon && props.loading) && (
          <>{props.children}</>
        )}
      </button>
    </>
  )
}