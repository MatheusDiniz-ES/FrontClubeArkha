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
import { HiOutlinePencil } from "react-icons/hi";
import { Title } from "@/components/Title";
import { Subtitle } from "@/components/Subtitle";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Input } from "@/components/Input";
import { useDialog } from "@/components/dialog/useDialog";
import { Dialog } from "@/components/dialog";
import { LuArchive } from "react-icons/lu";

import { Usuarios } from "../page";
import { AxiosError } from "axios";
import { ErrorApi } from "@/lib/utils";

const schema = yup.object({
  Name: yup.string().min(3, "Insira pelo menos 3 caracteres!").max(50, "Máximo de 50 caracteres!").required("Por favor, preencha esse campo!"),
  Email: yup.string().email("Insira um e-mail válido!").required("Por favor, preencha esse campo!"),
})

export default function EditUser({ params }: { params: { id: string } }) {

  const { alert, showAlert, hideAlert } = useAlert();
  const { dialog, showDialog, hideDialog } = useDialog();
  const router = useRouter()

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError, setValue, reset, watch } = useForm({
    resolver: yupResolver(schema)
  });

  const [editable, setEditable] = useState(false)


  const onSubmit = async (values: any) => save(values)

  const {} = useQuery({
    queryKey: ['getInfo', params.id],
    queryFn: async () => {
      const { data } = await api.get<{
        data: Usuarios
      }>(`/Usuario/${params.id}`)
      return data.data
    },
    onSuccess(value) {
      setValue('Name', value.nome)
      setValue('Email', value.email)
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  })


  const { mutate: save, isLoading: sending } = useMutation({
    mutationFn: async (values: any) => {
      await api.put(`/Usuario`, { 
        id: params.id,
        nome: values.Name,
        email: values.Email || '',
        isArquiteto: false
      })
    },

    onSuccess() {
      showAlert({
        title: 'Edição concluída com sucesso!',
        description: 'A edição do usuário foi concluída com êxito.',
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

  return (
    <main className="flex flex-col gap-4 items-center">
      <Header
        title={{
          children: ''
        }}
        breadCrumbs={{
          items: [
            {
              label: "Usuários",
              url: '/backoffice/usuarios'
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
          onClick: editable ? () => setEditable(false) : () => router.push('/backoffice/usuarios')
        }}
      />
      <Divisor />
      <div className="w-full flex flex-col gap-4 bg-white dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-600 p-8 tall:p-4">
        <div className="flex flex-col gap-0">
          <Title bold="800">Dados Principais</Title>
          <Subtitle size="xs">A informação principal do Usuário.</Subtitle>
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
              errorMessage={(errors.Email?.message as string) || undefined}
              className="flex-1 min-w-[250px]"
            />
          </div>
        </div>
      </div>

      <Alert alert={alert} hideAlert={hideAlert} />
      <Dialog dialog={dialog} hideDialog={hideDialog} />
    </main>
  )
}
