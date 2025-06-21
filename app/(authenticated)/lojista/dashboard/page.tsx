"use client";

import { Header } from "@/components/Header";
import { AiOutlinePlus } from "react-icons/ai";
import { Divisor } from "@/components/Divisor";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { QueryClient, useMutation, useQuery, useQueryClient } from "react-query";
import api from "@/lib/api";
import { Dialog } from "@/components/dialog";
import Alert from "@/components/alert";
import { useDialog } from "@/components/dialog/useDialog";
import useAlert from "@/components/alert/useAlert";
import { LuArchive } from "react-icons/lu";
import { TableArquitetosList } from "./components/Table";
import Carousel from "@/components/carrousel";
import {  PromoCard } from "@/app/(authenticated)/lojista/dashboard/components/card";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import moment from 'moment'
import img from "../../../../public/download.jpeg"

const queryBackofficeProvider = new QueryClient();
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Title } from "@/components/Title";
import { MdOutlineLocalOffer } from "react-icons/md";
export interface Arquitetos {
  id: number
  nome: string;
  imagemPerfil: string;
  telefone: string;
  cpf: string;
  cep: string;
  cidade: string;
  estado: string;
  cau: string;
  email: string;
  endereco: string;
  status: 'Ativo' | 'Inativo';
}

export default function ArquitetoPage() {
  const router = useRouter();
  const { dialog, hideDialog } = useDialog();
  const { alert, showAlert, hideAlert } = useAlert();

  const queryClient = useQueryClient()

  const queryFilters: any =
    queryBackofficeProvider.getQueryData("GetArquitetosListing");

  const [page, setPage] = useState(
    queryFilters?.page ? (queryFilters?.page! as number) : 1
  );
  const [limit, setLimit] = useState(
    queryFilters?.limit ? (queryFilters?.limit! as number) : 5
  );
  const [count, setCount] = useState(queryFilters?.count || 0);
  const [sorting, setSorting] = useState({
    field: queryFilters?.field ? (queryFilters?.field! as string) : "id",
    direction: queryFilters?.direction
      ? (queryFilters?.direction! as string)
      : "desc",
  });

  const [filter, setFilter] = useState<{
    status: string;
  }>(
    queryFilters?.filter
      ? (queryFilters?.filter! as any)
      : {
          status: "ativo",
        }
  );

  const [name, setName] = useState(queryFilters?.name || "");


   const { data, isLoading, refetch } = useQuery({
    queryKey: ['get-arquitetos', page, limit, sorting.field, sorting.direction, name, filter],
    queryFn: async () => {
      const { data } = await api.get(`/Promocao`);
      
      setCount(data.data.total);
      return data.data.data as Arquitetos[];
    },
    
  });


  console.log("aaa",data)

  data && data.map((item:any)=>{
     
  })

 

  const { mutate: ativar } = useMutation({
    mutationFn: async (id: number) => {
      await api.get(`/Promocao`);
    },
  });
/*
  function updateStatus(userId: number, status: string){

    const cached = queryClient.getQueriesData<Arquitetos[]>({
        queryKey: ['get-arquitetos']
    })

    cached.forEach(([cacheKey, cacheData]) => {
        if(!cacheData){
            return
        }

        console.log(cacheKey, cacheData)

        queryClient.setQueryData(cacheKey, {
            ...cacheData,
            aquitetos: cacheData.map((user) => {
                if(user.id === userId){
                    return {
                        ...user,
                        status
                    }
                }

                return user
            })
        })
    })
  }*/



  return (
    <main className="flex flex-col gap-4 items-center">
      <Header
        title={{
          children: "Dashboard",
        }}
        // subtitle={{
        //   children: "Listagem",
        // }}
        icon={<LuArchive className="w-6 h-6" />}
        // button={{
        //     testID: "addPontuacao",
        //     children: (
        //       <>
        //         <AiOutlinePlus className="w-6 h-6" />
        //         Adicionar Pontuação
        //       </>
        //     ),
        //     onClick: () => router.push("/lojista/dashboard/cadastrar"),
        // }}
      />
      <Divisor />

      {/* <Carousel images={images} /> */}

      <div className="flex">
        <div className="dark:bg-[#2C3441] bg-[#FFFFFF] p-4 rounded-2xl ">
          <div className="grid grid-cols-1 gap-4">

            <div className="mb-4 flex items-center justify-start gap-4 mt-4">
              <MdOutlineLocalOffer className="text-[24px] ml-4"/>
              <Title>Prêmios Ativos</Title>
            </div>
            <Swiper
              slidesPerView={4}
              spaceBetween={20}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              loop={true}
              modules={[Autoplay]}
              className="w-full"
              breakpoints={{
                1: {
                  slidesPerView: 1,
                },
                640: {
                  slidesPerView: 2,
                },
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
                1280: {
                  slidesPerView: 4,
                },
                1400: {
                  slidesPerView: 5,
                },
              }}
            >
             {data && data.length > 0 && data.map((item: any) => (
              item.banners.map((banner: any) => (
                <SwiperSlide key={banner.id}>
                  <PromoCard
                    id={item.id}
                    url={banner.arquivo}
                    title={item.nome}
                    subtitle={item.descricao}
                    promoEndDate={moment(item.datafim).format("DD/MM/YYYY")}
                    tag={item.pontuacao}
                  />
                </SwiperSlide>
              ))
            ))}
            </Swiper>
          </div>
        </div>
      </div>
    

      <Dialog dialog={dialog} hideDialog={hideDialog} />
      <Alert alert={alert} hideAlert={hideAlert} />

    </main>
  );
}
