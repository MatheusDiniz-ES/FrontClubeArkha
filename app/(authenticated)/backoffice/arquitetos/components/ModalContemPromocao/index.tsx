'use client'
import { Dialog as Modal, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from "react"
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { CheckCircle, XCircle } from 'lucide-react';
import { useMutation, useQuery } from 'react-query';
import api from '@/lib/api';
import { saveAs } from "file-saver";
import { Dialog } from '@/components/dialog';
import { useDialog } from '@/components/dialog/useDialog';
import useAlert from '@/components/alert/useAlert';
import { Select } from '@/components/Select';
import DecimalInput, { NumberInput } from '@/components/Input';
import { Button } from '@/components/Button';
import Alert from '@/components/alert';



interface ModalProps {
  isOpen: boolean
  onClose: () => void
  showAlert?: ({ title, description, action, type, customIcon }: Alert) => void
}

const schema = yup.object({
  promocao: yup.number().required("Por favor, preencha esse campo!"),
  arquiteto: yup.number().required("Por favor, preencha esse campo!"),
  saldoArquiteto: yup.number().required("saldoArquiteto é obrigatório"),
  pontuacao: yup.number().required("pontuacao é obrigatório"),
})



export function ModalPromo(props: ModalProps) {

  const { register, handleSubmit, formState: { errors }, reset, setValue,watch } = useForm({
    resolver: yupResolver(schema)
  });

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(6)
  const [count, setCount] = useState(0)
  
  const { alert, showAlert, hideAlert } = useAlert();
  const { dialog, showDialog, hideDialog } = useDialog();
  const [idArq, setIdArq] = useState<number | null>()
  const [idPromo, setIdPromo] = useState<number | null>()

  const [arquiteto,setArquiteto] = useState<number | null>()
  const [saldoArquiteto, setSaldoArquiteto] = useState<number | null>()
  const [promo, setPromo] = useState<number | null>()
  const [pontuacao, setPontuacao] = useState<number | null>()
  const [editable,setEditable] = useState(true)

  const { data: dataPromo, refetch: PromoRefecth } = useQuery({
    queryKey: ['getPromo'],
    queryFn: async () => {
      const { data } = await api.get(`/Promocao`);

      return data.data.data ;
    },
    refetchOnWindowFocus: false,
  });

  const { data: dataPromoId, refetch: PromoIdRefecth } = useQuery({
    queryKey: ['getPromo',idPromo],
    queryFn: async () => {
      const { data } = await api.get(`/Promocao/${idPromo}`);
      setPontuacao(data.data.pontuacao)
      return data.data ;
    },
    refetchOnWindowFocus: false,
  });

  

  const { data: dataArq, refetch: ArqRefecth } = useQuery({
    queryKey: ['getArq'],
    queryFn: async () => {
      const { data } = await api.get(`/Arquiteto`);

      return data.data.data ;
    },
    refetchOnWindowFocus: false,
  });

    const { data: dataArqId, refetch: ArqIdRefecth } = useQuery({
    queryKey: ['getArq',idArq],
    queryFn: async () => {
      const { data } = await api.get(`/ContaCorrenteArq/GetSaldo?UsuarioId=${idArq}`);
      setSaldoArquiteto(data.data.totalSaldo)
      return data.data ;
    },
    refetchOnWindowFocus: false,
  });



  const { mutate, isLoading: load } = useMutation({
    mutationFn: async (values: any) => {
      
      const payload = {        
        valorPontuacao: pontuacao,
        usuarioId: idArq,
        promocaoId: idPromo,
        tipo: "Debito"
      }

      const { data } = await api.post(`/ContaCorrenteArq`, payload)
      console.log(data,"conta")
      reset()
      return data
    },
    onSuccess(value) {
      if (value.success) {
        showAlert({
          title: 'Deu tudo certo!',
          description: 'A contemplação realizada com sucesso!',
          type: 'success'
        })
      } else {
        showAlert({
          title: 'Ops, algo deu errado!',
          description: value.message,
          type: 'error',
          customIcon: () => <XCircle />
        })
      }
    },
    onError() {
      showAlert({
        title: 'Ops, algo deu errado!',
        description: 'Contemplação não foi enviada.',
        type: 'error',
        customIcon: () => <XCircle/>
      })
    },
  })

  const onSubmit = (values: any) => {

       if (!pontuacao || pontuacao <= 0) {
      showAlert({
        title: 'Ops, Algo deu errado!',
        description: 'A pontuação deve ser maior que zero.',
        type: 'error',
      })
      return
    }

    if(saldoArquiteto && saldoArquiteto < pontuacao){
       showAlert({
        title: 'Ops, Algo deu errado!',
        description: 'A saldo insuficiente!',
        type: 'error',
      })

      return
    }
    mutate(values)
    props.onClose()
  }

  const close = () => {
    setSaldoArquiteto(0)
    setPontuacao(0)
    props.onClose()
  }

  return (
    <>
      <Transition appear show={props.isOpen} as={Fragment}>
        <Modal as="div" className="relative z-10" onClose={close}>
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
                      Contemplar Prêmio
                    </Modal.Title>

                  </div>
                  <div className='flex flex-wrap '>

                        <div className='grid grid-cols-2 w-full gap-4  mb-4'>
                          <Select
                            testID="arquiteto"
                            label="Arquiteto"
                            options={dataArq && dataArq.length > 0 && dataArq.map((item: any) => ({
                              value: item.id,
                              label: item.nome,
                              text: item.nome
                            }))}
                            select={{
                              // disabled: !editable,
                              // value: arquiteto ?? '',
                              onChange: (e) => {
                                setValue("arquiteto", Number(e.target.value))
                                setArquiteto(Number(e.target.value))
                                setIdArq(Number(e.target.value))
                              },
                            }}
                            className=' w-full min-w-[250px]'
                          />
                           <DecimalInput
                              label="Pontuação Destinada"
                              value={String(watch("saldoArquiteto") || "")}
                              onChange={(value) => setValue("saldoArquiteto", Number(value))}
                              input={{
                                ...register("saldoArquiteto"),
                                value:  saldoArquiteto ? saldoArquiteto : 0,
                                placeholder: "Saldo do Arquiteto",
                                disabled: editable,
                              }}
                              className="flex-1 min-w-[250px]"
                              errorMessage={(errors.saldoArquiteto?.message as string) || undefined}
                            />
                          {/* <NumberInput
                              inputFieldProps={{
                                testID: "",
                                label: "Pontuação do arquiteto",
                                input: {
                                  ...register('pontuacao'),
                                  value: saldoArquiteto ? saldoArquiteto : "",
                                  placeholder: "Informe o valor da pontuação",
                                  thousandSeparator: ".",
                                  decimalScale: 2,
                                  decimalSeparator: ",",
                                  prefix: "R$",
                                  disabled: !editable,
                                  onChange: (e) => {
                                    let valueString = e.target.value;
                                      
                                    // Remove prefixo "R$" se presente
                                    if (valueString.startsWith("R$")) {
                                      valueString = valueString.substring(2).trim();
                                    }
                                    // Remove separadores de milhar e substitui a vírgula por ponto
                                    valueString = valueString.replace(/\./g, '').replace(',', '.');
          
                                    // Converte para número
                                    const value = Number(valueString);
                                      setPontuacao( value)
                                      setValue("pontuacao",Number(value))
                                    // console.log('Processed valueString:', valueString); 
                                    // console.log('Converted value:', value); 
                                  }
                                },
                              }}
                              className='in-w-[250px]'
                              errorMessage={errors.pontuacao?.message}
                            />
                         */}
                      </div>
                      <div className='grid grid-cols-2 w-full gap-4 mb-5'>
                        <Select
                          testID="promo"
                          label="Prêmio"
                          options={dataPromo && dataPromo.length > 0 && dataPromo.map((item: any) => ({
                            value: item.id,
                            label: item.nome,
                            text: item.nome
                          }))}
                          select={{
                            // value: ,
                            // disabled: !editable,
                              onChange: (e) => {
                              setValue("promocao", Number(e.target.value))
                              setPromo(Number(e.target.value))
                              setIdPromo(Number(e.target.value))
                            },
                          }}
                          className=' w-full min-w-[250px]'
                        />

                        <DecimalInput
                          label="Valor do Prêmio"
                          value={String(watch("pontuacao") || "")}
                          onChange={(value) => setValue("pontuacao", Number(value))}
                          input={{
                            ...register("pontuacao"),
                            value: pontuacao && pontuacao.toFixed(0) ? pontuacao : 0,
                            placeholder: "Valor do Prêmio",
                            disabled: editable,
                          }}
                          className="flex-1 min-w-[250px]"
                          errorMessage={(errors.pontuacao?.message as string) || undefined}
                        />
                      </div>
                      <div className='flex w-full flex-wrap'>
                      
                         <div className='w-full flex gap-6 justify-between'>
                           <Button testID="showMoreActions" type="secondary" onClick={() => props.onClose()}>
                            Cancelar
                          </Button>

                          <Button testID="showMoreActions" type="primary" onClick={()=>close()}>
                            Cadastrar
                          </Button>
                         </div>
                      </div>
                     </div>
                </Modal.Panel>
              </Transition.Child>
            </div>
          </div>
        </Modal>
      </Transition>
      <Alert alert={alert} hideAlert={hideAlert} />
      <Dialog dialog={dialog} hideDialog={hideDialog} />
    </>
  )
} 