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
import { TableUsersList } from "./components/Table";

const queryBackofficeProvider = new QueryClient();

export interface Usuarios {
  id: number;
  nome: string;
  email: string;
  ativo: boolean;
  status: 'Ativo' | 'Inativo';
}

export default function Users() {
  const router = useRouter();
  const { dialog, hideDialog } = useDialog();
  const { alert, showAlert, hideAlert } = useAlert();

  const queryClient = useQueryClient()

  const queryFilters: any =
    queryBackofficeProvider.getQueryData("GetUsuariosListing");

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
    queryKey: ['get-users', page, limit, sorting.field, sorting.direction, name, filter],
    queryFn: async () => {
      const { data } = await api.get(
        `/Usuario?PageSize=${limit}&PageNumber=${page}&SortField=${sorting.field}&SortOrder=${
          sorting.direction
        }${(name && `&Value=${name}`) || ""}&Status=${filter.status}`
      );
      queryBackofficeProvider.setQueryData("GetUsuariosListing", {
        page,
        limit,
        count: data.data.total,
        field: sorting.field,
        direction: sorting.direction,
        filter,
        name
      });
      setCount(data.data.total);
      return data.data.data as Usuarios[];
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  });

  const { mutate: desativar } = useMutation({
    mutationFn: async (id: number) => {
      await api.patch(`/Usuario/desativar/${id}`);
    },
    onSuccess: (_, { id }: any) => {
      showAlert({
        title: `Inativação concluída com sucesso!`,
        description: `A inativação do usuário foi concluída com êxito.`,
        type: "error",
      });
      refetch()
    },
  });

  const { mutate: ativar } = useMutation({
    mutationFn: async (id: number) => {
      await api.patch(`/Usuario/ativar/${id}`);
    },
    onSuccess: (_, { id }: any) => {
      showAlert({
        title: `Ativação concluída com sucesso!`,
        description: `A ativação do usuário foi concluída com êxito.`,
        type: "success",
      });
      refetch()
    },
  });
/*
  function updateStatus(userId: number, status: string){

    const cached = queryClient.getQueriesData<Usuarios[]>({
        queryKey: ['get-users']
    })

    cached.forEach(([cacheKey, cacheData]) => {
        if(!cacheData){
            return
        }

        queryClient.setQueryData(cacheKey, {
            ...cacheData,
            users: cacheData.map((user) => {
                if(user.id == userId){
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
          children: "Usuários",
        }}
        subtitle={{
          children: "Listagem",
        }}
        icon={<LuArchive className="w-6 h-6" />}
        button={{
            testID: "addProduct",
            children: (
              <>
                <AiOutlinePlus className="w-6 h-6" />
                Usuários Adminstrativos
              </>
            ),
            onClick: () => router.push("/backoffice/usuarios/cadastrar"),
        }}
      />
      <Divisor />
      <TableUsersList
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
      />

      <Dialog dialog={dialog} hideDialog={hideDialog} />
      <Alert alert={alert} hideAlert={hideAlert} />

    </main>
  );
}
