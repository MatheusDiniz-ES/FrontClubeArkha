"use client";
import { Header } from "@/components/Header";
import { Divisor } from "@/components/Divisor";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import api from "@/lib/api";
import Alert from "@/components/alert";
import useAlert from "@/components/alert/useAlert";
import {
    MdCheck,
    MdDeviceHub,
    MdErrorOutline,
    MdOutlineDownloading,
} from "react-icons/md";
import { HiOutlinePencil } from "react-icons/hi";
import { Title } from "@/components/Title";
import { Subtitle } from "@/components/Subtitle";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import DecimalInput, { Input, MaskInput } from "@/components/Input";
import { useDialog } from "@/components/dialog/useDialog";
import { Dialog } from "@/components/dialog";
import { LuArchive } from "react-icons/lu";
import { AxiosError } from "axios";
import { ErrorApi } from "@/lib/utils";
import { MyDropzoneFiles } from "@/components/dropzone";

import 'react-quill/dist/quill.snow.css';
import dynamic from "next/dynamic";
import { Button } from "@/components/Button";
import { Trash } from "lucide-react";
import { MultiSelectize } from "@/components/MultiSelectize";
import { Lojistas } from "../lojistas/page";
import { BsFileEarmarkWord, BsFilePdf } from "react-icons/bs";

const QuillNoSSRWrapper = dynamic(() => import('react-quill'), {
    ssr: false,
    loading: () => <p>Carregando editor...</p>,
});

const schema = yup.object({
    Descricao: yup.string(),
    Banner: yup.string().notRequired(),
});

interface Selected {
    text: string
    value: string
}[]

interface PromocaoSendRequest {
    NamePromotion: string
    Descricao: string
    DataInicio: string
    DataFim: string
    pontuacaoValida: number;
}

interface Promocao {
    id: string;
    texto: string;
    anexos?: { value: string }[];

}

