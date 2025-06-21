import { ModalHistorico } from '@/app/(authenticated)/lojista/dashboard/components/Modal';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SubtitleTruncado from './components/convertHtml';
interface CardProps {
  url: string;
  title: string;
  subtitle: string;
  discount?: number;
  originalPrice?: string;
  promoPrice?: string;
  promoEndDate?: string;
  tag?: string;
  id?: number
}

export const PromoCard = ({ 
  url, 
  title, 
  subtitle, 
  discount, 
  originalPrice, 
  promoPrice, 
  promoEndDate,
  tag,
  id,

}: CardProps) => {


   const [modalOpen, setModalOpen] = useState(false)
   const router = useRouter();

   const formatTitle = ({title}: any)=>{
    const limitTitle = title && title.length > 30 ? title.slice(0,30) + "..." : title 
    const titleFormat = limitTitle.charAt(0).toUpperCase() + limitTitle.slice(1)
    return titleFormat;
   }
  return (
    <div className="relative w-full h-[330px] rounded-xl overflow-hidden shadow-lg group cursor-pointer transition-all duration-300 hover:shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative w-full h-full">
          <img
            src={url}
            alt={title}
            className="w-full xl:h-[60%] lg:h-[50%] md:h-[60%] h-[60%] object-cover transition-transform duration-600 group-hover:scale-110"
            loading="lazy"
          />
          {tag && (
            <div className="absolute top-4 right-4 bg-white text-black text-xs font-bold px-3 py-1 rounded-full animate-bounce duration-800">
              Pontuação Necessaria: {tag}
            </div>
          )}
        </div>

      <div className="absolute bottom-0 left-0 w-full xl:p-4  md:p-4  p-4 text-white space-y-1 h-[40%]">
        <h2 className="text-xl w-full font-bold truncate">{title ?? formatTitle(title)}</h2>
        <div className='h-auto'>
            <SubtitleTruncado className="text-sm w-full opacity-90" subtitle={subtitle} />
        </div>   

        {promoEndDate && (
          <div className="mt-2">
            <p className="text-xs opacity-80">Oferta termina em: {promoEndDate}</p>
          </div>
        )}
      </div>
      
      {/* Botão flutuante que aparece no hover */}
      <button 
        onClick={() => router.push(`/lojista/dashboard/detalhes-promocao/${id}`)}
        className="absolute inset-0 m-auto w-32 h-10 bg-white text-black font-medium rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center hover:bg-gray-100">
        Ver Prêmio
      </button>
    </div>
  );
};