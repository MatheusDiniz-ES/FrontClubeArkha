'use client'
import { Header } from "@/components/Header";
import { Divisor } from "@/components/Divisor";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import api from "@/lib/api";
import Alert from "@/components/alert";
import useAlert from "@/components/alert/useAlert";
import { MdCheck, MdCheckCircle, MdErrorOutline, MdOutlineDownloading } from "react-icons/md";
import { Title } from "@/components/Title";
import { Subtitle } from "@/components/Subtitle";
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import DecimalInput, { Input, MaskInput, NumberInput } from "@/components/Input";
import { useDialog } from "@/components/dialog/useDialog";
import { Dialog } from "@/components/dialog";
import { LuArchive } from "react-icons/lu";
import { MyDropzoneFiles } from "@/components/dropzone";
import { Select } from "@/components/Select";
import { ESTATES } from "@/lib/states";
import { Trash } from "lucide-react";
import { Button } from "@/components/Button";
import { useUser } from "@/stores/user";
import { BsFileEarmarkWord, BsFilePdf } from "react-icons/bs";


const schema = yup.object({
  pontuacaoValida: yup.number().required("Pontuação é Necessaria"),
  usuarioId: yup.string().required("Loja é Necessaria"),
  empresaId: yup.string().required("Arquiteto é Necessaria"),
  anexo: yup.string(),
  dataVenda: yup.string().required("Data da Venda é Necessaria"),
  // ("Anexo é Necessaria")
  nomeCliente: yup.string().required("Nome do Cliente é obrigatorio")
});

interface GetResponseIntegracaoCEP {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

interface pontuacao {
  usuarioId: string;
  empresaId: string;
  valorPontuacao: number;
  anexo: string;
  dataVenda: string;
  nomeCliente: string;
}


export default function CadastroArquiteto() {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profile64, setProfile64] = useState('');
  const [pontuacao, setPontuacao] = useState<number | null>(null);
  const [documentos, setDocumentos] = useState<File[] | null>(null);
  const [documentos64, setDocumentos64] = useState<string[]>([]);
  const { alert, showAlert, hideAlert } = useAlert();
  const { dialog, showDialog, hideDialog } = useDialog();
  const [id, setId] = useState<number | undefined>();
  const [arquiteto, setArquiteto] = useState<string | undefined>();
  const router = useRouter()
  const [empresa ,setEmpresa] = useState<string | null>(null)
  const [editable,setEditable] = useState(true)
  const [valorPontuacao,setValorPontuacao] = useState<number | null>(null)
  const [pontosConvertidos, setPontosConvertidos] = useState<number | null>(null)
  const { register, handleSubmit, control, formState: { errors, isSubmitting }, setValue, reset, watch } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (values: any) => save(values)

  const user = useUser((e)=> e.user);

  console.log(user)


  const { mutate: save, isLoading: sending } = useMutation({
    mutationFn: async (values: pontuacao) => {
      const payload = {
        usuarioId: Number(values.usuarioId),
        empresaId: Number(values.empresaId),
        valorPontuacao: pontosConvertidos,
        anexo: documentos64[0],
        valor: pontuacao,
        dataVenda: values.dataVenda,
        nomeCliente: values.nomeCliente
      }
      console.log(payload)
      await api.post('/Pontuacao', payload)
    },
    onSuccess() {
      showDialog({
        isOpen: true,
        setIsOpen: () => '',
        icon: <MdCheckCircle className="w-4 h-4" />,
        title: 'Cadastro concluída com sucesso!',
        subtitle: 'O cadastro da Pontuação foi concluído com êxito.',
        button: {
          testID: 'ok',
          children: 'Ok',
          onClick: () => router.push('/lojista/pontuacao')
        }
      })
    },
    onError() {
      showAlert({
        title: 'Ops, algo deu errado!',
        description: 'O cadastro não pode ser concluído',
        type: 'error'
      })
    }
  })


  const {data: dataLojista } = useQuery({
    queryKey:['lojista'],
    queryFn: async () => {
      const { data } = await api.get(`/Lojista/${user.empresaId}`)
      setValue("empresaId", data.data.id)
      return data.data
    },
  })


