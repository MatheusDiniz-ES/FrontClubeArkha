"use client";
import { Header } from "@/components/Header";
import { Divisor } from "@/components/Divisor";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import api from "@/lib/api";
import Alert from "@/components/alert";
import useAlert from "@/components/alert/useAlert";
import {
  MdCheck,
  MdDeviceHub,
  MdErrorOutline,
  MdOutlineDownloading,
} from "react-icons/md";
import { HiOutlinePencil } from "react-icons/hi";
import { Title } from "@/components/Title";
import { Subtitle } from "@/components/Subtitle";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import DecimalInput, { Input, MaskInput } from "@/components/Input";
import { useDialog } from "@/components/dialog/useDialog";
import { Dialog } from "@/components/dialog";
import { LuArchive } from "react-icons/lu";
import { AxiosError } from "axios";
import { ErrorApi } from "@/lib/utils";
import { MyDropzoneFiles } from "@/components/dropzone";

import 'react-quill/dist/quill.snow.css';
import dynamic from "next/dynamic";
import { Button } from "@/components/Button";
import { Trash } from "lucide-react";
import { MultiSelectize } from "@/components/MultiSelectize";
import { Lojistas } from "../../../lojistas/page";
import { BsFileEarmarkWord, BsFilePdf } from "react-icons/bs";
import SubtitleTruncado from "./components/convertHtml";
import moment from "moment";
import Carousel from "./components/carrousel";
// import { Lojistas } from "../../lojistas/page";

const QuillNoSSRWrapper = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Carregando editor...</p>,
});


interface Selected {
  text: string
  value: string
}[]

interface PromocaoSendRequest {
  NamePromotion: string
  Descricao: string
  DataInicio: string
  DataFim: string
  pontuacaoValida: number;
}

interface Promocao {
  id: string;
  nome: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  lojas?: { value: string }[];
  banners?: { value: string }[];
  documentos?: { value: string }[];
  pontuacao: number;
}

