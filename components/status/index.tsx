import clsx from "clsx"

interface StatusProps {
  variant: 'active' | 'inactive' | 'waiting' | 'operator',
  children: React.ReactNode
}

export function Status({ variant, children }: StatusProps) {
  return (
    <>
      <span className={clsx("flex items-center gap-2.5 text-xs font-semibold", {
        "text-green-500 dark:text-green-300": variant == 'active',
        "text-red-500 dark:text-red-300": variant == 'inactive',
        "text-amber-500 dark:text-amber-300": variant == 'waiting',
        "text-[#BF9006] dark:text-blue-300": variant == 'operator'
      })}>
        <div
          className={clsx("border rounded-full h-3 w-3 !bg-opacity-20", {
            "border-green-500 bg-green-500 dark:border-green-300 dark:bg-green-400": variant == 'active',
            "border-red-500 bg-red-500 dark:border-red-300 dark:bg-red-400": variant == 'inactive',
            "border-amber-500 bg-amber-500 dark:border-amber-300 dark:bg-amber-400": variant == 'waiting',
            "border-blue-500 dark:border-blue-300": variant == 'operator'
          })}
        />
        {children}
      </span>
    </>
  )
}


interface Status {
  variant: 'Ativo' | 'Inativo' | 'AguardandoAprovacao' | 'Reprovado',
  children: React.ReactNode
}

export function StatusAprovacao({ variant, children }: Status) {
  return (
    <>
      <span className={clsx("flex items-center gap-2.5 text-xs font-semibold", {
        "text-green-500 dark:text-green-300": variant == 'Ativo',
        "text-red-500 dark:text-red-300": variant == 'Inativo',
        "text-amber-500 dark:text-amber-300": variant == 'AguardandoAprovacao',
        "text-[#BF9006] dark:text-blue-300": variant == 'Reprovado'
      })}>
        <div
          className={clsx("border rounded-full h-3 w-3 !bg-opacity-20", {
            "border-green-500 bg-green-500 dark:border-green-300 dark:bg-green-400": variant == 'Ativo',
            "border-red-500 bg-red-500 dark:border-red-300 dark:bg-red-400": variant == 'Inativo',
            "border-amber-500 bg-amber-500 dark:border-amber-300 dark:bg-amber-400": variant == 'AguardandoAprovacao',
            "border-blue-500 dark:border-blue-300": variant == 'Reprovado'
          })}
        />
        {children}
      </span>
    </>
  )
}

