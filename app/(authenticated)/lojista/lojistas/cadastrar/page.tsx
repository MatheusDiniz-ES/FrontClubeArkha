'use client'
import { Header } from "@/components/Header";
import { Divisor } from "@/components/Divisor";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import api from "@/lib/api";
import Alert from "@/components/alert";
import useAlert from "@/components/alert/useAlert";
import { MdCheck, MdCheckCircle } from "react-icons/md";
import { Title } from "@/components/Title";
import { Subtitle } from "@/components/Subtitle";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Input, MaskInput } from "@/components/Input";
import { useDialog } from "@/components/dialog/useDialog";
import { Dialog } from "@/components/dialog";
import { LuArchive } from "react-icons/lu";
import { MyDropzoneFiles } from "@/components/dropzone";


const schema = yup.object({
  Name: yup.string().min(3, "Insira pelo menos 3 caracteres!").max(50, "Máximo de 50 caracteres!").required("Por favor, preencha esse campo!"),
  Email: yup.string().email("Insira um e-mail válido!").required("Por favor, preencha esse campo!"),
  CNPJ: yup.string().matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'O CNPJ deve estar no formato 99.999.999/9999-99').required('O campo CNPJ é obrigatório'),
  NomeFantasia: yup.string(),
  RazaoSocial: yup.string(),
  Endereco: yup.string(),
  Telefone: yup.string(),
  Numero: yup.string(),
  Cidade: yup.string().optional(),
  Estado: yup.string().optional(),
  CEP: yup.string(),
  Instagram: yup.string().optional(),
  Site: yup.string().optional()
});

interface LojistaFormData {
  Name: string;
  Email: string;
  CNPJ: string;
  NomeFantasia?: string;
  RazaoSocial?: string;
  Endereco: string;
  Telefone?: string;
  Numero?: string;
  Cidade?: string;
  Estado?: string;
  CEP: string;
  Instagram?: string;
  Site?: string;
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

interface GetResponseIntegracaoCNPJ {
  company: {
    id: number;
    name: string
  }
  emails: {
    address: string,
    domain: string
  }[]
  phones: {
    area: string
    number: string
  }[]
  alias?: string
}

export default function CadastroLojista() {

  const [fileLogo, setFileLogo] = useState<File | null>(null)
  const [logo64, setLogo64] = useState('')

  const { alert, showAlert, hideAlert } = useAlert();
  const { dialog, showDialog, hideDialog } = useDialog();
  const router = useRouter()

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, reset, watch } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (values: any) => save(values)

  const { } = useQuery({
    queryKey: ['get-integracao-cep'],
    queryFn: async () => {
      const { data } = await api.get(`/Integracao/CEP/${watch('CEP')?.replace(/-/g, '')}`)
      return data.data as GetResponseIntegracaoCEP
    },
    enabled: watch('CEP') ? true : false,
    onSuccess: (response) => {
      setValue("Cidade", response.localidade)
      setValue("Estado", response.uf)
      setValue("Endereco", response.logradouro)
    },
    onError: () => {
      setValue("Cidade", '')
      setValue("Estado", '')
      setValue("Endereco", '')
    }
  })

  const { } = useQuery({
    queryKey: ['get-integracao-cnpj'],
    queryFn: async () => {
      const { data } = await api.get(`/Integracao/CNPJ/${watch('CNPJ')?.replace(/[-./]/g, '')}`)
      return data.data as GetResponseIntegracaoCNPJ
    },
    enabled: watch('CNPJ') ? true : false,
    onSuccess: (response) => {
      setValue('RazaoSocial', response.company.name)
      setValue('Email', response.emails[0].address)
      setValue("NomeFantasia", response?.alias || '')
      setValue("Telefone", response.phones[0]?.area + response.phones[0]?.number)
    },
    onError: () => {
      setValue('RazaoSocial', '')
      setValue('Email', '')
      setValue("NomeFantasia", '')
      setValue("Telefone", '')
    }
  })


