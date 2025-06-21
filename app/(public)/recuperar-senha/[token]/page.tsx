'use client'
import { Title } from '@/components/Title'
// import logo from '../../../../public/logo.png'
// import redefinir from '../../../../public/redefinirSenha/redefinir.svg'
import { Subtitle } from '@/components/Subtitle'
import { useState } from 'react'
import { Form } from './form'
import Image from 'next/image'
import Loading from './transition'

export default function Home({ params }: { params: { token: string } }) {

  const [logged, setLogged] = useState(false)

  return (
    <>
      <div className="absolute top-0 bottom-0 right-0 left-0 bg-login opacity-95" />
      <main className="flex absolute min-h-screen flex-1 w-screen items-center">

        {/* carrossel container */}
        <div className="hidden flex-col md:flex flex-1 h-full items-center justify-center md:px-16 lg:px-24">
          <div className="static z-10 flex flex-col gap-4 items-center justify-center">
            {/* <Image
              src={redefinir.src}
              width={500}
              height={500}
              alt="Vamos redefinir sua senha"
              className='mx-auto w-[300px] object-cover transition-all duration-200'
            /> */}
            <Title size='lg' className='text-center text-white'>
              Vamos redefinir sua senha.
            </Title>
            <p
              className="text-white w-full transition-all duration-200 text-center font-normal text-base"
            >
              Estamos quase lá! Só precisamos redefinir sua nova senha, e você terá acesso ao Backoffice.
            </p>
          </div>
        </div>

        {/* login container */}
        <div className="flex justify-center w-[100vw] md:w-[50vw] h-full bg-login md:bg-none-image md:bg-white items-center">
          <div className="flex w-[95vw] sm:w-3/4 md:w-full justify-center flex-col h-screen bg-white md:bg-transparent rounded shadow-lg md:rounded-none md:shadow-none gap-8 px-8 py-8 md:py-0 md:px-16 lg:px-24 tall:scale-[0.85]">
            {/* <Image
              className="w-[120px]"
              src={logo.src}
              width={logo.width}
              height={logo.height}
              alt="Logo do sistema"
            /> */}
            <div className="flex w-full flex-col gap-2">
              <Title
                bold='800'
              >
                Redefinir senha
              </Title>
              <Subtitle>
                Observe os requisitos para redefinir sua nova senha.
              </Subtitle>
            </div>
            <Form
              setLogged={setLogged}
              id={params.token}
            />
          </div>
        </div>

        {logged && (
          <Loading />
        )}
      </main>
    </>
  )
}
