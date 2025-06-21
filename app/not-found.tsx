'use client'
import Image from 'next/image'
import NotFoundPhoto from '@/public/404.jpg'
import { Header } from '@/components/Header'
import { Button } from '@/components/Button'
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()
  return (
    <div className='w-screen h-screen bg-white flex items-center justify-center flex-col gap-12'>
      <Image
        alt='404 not found page'
        src={NotFoundPhoto.src}
        width={300}
        height={300}
        className='object-cover max-w-full md:max-w-[60vw] xl:max-w-[45vw] h-[40vh]'
      />
      <div className="'max-w-[90vw] sm:max-w-[350px] lg:max-w-[35vw]">
        <Header
          title={{
            children: 'Não encontramos nada por aqui!',
            bold: 'bold',
            size: 'lg',
            className: '!text-center mx-auto'
          }}
          subtitle={{
            children: 'A página não foi encontrada, tente novamente mais tarde.',
            bold: 'normal',
            size: 'md',
            className: '!text-center mx-auto'
          }}
          upperTitle
        />
      </div>
      <div
        onClick={() => {
          Cookies.remove('user-auth')
          Cookies.remove('user-area')
          setTimeout(() => {
            router.push('/')
          }, 300);
        }}
      >
        <Button
          testID='goBack'
          className='max-w-[90vw] sm:max-w-[350px] lg:max-w-[35vw]'
        >
          Voltar ao login
        </Button>
      </div>
    </div>
  )
}