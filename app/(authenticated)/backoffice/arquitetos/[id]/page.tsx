'use client'
import { Header } from "@/components/Header";
import { Divisor } from "@/components/Divisor";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef} from "react";
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
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import { Input, MaskInput } from "@/components/Input";
import { useDialog } from "@/components/dialog/useDialog";
import { Dialog } from "@/components/dialog";
import { LuArchive, LuClipboardCopy, LuClipboardPaste } from "react-icons/lu";


import { AxiosError } from "axios";
import { ErrorApi } from "@/lib/utils";
import { Select } from "@/components/Select";
import { ESTATES } from "@/lib/states";
import { MyDropzoneFiles } from "@/components/dropzone";
import { ProgressBar } from "../components/barraPontuacao";
import { ModalHistorico } from "../components/ModalHistorico";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcnui/table/table";
import ButtonToggle from "@/components/ButtonToggle";
import { Button } from "@/components/Button";
import { Plus } from "lucide-react";
import { Arquitetos } from "../page";
import moment from "moment";
import { TableArquitetosList } from "./components/TableHistorico";
import { TableHistoricoCredito } from "./components/TableHistoricoCredito";

const schema = yup.object({
  Nome: yup.string().min(3, "Insira pelo menos 3 caracteres!").required("Por favor, preencha esse campo de Nome!"),
   Email: yup.string().email("Insira um e-mail válido!").required("Por favor, preencha esse campo de Email!"),
   Telefone: yup.string().required("Por favor, preencha esse campo de Telefone!"),
   Cpf: yup.string().required("Por favor, preencha esse campo de Cpf!"),
   Cau: yup.string().required("Por favor, preencha esse campo de Registro de Conselho!"),
   Cidade: yup.string().required("Por favor, preencha esse campo de Cidade!"),
   Estado: yup.string().required("Por favor, preencha esse campo de Estado!"),
   Endereco: yup.string().required("Por favor, preencha esse campo de Endereço!"),
   Bairro: yup.string().required("Por favor, preencha esse campo de Bairro!"),
   numero: yup.string().required("Por favor, preencha esse campo de Numero!"),
   Cep: yup.string().required("Por favor, preencha esse campo de Cep!"),
   Instagram: yup.string().required("Por favor, preencha esse campo de Instagram!"),
   DataNascimento: yup.string().required("Por favor, preencha esse campo de Data de Nascimento!"),
   Profissao: yup.string().required("Por favor, preencha esse campo de Profissão!"),
   Facebook: yup.string(),
   NomeDivulgacao:yup.string().required("Por favor, preencha esse campo de Nome de divulgação!"),
   Site: yup.string(),
   CNPJ:yup.string(),
   Socios: yup.boolean(),
   ImagemPerfil: yup.string(),
   ArquitetoSocios: yup.array().of(
     yup.object({
       nomeSocio: yup.string().required("Nome do sócio é obrigatório"),
       dataNascimento: yup.string().required("Data de nascimento é obrigatória"),
       celular: yup.string().required("Celular é obrigatório")
     })
   ).when(['Socios'], (Socios, schema) => {
     return Socios.includes(true)
       ? schema.min(1, "É necessário inserir ao menos um sócio")
       : schema.notRequired();
   }),
   QuantidadeColaboradores: yup.string().when(['Socios'], (Socios, schema) => {
     return Socios.includes(true)
       ? schema.required("É necessário inserir a quantidade de colaboradores!")
       : schema.notRequired();
   }),
   Escritorio: yup.string().when(['Socios'], (Socios, schema) => {
     return Socios.includes(true)
       ? schema.required("É necessário inserir o nome do escritorio!")
       : schema.notRequired();
   }),
   EnderecoEscritorio: yup.string().when(['Socios'], (Socios, schema, index) => {
     return Socios.includes(true)
       ? schema.required("É necessário inserir o endereço de escritorio!")
       : schema.notRequired();
   }),
});


