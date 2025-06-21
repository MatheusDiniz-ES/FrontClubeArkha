'use client'
import clsx from 'clsx';
import { Dispatch, InputHTMLAttributes, SetStateAction, TextareaHTMLAttributes, useState } from 'react'
import { LuEye, LuEyeOff } from 'react-icons/lu';
import { MdErrorOutline } from 'react-icons/md';
import { Title } from '../Title';
import InputMask from 'react-input-mask';
import DatePicker, { DateObject, } from 'react-multi-date-picker';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import { Button, ButtonProps } from '../Button';
import TimePicker from 'react-multi-date-picker/plugins/time_picker';

interface InputFieldProps {
  testID: string
  label?: string;
  input?: InputHTMLAttributes<HTMLInputElement>
}

const ptBR = {
  name: "ptBR",
  weekDays: [
    ["Dom", "D"],
    ["Seg", "S"],
    ["Ter", "T"],
    ["Qua", "Q"],
    ["Qui", "Q"],
    ["Sex", "S"],
    ["Sáb", "S"]
  ],
  months: [
    ["Janeiro", "Jan"],
    ["Fevereiro", "Fev"],
    ["Março", "Mar"],
    ["Abril", "Abr"],
    ["Maio", "Mai"],
    ["Junho", "Jun"],
    ["Julho", "Jul"],
    ["Agosto", "Ago"],
    ["Setembro", "Set"],
    ["Outubro", "Out"],
    ["Novembro", "Nov"],
    ["Dezembro", "Dez"]
  ],
  today: "Hoje",
  clear: "Limpar",
  digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
  meridiems: [
    ["AM", "AM"],
    ["PM", "PM"]
  ],
  rtl: false,
};

function InputField(props: InputFieldProps) {
  return (
    <>
      <div className="relative w-full flex-1">
        <input
          {...props?.input}
          data-test-id={props.testID}
          className="px-2 w-full text-sm text-gray-700 bg-transparent border-0 appearance-none outline-none dark:text-gray-300 disabled:text-gray-500 dark:disabled:text-gray-300 transition-all duration-300"
        />
      </div>
    </>
  )
}

interface TextareaFieldProps {
  testID: string
  label?: string;
  textarea?: TextareaHTMLAttributes<HTMLTextAreaElement>
}

function TextareaField(props: TextareaFieldProps) {
  return (
    <>
      <div className="relative w-full flex-1">
        <textarea
          {...props?.textarea}
          data-test-id={props.testID}
          className="px-2 w-full text-sm text-gray-700 bg-transparent border-0 appearance-none outline-none dark:text-gray-300 disabled:text-gray-500 dark:disabled:text-gray-300 transition-all duration-300"
        />
      </div>
    </>
  )
}



interface DecimalInputProps {
  label?: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  input?: Partial<NumericFormatProps>; // para registrar no form
  className?: string;
  errorMessage?: string;
  disabled?: boolean
}

export default function DecimalInput({
  label = 'Valor',
  value,
  onChange,
  placeholder = 'R$ 0,00',
  input = {},
  className = '',
  errorMessage,
  disabled
}: DecimalInputProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={input?.id || ''}>
          <Title
            size='xs'
            bold='normal'
          >
            {label}
          </Title>
        </label>
      )}
      <NumericFormat
        value={value}
        onValueChange={(values) => onChange && onChange(values.value)}
        thousandSeparator="."
        decimalSeparator=","
        decimalScale={20}
        allowNegative={false}
        allowLeadingZeros={false}
        placeholder={placeholder}
        className={` rounded w-full border border-gray-400 dark:border-gray-600 gap-2 p-2 bg-white dark:bg-gray-750 focus-within:ring-2 focus-within:ring-cyan-300 dark:focus-within:ring-main-500 focus-within:border-none focus-within:!bg-white dark:focus-within:!bg-gray-700 dark:focus-within:text-gray-300 focus-within:text-gray-500 [&:has(textarea:disabled)]:!bg-gray-200 [&:has(textarea:disabled)]:!ring-0 [&:has(textarea:disabled)]:!border [&:has(textarea:disabled)]:!border-gray-300 [&:has(textarea:disabled)]:!text-gray-500 dark:[&:has(textarea:disabled)]:!bg-gray-600 dark:[&:has(textarea:disabled)]:border-gray-500 dark:[&:has(textarea:disabled)]:!text-gray-300 ${
          errorMessage
            ? 'border-red-500 focus:ring-red-400'
            : 'border-gray-300 focus:ring-blue-500'
        } ${
             input?.disabled ? 'opacity-60  pointer-events-none' : ''
        }`}
        {...input}
      />
      {errorMessage && (
        <span className="text-xs text-red-500">{errorMessage}</span>
      )}
    </div>
  );
}

