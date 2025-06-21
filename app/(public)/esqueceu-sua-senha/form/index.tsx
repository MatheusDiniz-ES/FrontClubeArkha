'use client'
import { Input } from "@/components/Input"
import { FaRegUser } from "react-icons/fa"
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Button } from "@/components/Button";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import api from "@/lib/api";
import Cookies from "js-cookie";

interface LoginFormProps {
  setLogged: Dispatch<SetStateAction<boolean>>
}

const schema = yup.object({
  Email: yup.string().required("Por favor, preencha esse campo!"),
}).required();

export function Form(props: LoginFormProps) {

  const router = useRouter()

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (values: any) => {
    try {
      await api.post(`/Auth/${values.Email}`)
      props.setLogged(true)
    } catch (e) {
      console.log(e)
      setError('Email', {
        message: 'Usuário não possui e-mail, favor verificar com o administrador'
      })
    }
  }

  return (
    <>
      <div className="flex w-full flex-col gap-6">
        <Input
          inputFieldProps={{
            testID: 'Email',
            label: 'Usuário / e-mail',
            input: {
              ...register('Email'),
              disabled: isSubmitting,
              id: 'Email',
              placeholder: 'Informe seu e-mail ou usuário'
            }
          }}
          leftIcon={<FaRegUser className="w-4 h-4" />}
          errorMessage={errors.Email?.message as string || undefined}
        />
        <Button
          testID="enviar"
          onClick={handleSubmit(onSubmit)}
          loading={isSubmitting}
        >
          Enviar
        </Button>
        <Button
          testID="Voltar"
          type="secondary"
          onClick={() => router.push('/')}
        >
          Voltar ao login
        </Button>
      </div>
    </>
  )
}