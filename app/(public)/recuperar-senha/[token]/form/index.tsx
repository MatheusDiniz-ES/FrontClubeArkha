'use client'
import { PasswordInput } from "@/components/Input"
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Button } from "@/components/Button";
import { useRouter } from "next/navigation";
import LabelStrong from "../passwordStrong";
import { MdOutlineLock, MdOutlineLockOpen } from "react-icons/md";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import api from "@/lib/api";
import Cookies from "js-cookie";
import { useUser } from "@/stores/user";
import { useThemeStore } from "@/stores/theme";
import { ErrorApi, handleArea, hashArea } from "@/lib/utils";
import userDefaultImage from '../../../../../public/userDefault.jpg'
// import { useAccessStore, useLoginCompanyStore } from "@/stores/accesses";
import { AxiosError } from "axios";
import { useMutation, useQuery } from "react-query";
import { useDialog } from "@/components/dialog/useDialog";
import { Dialog } from "@/components/dialog";
import { MdWarning } from "react-icons/md";
import { LuAlertCircle, LuCheck, LuCircle } from "react-icons/lu";

interface LoginFormProps {
  setLogged: Dispatch<SetStateAction<boolean>>
  id: string
}

const schema = yup.object({
  Senha: yup.string().matches(/^(?=.*[#@!&])(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).{8,}$/, 'A senha não segue todos os critérios!').required("Por favor, preencha esse campo!"),
  ConfirmarSenha: yup.string().oneOf([yup.ref('Senha')], 'As senhas precisam ser iguais!').required("Por favor, preencha este campo!"),
}).required();

export function Form(props: LoginFormProps) {

  const user = useUser((e: any) => e.user)
  const setUser = useUser((e: any) => e.setUser)
  // const company = useLoginCompanyStore((e: any) => e.company)
  // const setCompany = useLoginCompanyStore((e: any) => e.setCompany)
  // const setColor = useThemeStore((e: any) => e.setColor)
  // const setAccess = useAccessStore((e: any) => e.setAccess)
  const router = useRouter()
  const { dialog, showDialog, hideDialog } = useDialog()

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      Senha: '',
      ConfirmarSenha: ''
    }
  });

  const [senha, SetSenha] = useState('')

  const onSubmit = async (values: any) => mutate(values)

  // const {} = useQuery({
  //   queryKey: ["isValidToken",],
  //   queryFn: async () => {
  //       const { data } = await api.patch(`/Auth`,{
  //         token: `${props.id}`
  //       });
  //   },
  //   onSuccess(){
  //     console.log('TOKEN VÁLIDO')
  //   },
  //   onError(){
  //     showDialog({
  //       isOpen: true,
  //       setIsOpen: () => "",
  //       icon: <MdWarning className="w-6 h-6 text-blue-400" />,
  //       title: `Link Expirado`,
  //       subtitle:
  //         "Olá! O link para redefinir a senha parece ter expirado. Por favor, solicite uma nova redefinição diretamente na página de login.",
  //       button: {
  //         children: `Redirecionar para Login`,
  //         testID: "goBack",
  //         type: "primary",
  //         onClick: async () => {
  //           router.push('/')
  //           hideDialog();
  //         },
  //       },
  //       error: true,
  //     })
  //   },
  //   refetchOnWindowFocus: true,
  //   retry: false,
  // });

  const { mutate } = useMutation({
    mutationKey: ['SendPass', props.id],
    mutationFn: async (values: any) => {
      const { data } = await api.patch(`/Auth`, {
        novaSenha: values.Senha,
        token: props.id
      })
      return data as any
    },
    async onSuccess(data) {

      if(data.success){
        showDialog({
          isOpen: true,
          setIsOpen: () => '',
          title: 'Senha Alterada com sucesso!',
          subtitle: 'A senha foi alterada em nosso banco de dados!',
          icon: <LuCheck className="w-6 h-6" />,
          button: {
            children: "Voltar ao login",
            testID: 'backLogin',
            onClick: () => router.push('/')
          }
        })

      }
      // if (!!data.data.perfilUsuarioModel) {
        // const area = handleArea(data.data.area)
        // const myHasArea = await hashArea(handleArea(data.data.area))
        // Cookies.set('user-area', myHasArea)
        // setColor(data.data.cor)
        // setUser({
        //   nome: data.data.nome,
        //   email: data.data.email,
        //   grupoFornecimento: data.data.grupoFornecimento,
        //   relacionamentoId: data.data.idRelacionamento,
        //   usuarioId: data.data.usuarioId,
        //   imagem: !!data.data.imagem.length ? data.data.imagem : userDefaultImage.src,
        //   perfilUsuarioModel: data.data.perfilUsuarioModel
        // })
        // setCompany({
        //   ...company,
        //   logo: data.data.logo,
        //   id: data.data.idRelacionamento,
        //   cargoResponsavel: data.data.cargoResponsavel,
        //   cnpj: data.data.cnpj,
        //   emailResponsavel: data.data.emailResponsavel,
        //   nomefantasia: data.data.nomefantasia,
        //   nomeResponsavel: data.data.nomeResponsavel,
        //   observacao: data.data.observacao,
        //   telefoneResponsavel: data.data.telefoneResponsavel,
        //   razaoSocial: data.data.razaoSocial
        // })
        //   Cookies.set('user-auth', data.data.token)
        //   if (area == "backoffice" || area == "lojista") {
        //       router.push(`/${area}/usuarios`);
        //   } else {
        //       router.push(`/${area}/usuarios`);
        //   }
        // } else {
        // setAccess({
        //   backoffice: data.data.backoffice || null,
        //   consultoria: data.data.consultorias,
        //   clientes: data.data.clientes,
        //   fornecedores: data.data.fornecedores
        // })
        //   Cookies.set('user-pre-auth', data.data.token)
        //   router.push("/selecionar-login")
        // }
    },
    onError(e: AxiosError<ErrorApi>) {
      if (e?.response?.data?.description == "Token invalido") {
        showDialog({
          isOpen: true,
          setIsOpen: () => '',
          title: 'Token Expirado!',
          subtitle: 'O token informado já foi expirado. Tente pedir uma nova redefinição de senha.',
          icon: <LuAlertCircle className="w-6 h-6" />,
          button: {
            children: "Voltar ao login",
            testID: 'backLogin',
            onClick: () => router.push('/')
          }
        })
      } else {
        setError('Senha', {
          message: 'Sua senha não está no padrão.'
        })
      }
    }
  })

  const regexMin8Digitos = /^.{8,}$/;
  const regexCaractereEspecial = /[#@!&]/;
  const regexNumero = /\d/;
  const regexLetraMaiuscula = /[A-Z]/;
  const regexLetraMinuscula = /[a-z]/;

  return (
    <>
      <div className="flex w-full flex-col gap-6">
        <PasswordInput
          inputFieldProps={{
            testID: 'Senha',
            label: 'Senha',
            input: {
              ...register('Senha'),
              onChange: (e) => {
                SetSenha(e.target.value)
                setValue('Senha', e.target.value)
              },
              disabled: isSubmitting,
              id: 'Senha',
              placeholder: 'Informe sua nova senha'
            }
          }}
          leftIcon={<MdOutlineLock className="w-5 h-5 mx-2" />}
          errorMessage={errors.Senha?.message as string || undefined}
        />
        <h4>Sua nova senha deverá conter:</h4>
        <LabelStrong
          isUsing={regexMin8Digitos.test(senha)}
          text="No mínimo 8 dígitos"
        />
        <LabelStrong
          isUsing={regexCaractereEspecial.test(senha)}
          text="1 caractere especial (#@!&)"
        />
        <LabelStrong
          isUsing={regexNumero.test(senha)}
          text="1 número"
        />
        <LabelStrong
          isUsing={regexLetraMaiuscula.test(senha)}
          text="1 letra maiúscula"
        />
        <LabelStrong
          isUsing={regexLetraMinuscula.test(senha)}
          text="1 letra minúscula"
        />
        <PasswordInput
          inputFieldProps={{
            testID: 'ConfirmarSenha',
            label: 'Confirmar senha',
            input: {
              ...register('ConfirmarSenha'),
              disabled: isSubmitting,
              id: 'ConfirmarSenha',
              placeholder: 'Confirme sua nova senha'
            }
          }}
          leftIcon={<MdOutlineLockOpen className="w-5 h-5 mx-2" />}
          errorMessage={errors.ConfirmarSenha?.message as string || undefined}
        />
        <Button
          testID="Redefinir"
          onClick={handleSubmit(onSubmit)}
          loading={isSubmitting}
        >
          Redefinir
        </Button>
      </div>
      <Dialog dialog={dialog} hideDialog={hideDialog} />
    </>
  )
}