interface MaskInputFieldProps {
  testID: string
  mask: string
  label?: string;
  input?: InputHTMLAttributes<HTMLInputElement>
}


function MaskInputField(props: MaskInputFieldProps) {
	return (
		<>
			<div className="relative w-full flex-1">
        {/* @ts-ignore */}
				<InputMask
					{...props?.input}
					data-test-id={props.testID}
					mask={props.mask}
					maskChar={null}
					className="px-2 w-full text-sm text-gray-700 bg-transparent border-0 appearance-none outline-none dark:text-gray-300 disabled:text-gray-500 dark:disabled:text-gray-300 transition-all duration-300"
				/>
			</div>
		</>
	);
}


interface NumberInputFieldProps {
  testID: string
  label?: string;
  input?: NumericFormatProps
}

function NumberInputField(props: NumberInputFieldProps) {
  return (
    <>
      <div className="relative w-full flex-1">
        <NumericFormat
          {...props?.input}
          data-test-id={props.testID}
          className="px-2 w-full text-sm text-gray-700 bg-transparent border-0 appearance-none outline-none dark:text-gray-300 disabled:text-gray-500 dark:disabled:text-gray-300 transition-all duration-300"
        />
      </div>
    </>
  )
}

interface DateFieldProps {
  testID: string
  label?: string;
  value: any
  onChange: (e: any) => void
  placeholder: string
  disabled?: boolean
  multiple?: boolean
  format?: string;
}

function DateField(props: DateFieldProps) {
  return (
    <div className="relative w-full flex-1">
      <DatePicker
        id={props.testID}
        data-test-id={props.testID}
        value={props.value}
        onChange={(selectedDates: DateObject | null) => props.onChange(selectedDates as any)}
        editable={false}
        disabled={props.disabled}
        locale={ptBR}
        //multiple
        //disableMonthPicker
        //hideMonth
        //buttons={false}
        //weekDays={[]}
        //months={[]}
        placeholder={props.placeholder}
        //hideWeekDays
        currentDate={new DateObject('2023-1-1')}
        //numberOfMonths={0}
        //onMonthChange={() => ''}
        //hideYear
        //disableYearPicker
        format={props.format}
        inputClass='px-2 w-full text-sm text-gray-700 bg-transparent border-0 appearance-none outline-none dark:text-gray-300 disabled:text-gray-500 dark:disabled:text-gray-300 transition-all duration-300'
        className=""
        plugins={[
          <TimePicker position="bottom" hideSeconds />
        ]}
      />
    </div>
  )
}

interface NumberInputProps {
  inputFieldProps: NumberInputFieldProps
  leftIcon?: React.ReactElement
  rightIcon?: React.ReactElement
  errorMessage?: React.ReactNode
  message?: React.ReactNode
  className?: string
}