  const { mutate: save, isLoading: sending } = useMutation({
    mutationFn: async (values: LojistaFormData) => {
      await api.post('/Lojista', { 
        nome: values.Name,
        email: values.Email || '',
        cnpj: values.CNPJ || '',
        endereco: values.Endereco || '',
        telefone: values.Telefone || '',
        cep: values.CEP || '',
        instagram: values.Instagram || '',
        site: values.Site,
        razaoSocial: values.RazaoSocial,
        logo: logo64,
        numero: values.Numero,
        cidade: values.Cidade,
        estado: values.Estado
      })
    },
    onSuccess() {
      showDialog({
        isOpen: true,
        setIsOpen: () => '',
        icon: <MdCheckCircle className="w-4 h-4" />,
        title: 'Cadastro concluída com sucesso!',
        subtitle: 'O cadastro do lojista foi concluído com êxito.',
        button: {
          testID: 'ok',
          children: 'Ok',
          onClick: () => router.push('/backoffice/lojistas')
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
      setLogo64(base64)
    } catch (err) {
      console.error(err)
    }
  }
  

  useEffect(() => {
    if(fileLogo) {
        handleFileChange(fileLogo as File)
    }
  }, [fileLogo])


  return (
    <main className="flex flex-col gap-4 items-center">
      <Header
        title={{
          children: "Cadastrar Lojista",
        }}
        breadCrumbs={{
          items: [
            {
              label: "Lojistas",
              url: "/backoffice/lojistas",
            },
            {
              label: "Adicionar Lojista",
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
          onClick: handleSubmit(onSubmit),
          loading: sending,
        }}
        secondButton={{
          testID: "cancel",
          children: <>Voltar</>,
          type: "secondary",
          onClick: () => router.push("/backoffice/lojistas"),
        }}
      />
      <Divisor />
      <div className="w-full flex flex-col gap-4 bg-white dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-600 p-8 tall:p-4">
        <div className="flex flex-col gap-0">
          <Title bold="800">Dados Principais</Title>
          <Subtitle size="xs">A informação principal do Lojista.</Subtitle>
        </div>
        <div className="flex space-x-3 items-center flex-wrap md:flex-nowrap justify-center">
          <div className="w-40 h-40 flex-shrink-0">
            <MyDropzoneFiles
                typeFiles={2}
                saveFile={setFileLogo}
                disabled={false}
                mutiple={false}
                className="w-full h-full rounded-full border border-muted-foreground cursor-pointer flex justify-center items-center"
              >
                {!logo64 ? (
                  <div>
                      <p className="font-bold">Selecionar Foto</p>
                  </div>
                ) : (
                  <img 
                    src={logo64}
                    alt=""
                    className="w-full h-full object-cover rounded-full"
                  />
                )}
            </MyDropzoneFiles>
          </div>
          <div className="gap-4 w-full space-y-5">
            <div className="flex flex-wrap gap-4">
            <MaskInput
                inputFieldProps={{
                  testID: 'CNPJ',
                  label: 'CNPJ',
                  mask: '99.999.999/9999-99',
                  input: {
                    ...register('CNPJ'),
                    placeholder: 'Insira o CNPJ da empresa',
                    id: 'CNPJ',
                  }
                }}
                className="flex-1 min-w-[150px]"
                errorMessage={errors.CNPJ?.message as string || undefined}
              />
              <Input
                inputFieldProps={{
                  testID: "nomeFantasia",
                  label: "Nome Fantasia",
                  input: {
                    ...register("NomeFantasia"),
                    placeholder: "Nome Fantasia",
                  },
                }}
                errorMessage={(errors.NomeFantasia?.message as string) || undefined}
                className="flex-1 min-w-[250px]"
              />
              <Input
                inputFieldProps={{
                  testID: "raaoSocial",
                  label: "Razão Social",
                  input: {
                    ...register("RazaoSocial"),
                    placeholder: "Razão Social",
                  },
                }}
                errorMessage={(errors.RazaoSocial?.message as string) || undefined}
                className="flex-1 min-w-[250px]"
              />
              </div>
              <div className="flex flex-wrap gap-4">
              <Input
                inputFieldProps={{
                  testID: "nome",
                  label: "Nome",
                  input: {
                    ...register("Name"),
                    placeholder: "Insira o nome",
                    maxLength: 50,
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
                    type: 'email'
                  },
                }}
                errorMessage={(errors.Email?.message as string) || undefined}
                className="flex-1 min-w-[250px]"
              />
              
              <MaskInput
                inputFieldProps={{
                  mask: "(99) 99999-9999",
                  testID: "phone",
                  label: "Telefone",
                  input: {
                    ...register("Telefone"),
                    placeholder: "Telefone",
                  },
                }}
                errorMessage={(errors.Telefone?.message as string) || undefined}
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
                  },
                }}
                className="flex-1 min-w-[250px]"
            />
            <Input
              inputFieldProps={{
                testID: "state",
                label: "Estado",
                input: {
                  ...register("Estado"),
                  placeholder: "Estado",
                },
              }}
              errorMessage={(errors.Endereco?.message as string) || undefined}
              className="flex-1 min-w-[250px]"
            />
            <Input
                inputFieldProps={{
                  testID: "numero",
                  label: "Número",
                  input: {
                      ...register("Numero"),
                      placeholder: "Número",
                  },
                }}
                className="flex-1 min-w-[250px]"
            />
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
          <Title bold="800">
            Links
          </Title>
          <div className="gap-4 w-full space-y-5">
            <div className="flex flex-wrap gap-4">
              <Input
                inputFieldProps={{
                  testID: "insta",
                  label: "Instagram",
                  input: {
                    ...register("Instagram"),
                  },
                }}
                errorMessage={(errors.Instagram?.message as string) || undefined}
                className="flex-1 min-w-[250px]"
              />
              <Input
                inputFieldProps={{
                  testID: "site",
                  label: "Site",
                  input: {
                    ...register("Site"),
                  },
                }}
                errorMessage={(errors.Site?.message as string) || undefined}
                className="flex-1 min-w-[250px]"
              />
            </div>
          </div>

        </div>
      </div>
      <Alert alert={alert} hideAlert={hideAlert} />
      <Dialog dialog={dialog} hideDialog={hideDialog} />
    </main>
  );
}
