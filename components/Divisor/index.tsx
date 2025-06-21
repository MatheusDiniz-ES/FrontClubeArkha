export function Divisor({className}: {className?: string}) {
  return (
    <>
      <hr className={`block w-full border-0 h-[1px] bg-gray-200 dark:bg-gray-600 ${className || ''}`}/>
    </>
  )
}