export function NumberInput(props: NumberInputProps) {
  return (
    <div className={`w-full flex flex-col items-start gap-1 ${props.className || ''}`}>
      {props.inputFieldProps.label && (
        <label htmlFor={props.inputFieldProps.input?.id || ''}>
          <Title
            size='xs'
            bold='normal'
          >
            {props.inputFieldProps.label}
          </Title>
        </label>
      )}
      <InputRoot error={!!props.errorMessage}>
        {props.leftIcon && (props.leftIcon)}
        <NumberInputField {...props.inputFieldProps} />
        {props.rightIcon && (props.rightIcon)}
      </InputRoot>
      {props.errorMessage && (
        <small className="mt-1 w-full text-xs flex gap-2 items-center font-semibold text-red-500 dark:text-red-300">
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
  )
}

interface InputRootProps {
  children: React.ReactNode | React.ReactNode[]
  error?: boolean
  withButton?: boolean
}

function InputRoot(props: InputRootProps) {

  return (
    <label className={clsx(`flex rounded h-12 w-full items-center border border-gray-400 dark:border-gray-600 gap-2 px-2 bg-white dark:bg-gray-750 focus-within:ring-2 focus-within:ring-cyan-300 dark:focus-within:ring-main-500 focus-within:border-none focus-within:!bg-white dark:focus-within:!bg-gray-700 dark:focus-within:text-gray-300 focus-within:text-gray-500 [&:has(input:disabled)]:!bg-gray-200 [&:has(input:disabled)]:!ring-0 [&:has(input:disabled)]:!border [&:has(input:disabled)]:!border-gray-300 [&:has(input:disabled)]:!text-gray-500 dark:[&:has(input:disabled)]:!bg-gray-600 dark:[&:has(input:disabled)]:border-gray-500 dark:[&:has(input:disabled)]:!text-gray-300`, {
      "ring-red-500 ring-2 border-0 text-red-500 !bg-red-50 dark:!bg-gray-700 dark:ring-red-500 dark:!text-red-300": props.error,
      "!pr-0": props.withButton
    })}>
      {props.children}
    </label>
  )
}

interface InputProps {
  inputFieldProps: InputFieldProps
  leftIcon?: React.ReactElement
  rightIcon?: React.ReactElement
  errorMessage?: React.ReactNode
  message?: React.ReactNode
  className?: string
}

export function Input(props: InputProps) {
  return (
    <div className={`w-full flex flex-col items-start gap-1 ${props.className || ''}`}>
      {props.inputFieldProps.label && (
        <label htmlFor={props.inputFieldProps.input?.id || ''}>
          <Title
            size='xs'
            bold='normal'
          >
            {props.inputFieldProps.label}
          </Title>
        </label>
      )}
      <InputRoot error={!!props.errorMessage}>
        {props.leftIcon && (props.leftIcon)}
        <InputField {...props.inputFieldProps} />
        {props.rightIcon && (props.rightIcon)}
      </InputRoot>
      {props.errorMessage && (
        <small className="mt-1 w-full text-xs flex gap-2 items-center font-semibold text-red-500 dark:text-red-300">
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
  )
}

interface TextareaProps {
  textareaFieldProps: TextareaFieldProps
  errorMessage?: React.ReactNode
  message?: React.ReactNode
  className?: string
}

export function Textarea(props: TextareaProps) {
  return (
    <div className={`w-full flex flex-col items-start gap-1 ${props.className || ''}`}>
      {props.textareaFieldProps.label && (
        <label htmlFor={props.textareaFieldProps.textarea?.id || ''}>
          <Title
            size='xs'
            bold='normal'
          >
            {props.textareaFieldProps.label}
          </Title>
        </label>
      )}
      <div className={clsx(`rounded w-full border border-gray-400 dark:border-gray-600 gap-2 p-2 bg-white dark:bg-gray-750 focus-within:ring-2 focus-within:ring-cyan-300 dark:focus-within:ring-main-500 focus-within:border-none focus-within:!bg-white dark:focus-within:!bg-gray-700 dark:focus-within:text-gray-300 focus-within:text-gray-500 [&:has(textarea:disabled)]:!bg-gray-200 [&:has(textarea:disabled)]:!ring-0 [&:has(textarea:disabled)]:!border [&:has(textarea:disabled)]:!border-gray-300 [&:has(textarea:disabled)]:!text-gray-500 dark:[&:has(textarea:disabled)]:!bg-gray-600 dark:[&:has(textarea:disabled)]:border-gray-500 dark:[&:has(textarea:disabled)]:!text-gray-300`, {
        "ring-red-500 ring-2 border-0 text-red-500 !bg-red-50 dark:!bg-gray-700 dark:ring-red-500 dark:!text-red-300": !!props.errorMessage,
      })}>
        <TextareaField {...props.textareaFieldProps} />
      </div>
      {/* <InputRoot error={!!props.errorMessage}>
      </InputRoot> */}
      {props.errorMessage && (
        <small className="mt-1 w-full text-xs flex gap-2 items-center font-semibold text-red-500 dark:text-red-300">
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
  )
}

interface InputWithButtonProps {
  inputFieldProps: InputFieldProps
  button: ButtonProps
  leftIcon?: React.ReactElement
  rightIcon?: React.ReactElement
  errorMessage?: React.ReactNode
  message?: React.ReactNode
  className?: string
}

export function InputWithButton(props: InputWithButtonProps) {
  return (
    <div className={`w-full flex flex-col items-start gap-1 ${props.className || ''}`}>
      {props.inputFieldProps.label && (
        <label htmlFor={props.inputFieldProps.input?.id || ''}>
          <Title
            size='xs'
            bold='normal'
          >
            {props.inputFieldProps.label}
          </Title>
        </label>
      )}
      <InputRoot withButton error={!!props.errorMessage}>
        {props.leftIcon && (props.leftIcon)}
        <InputField {...props.inputFieldProps} />
        <Button
          {...props.button}
          className="rounded-none rounded-ee-[3.5px] rounded-se-[3.5px] !h-full border-l border-gray-400 dark:border-gray-600"
        />
      </InputRoot>
      {props.errorMessage && (
        <small className="mt-1 w-full text-xs flex gap-2 items-center font-semibold text-red-500 dark:text-red-300">
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
  )
}

interface PasswordInputProps {
  inputFieldProps: InputFieldProps
  leftIcon?: React.ReactElement
  errorMessage?: React.ReactNode
  message?: React.ReactNode
  className?: string
}

export function PasswordInput(props: PasswordInputProps) {

  const [show, setShow] = useState(false)

  return (
    <div className={`w-full flex flex-col items-start gap-1 ${props.className || ''}`}>
      {props.inputFieldProps.label && (
        <label htmlFor={props.inputFieldProps.input?.id || ''}>
          <Title
            size='xs'
            bold='normal'
          >
            {props.inputFieldProps.label}
          </Title>
        </label>
      )}
      <InputRoot error={!!props.errorMessage}>
        {props.leftIcon && (props.leftIcon)}
        <InputField {...props.inputFieldProps} input={{
          ...props.inputFieldProps.input,
          type: show ? 'text' : 'password'
        }} />
        <span className='flex items-center justify-center cursor-pointer' onClick={() => setShow(!show)}>
          {show ? <LuEyeOff className='w-6 h-6' /> : <LuEye className='w-6 h-6' />}
        </span>
      </InputRoot>
      {props.errorMessage && (
        <small className="mt-1 w-full text-xs flex gap-2 items-center font-semibold text-red-500 dark:text-red-300">
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
  )
}

interface MaskInputProps {
  inputFieldProps: MaskInputFieldProps
  leftIcon?: React.ReactElement
  rightIcon?: React.ReactElement
  errorMessage?: React.ReactNode
  message?: React.ReactNode
  className?: string
}

export function MaskInput(props: MaskInputProps) {
  return (
    <div className={`w-full flex flex-col items-start gap-1 ${props.className || ''}`}>
      {props.inputFieldProps.label && (
        <label htmlFor={props.inputFieldProps.input?.id || ''}>
          <Title
            size='xs'
            bold='normal'
          >
            {props.inputFieldProps.label}
          </Title>
        </label>
      )}
      <InputRoot error={!!props.errorMessage}>
        {props.leftIcon && (props.leftIcon)}
        <MaskInputField {...props.inputFieldProps} />
        {props.rightIcon && (props.rightIcon)}
      </InputRoot>
      {props.errorMessage && (
        <small className="mt-1 w-full text-xs flex gap-2 items-center font-semibold text-red-500 dark:text-red-300">
          <MdErrorOutline className="w-4 h-4" />
          {props.errorMessage}
        </small>
      )}
      {props.message && (
        <small className="mt-2 w-full text-xs font-semibold text-gray-600">
          {props.message}
        </small>
      )}
    </div>
  )
}

interface DateInputProps {
  inputFieldProps: DateFieldProps
  leftIcon?: React.ReactElement
  rightIcon?: React.ReactElement
  errorMessage?: React.ReactNode
  message?: React.ReactNode
  className?: string
}

export function DateInput(props: DateInputProps) {
  return (
    <div className={`w-full flex flex-col items-start gap-1 ${props.className || ''}`}>
      {props.inputFieldProps.label && (
        <label htmlFor={props.inputFieldProps.testID || ''}>
          <Title
            size='xs'
            bold='normal'
          >
            {props.inputFieldProps.label}
          </Title>
        </label>
      )}
      <InputRoot error={!!props.errorMessage}>
        {props.leftIcon && (props.leftIcon)}
        <DateField {...props.inputFieldProps} />
        {props.rightIcon && (props.rightIcon)}
      </InputRoot>
      {props.errorMessage && (
        <small className="mt-1 w-full text-xs flex gap-2 items-center font-semibold text-red-500 dark:text-red-300">
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
  )
}