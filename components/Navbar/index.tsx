'use client'
import { BsBell } from "react-icons/bs"
import { ToggleDarkModeButton } from "./components/darkMode"
import { Title } from "../Title"
import { Subtitle } from "../Subtitle"
import { LuChevronDown } from "react-icons/lu"
import { BiUserCircle } from 'react-icons/bi'
import * as Popover from '@radix-ui/react-popover'
import Link from "next/link"
import { RxExit } from "react-icons/rx"
import { useUser } from "@/stores/user"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { changeColor } from "@/lib/utils"
import api from "@/lib/api"
import { ToggleFullScreenModeButton } from "./components/fullScreenMode"

export function Navbar() {

  const router = useRouter()
  const user = useUser(e => e.user)
  
  const [area, setArea] = useState<null | {
    id: number;
    area: string;
    ambiente: string;
    logo: string;
    nomefantasia: string;
  }>(null);


  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true)
    changeColor('cyan')
  }, [])

  if (!isMounted) return null

  return (
    <div className="flex items-center bg-white dark:bg-gray-750 dark:text-gray-300 w-full justify-end gap-6 h-16 py-8 px-4 border-b border-gray-100 dark:border-gray-600">
      {/* <span className="hidden xs:flex items-center py-2 px-4 rounded justify-center text-main-500 dark:bg-main-700 dark:text-main-200">
        Painel ADM
      </span> */}
      
      <ToggleFullScreenModeButton />
      <ToggleDarkModeButton />

      <Popover.Root>
        <Popover.Trigger>
          <div className="flex items-center gap-4">
            {/* <Image
              width={150}
              height={150}
              src={user.imagem}
              alt="Foto do seu usuário"
              className="w-6 h-6 md:w-12 md:h-12 rounded-full object-cover"
            /> */}
            <span className="hidden md:flex flex-col">
              <Title
                size="xs"
                className="text-left"
              >
                {user.usuarioNome}
              </Title>
              <Subtitle
                size="xs"
                className="text-left"
              >
                {user.usuarioEmail}
              </Subtitle>
            </span>
            <LuChevronDown className="w-6 h-6 hidden md:block" />
          </div>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="flex flex-col bg-white shadow rounded-[8px] dark:bg-gray-750 text-gray-700 dark:text-gray-300 w-[270px] mt-2 p-2 gap-1 dark:border dark:border-gray-600" sideOffset={5} side='bottom' align='end'>
            <div
              className='flex items-center gap-4 transition-colors duration-300 py-2 px-4 hover:bg-gray-300 hover:text-gray-700 rounded cursor-pointer'
              onClick={() => {
                Cookies.remove('user-auth')
                 Cookies.remove('user-area')
                setTimeout(() => {
                  router.push("/")
                }, 300);
              }}
            >
              <RxExit className='w-5 h-5' />
              Sair
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  )
}