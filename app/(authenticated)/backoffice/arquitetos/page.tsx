"use client";

import { Header } from "@/components/Header";
import { AiOutlinePlus } from "react-icons/ai";
import { Divisor } from "@/components/Divisor";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { QueryClient, useMutation, useQuery, useQueryClient } from "react-query";
import api from "@/lib/api";
import { Dialog } from "@/components/dialog";
import Alert from "@/components/alert";
import { useDialog } from "@/components/dialog/useDialog";
import useAlert from "@/components/alert/useAlert";
import { LuArchive } from "react-icons/lu";
import { TableArquitetosList } from "./components/Table";
import { ModalPromo } from "./components/ModalContemPromocao";

const queryBackofficeProvider = new QueryClient();

export interface Arquitetos {
  id: number
  nome: string;
  imagemPerfil: string;
  telefone: string;
  cpf: string;
  cep: string;
  cidade: string;
  estado: string;
  cau: string;
  email: string;
  endereco: string;
  status: 'Ativo' | 'Inativo' | 'AguardandoAprovacao' | 'Reprovado';
}

export default function ArquitetoPage() {
  const router = useRouter();
  const { dialog, hideDialog } = useDialog();
  const { alert, showAlert, hideAlert } = useAlert();
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient()

  const queryFilters: any =
    queryBackofficeProvider.getQueryData("GetArquitetosListing");

  const [page, setPage] = useState(
    queryFilters?.page ? (queryFilters?.page! as number) : 1
  );
  const [limit, setLimit] = useState(
    queryFilters?.limit ? (queryFilters?.limit! as number) : 5
  );
  const [count, setCount] = useState(queryFilters?.count || 0);
  const [sorting, setSorting] = useState({
    field: queryFilters?.field ? (queryFilters?.field! as string) : "id",
    direction: queryFilters?.direction
      ? (queryFilters?.direction! as string)
      : "desc",
  });

  const [filter, setFilter] = useState<{
    status: string;
  }>(
    queryFilters?.filter
      ? (queryFilters?.filter! as any)
      : {
          status: "ativo",
        }
  );

  const [name, setName] = useState(queryFilters?.name || "");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['get-arquitetos', page, limit, sorting.field, sorting.direction, name, filter],
    queryFn: async () => {
      const { data } = await api.get(
        `/Arquiteto?PageSize=${limit}&PageNumber=${page}&SortField=${sorting.field}&SortOrder=${
          sorting.direction
        }${(name && `&Value=${name}`) || ""}`
      );
      queryBackofficeProvider.setQueryData("GetArquitetosListing", {
        page,
        limit,
        count: data.data.total,
        field: sorting.field,
        direction: sorting.direction,
        filter,
        name
      });
      setCount(data.data.total);
      return data.data.data as Arquitetos[];
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  });

  const { mutate: desativar } = useMutation({
    mutationFn: async (id: number) => {
      await api.patch(`/Arquiteto/desativar/${id}`);
    },
    onSuccess: (_, { id }: any) => {
      showAlert({
        title: `Inativação concluída com sucesso!`,
        description: `A inativação do arquiteto foi concluída com êxito.`,
        type: "error",
      });
      //updateStatus(id, 'Inativo')
      refetch()
    },
  });

  const { mutate: ativar } = useMutation({
    mutationFn: async (id: number) => {
      await api.patch(`/Arquiteto/ativar/${id}`);
    },
    onSuccess: (_, { id }: any) => {
      showAlert({
        title: `Ativação concluída com sucesso!`,
        description: `A ativação do arquiteto foi concluída com êxito.`,
        type: "success",
      });
      refetch()
      //updateStatus(id, 'Ativo')
    },
  });
/*
  function updateStatus(userId: number, status: string){

    const cached = queryClient.getQueriesData<Arquitetos[]>({
        queryKey: ['get-arquitetos']
    })

    cached.forEach(([cacheKey, cacheData]) => {
        if(!cacheData){
            return
        }

        console.log(cacheKey, cacheData)

        queryClient.setQueryData(cacheKey, {
            ...cacheData,
            aquitetos: cacheData.map((user) => {
                if(user.id === userId){
                    return {
                        ...user,
                        status
                    }
                }

                return user
            })
        })
    })
  }*/

  return (
    <main className="flex flex-col gap-4 items-center">
      <Header
        title={{
          children: "Arquiteto",
        }}
        subtitle={{
          children: "Listagem",
        }}
        icon={<LuArchive className="w-6 h-6" />}
        button={{
            testID: "addArquiteto",
            children: (
              <>
                <AiOutlinePlus className="w-6 h-6" />
                Adicionar Arquiteto
              </>
            ),
            onClick: () => router.push("/backoffice/arquitetos/cadastrar"),
        }}
        secondButton={{
            testID: "addArquiteto",
            children: (
              <>
                <AiOutlinePlus className="w-6 h-6" />
               Contemplar Prêmio
              </>
            ),
            onClick: () => setModalOpen(true),
        }}
      />
      <Divisor />
      <TableArquitetosList
        count={count}
        data={data || []}
        isLoading={false}
        limit={limit}
        page={page}
        setLimit={setLimit}
        setPage={setPage}
        setSorting={setSorting}
        sorting={sorting}
        desativar={desativar}
        ativar={ativar}
        excluir={() => {}}
        name={name}
        setName={setName}
        filters={filter}
        setFilters={setFilter}
        refetch={refetch}
      />
       <ModalPromo
          isOpen={modalOpen}
          onClose={()=> setModalOpen(false)}
        /> 

      <Dialog dialog={dialog} hideDialog={hideDialog} />
      <Alert alert={alert} hideAlert={hideAlert} />

    </main>
  );
}
