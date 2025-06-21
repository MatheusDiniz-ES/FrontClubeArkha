'use client'
import { Header } from "@/components/Header";
import { Divisor } from "@/components/Divisor";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import api from "@/lib/api";
import Alert from "@/components/alert";
import useAlert from "@/components/alert/useAlert";
import { MdCheck, MdDeviceHub, MdErrorOutline, MdOutlineDownloading } from "react-icons/md";
import { GrTarget } from "react-icons/gr";
import { HiOutlinePencil } from "react-icons/hi";
import { Title } from "@/components/Title";
import { Subtitle } from "@/components/Subtitle";
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { Input, MaskInput } from "@/components/Input";
import { useDialog } from "@/components/dialog/useDialog";
import { Dialog } from "@/components/dialog";
import { LuArchive } from "react-icons/lu";

import { Arquitetos } from "../page";
import { AxiosError } from "axios";
import { ErrorApi } from "@/lib/utils";
import { Select } from "@/components/Select";
import { ESTATES } from "@/lib/states";
import { MyDropzoneFiles } from "@/components/dropzone";
import { ProgressBar } from "../components/barraPontuacao";
import { ModalHistorico } from "../components/Modal";

const schema = yup.object({
  Name: yup.string().min(3, "Insira pelo menos 3 caracteres!").max(50, "Máximo de 50 caracteres!").required("Por favor, preencha esse campo!"),
  Email: yup.string().email("Insira um e-mail válido!").required("Por favor, preencha esse campo!"),
  Telefone: yup.string(),
  CEP: yup.string(),
  CPF: yup.string(),
  CAU: yup.string(),
  Cidade: yup.string(),
  Estado: yup.string(),
  Endereco: yup.string(),
  Numero: yup.string()
}).required();

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

