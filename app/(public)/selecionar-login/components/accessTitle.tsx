import { Divisor } from "@/components/Divisor";

export function AccessTitle ({ nome }: {nome: string}) {
  return (
    <>
      <div className="flex items-center w-full gap-2">
        <h5
          className="text-sm font-medium text-gray-500 min-w-fit"
        >
          {nome}
        </h5>
        <Divisor />
      </div>
    </>
  )
}