export default function EditGrupoPage({
    params,
}: {
    params: { id: string };
}) {
    const [fileArq, setFileArq] = useState<File[] | null>(null);
    const [file64, setFile64] = useState<string[]>([]);

    const [documentos, setDocumentos] = useState<File[] | null>(null);
    const [documentos64, setDocumentos64] = useState<string[]>([]);

    const [editorLoaded, setEditorLoaded] = useState(false);
    const [selectsLojistas, setSelectsLojistas] = useState<Selected[]>([])


    const [fileVerificacao, setFileVerificacao] = useState<string[]>([]);

    const [documentosVerificacao, setDocumentosVerificacao] = useState<string[]>([]);

    const { alert, showAlert, hideAlert } = useAlert();
    const { dialog, showDialog, hideDialog } = useDialog();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        setValue,
        reset,
        watch,
        control
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [editable, setEditable] = useState(false);


   
  const handleFileChange = async (files: File[]) => {
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
      setFile64(base64List);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (fileArq) {
      handleFileChange(fileArq as File[])
    }
  }, [fileArq])

    useEffect(() => {
        if (typeof document !== 'undefined') {
            setEditorLoaded(true);
        }
    }, []);

    const onSubmit = async (values: any) => save(values);

    const {data} = useQuery({
        queryKey: ["getPolitica"],
        queryFn: async () => {
            const { data } = await api.get<{
                data: Promocao;
            }>(`/PoliticaPrivacidade/1`);
            return data.data;
        },
        onSuccess(value) {
            setValue('Descricao', value.texto)
        },
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
    });

    console.log(data,"kenji")

    const { mutate: save, isLoading: sending } = useMutation({
        mutationFn: async (values: PromocaoSendRequest) => {

            const payload: any = {
                id: 1,
                texto: values.Descricao || "",
            };

            await api.put(`/PoliticaPrivacidade`, payload);
        },
        onSuccess() {
            showAlert({
                title: "Edição concluída com sucesso!",
                description: "A edição de politica de privacidade foi concluída com êxito.",
                type: "success",
            });
            setEditable(false);
        },
        onError(error: AxiosError<ErrorApi>) {
            showAlert({
                title: "Ops, algo deu errado!",
                description: "A edição não pode ser concluída",
                type: "error",
            });
        },
    });


    return (
        <main className="flex flex-col gap-4 items-center">
            <Header
                title={{
                    children: '',
                }}
                breadCrumbs={{
                    items: [
                        {
                            label: "Politicas de Privacidade",
                            url: "/backoffice/politica-privacidade",
                        },
                        {
                            label: "Visualização Interna",
                            url: "",
                        },
                    ],
                }}
                icon={<LuArchive className="w-6 h-6" />}
                button={{
                    testID: "edit",
                    children: editable ? (
                        <>
                            <MdCheck className="w-5 h-5" />
                            Salvar Alterações
                        </>
                    ) : (
                        <>
                            <HiOutlinePencil className="w-5 h-5" />
                            Editar Informações
                        </>
                    ),
                    onClick: editable ? handleSubmit(onSubmit) : () => setEditable(true),
                    loading: sending,
                }}
                // secondButton={{
                //     testID: "cancel",
                //     children: editable ? <>Cancelar</> : <>Voltar</>,
                //     type: "secondary",
                //     onClick: editable
                //         ? () => setEditable(false)
                //         : () => router.push("/backoffice/grupo"),
                // }}
            />
            <Divisor />
            <div className="w-full flex flex-col gap-4 bg-white dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-600 p-8 tall:p-4">
                <div className="flex flex-col gap-0">
                    <Title bold="800">Dados Principais</Title>
                    <Subtitle size="xs">A informação principais de politica de privacidade</Subtitle>
                </div>
                <div className="gap-4 w-full space-y-5">

                    {editorLoaded ? (
                        <>
                            <Subtitle bold="semibold" className="m-0 p-0 text-sm">Texto</Subtitle>
                            {/* @ts-ignore */}
                            <Controller
                                name="Descricao"
                                control={control}
                                render={({ field: { name, onChange, value, disabled } }) => {
                                    return (
                                        <QuillNoSSRWrapper
                                            readOnly={disabled}
                                            value={value}
                                            onChange={onChange}
                                            className="h-500 text-wrap rounded w-full border whitespace-pre-wrap
                  border-gray-400 dark:border-gray-600 gap-2 p-2 bg-white 
                  dark:bg-gray-750 focus-within:ring-2 focus-within:ring-cyan-300 
                  dark:focus-within:ring-main-500 focus-within:border-none focus-within:!bg-white
                  dark:focus-within:!bg-gray-700 dark:focus-within:text-gray-300 
                  focus-within:text-gray-500 [&:has(textarea:disabled)]:!bg-gray-200 
                  [&:has(textarea:disabled)]:!ring-0 [&:has(textarea:disabled)]:!border [&:has(textarea:disabled)]:!border-gray-300 [&:has(textarea:disabled)]:!text-gray-500 dark:[&:has(textarea:disabled)]:!bg-gray-600 dark:[&:has(textarea:disabled)]:border-gray-500 dark:[&:has(textarea:disabled)]:!text-gray-300"
                                            modules={{
                                                toolbar: [
                                                    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                                    [{ 'size': [] }],
                                                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                                                    ['link', 'image', 'video'],
                                                    ['clean']
                                                ],
                                            }}
                                            formats={[
                                                'header', 'font', 'size',
                                                'bold', 'italic', 'underline', 'strike', 'blockquote',
                                                'list', 'bullet', 'indent',
                                                'link', 'image', 'video'
                                            ]}
                                        />
                                    )
                                }}
                            />
                        </>
                    ) : (
                        <p className="text-white">Carregando editor...</p>
                    )}
                </div>
            </div>
            <Alert alert={alert} hideAlert={hideAlert} />
            <Dialog dialog={dialog} hideDialog={hideDialog} />
        </main>
    );
}