export default function EditArquitetoPage({ params }: { params: { id: string } }) {

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profile64, setProfile64] = useState('');
  const [imgArquiteto,setImgArquiteto] = useState("")

  const { alert, showAlert, hideAlert } = useAlert();
  const { dialog, showDialog, hideDialog } = useDialog();
  const [cep,setCep] = useState('')
  const [meta,setMeta] = useState(200)
  const [pontuacaoAtual, setPontuacaoAtual] = useState(50)
  const [modalOpen, setModalOpen] = useState(false)

  const router = useRouter()

  const { register, handleSubmit, control, formState: { errors, isSubmitting }, setError, setValue, reset, watch } = useForm({
    resolver: yupResolver(schema)
  });


  const [editable, setEditable] = useState(false)

  const pontuacaoFaltante = meta - pontuacaoAtual
  const onSubmit = async (values: any) => save(values)

  const {} = useQuery({
    queryKey: ['getInfo', params.id],
    queryFn: async () => {
      const { data } = await api.get<{data: Arquitetos}>(`/Arquiteto/${params.id}`)
      return data.data
    },
    onSuccess(value) {

      setValue('Name', value.nome)
      setValue('CPF', value.cpf)
      setValue('Email', value.email)
      setValue('Endereco', value.endereco)
      setValue('Estado', value.estado)
      setValue('Telefone', value.telefone)
      setValue('Cidade', value.cidade)
      setValue('CAU', value.cau)
      setValue('CEP', value.cep)
      setProfile64(value.imagemPerfil)
      setImgArquiteto(value.imagemPerfil)
      setCep(value.cep);
      
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  })


  const { mutate: save, isLoading: sending } = useMutation({
    mutationFn: async (values: any) => {
      await api.put(`/Arquiteto`, { 
        id: Number(params.id),
        nome: values.Name,
        imagemPerfil: profile64 == imgArquiteto ? null : profile64,
        telefone: values.Telefone,
        cpf: values.CPF,
        cep: values.CEP,
        cidade: values.Cidade,
        estado: values.Estado,
        cau: values.CAU,
        email: values.Email,
        endereco: values.Endereco,
      })
    },
    onSuccess() {
      showAlert({
        title: 'Edição concluída com sucesso!',
        description: 'A edição do arquiteto foi concluída com êxito.',
        type: 'success'
      })
      setEditable(false)
    },
    onError(error: AxiosError<ErrorApi>) {
      showAlert({
        title: 'Ops, algo deu errado!',
        description: 'A edição não pode ser concluída',
        type: 'error'
      })
    }
  })

  const { } = useQuery({
    queryKey: ['get-integracao-cep',cep ],
    queryFn: async () => {
      const { data } = await api.get(`/Integracao/CEP/${cep?.replace(/-/g, '')}`)
      return data.data as GetResponseIntegracaoCEP
    },
    enabled: watch('CEP') ? true : false,
    onSuccess: (response) => {
      setValue("Cidade", response.localidade)
      setValue("Estado", response.uf)
      setValue("Endereco", response.bairro)
    },
    onError: () => {
      setValue("Cidade", '')
      setValue("Estado", '')
      setValue("Endereco", '')
    }
  })

  const handleFileChange = async (file: File) => {
    const toBase64 = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(new Error('Erro ao ler arquivo'))
        reader.readAsDataURL(file)
      })
  
    try {
      const base64 = await toBase64(file)
      setProfile64(base64)
    } catch (err) {
      console.error(err)
    }
  }
  

  useEffect(() => {
    if(profileImage) {
        handleFileChange(profileImage as File)
    }
  }, [profileImage])

  return (
    <main className="flex flex-col gap-4 items-center">
      <Header
        title={{
          children: ''
        }}
        breadCrumbs={{
          items: [
            {
              label: "Arquitetos",
              url: '/backoffice/arquitetos'
            },
            {
              label: "Visualização Interna",
              url: ''
            }
          ]
        }}
        icon={<LuArchive className="w-6 h-6" />}
        button={{
          testID: 'edit',
          children: editable ? <>
            <MdCheck className="w-5 h-5" />
            Salvar Alterações
          </> : <>
            <HiOutlinePencil className="w-5 h-5" />
            Editar Informações
          </>,
          onClick: editable ? handleSubmit(onSubmit) : () => setEditable(true),
          loading: sending,
        }}
        secondButton={{
          testID: 'cancel',
          children: editable ? <>
            Cancelar
          </> : <>
            Voltar
          </>,
          type: 'secondary',
          onClick: editable ? () => setEditable(false) : () => router.push('/backoffice/arquitetos')
        }}
      />
      <Divisor />
      <div className="w-full flex flex-col gap-4 bg-white dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-600 p-8 tall:p-4">
        <div className="flex flex-col gap-0">
          <Title bold="800">Dados Principais</Title>
          <Subtitle size="xs">A informação principal do Arquiteto.</Subtitle>
        </div>
        <div className="flex space-x-3 items-center flex-wrap md:flex-nowrap justify-center">
        <div className="w-40 h-40 flex-shrink-0">
            <MyDropzoneFiles
                  typeFiles={2}
                  saveFile={setProfileImage}
                  disabled={false}
                  mutiple={false}
                  className="w-full h-full rounded-full border border-muted-foreground cursor-pointer flex justify-center items-center"
              >
                {!profile64 ? (
                  <div>
                      <p className="font-bold">Selecionar Foto</p>
                  </div>
                ) : (
                  <img 
                    src={profile64}
                    alt=""
                    className="w-full h-full object-cover rounded-full"
                  />
                )}

            </MyDropzoneFiles>
        </div>
        <div className="gap-4 w-full space-y-5">
          <div className="flex flex-wrap gap-4">
            <Input
              inputFieldProps={{
                testID: "nome",
                label: "Nome",
                input: {
                  ...register("Name"),
                  placeholder: "Insira o nome",
                  maxLength: 50,
                  disabled: !editable
                },
              }}
              errorMessage={(errors.Name?.message as string) || undefined}
              className="flex-1 min-w-[250px]"
            />
            <Input
              inputFieldProps={{
                testID: "email",
                label: "E-mail",
                input: {
                  ...register("Email"),
                  placeholder: "Insira o E-mail",
                  maxLength: 50,
                  type: 'email',
                  disabled: !editable
                },
              }}
              errorMessage={(errors.Name?.message as string) || undefined}
              className="flex-1 min-w-[250px]"
            />
            <MaskInput
              inputFieldProps={{
                testID: "phone",
                label: "Telefone",
                mask: "(99) 99999-9999",
                input: {
                  ...register("Telefone"),
                  placeholder: "Telefone",
                  disabled: !editable
                },
              }}
              errorMessage={(errors.Name?.message as string) || undefined}
              className="flex-1 min-w-[250px]"
            />
            </div>
            <div className="flex flex-wrap gap-4">
              <MaskInput
                inputFieldProps={{
                  testID: "cpf",
                  label: "CPF",
                  mask: "999.999.999-99",
                  input: {
                    ...register("CPF"),
                    placeholder: "CPF",
                    disabled: !editable
                  },
                }}
                errorMessage={(errors.CPF?.message as string) || undefined}
                className="flex-1 min-w-[250px]"
              />
              <MaskInput
                inputFieldProps={{
                  testID: "cau",
                  label: "Registro CAU",
                  mask: "aa999999-9",
                  input: {
                    ...register("CAU"),
                    placeholder: "SP123456-7",
                    disabled: !editable
                  },
                }}
                errorMessage={(errors.CAU?.message as string) || undefined}
                className="flex-1 min-w-[250px]"
              />
            </div>
        </div>
        </div>
      </div>
      <div className="w-full flex flex-col gap-4 bg-white dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-600 p-8 tall:p-4">
        <div className="flex flex-col gap-0">
          <Title bold="800">Endereço</Title>
          <Subtitle size="xs">Endereço do Arquiteto.</Subtitle>
        </div>
        <div className="gap-4 w-full space-y-5">
          <div className="flex flex-wrap gap-4">
            <MaskInput
              inputFieldProps={{
                testID: "cep",
                label: "CEP",
                mask: "99999-999",
                input: {
                  ...register("CEP"),
                  placeholder: "CEP",
                  value: cep,
                  onChange: ((e)=> setCep(e.target.value)),
                  disabled: !editable
                },
              }}
              errorMessage={(errors.CEP?.message as string) || undefined}
              className="flex-1 min-w-[250px]"
            />
            <Input
                inputFieldProps={{
                  testID: "city",
                  label: "Cidade",
                  input: {
                      ...register("Cidade"),
                      placeholder: "Cidade",
                      maxLength: 50,
                      disabled: !editable
                  },
                }}
                className="flex-1 min-w-[250px]"
            />
          </div>
        </div>
        <div className="gap-4 w-full space-y-5">
          <div className="flex flex-wrap gap-4">
          {/* @ts-ignore */}
<Controller
              name="Estado"
              control={control}
              render={({ field: { name, onChange, value, disabled } }) => {
                return (
                  <Select
                  testID="state"
                  label="Estado"
                  options={ESTATES.map((state) => ({
                      value: state.sigla,
                      label: state.nome,
                      text: state.nome
                  }))}
                  select={{
                      disabled: !editable,
                      value: value,
                      onChange: (e) => {
                        onChange(e.target.value)
                      },
                  }}
              />
                )
              }}
            >
            </Controller>
            <Input
              inputFieldProps={{
                testID: "endereco",
                label: "Endereço",
                input: {
                  ...register("Endereco"),
                  placeholder: "Endereço",
                  maxLength: 100,
                  disabled: !editable
                },
              }}
              errorMessage={(errors.Endereco?.message as string) || undefined}
              className="flex-1 min-w-[250px]"
            />
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4 bg-white dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-600 p-8 tall:p-4">
        <div className="flex flex-col gap-0">
          <Title bold="800">Pontuação</Title>
          <Subtitle>Confira sua Pontuação</Subtitle>
          
        </div>
        <div className="grid grid-cols-3 gap-4">

           <div className="w-full flex flex-col gap-4 bg-white dark:bg-gray-750 rounded-2xl border border-gray-200 dark:border-gray-600 p-8  tall:p-4 justify-center items-center">
              <div className="w-[70%]">
                <div className="flex gap-2 justify-start items-center mb-4">
                  <GrTarget className="text-orange-500 text-[20px] " />
                  <Title bold="800">Total de Pontos</Title>
                </div>
                <div className="w-full flex-col items-center justify-center">
                    <div className="flex items-center w-full justify-center mb-4">
                      <Title>{pontuacaoAtual + 75} pts</Title>
                    </div>
                    <div className="w-full justify-center items-center mb-4">
                          <ProgressBar current={pontuacaoAtual } goal={meta}/>
                    </div>

                    <div>
                      <Subtitle>Faltam <strong>{pontuacaoFaltante}</strong> pts para ganhar 10% de desconto!</Subtitle>
                    </div>
                </div>
              </div>
           </div>

            <div className="w-full flex flex-col gap-4 bg-white dark:bg-gray-750 rounded-2xl border border-gray-200 dark:border-gray-600 p-8  tall:p-4 justify-center items-center">
              <div className="w-[70%]">
                <div className="flex gap-2 justify-start items-center mb-4">
                  <GrTarget className="text-orange-500 text-[20px] " />
                  <Title bold="800">Seus Pontos Mensais </Title>
                </div>
                <div className="w-full flex-col items-center justify-center">
                    <div className="flex items-center w-full justify-center mb-4">
                      <Title>{pontuacaoAtual} pts</Title>
                    </div>
                    <div className="w-full justify-center items-center mb-4">
                          <ProgressBar current={pontuacaoAtual} goal={meta}/>
                    </div>

                    <div>
                      <Subtitle>Faltam <strong>{pontuacaoFaltante}</strong> pts para ganhar 10% de desconto!</Subtitle>
                    </div>
                </div>
              </div>
           </div>

            <div className="w-full flex flex-col gap-4 bg-white dark:bg-gray-750 rounded-2xl border border-gray-200 dark:border-gray-600 p-8  tall:p-4 justify-center items-center">
              <div className="w-[70%]">
                <div className="flex gap-2 justify-start items-center mb-4">
                  <GrTarget className="text-orange-500 text-[20px] " />
                  <Title bold="800">Historico de Pontos</Title>
                </div>
                <div className="w-full flex-col items-center justify-center">
                    
                    <div className="w-full grid grid-cols-2 justify-center items-center mb-4">
                        <span>12/10/1717</span>
                        <span className="text-orange-500">+{pontuacaoAtual} pts</span>
                    </div>
                     <div className="w-full grid grid-cols-2 justify-center items-center mb-4">
                        <span>12/10/1717</span>
                        <span className="text-orange-500">+{pontuacaoAtual} pts</span>
                    </div>

                    <div>
                      <button className="text-orange-500 " onClick={() => setModalOpen(true)}>Ver Mais</button>
                    </div>
                </div>
              </div>
           </div>
          
        </div>
       
      </div>

      <ModalHistorico 
        isOpen={modalOpen}
        onClose={()=> setModalOpen(false)}
      />  
      <Alert alert={alert} hideAlert={hideAlert} />
      <Dialog dialog={dialog} hideDialog={hideDialog} />
    </main>
  )
}
