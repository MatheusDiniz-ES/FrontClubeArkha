'use client'
import { Dialog as Modal, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from "react"
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { CheckCircle, XCircle } from 'lucide-react';
import { useMutation, useQuery } from 'react-query';
import api from '@/lib/api';
import { Alert } from '@/components/alert/useAlert';;
import { saveAs } from "file-saver";

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  showAlert?: ({ title, description, action, type, customIcon }: Alert) => void
  props?: Array<any>;
}

const schema = yup.object({
  Email: yup.string().email("Formato de email inválido.").required("Por favor, preencha esse campo!"),
  Nome: yup.string().required("Por favor, preencha esse campo!"),
  codigo: yup.string().required("campo codigo é obrigatório"),
  nomeCliente: yup.string().required("Nome do Cliente é obrigatório"),
  nomeProjeto: yup.string().required("Nome do Projeto é obrigatório"),
  numContrato: yup.string().required("Numero do Contrato é obrigatório"),
  area: yup.number().required('Selecione a area!'),
  colaborador: yup.number().required('Selecione o associado!'),
  prazo: yup.number(),
  limiteDia: yup.number()

})



export function ModalHistorico(props: ModalProps) {

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(6)
  const [count, setCount] = useState(0)



  

  // const { data: dataProjeto, refetch: Clienterefecth } = useQuery({
  //   queryKey: ['getProjeto'],
  //   queryFn: async () => {
  //     const { data } = await api.get(`/entity/Projetos`);

  //     return data.data.data as ProjetoReturn[];
  //   },
  //   refetchOnWindowFocus: false,
  // });

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema)
  });


  // const { mutate, isLoading: load } = useMutation({
  //   mutationFn: async (values: any) => {
  //     const { data } = await api.post('/Action/run', {
  //       actionName: "SendInviteUser",
  //       params: {
  //         email: values.Email,
  //         name: values.Nome,
  //         revenda_id: user.revendaId
  //       }
  //     })
  //     reset()
  //     return data.data.data as {
  //       message: string
  //       success: boolean
  //     }
  //   },
  //   onSuccess(value) {
  //     if (value.success) {
  //       props.showAlert({
  //         title: 'Deu tudo certo!',
  //         description: 'A solicitação de acesso já foi enviada.',
  //         type: 'success'
  //       })
  //     } else {
  //       props.showAlert({
  //         title: 'Ops, algo deu errado!',
  //         description: value.message,
  //         type: 'error',
  //         customIcon: () => <XCircle />
  //       })
  //     }
  //   },
  //   onError() {
  //     props.showAlert({
  //       title: 'Ops, algo deu errado!',
  //       description: 'E a solicitação de acesso não foi enviada.',
  //       type: 'error',
  //       customIcon: () => <XCircle/>
  //     })
  //   },
  //   onMutate() {
  //     props.onClose()
  //   }
  // })

  return (
    <>
      <Transition appear show={props.isOpen} as={Fragment}>
        <Modal as="div" className="relative z-10" onClose={props.onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-40" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Modal.Panel className="transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left shadow-xl transition-all flex flex-col gap-2 w-[900px]">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center rounded-full p-4 bg-primary-P50-value">
                      <CheckCircle className="w-8 h-8 text-primary-P200-value" />
                    </div>
                    <Modal.Title
                      as="h3"
                      className="text-base md:text-lg font-bold text-gray-800 dark:text-gray-300"
                    >
                      Detalhes Prêmio
                    </Modal.Title>
                  </div>
                </Modal.Panel>
              </Transition.Child>
            </div>
          </div>
        </Modal>
      </Transition>
    </>
  )
} 