'use client'
import { motion } from 'framer-motion';
import logo from "../../../../public/Logo.svg";
import Image from 'next/image';
import { Title } from '@/components/Title';
import { Subtitle } from '@/components/Subtitle';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';

export default function Loading() {

  const router = useRouter()

  return (
    <>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed z-[100] top-0 right-0 bottom-0 flex flex-col gap-8 items-center justify-center left-0 bg-white bg-cover"
      >
        <div className="flex flex-col gap-8 items-center justify-center max-w-xs sm:max-w-[400px]">
          <Image src={logo} height={500} width={500} alt="Logo do sistema" className='w-[100px] md:w-[200px] static z-10' />
          <div className="flex w-full text-center flex-col gap-2 items-center justify-center">
            <Title>
              Instruções para redefinição de
              senha enviada com sucesso.
            </Title>
            <Subtitle>
              Confira seu e-mail para redefinir sua senha.
            </Subtitle>
          </div>
          <Button
            testID='voltar'
            className='w-full'
            onClick={() => router.push('/')}
          >
            Voltar ao Login
          </Button>
        </div>
      </motion.div>
    </>
  )
}