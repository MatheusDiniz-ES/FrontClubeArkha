'use client'
import { Title } from '@/components/Title'
import logo from "../../../public/Logo.svg";
import esqueceuSuaSenha from '../../../public/redefinirSenha/redefinir_senha.png'
import { Subtitle } from '@/components/Subtitle'
import { useState } from 'react'
import { Form } from './form'
import { motion } from 'framer-motion';
import Image from 'next/image'
import Loading from './transition'

export default function Home() {

  const [logged, setLogged] = useState(false)

  return (
    <>
      <div className="absolute top-0 bottom-0 right-0 left-0 bg-login opacity-95" />
      <motion.main
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4 }}
        className="flex min-h-screen flex-1 w-screen items-center"
      >

        {/* carrossel container */}
        <div className="hidden flex-col md:flex flex-1 h-full items-center justify-center md:px-16 lg:px-24">
          <div className="static z-10 flex flex-col gap-4 items-center justify-center">
            <Image
              src={esqueceuSuaSenha.src}
              width={600}
              height={600}
              alt="Esqueceu sua senha?"
              className='mx-auto w-[300px] object-cover transition-all duration-200'
            />
            <Title size='lg' className='text-center text-white'>
              Receba as instruções de redefinição no seu e-mail!
            </Title>
            <p
              className="text-white w-full transition-all duration-200 text-center font-normal text-base"
            >
              Lembre-se de conferir as pastas de Spam e Lixeira.
            </p>
          </div>
        </div>

        {/* login container */}
        <div
          className="flex justify-center w-[100vw] md:w-[50vw] h-full bg-login md:bg-none-image md:bg-white items-center"
        >
          <div
            className="flex w-[95vw] sm:w-3/4 md:w-full justify-center flex-col h-screen bg-white md:bg-transparent rounded shadow-lg md:rounded-none md:shadow-none gap-8 px-8 py-8 md:py-0 md:px-16 lg:px-24 tall:scale-[0.85]"
          >
            <Image
              className="w-[300px] mx-auto"
              src={logo}
              width={500}
              height={500}
              alt="Logo do sistema"
            />
            <div className="flex w-full flex-col gap-2">
              <Title
                bold='800'
              >
                Esqueci minha senha
              </Title>
              <Subtitle>
                Insira seu e-mail para receber as instruções de redefinição.
              </Subtitle>
            </div>
            <Form
              setLogged={setLogged}
            />
          </div>
        </div>

        {logged && (
          <Loading />
        )}
      </motion.main>
    </>
  )
}
