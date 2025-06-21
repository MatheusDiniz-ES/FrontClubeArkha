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
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Input } from "@/components/Input";
import { useDialog } from "@/components/dialog/useDialog";
import { Dialog } from "@/components/dialog";
import { LuArchive } from "react-icons/lu";

const schema = yup.object({
  Name: yup.string().min(3, "Insira pelo menos 3 caracteres!").max(50, "Máximo de 50 caracteres!").required("Por favor, preencha esse campo!"),
  Email: yup.string().email("Insira um e-mail válido!").required("Por favor, preencha esse campo!"),
  Senha: yup
    .string()
    .required('Senha é obrigatória')
    .min(6, 'A senha deve ter no mínimo 6 caracteres')
});

export default function CadastroUsuario() {

  const { alert, showAlert, hideAlert } = useAlert();
  const { dialog, showDialog, hideDialog } = useDialog();
  const router = useRouter()

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, reset } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (values: any) => save(values)


  const { mutate: save, isLoading: sending } = useMutation({
    mutationFn: async (values: any) => {
      const {data} = await api.post('/Usuario', { 
        nome: values.Name,
        email: values.Email || '',
        senha: values.Senha || '',
        isArquiteto: false,
        area: "Lojista"
      })
      return data as {
        description: string
      }
    },
    onSuccess() {
      showDialog({
        isOpen: true,
        setIsOpen: () => '',
        icon: <MdCheckCircle className="w-4 h-4" />,
        title: 'Cadastro concluída com sucesso!',
        subtitle: 'O cadastro de usuário foi concluído com êxito.',
        button: {
          testID: 'ok',
          children: 'Ok',
          onClick: () => router.push('/lojista/usuarios')
        }
      })
    },
    onError(e:any) {
      const descripition = e?.response?.data.description
      showAlert({
        title: 'Ops, algo deu errado!',
        description: `${descripition}`,
        type: 'error'
      })
    }
  })


  return (
    <main className="flex flex-col gap-4 items-center">
      <Header
        title={{
          children: "Cadastrar Usuário",
        }}
        breadCrumbs={{
          items: [
            {
              label: "Usuário",
              url: "/lojista/usuarios",
            },
            {
              label: "Adicionar Usuário",
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
          onClick: () => router.push("/lojista/usuarios"),
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
              errorMessage={(errors.Name?.message as string) || undefined}
              className="flex-1 min-w-[250px]"
            />
            <Input
              inputFieldProps={{
                testID: "password",
                label: "Senha",
                input: {
                  ...register("Senha"),
                  placeholder: "Insira uma Senha",
                  maxLength: 150,
                  type: 'password'
                },
              }}
              errorMessage={(errors.Name?.message as string) || undefined}
              className="flex-1 min-w-[250px]"
            />
          </div>
        </div>
      </div>
      <Alert alert={alert} hideAlert={hideAlert} />
      <Dialog dialog={dialog} hideDialog={hideDialog} />
    </main>
  );
}
