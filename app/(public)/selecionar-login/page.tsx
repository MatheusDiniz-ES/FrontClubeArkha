'use client'
import { Title } from '@/components/Title'
import { Subtitle } from '@/components/Subtitle'
import { LuMonitor } from 'react-icons/lu'
import { useUser } from '@/stores/user'
import { AccessTitle } from './components/accessTitle'
import { AccessItem } from './components/accessItem'
import { useState } from 'react'
import Loading from './components/transition/loading'
import { motion } from 'framer-motion';
import { useAccessStore } from '@/stores/access'

export default function Home() {

  const access = useAccessStore((e) => e.access);

  const setUser = useUser((e) => e.setUser )

  const [area, setArea] = useState<null | {
    id?: number,
    area: string,
    cnpj?: string,
    logo?: string,
    nomefantasia?: string,
    empresaId?: any
  }>(null)

  return (
    <>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center w-screen h-screen"
      >
        <div className="absolute top-0 bottom-0 right-0 left-0 bg-[#727272] opacity-80 z-[0]" />
        <div className="flex flex-col absolute z-10 w-screen h-screen sm:w-[80vw] sm:h-[80vh] md:w-[60vw] md:h-[600px] bg-white sm:rounded-lg sm:shadow-md p-8 gap-4 xl:gap-8 overflow-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center mx-auto sm:mx-0 sm:justify-start gap-4">
            <LuMonitor className='w-6 h-6 text-gray-500' />
            <div className="flex flex-col">
              <Title>
                Selecione seu painel de acesso
              </Title>
              <Subtitle>
                Confira os painéis que você possui acesso.
              </Subtitle>
            </div>
          </div>
          {access.backoffice && (
            <>
              <AccessTitle nome="Painel Backoffice" />
              <div className="flex items-center w-full flex-wrap gap-4">
                <AccessItem
                  logo={''}
                  nome_fantasia='Ambiente Administrativo'
                  onClick={() => {
                     setUser({
                        empresaId: access.backoffice?.empresaId
                      });
                    setArea({
                      area: 'backoffice',
                      id:  access.backoffice?.id,
                      cnpj: access.backoffice?.cnpj,
                      logo: '',
                      nomefantasia: access.backoffice?.nomefantasia,
                      empresaId: access.backoffice?.empresaId
                    })

                    console.log(access.backoffice?.empresaId)
                  }}
                />
              </div>
            </>
          )}
          
          {!!access.lojistas.length && (
            <>
              <AccessTitle nome="Painel Lojista" />
              <div className="flex items-center w-full flex-wrap gap-4">
                {access.lojistas.map((lojista) => (
                  <AccessItem
                    key={lojista.id}
                    logo={lojista.logo}
                    nome_fantasia={lojista.nomefantasia || "Ambiente Lojista"}
                    cnpj={String(lojista.cnpj)}
                    onClick={() => {
                      setUser({
                        empresaId: lojista.empresaId
                      });
        
                      setArea({
                        area: 'lojista',
                        id: lojista.id,
                        cnpj: lojista.cnpj,
                        logo: lojista.logo,
                        nomefantasia: lojista.nomefantasia,
                        empresaId: lojista?.empresaId
                      })
                        console.log(lojista.empresaId)
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </motion.div>
      {area != null && (
        <Loading
          area={area}
        />
      )}
    </>
  )
}
