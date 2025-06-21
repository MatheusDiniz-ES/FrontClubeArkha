import clsx from "clsx"
import { MdCheck } from "react-icons/md"
import { ClassNameValue } from "tailwind-merge"

export type StepProp = {
  title: string
  number: number
  subtitle?: string
  message?: string
}

interface StepsProps {
  steps: StepProp[]
  activeStep: number
  vertical?: boolean
  className?: ClassNameValue
}

export function Steps(props: StepsProps) {
  return (
    <ol className={clsx(`items-center w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0 ${props.className || ''}`, {
      "sm:flex-col !items-start sm:!space-y-4 sm:!space-x-0": props.vertical
    })}>
      {props.steps.map((step, index) => (
        <li key={index} className={clsx("flex items-center space-x-4", {
          "flex-1": !props.vertical
        })}>
          <span className={clsx("flex items-center justify-center w-12 h-12 border-2 rounded-full shrink-0", {
            "border-main-500 text-main-500": props.activeStep >= index,
            "bg-main-500 text-white dark:text-gray-700": props.activeStep > index,
            "text-gray-500": props.activeStep == index,
            "border-gray-500": props.activeStep < index
          })}>
            {props.activeStep > index ? (
              <MdCheck className="w-5 h-5" />
            ) : (
              step.number < 10 ? '0' + step.number : step.number
            )}
          </span>
          <span>
            <h3 className={clsx("font-bold leading-tight", {
              "text-gray-800 dark:text-gray-300": props.activeStep != index,
              "text-main-500": props.activeStep == index
            })}>
              {step.title}
            </h3>
            {step.subtitle && (
              <p className="text-sm dark:text-gray-300 text-gray-400">{step.subtitle}</p>
            )}
            {step.message && (
              <p className="text-sm text-gray-500">{step.message}</p>
            )}
          </span>
        </li>
      ))}
    </ol>
  )
}