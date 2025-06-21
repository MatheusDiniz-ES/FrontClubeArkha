"use client";
import { Input, PasswordInput } from "@/components/Input";
import { FaRegUser } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { MdOutlineLock } from "react-icons/md";
import { Button } from "@/components/Button";
import { useRouter, usePathname } from "next/navigation";
import api from "@/lib/api";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useMutation } from "react-query";
import { compareArea, handleArea, hashArea } from "@/lib/utils";
import { useUser } from "@/stores/user";
import { useAccessStore } from "@/stores/access";



const schema = yup
  .object({
    Email: yup.string().required("Por favor, preencha esse campo!"),
    Senha: yup.string().required("Por favor, preencha esse campo!"),
  })
  .required();

export function LoginForm({
  setLogged,
}: {
  setLogged: Dispatch<SetStateAction<boolean>>;
}) {

  //const setAccess = useAccessStore((e) => e.setAccess);
  const setUser = useUser((e) => e.setUser);
  const setAccess = useAccessStore((e) => e.setAccess);
  const router = useRouter();

  const [area, setArea] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    getValues,

  } = useForm({
    resolver: yupResolver(schema),
  });

  const { mutate, isLoading: sending } = useMutation({
    mutationFn: async (values: any) => {
        const { data } = await api.post("/Auth", {
            login: values.Email,
            senha: values.Senha,
            // relacionamentoId: 2
        });
       

        if(data.data.area){
          const myHasArea = hashArea(data.data.area.toLowerCase());
          Cookies.set('user-area', myHasArea)
          const area = compareArea(myHasArea)

          setUser({
            area: area,
            expiration: data.data.expiration,
            relacionamentoId: data.data.relacionamentoId,
            token: data.data.token,
            usuarioEmail: data.data.usuarioEmail,
            usuarioId: data.data.uaurioId,
            usuarioNome: data.data.usuarioNome,
            empresaId: data.data.empresaId
          });
          Cookies.set("user-pre-auth", data.data.token);
          Cookies.set("user-auth", data.data.token);
          setLogged(true);
          router.push(`/${area}/usuarios`);
          return
        }
        setAccess({
            backoffice: data.data.backoffice || null,
            lojistas: data.data.lojistas,
        });

        setLogged(true);
        Cookies.set("user-pre-auth", data.data.token);
        Cookies.set("user-auth", data.data.token);
        router.push(`/selecionar-login`);
        
    },
    onError(error) {
        setError("Email", {
            message: "E-mail inválidos, tente novamente!",
        });
        setError("Senha", {
            message: "Senha inválidos, tente novamente!",
        });
    },
});

  const onSubmit = (values: any) => {
    mutate(values)
  };

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Enter" || event.key === "NumpadEnter") {
        event.preventDefault();
        onSubmit(getValues());
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <div className="flex w-full flex-col gap-6">
        <Input
          inputFieldProps={{
            testID: "Email",
            label: "Usuário / e-mail",
            input: {
              ...register("Email"),
              disabled: isSubmitting,
              id: "Email",
              placeholder: "Insira seu nome de usuário ou e-mail",
            },
          }}
          leftIcon={<FaRegUser className="w-4 h-4 mx-2" />}
          errorMessage={(errors.Email?.message as string) || undefined}
        />
        <PasswordInput
          inputFieldProps={{
            testID: "Senha",
            label: "Senha",
            input: {
              ...register("Senha"),
              disabled: isSubmitting,
              id: "Senha",
              placeholder: "Insira sua senha",
            },
          }}
          leftIcon={<MdOutlineLock className="w-5 h-5 mx-2" />}
          errorMessage={(errors.Senha?.message as string) || undefined}
          message={
            <>
              <span
                className="text-[#BF9006] cursor-pointer hover:underline"
                onClick={() => router.push("/esqueceu-sua-senha")}
              >
                Esqueceu sua senha?
              </span>
            </>
          }
        />
        <Button
          testID="Entrar"
          onClick={handleSubmit(onSubmit)}
          loading={sending}
          color={"#BF9006"}
        >
          Entrar
        </Button>
      </div>
    </>
  );
}
