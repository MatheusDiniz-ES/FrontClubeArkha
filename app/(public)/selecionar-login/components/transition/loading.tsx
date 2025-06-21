import Alert from "@/components/alert";
import useAlert from "@/components/alert/useAlert";
import api from "@/lib/api";
import { hashArea } from "@/lib/utils";
// import { useLoginCompanyStore } from "@/stores/accesses";
import { useThemeStore } from "@/stores/theme";
import { useUser } from "@/stores/user";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import Lottie from "lottie-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery } from "react-query";
//import logo from "../../../../../public/logo.png";
import userDefaultImage from "../../../../../public/userDefault.jpg";
import gif from "./waitingGif.json";
import logo from "../../../../../public/Logo.svg"

interface Loading {
    area: {
        id?: number;
        area: string;
        cnpj?: string;
        logo?: string;
        nomefantasia?: string;
        empresaId?: any
    };
}

export default function Loading(props: Loading) {
    const user = useUser((e) => e.user);
    const setUser = useUser((e) => e.setUser);
    //const setCompany = useLoginCompanyStore((e) => e.setCompany);
    const setColor = useThemeStore((e) => e.setColor);
    const router = useRouter();
    const { alert, hideAlert, showAlert } = useAlert();

    const {} = useQuery({
        queryFn: async () => {
            const { data } = await api.patch("/Auth/token", {
                relacionamentoId: props.area.id,
                token: Cookies.get("user-auth"),
            });
            
             console.log(">>>>>>>>>>>>",data)
            Cookies.set("user-auth", data.data.token);
            return data.data as {
                cor: "cyan" | "orange" | "violet" | "emerald";
                area: string;
                expiration: string;
                relacionamentoId: number,
                token: string,
                usuarioEmail: string;
                usuarioId: number
                usuarioNome: string
                empresaId: number
            };
        },
        async onSuccess(data) {
            setColor(data.cor);
            const myHasArea = await hashArea(props.area.area);
            Cookies.set("user-area", myHasArea);

           
            setUser({
                area: props.area.area,
                expiration: data.expiration,
                relacionamentoId: data.relacionamentoId,
                token: data.token,
                usuarioEmail: data.usuarioEmail,
                usuarioId: data.usuarioId,
                usuarioNome: data.usuarioNome,
                empresaId: data.empresaId
            });

            // setCompany({
            //     ...props.area,
            //     id: data.idRelacionamento,
            //     cargoResponsavel: data.cargoResponsavel,
            //     emailResponsavel: data.emailResponsavel,
            //     nomeResponsavel: data.nomeResponsavel,
            //     observacao: data.observacao,
            //     telefoneResponsavel: data.telefoneResponsavel,
            //     logo: data.logo,
            //     razaoSocial: data.razaoSocial,
            // });

            Cookies.remove("user-pre-auth");

            setTimeout(() => {
                router.push(`/${props.area.area}/usuarios`);
            }, 700);
        },
        onError(error) {
            showAlert({
                title: "Algo deu errado!",
                description: "Estamos te redirecionando pro login.",
                type: "error",
            });
            router.push("/");
        },
        refetchOnReconnect: false,
        refetchIntervalInBackground: false,
        refetchOnWindowFocus: false,
        retry: false,
    });

    return (
        <>
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed z-[100] top-0 right-0 bottom-0 left-0 flex flex-col gap-12 items-center justify-center bg-cover"
            >
                <div className="absolute top-0 bottom-0 right-0 left-0 bg-white opacity-95" />
                <Image
                    src={logo.src}
                    height={500}
                    width={500}
                    alt="Logo do sistema"
                    className="w-[280px] sm:w-[373px] static z-10"
                />
                <Lottie
                    animationData={gif}
                    className="w-8 md:w-12 lg:w-16 static z-10"
                />
            </motion.div>
            <Alert alert={alert} hideAlert={hideAlert} />
        </>
    );
}