interface ArquitetoGet {
  nome: string,
  quantidadeColaboradores: string | null,
  instagram: string,
  socios: boolean,
  imagemPerfil: string,
  telefone: string,
  cpf: string,
  cep: string,
  cidade: string,
  estado: string,
  cau: string,
  email: string,
  endereco: string,
  id: number,
  arquitetoSocios: {
    nomeSocio?: string;
    dataNascimento?: string,
    celular?: string
  }[];
  totalSaldo: number
  totalCredito: number
  numero: string,
  bairro: string,
  nomeEscritorio: string;

  dataNascimento: string;
  profissao: string;
  enderecoEscritorio: string;
  facebook: string;
  site: string;
  cnpj:string;
  nomeDivulgacao:string;

}

interface contaCorrenteId {
    dataCriacao: string
    empresaId: number
    empresaNome: string
    id: number
    pontuacaoId: number
    promocaoId: number
    promocaoNome: string
    tipo: "Credito" | "Debito"
    usuarioId: number
    valorPontuacao: number
}
 

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

  const [cep,setCep] = useState('')
  const [meta,setMeta] = useState(200)
  const [pontuacaoAtual, setPontuacaoAtual] = useState(50)
  const [modalOpen, setModalOpen] = useState(false)

  const [saldo, setSaldo] = useState<string | undefined>();
  const [credito, setCredito] = useState<string | undefined>();

  const router = useRouter()
  // const [sociosArq,setSociosArq] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [count, setCount] = useState(0);
  const [pageCredito, setPageCredito] = useState(1);
  const [limitCredito, setLimitCredito] = useState(5);
  const [countCredito, setCountCredito] = useState(0);
  const [sociosArquitetos,setSociosArquitetos] = useState<any[]>([])
  const { alert, showAlert, hideAlert } = useAlert();
  const { dialog, showDialog, hideDialog } = useDialog();
  const { register, handleSubmit, control, formState: { errors, isSubmitting }, setError, setValue, reset, watch } = useForm({
    resolver: yupResolver(schema),
     mode: "onChange", 
  });
  const useRefScroll = useRef(null)
  const { fields, append, remove } = useFieldArray({
    control,
    name: "ArquitetoSocios",
    
  });

  const [editable, setEditable] = useState(false)


  const onSubmit = async (values: any) => save(values)
  const sociosArq = watch("Socios");

   const onError = (errors: any) => {

    console.log(Object.keys(errors))
    const firstErrorKey = Object.keys(errors)[1];
    const firstError = errors[firstErrorKey];

    showAlert({
      title: 'Ops, algo deu errado!',
      description: firstError?.message || 'Verifique os campos obrigatórios.',
      type: 'error',
    });
  };

  const {} = useQuery({
    queryKey: ['getInfo', params.id],
    queryFn: async () => {
      const { data } = await api.get<{data: ArquitetoGet}>(`/Arquiteto/${params.id}`)
         console.log(data)
      return data.data
    },

    onSuccess(value) {

      setValue('Nome', value.nome)
      setValue('Cpf', value.cpf)
      setValue('Email', value.email)
      setValue('Endereco', value.endereco)
      setValue('Estado', value.estado)
      setValue('Telefone', value.telefone)
      setValue('Cidade', value.cidade)
      setValue('Cau', value.cau)
      setValue('Cep', value.cep)
      if (value.arquitetoSocios && value.arquitetoSocios.length > 0) {
        value.arquitetoSocios.forEach((item: any) => {
          append({
            nomeSocio: item.nomeSocio || "",
            dataNascimento: item.dataNascimento ? moment(item.dataNascimento).format("YYYY-MM-DD") : "",
            celular: item.celular || "",
            
          },{ shouldFocus: false });
        });
      }
      setValue("Socios",value.socios)
      setProfile64(value.imagemPerfil)
      setImgArquiteto(value.imagemPerfil)
      setCep(value.cep);
      setValue('numero', value.numero || '')
      setValue('Bairro', value.bairro || '')
      setValue('Instagram', value.instagram ? value.instagram : "")
      setValue('Escritorio', value.nomeEscritorio ? value.nomeEscritorio : "")
      setValue('DataNascimento', moment(value.dataNascimento).format("YYYY-MM-DD") ? moment(value.dataNascimento).format("YYYY-MM-DD") : "")
      setValue('Profissao', value.profissao ? value.profissao : "")
      setValue('EnderecoEscritorio', value.enderecoEscritorio ? value.enderecoEscritorio : "")
      setValue('Facebook', value.facebook ? value.facebook : "")
      setValue('Site', value.site ? value.site : "")
      setValue('CNPJ', value.cnpj ? value.cnpj : "")
      setValue('NomeDivulgacao', value.nomeDivulgacao ? value.nomeDivulgacao : "")
      setValue('QuantidadeColaboradores', value.quantidadeColaboradores ?? undefined)

     
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  })

  const {} = useQuery({
    queryKey: ['getArquitetoId', params.id],
    queryFn: async () => {
      const { data } = await api.get(`/Arquiteto?Id=${params.id}`)
      const saldo = data.data.data[0].totalSaldo
      const format = new Intl.NumberFormat('pt-BR').format(saldo);
      setSaldo(format)
      const credito = data.data.data[0].totalDebito
      const formatCredito = new Intl.NumberFormat('pt-BR').format(credito);
      setCredito(formatCredito)
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  })

  const {data: ContaCorrente, refetch: refetchConta} = useQuery({
    queryKey: ['getContaCorreteId', params.id,page,limit],
    queryFn: async () => {
      const { data } = await api.get(`/ContaCorrenteArq?UsuarioId=${params.id}&Tipo=Debito&PageSize=${limit}&PageNumber=${page}`)
      setLimit(data.data.limit)

      setCount(data.data.total)
      return data.data.data
    },
  

    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  })

  const {data: ContaCorrenteCredito, refetch: refetchContaCredito} = useQuery({
    queryKey: ['getContaCorrenteCredito', params.id,pageCredito,limitCredito],
    queryFn: async () => {
      const { data } = await api.get(`/ContaCorrenteArq?UsuarioId=${params.id}&Tipo=Credito&PageSize=${limitCredito}&PageNumber=${pageCredito}`)
      setLimitCredito(data.data.limit)
      setCountCredito(data.data.total)
      return data.data.data
    },
  

    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  })


  
   useEffect(() => {
      console.log(ContaCorrente)
   }, [ContaCorrente]);

  


  const { mutate: save, isLoading: sending } = useMutation({
    mutationFn: async (values: any) => {
      const payload =
      { 
        id: Number(params.id),
        nome: values.Nome,
        imagemPerfil: profile64 == imgArquiteto ? null : profile64,
        telefone: values.Telefone,
        cpf: values.Cpf,
        cep: values.Cep,
        cidade: values.Cidade,
        estado: values.Estado,
        cau: values.Cau,
        email: values.Email,
        endereco: values.Endereco,
         ...(sociosArq && {  quantidadeColaboradores: Number(values.QuantidadeColaboradores)}),
        ...(sociosArq && { arquitetoSocios: values.ArquitetoSocios }),
        socios: sociosArq,
        instagram: values.Instagram,
        nomeEscritorio: values.Escritorio,
        dataNascimento: values.DataNascimento ? values.DataNascimento : "",
        profissao: values.Profissao,
        enderecoEscritorio: values.Endereco,
        facebook: values.Facebook,
        site: values.Site,
        cnpj: values.CNPJ,
        nomeDivulgacao: values.NomeDivulgacao,
        bairro: values.Bairro,
        numero: values.numero
      }

      await api.put(`/Arquiteto`, payload)
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
    enabled: watch('Cep') ? true : false,
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

  
  useEffect(() => {
    if (useRefScroll.current) {
      (useRefScroll.current as HTMLElement).scrollTop = 0;
    }
  }, [])

  return (
    <main className="flex flex-col gap-4 items-center" ref={useRefScroll}>
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
          onClick: editable ? handleSubmit(onSubmit,onError) : () => setEditable(true),
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
                      ...register("Nome"),
                      placeholder: "Insira o nome",
                      maxLength: 50,
                      disabled: !editable,
                      onChange: ((e) =>  {
                          setValue('Nome',e.target.value)
                      }),
                    },
                  }}
                  errorMessage={(errors.Nome?.message as string) || undefined}
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
                      disabled: !editable,
                      onChange: ((e) =>  {
                          setValue('Email',e.target.value)
                      }),
                    },
                  }}
                  errorMessage={(errors.Email?.message as string) || undefined}
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
                      disabled: !editable,
                      onChange: ((e) =>  {
                          setValue('Telefone',e.target.value)
                      }),
                    },
                  }}
                  errorMessage={(errors.Telefone?.message as string) || undefined}
                  className="flex-1 min-w-[250px]"
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <MaskInput
                  inputFieldProps={{
                    testID: 'CNPJ',
                    label: 'CNPJ',
                    mask: '99.999.999/9999-99',
                    input: {
                      disabled: !editable,
                      ...register('CNPJ'),
                      placeholder: 'Insira o CNPJ da empresa',
                      id: 'CNPJ',
                      onChange: (e:any) => setValue("CNPJ",e.target.value)
                    }
                  }}
                  className="flex-1 min-w-[150px]"
                  errorMessage={errors.CNPJ?.message as string || undefined}
                />
                
                <MaskInput
                  inputFieldProps={{
                    testID: "cpf",
                    label: "CPF",
                    mask: "999.999.999-99",
                    input: {
                      ...register("Cpf"),
                      placeholder: "CPF",
                      disabled: !editable,
                      onChange: ((e) =>  {
                        setValue('Cpf',e.target.value)
                      }),
                    },
                  }}
                  errorMessage={(errors.Cpf?.message as string) || undefined}
                  className="flex-1 min-w-[250px]"
                />
                <Input
                  inputFieldProps={{
                    testID: "DataNascimento",
                    label: "Data Nascimento",
                    input: {
                      ...register("DataNascimento"),
                      placeholder: "Insira o Data Nascimento",
                      onChange: ((e) =>  {
                        setValue('DataNascimento',e.target.value)
                      }),
                    type: "date"
                    },
                  }}
                  errorMessage={(errors.DataNascimento?.message as string) || undefined}
                  className="flex-1 min-w-[250px]"
                />
               
                
              
              </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
              <Input
              inputFieldProps={{
                testID: "Profissao",
                label: "Profissão",
                input: {
                  ...register("Profissao"),
                  placeholder: "Insira o Profissão",
                   onChange: ((e) =>  {
                      setValue('Profissao',e.target.value)
                    }),
                },
              }}
              errorMessage={(errors.Profissao?.message as string) || undefined}
              className="flex-1 min-w-[250px]"
            />
             <Input
                  inputFieldProps={{
                    testID: "cau",
                    label: "Registro de Conselho",
                    input: {
                      ...register("Cau"),
                      placeholder: "Perencha o Nº registro de conselho",
                      disabled: !editable,
                      onChange: ((e) =>  {
                        setValue('Cau',e.target.value)
                      }),
                    },
                  }}
                  errorMessage={(errors.Cau?.message as string) || undefined}
                  className="flex-1 min-w-[250px]"
                />
             <Input
              inputFieldProps={{
                testID: "nomeDivulgacao",
                label: "Nome de Divulgacao",
                input: {
                  ...register("NomeDivulgacao"),
                  placeholder: "Insira o nome de divulgacao",
                  onChange: ((e) =>  {
                      setValue('NomeDivulgacao',e.target.value)
                    }),
                },
              }}
              errorMessage={(errors.NomeDivulgacao?.message as string) || undefined}
              className="flex-1 min-w-[250px]"
            />
            <Input
              inputFieldProps={{
                testID: "Instagram",
                label: "Instagram",
                input: {
                  ...register("Instagram"),
                  placeholder: "Insira o link do Instagram",
                   onChange: ((e) =>  {
                      setValue('Instagram',e.target.value)
                    }),
                },
              }}
              errorMessage={(errors.Instagram?.message as string) || undefined}
              className="flex-1 min-w-[250px]"
            />
            <Input
              inputFieldProps={{
                testID: "Facebook",
                label: "Facebook",
                input: {
                  ...register("Facebook"),
                  placeholder: "Insira o link do Facebook",
                   onChange: ((e) =>  {
                      setValue('Facebook',e.target.value)
                    }),
                },
              }}
              errorMessage={(errors.Facebook?.message as string) || undefined}
              className="flex-1 min-w-[250px]"
            />
            <Input
              inputFieldProps={{
                testID: "Site",
                label: "Site",
                input: {
                  ...register("Site"),
                  placeholder: "Insira o link do Site",
                  onChange: ((e) =>  {
                      setValue('Site',e.target.value)
                    }),
                },
              }}
              errorMessage={(errors.Site?.message as string) || undefined}
              className="flex-1 min-w-[250px]"
            />

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
                  ...register("Cep"),
                  placeholder: "CEP",
                  value: cep,
                  onChange: ((e) =>  {
                    setCep(e.target.value),
                    setValue('Cep',e.target.value)
                  }),
                  disabled: !editable
                },
              }}
              errorMessage={(errors.Cep?.message as string) || undefined}
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
                      disabled: !editable,
                      onChange: (e) => {
                        setValue('Cidade', e.target.value)
                      }
                  },
                  
                }}
                className="flex-1 min-w-[250px]"
            />
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
                      ...register('Estado'),
                      disabled: !editable,
                      value: value,
                      onChange: (e) => {
                        onChange(e.target.value)
                        setValue('Estado', e.target.value)
                      },
                  }}
              />
                )
              }}
            >
            </Controller>
          </div>
        </div>
        <div className="gap-4 w-full space-y-5">
          <div className="flex flex-wrap gap-4">
            <Input
              inputFieldProps={{
                testID: "endereco",
                label: "Endereço",
                input: {
                  ...register("Endereco"),
                  placeholder: "Endereço",
                  maxLength: 100,
                  disabled: !editable,
                  onChange: (e) => {
                    setValue('Endereco', e.target.value)
                  },
                },
                
              }}
              errorMessage={(errors.Endereco?.message as string) || undefined}
              className="flex-1 min-w-[250px]"
            />
             <Input
              inputFieldProps={{
                testID: "bairro",
                label: "Bairro",
                input: {
                  ...register("Bairro"),
                  placeholder: "Bairro",
                  maxLength: 100,
                  onChange: (e) => {
                    setValue('Bairro', e.target.value)
                  },
                },
              }}
              errorMessage={(errors.Bairro?.message as string) || undefined}
              className="flex-1 min-w-[250px]"
            />
            <Input
              inputFieldProps={{
                testID: "numero",
                label: "Numero",
                input: {
                  ...register("numero"),
                  placeholder: "Numero",
                  maxLength: 100,
                  onChange: (e) => {
                    setValue('numero', e.target.value)
                  },
                },
              }}
              errorMessage={(errors.numero?.message as string) || undefined}
              className="flex-1 min-w-[250px]"
            />
          </div>
        </div>
        <div className="w-full flex flex-col gap-4 bg-white dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-600 p-8 tall:p-4">
        {/* <div className="flex flex-col gap-0">
            <Title bold="800">Socios</Title>
            <Subtitle size="xs">Principais Informações</Subtitle>
          </div> */}
        <div className="flex justify-between gap-6 items-center p-4">
          <div>
            <Title bold="800">Possui participação societaria?</Title>
          </div>
          <ButtonToggle
            onToggle={() => {
              setValue("Socios",!sociosArq)
            }}
            color={"#fcdc28"}
            value={!!sociosArq}
          />
        </div>
      </div>
      {sociosArq &&
        <div className="w-full flex flex-col gap-4 bg-white dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-600 p-8 tall:p-4">
          <div className="flex flex-wrap gap-4">
                <Input
                  inputFieldProps={{
                    testID: "Nome do escritório",
                    label: "Nome Escritório",
                    input: {
                      ...register("Escritorio"),
                      placeholder: "Insira o Nome Escritório",
                      onChange: (e) => {
                        setValue('Escritorio', e.target.value)
                      }
                    },
                  }}
                  errorMessage={(errors.Escritorio?.message as string) || undefined}
                  className="flex-1 min-w-[250px]"
                />
                <Input
                  inputFieldProps={{
                    testID: "EnderecoEscritorio",
                    label: "Endereço Escritório",
                    input: {
                      ...register("EnderecoEscritorio"),
                      placeholder: "Insira o Endereço Escritório",
                      onChange: (e) => {
                        setValue('EnderecoEscritorio',e.target.value)
                      },
                    },
                  }}
                  errorMessage={(errors.EnderecoEscritorio?.message as string) || undefined}
                  className="flex-1 min-w-[250px]"
                />
                <Input
                  inputFieldProps={{
                    testID: "Quantidade de Colaboradores",
                    label: "Quantidade de Colaboradores",
                    input: {
                      ...register("QuantidadeColaboradores"),
                      placeholder: "Insira a Quantidade de Colaboradores",
                      maxLength: 50,
                      onChange: (e) => {
                        setValue('QuantidadeColaboradores', String(e.target.value))
                      },
                      type: 'number'
                    },
                  }}
                  errorMessage={(errors.QuantidadeColaboradores?.message as string) || undefined}
                  className="flex-1 min-w-[250px]"
                />
          </div>
            
          {fields && fields.length > 0 ? (
            fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 w-full">
                <Input
                  inputFieldProps={{
                    testID: `socio-${index}`,
                    label: `Sócio ${index + 1}`,
                    input: {
                      value: watch(`ArquitetoSocios.${index}.nomeSocio`),
                      ...register(`ArquitetoSocios.${index}.nomeSocio`, {
                        required: "Campo obrigatório",
                        minLength: { value: 3, message: "No mínimo 3 caracteres" },
                      }),
                      onChange: ((e) =>  {
                        setValue(`ArquitetoSocios.${index}.nomeSocio`,e.target.value)
                      }),
                      placeholder: "Nome do sócio",
                    },
                  }}
                  errorMessage={(errors.ArquitetoSocios?.[index]?.nomeSocio?.message as string) || undefined}
                />
                <Input
                  inputFieldProps={{
                    testID: `DataNascimento-${index}`,
                    label: `Data Nascimento ${index + 1}`,
                    input: {
                      value: watch(`ArquitetoSocios.${index}.dataNascimento`),
                      ...register(`ArquitetoSocios.${index}.dataNascimento`),
                      placeholder: "Insira o Data Nascimento",
                      type: "date",
                      onChange: ((e) =>  {
                        setValue(`ArquitetoSocios.${index}.dataNascimento`,e.target.value)
                      }),
                    },
                  }}
                  errorMessage={(errors.ArquitetoSocios?.[index]?.dataNascimento?.message as string) || undefined}
                  className="flex-1 min-w-[250px]"
                />
                <MaskInput
                  inputFieldProps={{
                    testID: `phone-${index}`,
                    label: `Telefone ${index + 1}`,
                    mask: "(99) 99999-9999",
                    input: {
                      value: watch(`ArquitetoSocios.${index}.celular`),
                      ...register(`ArquitetoSocios.${index}.celular`),
                      placeholder: "Telefone",
                      onChange: ((e) =>  {
                        setValue(`ArquitetoSocios.${index}.celular`,e.target.value)
                      }),
                    },
                  }}
                  errorMessage={(errors.ArquitetoSocios?.[index]?.celular?.message as string) || undefined}
                  className="flex-1 min-w-[250px]"
                />
                {index <= 0 &&
                  <Button
                    testID="add-socio-button"
                    type="primary"
                    onClick={() => append({ nomeSocio: "", celular: "", dataNascimento: "" })}
                    className="w-fit mt-[27px]"
                  >
                    <Plus className="text-[20px] " />
                  </Button>
                }
                {index !== 0 && 
                  <Button
                    testID="remove-socio-button"
                    type="secondary"
                    onClick={() => remove(index)}
                    className="px-2 mt-[27px]"
                  >
                    Remover
                  </Button>
                }
              </div>
            ))
          ) : (
            <div className="flex gap-2 w-full">
              <Input
                inputFieldProps={{
                  testID: `socio-0`,
                  label: `Sócio 1`,
                  input: {
                    value: watch(`ArquitetoSocios.0.nomeSocio`),
                    ...register(`ArquitetoSocios.0.nomeSocio`, {
                      required: "Campo obrigatório",
                      minLength: { value: 3, message: "No mínimo 3 caracteres" },
                    }),
                    onChange: ((e) =>  {
                      setValue(`ArquitetoSocios.0.nomeSocio`,e.target.value)
                    }),
                    placeholder: "Nome do sócio",
                  },
                }}
                errorMessage={(errors.ArquitetoSocios?.[0]?.nomeSocio?.message as string) || undefined}
              />
              <Input
                inputFieldProps={{
                  testID: `DataNascimento-0`,
                  label: `Data Nascimento 1`,
                  input: {
                    value: watch(`ArquitetoSocios.0.dataNascimento`),
                    ...register(`ArquitetoSocios.0.dataNascimento`),
                    placeholder: "Insira o Data Nascimento",
                    type: "date",
                    onChange: ((e) =>  {
                      setValue(`ArquitetoSocios.0.dataNascimento`,e.target.value)
                    }),
                  },
                }}
                errorMessage={(errors.ArquitetoSocios?.[0]?.dataNascimento?.message as string) || undefined}
                className="flex-1 min-w-[250px]"
              />
              <MaskInput
                inputFieldProps={{
                  testID: `phone-0`,
                  label: `Telefone 1`,
                  mask: "(99) 99999-9999",
                  input: {
                    value: watch(`ArquitetoSocios.0.celular`),
                    ...register(`ArquitetoSocios.0.celular`),
                    placeholder: "Telefone",
                    onChange: ((e) =>  {
                      setValue(`ArquitetoSocios.0.celular`,e.target.value)
                    }),
                  },
                }}
                errorMessage={(errors.ArquitetoSocios?.[0]?.celular?.message as string) || undefined}
                className="flex-1 min-w-[250px]"
              />
              <Button
                testID="add-socio-button"
                type="primary"
                onClick={() => append({ nomeSocio: "", celular: "", dataNascimento: "" })}
                className="w-fit mt-[27px]"
              >
                <Plus className="text-[20px] " />
              </Button>
            </div>
          )}

        </div>
      
      }
      </div>

      <div className="w-full flex flex-col gap-4 bg-white dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-600 p-8 tall:p-4">
        <div className="flex flex-col gap-0">
          <Title bold="800">Pontuação</Title>
          <Subtitle>Confira sua Pontuação</Subtitle>
          
        </div>
        <div className="grid grid-cols-2 gap-4">

           <div className="w-full flex flex-col gap-4 bg-white dark:bg-gray-750 rounded-2xl border border-gray-200 dark:border-gray-600 p-8  tall:p-4 justify-center items-center">
              <div className="w-[70%]">
                <div className="flex gap-2 justify-start items-center mb-4">
                  <GrTarget className="text-orange-500 text-[20px] " />
                  <Title bold="800">Saldo Total de Pontos</Title>
                </div>
                <div className="w-full flex-col items-center justify-center">
                    <div className="flex flex-col items-center w-full justify-center mb-4">
                      <span className="font-semibold text-lg">{saldo} pts</span>
                    </div>

                    {/* <div>
                      <Subtitle>Faltam <strong>{pontuacaoFaltante}</strong> pts para ganhar 10% de desconto!</Subtitle>
                    </div> */}
                </div>
              </div>
           </div>

            <div className="w-full flex flex-col gap-4 bg-white dark:bg-gray-750 rounded-2xl border border-gray-200 dark:border-gray-600 p-8  tall:p-4 justify-center items-center">
              <div className="w-[70%]">
                <div className="flex gap-2 justify-start items-center mb-4">
                  <GrTarget className="text-orange-500 text-[20px] " />
                  <Title bold="800">Saldo já Utilizado</Title>
                </div>
                <div className="w-full flex-col items-center justify-center">
                    <div className="flex flex-col items-center w-full justify-center mb-4">
                      <span className="font-semibold text-lg">{credito} pts</span>
                    </div>

                    {/* <div>
                      <Subtitle>Faltam <strong>{pontuacaoFaltante}</strong> pts para ganhar 10% de desconto!</Subtitle>
                    </div> */}
                </div>
              </div>
            </div>
          
        </div>
        
        <div className="w-full flex flex-col gap-4 bg-white dark:bg-gray-750 rounded-2xl border border-gray-200 dark:border-gray-600 p-8  tall:p-4 justify-center items-center">
          <div className="w-full">
              <div className="grid grid-cols-2 gap-2 justify-start items-center mb-4">
                <div className="flex gap-4 items-center justify-center">
                  <LuClipboardCopy className="text-orange-500 text-[20px] " />
                  <Title bold="800">Historico de Débitos</Title>
                </div>
                <div className="flex gap-4 items-center justify-center">
                  <LuClipboardPaste className="text-orange-500 text-[20px] " />
                  <Title bold="800">Historico de Créditos</Title>
                </div>
              </div>
              <div className="grid grid-cols-2 justify-center w-full gap-4">

                 <div className="grid grid-cols-1 items-center justify-center">

                  <TableArquitetosList
                    data={ContaCorrente || []}
                    isLoading={false}
                    count={count}
                    limit={limit}
                    page={page}
                    setLimit={setLimit}
                    setPage={setPage}     
                    // excluir={() => {}}
                    refetch={refetchConta}
                  />
                  
                  
                    
                    {/* <div className="w-full grid grid-cols-2 justify-center items-center mb-4">
                        <span>12/10/1717</span>
                        <span className="text-orange-500">+{pontuacaoAtual} pts</span>
                    </div>
                      <div className="w-full grid grid-cols-2 justify-center items-center mb-4">
                        <span>12/10/1717</span>
                        <span className="text-orange-500">+{pontuacaoAtual} pts</span>
                    </div>

                    <div>
                      <button className="text-orange-500 " onClick={() => setModalOpen(true)}>Ver Mais</button>
                    </div> */}
                </div>
                <div className="grid grid-cols-1 items-center justify-center">

                  <TableHistoricoCredito
                    data={ContaCorrenteCredito || []}
                    isLoading={false}
                    countCredito={countCredito}
                    limitCredito={limitCredito}
                    pageCredito={pageCredito}
                    setLimitCredito={setLimitCredito}
                    setPageCredito={setPageCredito}     
                    // excluir={() => {}}
                    refetch={refetchContaCredito}
                  />
                  
                    
                    {/* <div className="w-full grid grid-cols-2 justify-center items-center mb-4">
                        <span>12/10/1717</span>
                        <span className="text-orange-500">+{pontuacaoAtual} pts</span>
                    </div>
                      <div className="w-full grid grid-cols-2 justify-center items-center mb-4">
                        <span>12/10/1717</span>
                        <span className="text-orange-500">+{pontuacaoAtual} pts</span>
                    </div>

                    <div>
                      <button className="text-orange-500 " onClick={() => setModalOpen(true)}>Ver Mais</button>
                    </div> */}
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