   const {data: dataArquiteto } = useQuery({
    queryKey:['Arquiteto'],
    queryFn: async () => {
      const { data } = await api.get(`/Arquiteto`)

      return data.data.data
    },
  })
  


  // const { } = useQuery({
  //   queryKey: ['get-integracao-cep'],
  //   queryFn: async () => {
  //     const { data } = await api.get(`/Integracao/CEP/${watch('CEP')?.replace(/-/g, '')}`)
  //     return data.data as GetResponseIntegracaoCEP
  //   },
  //   enabled: watch('CEP') ? true : false,
  //   onSuccess: (response) => {
  //     setValue("Cidade", response.localidade)
  //     setValue("Estado", response.uf)
  //     setValue("Endereco", response.bairro)
  //   },
  //   onError: () => {
  //     setValue("Cidade", '')
  //     setValue("Estado", '')
  //     setValue("Endereco", '')
  //   }
  // })

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
    if (valorPontuacao) {
      const pontos = valorPontuacao / 1000;
      const convertidos = Number(pontos.toFixed(2));
      setPontosConvertidos(convertidos);
      console.log("Enviando:", convertidos);
    }
  }, [valorPontuacao]);


  return (
    <main className="flex flex-col gap-4 items-center">
      <Header
        title={{
          children: "Detalhes do Prêmio",
        }}
        breadCrumbs={{
          items: [
            {
              label: "Dashboard",
              url: "/lojista/pontuacao",
            },
            {
              label: "Detalhes",
              url: "",
            },
          ],
        }}
        icon={<LuArchive className="w-6 h-6" />}
        button={{
          testID: "add",
          children: (
            <>
              <MdCheck className="w-5 h-5" />
              Confirmar Cadastro
            </>
          ),
          onClick: () => handleSubmit(onSubmit)(),
          loading: sending,
        }}
        secondButton={{
          testID: "cancel",
          children: <>Voltar</>,
          type: "secondary",
          onClick: () => router.push("/lojista/pontuacao"),
        }}
      />
      <Divisor />
      <div className="w-full flex flex-col gap-4 bg-white dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-600 p-8 tall:p-4">
        <div className="flex flex-col gap-0">
          <Title bold="800">Dados Principais</Title>
          <Subtitle size="xs">A informações principais do prêmio</Subtitle>
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
                  // // disabled: !editable,
                  value: arquiteto,
                  onChange: (e) => {
                    setValue("usuarioId", e.target.value)
                     setArquiteto(e.target.value)
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
                  value: user.empresaId, // empresaId,
                  disabled: editable,
                  onChange: (e) => {
                    setValue("empresaId", e.target.value)
                    setEmpresa(e.target.value)
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
                                <BsFilePdf className="w-full h-full text-red-600" size={64} />
                                ) : file.endsWith('.doc') || file.endsWith('.docx') ? (
                                <BsFileEarmarkWord className="w-full h-full text-blue-600" size={64} />
                                ) : /\.(jpe?g|png|gif|webp|svg)$/i.test(file) ? (
                                <img
                                    key={index}
                                    src={file}
                                    className="w-full h-full object-cover rounded-[10px]"
                                    alt={`preview-${index}`}
                                />
                                ) : null}
                            </>
                            )}
                            {documentos && documentos[index] && (
                            <>
                                { 
                                    documentos[index].type === "application/pdf" ? (
                                    <BsFilePdf className="w-full h-full text-red-600" size={64} />
                                ) : (
                                    documentos[index].type === "application/msword" ||
                                    documentos[index].type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                                    documentos[index].name?.toLowerCase().endsWith(".doc") ||
                                    documentos[index].name?.toLowerCase().endsWith(".docx")) ? (
                                    <BsFileEarmarkWord className="w-full h-full text-blue-600" size={64} />
                                ) : (
                                    <img
                                        key={index}
                                        src={file}
                                        className="w-full h-full object-cover rounded-[10px]"
                                        alt={`preview-${index}`}
                                    />
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
