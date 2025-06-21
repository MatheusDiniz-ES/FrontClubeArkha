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
import DecimalInput, { Input, MaskInput } from "@/components/Input";
import { useDialog } from "@/components/dialog/useDialog";
import { Dialog } from "@/components/dialog";
import { LuArchive } from "react-icons/lu";
import { MyDropzoneFiles } from "@/components/dropzone";
import { Select } from "@/components/Select";
import { ESTATES } from "@/lib/states";
import { Trash } from "lucide-react";
import { Button } from "@/components/Button";


const schema = yup.object({
  pontuacaoValida: yup.number().required("Pontuação é Necessaria")
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

interface pontuacao{
  usuarioId: number,
  empresaId: number,
  valorPontuacao: number,
  anexo: string
}


export default function CadastroArquiteto() {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profile64, setProfile64] = useState('');
  const [pontuacao, setPontuacao] = useState<number | null>(null);
  const [documentos, setDocumentos] = useState<File[] | null>(null);
  const [documentos64, setDocumentos64] = useState<string[]>([]);
  const { alert, showAlert, hideAlert } = useAlert();
  const { dialog, showDialog, hideDialog } = useDialog();
  const router = useRouter()

  const { register, handleSubmit, control, formState: { errors, isSubmitting }, setValue, reset, watch } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (values: any) => save(values)


  const { mutate: save, isLoading: sending } = useMutation({
    mutationFn: async (values: pontuacao) => {
      await api.post('/Pontuacao', {
        usuarioId: values.usuarioId,
        empresaId: values.empresaId,
        valorPontuacao: values.valorPontuacao,
        anexo: values.anexo
      })
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

  return (
    <main className="flex flex-col gap-4 items-center">
      <Header
        title={{
          children: "Detalhes da Prêmio",
        }}
        breadCrumbs={{
          items: [
            {
              label: "Dashboard",
              url: "/lojista/dashboard",
            },
            {
              label: "Detalhes",
              url: "",
            },
          ],
        }}
        icon={<LuArchive className="w-6 h-6" />}
        // button={{
        //   testID: "add",
        //   children: (
        //     <>
        //       <MdCheck className="w-5 h-5" />
        //       Confirmar Cadastro
        //     </>
        //   ),
        //   onClick: handleSubmit(onSubmit),
        //   loading: sending,
        // }}
        secondButton={{
          testID: "cancel",
          children: <>Voltar</>,
          type: "secondary",
          onClick: () => router.push("/lojista/dashboard"),
        }}
      />
      <Divisor />
      <div className="w-full flex flex-col gap-4 bg-white dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-600 p-8 tall:p-4">
        <div className="flex flex-col gap-0">
          <Title bold="800">Dados Principais</Title>
          <Subtitle size="xs">A informações principais da prêmio</Subtitle>
        </div>
        <div className="flex space-x-3 items-center flex-wrap md:flex-nowrap justify-center">

          <div className="gap-4 w-full space-y-5">
            <div className="flex flex-wrap gap-4 ">

              <Select
                testID="arquiteto"
                label="Arquiteto"
                options={ESTATES.map((state) => ({
                  value: state.sigla,
                  label: state.nome,
                  text: state.nome
                }))}
                select={{
                  // disabled: !editable,
                  // value: value,
                  onChange: (e) => {
                    // onChange(e.target.value)
                  },
                }}
              />
              <Select
                testID="loja"
                label="Loja"
                options={ESTATES.map((state) => ({
                  value: state.sigla,
                  label: state.nome,
                  text: state.nome
                }))}
                select={{
                  // disabled: !editable,
                  // value: value,
                  onChange: (e) => {
                    // onChange(e.target.value)
                  },
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <DecimalInput
                label="Pontuação Destinada"
                value={String(watch("pontuacaoValida") || "")}
                onChange={(value) => {
                  setValue("pontuacaoValida", Number(value))
                  setPontuacao(Number(value))
                }}
                input={{
                  ...register("pontuacaoValida"),
                  placeholder: "Pontuação Destinada para a Prêmio",
                }}
                className="flex-1 min-w-[250px]"
                errorMessage={(errors.pontuacaoValida?.message as string) || undefined}
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
                    typeFiles={2}
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
                  {documentos64?.length > 0 &&
                    documentos64.map((file, index) => (
                      <div className="w-28 h-28 rounded-lg relative" key={index}>
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
                        <img
                          key={index}
                          src={file}
                          className="w-full h-full object-cover rounded-[10px]"
                          alt={`preview-${index}`}
                        />
                      </div>
                    ))
                  }
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
