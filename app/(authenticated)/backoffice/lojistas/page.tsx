"use client";

import { Header } from "@/components/Header";
import { AiOutlinePlus } from "react-icons/ai";
import { Divisor } from "@/components/Divisor";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import api from "@/lib/api";
import { Dialog } from "@/components/dialog";
import Alert from "@/components/alert";
import { useDialog } from "@/components/dialog/useDialog";
import useAlert from "@/components/alert/useAlert";
import { LuArchive } from "react-icons/lu";
import { TableLojistasList } from "./components/Table";

const queryBackofficeProvider = new QueryClient();

export interface Lojistas {
  id: number;
  nome: string;
  CNPJ: string;
  email: string;
  ativo: boolean;
  status: 'Ativo' | 'Inativo';
  cnpj: string;
  endereco: string
  telefone: string
  cep: string;
  instagram: string;
  site: string;
  razaoSocial: string;
  logo: string
  numero: string;
  cidade: string;
  estado: string;
  nomeFantasia: string;
  banner: string;
  bairro: string
  descricao: string;
  cargo: string;
}

export default function LojistasPage() {
  const router = useRouter();
  const { dialog, hideDialog } = useDialog();
  const { alert, showAlert, hideAlert } = useAlert();


  const queryFilters: any =
    queryBackofficeProvider.getQueryData("GetLojistasListing");

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
    queryKey: [page, limit, sorting.field, sorting.direction, name, filter],
    queryFn: async () => {
      const { data } = await api.get(
        `/Lojista?PageSize=${limit}&PageNumber=${page}&SortField=${sorting.field}&SortOrder=${
          sorting.direction
        }${(name && `&Value=${name}`) || ""}&Status=${filter.status}`
      );
      queryBackofficeProvider.setQueryData("GetLojistasListing", {
        page,
        limit,
        count: data.data.total,
        field: sorting.field,
        direction: sorting.direction,
        filter,
        name
      });
      setCount(data.data.total);
      return data.data.data as Lojistas[];
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  });

  const { mutate: desativar } = useMutation({
    mutationFn: async (id: number) => {
      await api.patch(`/Lojista/desativar/${id}`);
    },
    onSuccess: () => {
      showAlert({
        title: `Inativação concluída com sucesso!`,
        description: `A inativação do anúncio foi concluída com êxito.`,
        type: "error",
      });
      refetch();
    },
  });

  const { mutate: ativar } = useMutation({
    mutationFn: async (id: number) => {
      await api.patch(`/Lojista/ativar/${id}`);
    },
    onSuccess: () => {
      showAlert({
        title: `Ativação concluída com sucesso!`,
        description: `A ativação do anúncio foi concluída com êxito.`,
        type: "success",
      });
      refetch();
    },
  });

  return (
    <main className="flex flex-col gap-4 items-center">
      <Header
        title={{
          children: "Lojistas",
        }}
        subtitle={{
          children: "Listagem",
        }}
        icon={<LuArchive className="w-6 h-6" />}
        button={{
            testID: "addLojista",
            children: (
              <>
                <AiOutlinePlus className="w-6 h-6" />
                Cadastrar Lojista
              </>
            ),
            onClick: () => router.push("/backoffice/lojistas/cadastrar"),
        }}
      />
      <Divisor />
      <TableLojistasList
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
