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
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import { Input, MaskInput } from "@/components/Input";
import { useDialog } from "@/components/dialog/useDialog";
import { Dialog } from "@/components/dialog";
import { LuArchive } from "react-icons/lu";
import { MyDropzoneFiles } from "@/components/dropzone";
import { Select } from "@/components/Select";
import { ESTATES } from "@/lib/states";
import ButtonToggle from "@/components/ButtonToggle";
import { Button } from "@/components/Button";
import Icon from "react-multi-date-picker/components/icon";
import { Plus } from "lucide-react";


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
  Socios: yup.boolean().required(),
  ImagemPerfil: yup.string(),
  ArquitetoSocios: yup
  .array()
  .when("Socios", {
    is: (socios: boolean) => socios === true,
    then: (schema) =>
      schema
        .min(1, "É necessário inserir ao menos um sócio")
        .of(
          yup.object({
            nomeSocio: yup.string().required("Nome do sócio é obrigatório"),
            dataNascimento: yup
              .string()
              .required("Data de nascimento é obrigatória"),
            celular: yup.string().required("Celular é obrigatório"),
          })
        ),
    otherwise: (schema) => schema.notRequired(),
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
interface ArquitetoPost {
  Nome: string,
  QuantidadeColaboradores: string | null,
  Instagram: string,
  Socios: boolean,
  ImagemPerfil: string,
  Telefone: string,
  Cpf: string,
  Cep: string,
  Cidade: string,
  Estado: string,
  Cau: string,
  Email: string,
  Endereco: string,
  Id: number,

  ArquitetoSocios: {
    nomeSocio: string;
    dataNascimento: string,
    celular: string
  }[];
  Escritorio: string;
  
  DataNascimento: string;
  Profissao: string;
  EnderecoEscritorio: string;
  Facebook: string;
  Site: string;
  CNPJ:string;
  NomeDivulgacao:string;
  Bairro: string;
  Numero: string;
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




export default function CadastroArquiteto() {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profile64, setProfile64] = useState('');

  const { alert, showAlert, hideAlert } = useAlert();
  const { dialog, showDialog, hideDialog } = useDialog();
  const router = useRouter()
  // const [socios,setSocios] = useState(false);
  const { register, handleSubmit, control, formState: { errors, isSubmitting }, setValue, reset, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ArquitetoSocios: [{ nomeSocio: "", dataNascimento: "", celular: "" }],
      Socios: false,
    },
  });
 const [CNPJ,setCNPJ] = useState('')


  const { fields, append, remove } = useFieldArray({
    control,
    name: "ArquitetoSocios"
  });
  const sociosArq = watch("Socios");

  const onSubmit = async (values: any) => save(values)

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

  const { mutate: save, isLoading: sending } = useMutation({
    mutationFn: async (values: ArquitetoPost) => {

      const payload = {
        nome: values.Nome,
        imagemPerfil: profile64,
        telefone: values.Telefone,
        cpf: values.Cpf,
        cep: values.Cep,
        cidade: values.Cidade,
        estado: values.Estado,
        cau: values.Cau,
        email: values.Email,
        endereco: values.Endereco,
        ...(sociosArq && { quantidadeColaboradores: Number(values.QuantidadeColaboradores)}),
        ...(sociosArq && { arquitetoSocios: values.ArquitetoSocios }),
        socios: values.Socios,
        status: "Ativo",
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
        numero: values.Numero
      }

      console.log(payload)

      const {data} = await api.post('/Arquiteto', payload)
      return data as {
        description: string
      }
    },
    onSuccess(data) {
      showDialog({
        isOpen: true,
        setIsOpen: () => '',
        icon: <MdCheckCircle className="w-4 h-4" />,
        title: 'Cadastro concluída com sucesso!',
        subtitle: 'O cadastro do arquiteto foi concluído com êxito.',
        button: {
          testID: 'ok',
          children: 'Ok',
          onClick: () => router.push('/backoffice/arquitetos')
        }
      })
    },
    onError(e: any) {
        const description =
          e?.response?.data?.description || 
          e?.description || 
          e?.message || 
          'Erro desconhecido';

      showAlert({
        title: 'Ops, algo deu errado!',
        description: `${description}`,
        type: 'error'
      })
    }
  })

  const { } = useQuery({
    queryKey: ['get-integracao-cep'],
    queryFn: async () => {
      const { data } = await api.get(`/Integracao/CEP/${watch('Cep')?.replace(/-/g, '')}`)
      return data.data as GetResponseIntegracaoCEP
    },
    enabled: watch('Cep') ? true : false,
    onSuccess: (response) => {
      setValue("Cidade", response.localidade)
      setValue("Estado", response.uf)
      setValue("Endereco", response.logradouro)
      setValue("Bairro", response.bairro)
    },
    onError: () => {
      setValue("Cidade", '')
      setValue("Estado", '')
      setValue("Endereco", '')
      setValue("Bairro", '')   
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
    if (profileImage) {
      handleFileChange(profileImage as File)
    }
  }, [profileImage])

  return (
    <main className="flex flex-col gap-4 items-center">
      <Header
        title={{
          children: "Cadastrar Arquiteto",
        }}
        breadCrumbs={{
          items: [
            {
              label: "Arquitetos",
              url: "/backoffice/Arquiteto",
            },
            {
              label: "Adicionar Arquiteto",
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
          onClick: handleSubmit(onSubmit, onError),
          loading: sending,
        }}
        secondButton={{
          testID: "cancel",
          children: <>Voltar</>,
          type: "secondary",
          onClick: () => router.push("/backoffice/arquitetos"),
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
                    type: 'email'
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
                    ...register('CNPJ'),
                    placeholder: 'Insira o CNPJ da empresa',
                    id: 'CNPJ',
                    onChange: (e:any) => setCNPJ(e.target.value)
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
                  },
                }}
                errorMessage={(errors.Cpf?.message as string) || undefined}
                className="flex-1 min-w-[250px]"
              />
              <MaskInput
                inputFieldProps={{
                  testID: "DataNascimento",
                  label: "Data Nascimento",
                  mask: "99/99/9999",
                  input: {
                    ...register("DataNascimento"),
                    placeholder: "Insira o Data Nascimento",
                   
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
                  maxLength: 50,
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
                  type: 'text'
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
                  type: 'text'
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
                  type: 'text'
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
                  type: 'text'
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

            <Input
              inputFieldProps={{
                testID: "bairro",
                label: "Bairro",
                input: {
                  ...register("Bairro"),
                  placeholder: "Bairro",
                  maxLength: 100,
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
                },
              }}
              errorMessage={(errors.numero?.message as string) || undefined}
              className="flex-1 min-w-[250px]"
            />
          </div>
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
            onToggle={() => setValue("Socios",!sociosArq)} 
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
                  type: 'text'
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
                  maxLength: 50,
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
                },
              }}
              errorMessage={(errors.QuantidadeColaboradores?.message as string) || undefined}
              className="flex-1 min-w-[250px]"
            />

              {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 w-full">
                
                <Input
                  inputFieldProps={{
                    testID: `socio-${index}`,
                    label: `Sócio ${index + 1}`,
                    input: {
                      ...register(`ArquitetoSocios.${index}.nomeSocio`, {
                        required: "Campo obrigatório",
                        minLength: { value: 3, message: "No mínimo 3 caracteres" },
                      }),
                      placeholder: "Nome do sócio",
                    },
                  }}
                  errorMessage={(
                    (errors.ArquitetoSocios?.[index] as import("react-hook-form").FieldErrorsImpl<any>)?.nomeSocio?.message as string
                  ) || undefined}
                />
                <MaskInput
                  inputFieldProps={{
                    testID: `DataNascimento-${index}`,
                    label: `Data Nascimento ${index + 1}`,
                    mask: "99/99/9999",
                    input: {
                      ...register(`ArquitetoSocios.${index}.dataNascimento`),
                      placeholder: "Insira o Data Nascimento",
                    },
                  }}
                  errorMessage={(
                    (errors.ArquitetoSocios?.[index] as import("react-hook-form").FieldErrorsImpl<any>)?.dataNascimento?.message as string
                  ) || undefined}
                  className="flex-1 min-w-[250px]"
                />
                <MaskInput
                    inputFieldProps={{
                      testID: "phone-${index}",
                      label: `Telefone ${index + 1}`,
                      mask: "(99) 99999-9999",
                      input: {
                        ...register(`ArquitetoSocios.${index}.celular`),
                        placeholder: "Telefone",
                      },
                    }}
                    errorMessage={((errors.ArquitetoSocios?.[index] as import("react-hook-form").FieldErrorsImpl<any>)?.celular?.message as string) || undefined}
                    className="flex-1 min-w-[250px]"
                  />
                {
                  index <= 0 &&
                  <Button
                    testID="add-socio-button"
                    type="primary"
                    onClick={() => append({ nomeSocio: "", dataNascimento: "", celular: "" })}
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
            ))}
           
          </div>
        

        </div>
      
      }
      <Alert alert={alert} hideAlert={hideAlert} />
      <Dialog dialog={dialog} hideDialog={hideDialog} />
    </main>
  );
}
