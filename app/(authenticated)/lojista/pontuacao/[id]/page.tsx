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
import DecimalInput, { Input, MaskInput, NumberInput } from "@/components/Input";
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
import { Lojistas } from "../../lojistas/page";
import { Select } from "@/components/Select";
import { useUser } from "@/stores/user";
import { BsFileEarmarkWord, BsFilePdf } from "react-icons/bs";
import moment from "moment";

const QuillNoSSRWrapper = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Carregando editor...</p>,
});


const schema = yup.object({
  pontuacaoValida: yup.number().required("Pontuação é Necessaria"),
  usuarioId: yup.number().required("Loja é Necessaria"),
  empresaId: yup.number().required("Arquiteto é Necessaria"),
  anexo: yup.string(),
  dataVenda:yup.string().required("Data da venda é Necessaria"),
  nomeCliente: yup.string().required('Nome do cliente é Obrigatorio')
});

interface Selected {
  text: string
  value: string
}[]



interface pontuacao {
  usuarioId: number,
  empresaId: number,
  valorPontuacao: number,
  anexo: string
  valor: number
  dataVenda: string
  nomeCliente: string;
}

export default function EditPromocoesPage({
  params,
}: {
  params: { id: string };
}) {
  const [file, setFile] = useState<File[] | null>(null);
  const [file64, setFile64] = useState<string[]>([]);
  const [pontuacao, setPontuacao] = useState<number | null>(null);
  const [documentos, setDocumentos] = useState<File[] | null>(null);
  const [documentos64, setDocumentos64] = useState<string[]>([]);

  const [editorLoaded, setEditorLoaded] = useState(false);
  const [selectsLojistas, setSelectsLojistas] = useState<Selected[]>([])
  const [arquiteto, setArquiteto] = useState<number | undefined>();
  const [empresa,setEmpresa] = useState<number | undefined>()
  const [fileVerificacao, setFileVerificacao] = useState<string[]>([]);
  const [valorPontuacao,setValorPontuacao] = useState<number | null>(null)
  const [documentosVerificacao, setDocumentosVerificacao] = useState<string[]>([]);
  const user = useUser((e)=> e.user)
  const [pontosConvertidos, setPontosConvertidos] = useState<number | null>(null)



  const { alert, showAlert, hideAlert } = useAlert();
  const { dialog, showDialog, hideDialog } = useDialog();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
    reset,
    watch,
    control
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [editable, setEditable] = useState(false);



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


  const {data: dataLojista } = useQuery({
    queryKey:['lojista'],
    queryFn: async () => {
      const { data } = await api.get(`/lojista/${user.empresaId}`)
      setValue("empresaId", data.data.id)
      return data.data
    },
  })
  console.log("aqui2",  dataLojista);

   const {data: dataArquiteto } = useQuery({
    queryKey:['Arquiteto'],
    queryFn: async () => {
      const { data } = await api.get(`/Arquiteto`)
      return data.data.data
    },
  })


  const onSubmit = async (values: any) => save(values);

  const {data } = useQuery({
    queryKey: ["getInfo", params.id],
    queryFn: async () => {
      const { data } = await api.get<{
        data: pontuacao;
      }>(`/Pontuacao/${params.id}`);
      return data.data;
    },
    onSuccess(value) {
      setValue('usuarioId', value.usuarioId)
      setValue('empresaId', value.empresaId)
      setValue("pontuacaoValida", value.valorPontuacao);
      setValue('dataVenda', moment(value.dataVenda).format("YYYY-MM-DD"))
      setDocumentos64([value.anexo])
      setDocumentosVerificacao([value.anexo])
      setArquiteto(value.usuarioId)
      setPontuacao(value.valor)
      setEmpresa(value.empresaId)
      setPontosConvertidos(value.valorPontuacao)
      setValorPontuacao(value.valor)
      setValue("nomeCliente", value.nomeCliente ?? "")

    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

    
  

  const { mutate: save, isLoading: sending } = useMutation({
    mutationFn: async (values: pontuacao) => {
      await api.put(`/Pontuacao`, {
        id: Number(params.id),
        usuarioId: Number(values.usuarioId),
        empresaId: Number(values.empresaId),
        valorPontuacao: pontosConvertidos,
        anexo:  documentos64[0] ===  documentosVerificacao[0] ? undefined :  documentos64[0],
        valor:  valorPontuacao,
        dataVenda: values.dataVenda,
        nomeCliente: values.nomeCliente
      });
    },
    onSuccess() {
      showAlert({
        title: "Edição concluída com sucesso!",
        description: "A edição do Prêmio foi concluída com êxito.",
        type: "success",
      });
      setEditable(false);
    },
    onError(error: AxiosError<ErrorApi>) {
      showAlert({
        title: "Ops, algo deu errado!",
        description: "A edição não pode ser concluída",
        type: "error",
      });
    },
  });

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

  useEffect(() => {
    if(valorPontuacao){
      const pontos = valorPontuacao / 1000 
        const convertidos = Number(pontos.toFixed(2));
      setPontosConvertidos(convertidos)
    }
  }, [valorPontuacao]);



  return (
    <main className="flex flex-col gap-4 items-center">
      <Header
        title={{
          children: '',
        }}
        breadCrumbs={{
          items: [
            {
              label: "Pontuação",
              url: "/pontuação/Detalhes",
            },
            {
              label: "Visualização Interna",
              url: "",
            },
          ],
        }}
        icon={<LuArchive className="w-6 h-6" />}
        button={{
          testID: "edit",
          children: editable ? (
            <>
              <MdCheck className="w-5 h-5" />
              Salvar Alterações
            </>
          ) : (
            <>
              <HiOutlinePencil className="w-5 h-5" />
              Editar Informações
            </>
          ),
          onClick: editable ? handleSubmit(onSubmit) : () => setEditable(true),
          loading: sending,
        }}
        secondButton={{
          testID: "cancel",
          children: editable ? <> Cancelar </> : <>Voltar </>,
          type: "secondary",
          onClick: editable
            ? () => setEditable(false)
            : () => router.push("/lojista/pontuacao"),
        }}
      />
      <Divisor />
      <div className="w-full flex flex-col gap-4 bg-white dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-600 p-8 tall:p-4">
        <div className="flex flex-col gap-0">
          <Title bold="800">Dados Principais</Title>
          <Subtitle size="xs">A informações principais da pontuação</Subtitle>
        </div>
        <div className="flex space-x-3 items-center flex-wrap md:flex-nowrap justify-center">

          <div className="gap-4 w-full space-y-5">
            <div className="flex flex-wrap gap-4 ">

              <Select
                testID="arquiteto"
                label="Arquiteto"
                options={dataArquiteto && dataArquiteto.length > 0 && dataArquiteto.map((item: any) => ({
                  value: item.id,
                  label: item.nome,
                  text: item.nome
                }))}
                select={{
                  disabled: !editable,
                  value: arquiteto,
                  onChange: (e) => {
                    setArquiteto(Number(e.target.value))
                    setValue("usuarioId", Number(e.target.value))
                  },
                }}
              />
              <Select
                testID="loja"
                label="Loja"
                options={[
                  {
                    value: dataLojista ? dataLojista.id : "",
                    text: dataLojista ? dataLojista.nomeFantasia : ""
                  }
                ]}
                select={{
                  value: empresa ,
                  disabled: true,
                  onChange: (e) => {
                    setValue("empresaId",Number( e.target.value))
                    // setEmpresa(Number(e.target.value))
                  },
                }}
              />
              <Input
                    inputFieldProps={{
                      testID: "nomeCliente",
                      label: "Nome do Cliente",
                      input: {
                        ...register("nomeCliente"),
                        placeholder: "Insira o nome do Cliente",
                      },
                    }}
                    errorMessage={(errors.nomeCliente?.message as string) || undefined}
                    className="flex-1 min-w-[250px]"
                  />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <NumberInput
                    inputFieldProps={{
                      testID: "",
                      label: "Valor Pontuação",
                      input: {
                        ...register('pontuacaoValida'),
                        value: pontuacao,
                        placeholder: "Informe o valor da pontuação",
                        thousandSeparator: ".",
                        decimalScale: 2,
                        decimalSeparator: ",",
                        prefix: "R$",
                        disabled: !editable,
                        onChange: (e) => {
                          let valueString = e.target.value;
                            
                          // Remove prefixo "R$" se presente
                          if (valueString.startsWith("R$")) {
                            valueString = valueString.substring(2).trim();
                          }
                          // Remove separadores de milhar e substitui a vírgula por ponto
                          valueString = valueString.replace(/\./g, '').replace(',', '.');

                          // Converte para número
                          const value = Number(valueString);
                            setPontuacao( value)
                            setValue("pontuacaoValida",  value)
                             setValorPontuacao(value)
                          // console.log('Processed valueString:', valueString); 
                          // console.log('Converted value:', value); 

                        
                        }
                      },
                    }}
                    errorMessage={errors.pontuacaoValida?.message}
                  />
                  <Input
                    inputFieldProps={{
                      testID: "dataVenda",
                      label: "Data da Venda",
                      input: {
                        ...register("dataVenda"),
                        placeholder: "Insira a data da venda",
                        type: "date",
                        onChange: (e) => setValue("dataVenda",e.target.value),
                        disabled: !editable
                      },
                    }}
                    errorMessage={(errors.dataVenda?.message as string) || undefined}
                    className="flex-1 min-w-[250px]"
                  />
              

              <div className=" flex-col flex">
                <div className="flex flex-col mb-1">
                  <Title 
                  size='xs'
                  bold='normal'>
                    Documentos
                  </Title>
                </div>
                <div className="flex gap-4 mb-4">
                  <MyDropzoneFiles
                    typeFiles={5}
                    saveMultpleFile={setDocumentos}
                    disabled={false}
                    mutiple={true}
                  >
                    <Button testID="selectFiles">
                      <MdOutlineDownloading className="w-7 h-7 rotate-180" />
                      <p className="font-bold">
                        Selecione Anexo
                      </p>
                    </Button>
                  </MyDropzoneFiles>
                </div>
                <div className="w-full h-auto flex gap-2">
                  {documentos64?.length > 0 ? (
                    documentos64.map((file, index) => (
                        <div className="w-28 h-28  rounded-lg relative" key={index}>
                            <div
                                onClick={() => {
                                    const newFiles = [...documentos64];
                                    newFiles.splice(index, 1);
                                    setDocumentos64(newFiles);
                                }}
                                className="absolute top-2 right-2 bg-red-600 w-7 h-7 rounded-full flex justify-center items-center cursor-pointer">
                                <Trash
                                    size={20}
                                    className="text-black"
                                />
                            </div>
                            
                            {file && (
                            <>
                                {file.endsWith('.pdf') ? (
                                <a href={file} download>
                                  <BsFilePdf className="w-full h-full text-red-600" size={64} />
                                </a> 
                                ) : file.endsWith('.doc') || file.endsWith('.docx') ? (
                                <a href={file} download>
                                  <BsFileEarmarkWord className="w-full h-full text-blue-600" size={64} />
                                </a>
                                ) : /\.(jpe?g|png|gif|webp|svg)$/i.test(file) ? (
                                <a href={file} download>
                                  <img
                                      key={index}
                                      src={file}
                                      className="w-full h-full object-cover rounded-[10px]"
                                      alt={`preview-${index}`}
                                  />
                                </a>
                                ) : null}
                            </>
                            )}
                            {documentos && documentos[index] && (
                            <>
                                { 
                                    documentos[index].type === "application/pdf" ? (
                                  <a href={file} download>
                                    <BsFilePdf className="w-full h-full text-red-600" size={64} />
                                  </a>
                                ) : (
                                    documentos[index].type === "application/msword" ||
                                    documentos[index].type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                                    documentos[index].name?.toLowerCase().endsWith(".doc") ||
                                    documentos[index].name?.toLowerCase().endsWith(".docx")) ? (
                                    <a href={file} download>
                                      <BsFileEarmarkWord className="w-full h-full text-blue-600" size={64} />
                                    </a>
                                ) : (
                                  <a href={file} download>
                                    <img
                                        key={index}
                                        src={file}
                                        className="w-full h-full object-cover rounded-[10px]"
                                        alt={`preview-${index}`}
                                    />
                                  </a>
                                )}
                            </>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="flex justify-start items-center w-full h z-0">
                        <p className="text-[#BF9006] font-bold">
                            Não há fotos selecionadas
                        </p>
                    </div>
                )}
                </div>
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