export default function EditPromocoesPage({
  params,
}: {
  params: { id: string };
}) {
  const [file, setFile] = useState<File[] | null>(null);
  const [file64, setFile64] = useState<string[]>([]);



  const [documentos, setDocumentos] = useState<File[] | null>(null);
  const [documentos64, setDocumentos64] = useState<string[]>([]);
  console.log(documentos64)
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [selectsLojistas, setSelectsLojistas] = useState<Selected[]>([])


  const [fileVerificacao, setFileVerificacao] = useState<string[]>([]);

  const [documentosVerificacao, setDocumentosVerificacao] = useState<string[]>([]);

  const [descricao, setDescricao] = useState('')
  const [nome, setNome] = useState('')
  const [dataInicio,setDataInicio] = useState('')
  const [dataFim,setDataFim] = useState('')
  const [pontuacao, setPontuacao] = useState<number>()


  const { alert, showAlert, hideAlert } = useAlert();
  const { dialog, showDialog, hideDialog } = useDialog();
  const router = useRouter();

  const [editable, setEditable] = useState(false);

  const handleFileChange = async (files: File[]) => {
    const base64Promises = files.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
        reader.readAsDataURL(file);
      });
    });

    try {
      const base64List = await Promise.all(base64Promises);
      setFile64(base64List);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDocumentosChange = async (files: File[]) => {
    const base64Promises = files.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
        reader.readAsDataURL(file);
      });
    });

    try {
      const base64List = await Promise.all(base64Promises);
      setDocumentos64(base64List);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (documentos) {
      handleDocumentosChange(documentos as File[])
    }
  }, [documentos])

  useEffect(() => {
    if (file) {
      handleFileChange(file as File[])
    }
  }, [file])


  useEffect(() => {
    if (documentos) {
      handleDocumentosChange(documentos as File[])
    }
  }, [documentos])

  useEffect(() => {
    if (typeof document !== 'undefined') {
      setEditorLoaded(true);
    }
  }, []);



  const { } = useQuery({
    queryKey: ["getInfo", params.id],
    queryFn: async () => {
      const { data } = await api.get<{
        data: Promocao;
      }>(`/Promocao/${params.id}`);
      return data.data;
    },
    onSuccess(value) {

      setNome(value.nome)
      setDescricao(value.descricao)
      setDescricao(value.descricao)
      setDataInicio(value?.dataInicio.split("T")[0] || '')
      setDataFim( value.dataFim.split("T")[0] || '')
      setSelectsLojistas((value.lojas || []).map((item: any) => ({
        value: item.empresaId,
        text: item.nomeEmpresa
      })))
      setPontuacao(value.pontuacao);
      setFile64(value.banners?.map((item: any) => item.arquivo) || [])
      setFileVerificacao(value.banners?.map((item: any) => item.arquivo) || [])
      setDocumentos64(value.documentos?.map((item: any) => item.documento) || [])
      setDocumentosVerificacao(value.documentos?.map((item: any) => item.documentos) || [])

    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

   const formatTitle = ({title}: any)=>{
    const limitTitle = title && title.length > 30 ? title.slice(0,30) + "..." : title 
    const titleFormat = limitTitle.charAt(0).toUpperCase() + limitTitle.slice(1)
    return titleFormat;
   }


  return (
    <main className="flex flex-col gap-4 items-center">
      <Header
        title={{
          children: '',
        }}
        breadCrumbs={{
          items: [
            {
              label: "Prêmios",
              url: "/lojista/dashboard",
            },
            {
              label: "Visualização Interna",
              url: "",
            },
          ],
        }}
        icon={<LuArchive className="w-6 h-6" />}
        secondButton={{
          testID: "cancel",
          children: editable ? <>Cancelar</> : <>Voltar</>,
          type: "secondary",
          onClick: editable
            ? () => setEditable(false)
            : () => router.push("/lojista/dashboard"),
        }}
      />
      <Divisor />
      <div className="w-full flex flex-col gap-4 bg-white dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-600 ">
        <div className="flex w-full p-8 rounded-lg">
            {file64?.length > 0 ? (
                  <Carousel
                    images={file64.map((file, idx) => ({
                      id: idx,
                      src: file,
                      alt: `preview-${idx}`
                    }))}
                  />
            ) : (
              <div className="flex justify-start items-center w-full z-0">
                <p className="text-[#BF9006] font-bold">
                  Não há fotos selecionadas
                </p>
              </div>
            )}
        </div>
        <div className="flex w-full justify-between items-center px-8">
          <Title bold="800">{nome.charAt(0).toUpperCase() + nome.slice(1)}</Title>
          <p className="text-sm font-bold">Duração: {moment(dataInicio).format("DD/MM/YYYY")} Até {moment(dataFim).format("DD/MM/YYYY")}</p>
        </div>
        <div className="gap-4 w-full flex flex-col ">
          <div className="flex w-full justify-start ">
              
              <div className="flex flex-col w-full justify-start items-center ">
                  <div className="flex flex-col justify-start p-8">
                    <Title bold="800" className="pb-4">Descrição</Title>
                    <SubtitleTruncado className="text-sm w-full opacity-90 font-semibold text-[20px] text-justify" subtitle={descricao} />
                  </div>
                  
              </div>

              
              <div className="flex flex-col w-full justify-start items-center">
                <div className="flex flex-col justify-start w-full p-8">
                  <Title bold="800" className="pb-4">Documentos</Title>
                  <a href={documentos64[0]} download>
                    <Button
                      testID="baixar documento"
                      children="Baixar Documentos"
                    ></Button>
                  </a>
                </div>
              </div>

          </div>
        </div>
      </div>
      <Alert alert={alert} hideAlert={hideAlert} />
      <Dialog dialog={dialog} hideDialog={hideDialog} />
    </main>
  );
}
