"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { LuChevronsUpDown, LuEye, LuTrash2 } from "react-icons/lu";
import * as Popover from "@radix-ui/react-popover";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcnui/table/table";
import { AiOutlineSearch } from "react-icons/ai";
import { Select } from "@/components/Select";
import { BsThreeDots } from "react-icons/bs";
import Link from "next/link";
import clsx from "clsx";
import { IoMdPower } from "react-icons/io";
import { Status, StatusAprovacao } from "@/components/status";
import { Divisor } from "@/components/Divisor";
import { TablePagination } from "@/components/TablePagination";
import { useDialog } from "@/components/dialog/useDialog";
import { Dialog } from "@/components/dialog";
import useAlert from "@/components/alert/useAlert";
import Alert from "@/components/alert";
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, UseMutateFunction, useMutation, useQuery } from "react-query";
import { Arquitetos  } from "../../../page";

import { Filter } from "@/components/filterContainer";
import { RadioButton, RadioButtonContainer } from "@/components/radio";
import { unitsArray } from "@/lib/units";
import api from "@/lib/api";
import { FaCheck } from "react-icons/fa";
import { Check, Download, Upload } from "lucide-react";
import moment from "moment";
import Icon from "react-multi-date-picker/components/icon";

interface contaCorrenteId {
    dataCriacao: string
    empresaId: number
    empresaNome: string
    id: number
    pontuacaoId: number
    promocaoId: number
    promocaoNome: string
    tipo: "Credito" | "Debito"
    usuarioId: number
    valorPontuacao: number
    pontuacaoAnexo: string
    dataVenda: string
}
 

interface TableArquitetosListProps {
  isLoading: boolean;
  sorting?: {
    field: string;
    direction: string;
  };
  // ativar: UseMutateFunction<void, unknown, number, unknown>;
  // desativar: UseMutateFunction<void, unknown, number, unknown>;
  // excluir: UseMutateFunction<void, unknown, number, unknown>;
  // setSorting?: Dispatch<
  //   SetStateAction<{
  //     field: string;
  //     direction: string;
  //   }>
  // >;
  data: any;
  countCredito: number;
  pageCredito: number;
  setPageCredito: Dispatch<SetStateAction<number>>;
  limitCredito: number;
  setLimitCredito: Dispatch<SetStateAction<number>>;
  // name: string;
  // setName: Dispatch<SetStateAction<string>>;
  // filters: {
  //   status: string;
  // };
  // setFilters: Dispatch<
  //   SetStateAction<{
  //     status: string;
  //   }>
  // >;
  refetch:  <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<Arquitetos[], unknown>>
}
const statusMap = {
  Ativo: "Ativo",
  Inativo: "Inativo",
  AguardandoAprovacao: "AguardandoAprovacao",
  Reprovado: "Reprovado",
};




export function TableHistoricoCredito({
  isLoading,
  // setSorting,
  sorting,
  data,
  countCredito,
  limitCredito,
  pageCredito,
  setLimitCredito,
  setPageCredito,
  // ativar,
  // desativar,
  // name,
  // setName,
  // excluir,
  // filters,
  // setFilters,
  refetch
}: TableArquitetosListProps) {

  
  const { dialog, hideDialog, showDialog } = useDialog();
  const { alert, showAlert, hideAlert } = useAlert();


    const { mutate: reprovar } = useMutation({
      mutationFn: async (id: number) => {
        await api.patch(`/Arquiteto/reprovar/${id}`);
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

  const { mutate: aprovar } = useMutation({
    mutationFn: async (id: number) => {
      await api.patch(`/Arquiteto/ativar/${id}`);
    },
    onSuccess: (_, { id }: any) => {
      showAlert({
        title: `Aprovação concluída com sucesso!`,
        description: `A aprovação do arquiteto foi concluída com êxito.`,
        type: "success",
      });
      refetch()
      // updateStatus(id, 'Ativo')
    },
  });
  const columns: ColumnDef<contaCorrenteId>[] = [
     {
      accessorKey: "tipo",
      header: ({ column }: any) => {
        return (
          <span
            className="flex items-center w-full gap-4"
            onClick={() => {
            }}
          >
            Tipo Transferência
            <LuChevronsUpDown className="ml-2 h-4 w-4" />
          </span>
        );
      },
      cell: ({ row }) => (
        // setTipo([row.original.tipo]),
        row.original.tipo === "Credito" ? <div className="flex gap-2"><Upload/>Credito</div> : <div className="flex gap-2"><Download/> Debito</div>
      ),
    },
    {
      accessorKey: "dataCriacao",
      header: ({ column }: any) => {
        return (
          <span
            className="flex items-center w-full gap-4"
            onClick={() => {
            }}
          >
            Data de Criacao
            <LuChevronsUpDown className="ml-2 h-4 w-4" />
          </span>
        );
      },
      cell: ({ row }) => (
        moment(row.original.dataCriacao).format("DD/MM/YYYY")
      ),
      
    },
    {
      accessorKey: "dataVenda",
      header: ({ column }: any) => {
        return (
          <span
            className="flex items-center w-full gap-4"
            onClick={() => {
            }}
          >
            Data de Venda
            <LuChevronsUpDown className="ml-2 h-4 w-4" />
          </span>
        );
      },
      cell: ({ row }) => (
        moment(row.original.dataVenda).format("DD/MM/YYYY")
      ),
      
    },
    
     {
      accessorKey: "empresaNome",
      header: ({ column }: any) => {
        return (
          <span
            className="flex items-center w-full gap-4"
            onClick={() => {
            }}
          >
            Loja
            <LuChevronsUpDown className="ml-2 h-4 w-4" />
          </span>
        );
      }
    },
    {
      accessorKey: "valorPontuacao",
      header: ({ column }: any) => {
        return (
          <span
            className="flex items-center w-full gap-4"
            onClick={() => {
            }}
          >
            Valor Pontuacao
            <LuChevronsUpDown className="ml-2 h-4 w-4" />
          </span>
        );
      },
       cell: ({ row }) => (
        new Intl.NumberFormat('pt-BR').format(row.original.valorPontuacao)
      ),
    },
    {
      accessorKey: "pontuacaoAnexo",
      header: ({ column }: any) => {
        return (
          <span
            className="flex items-center w-full gap-4"
            onClick={() => {
            }}
          >
           ANEXO
            <LuChevronsUpDown className="ml-2 h-4 w-4" />
          </span>
        );
      },
       cell: ({ row }) => (
        row.original.tipo === "Credito" ? <a target="_blank" href={row.original.pontuacaoAnexo} className="text-sky-500">Anexo</a> : null 
      ),
    },
    
   
  ];

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  
  useEffect(() => {
    if (
      typeof window != "undefined" &&
      !isLoading &&
      Math.ceil(countCredito / limitCredito) < pageCredito
    ) {
      setPageCredito(1);
    }
  }, [name,pageCredito, countCredito, limitCredito]);

  return (
    <>
      <div className="flex py-2 items-center w-full justify-between gap-4 flex-wrap">
        {/* <label className="flex text-gray-700 dark:text-gray-300 items-center justify-center gap-4 mx-auto sm:mx-0">
          Mostrar
          <Select
            testID="linhasPágina"
            options={[
              {
                text: "5",
                value: 5,
              },
              {
                text: "10",
                value: 10,
              },
              {
                text: "15",
                value: 15,
              },
              {
                text: "20",
                value: 20,
              },
              {
                text: "50",
                value: 50,
              },
            ]}
            select={{
              className: "!w-[70px]",
              value: limit,
              onChange: (e) => setLimit(Number(e.target.value)),
            }}
          />
          registros
        </label> */}
        <div className="flex flex-1 justify-center items-center md:justify-end gap-4 flex-wrap">
          {/* <Input
            inputFieldProps={{
              testID: "pesquisar",
              input: {
                value: name,
                onChange: (e) => setName(e.target.value),
                placeholder: "Pesquisar Arquiteto",
              },
            }}
            rightIcon={<AiOutlineSearch className="w-6 h-6" />}
            className="!w-[270px] 2xl:!w-full 2xl:max-w-xl transition-all duration-300"
          /> */}
          {/* <Filter
            cleanupFilter={() =>
              setFilters({
                status: "",
              })
            }
          >
            <RadioButtonContainer
              value={filters.status}
              onValueChange={(e) =>
                setFilters({
                  ...filters,
                  status: e,
                })
              }
            >
              <>
                <RadioButton id="todos" value="" label={"Todos"} />
                <RadioButton id="ativo" value="ativo" label={"Ativos"} />
                <RadioButton id="inativo" value="inativo" label={"Inativos"} />
              </>
            </RadioButtonContainer>
          </Filter> */}
        </div>
      </div>
      <div className="rounded-[8px] shadow-sm border border-gray-200 bg-white dark:bg-gray-750 dark:border-gray-600 w-full lg:max-w-none max-w-[90vw] overflow-auto text-gray-950 dark:text-gray-400">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup: any) => (
                            <TableRow
              key={headerGroup.id}
              className="border-gray-200 dark:border-gray-600"
            >
              {headerGroup.headers.map((header: any) => {
                return (
                  <TableHead key={header.id} className="first:!pr-4">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <svg
                    className="animate-spin mx-auto h-16 w-16"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth={"4"}
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: any) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="py-4 border-gray-200 dark:border-gray-600"
                >
                  {row.getVisibleCells().map((cell: any) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Não foi encontrado nenhum resultado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Divisor className="mt-2" />
      <TablePagination
        count={countCredito}
        limit={limitCredito}
        page={pageCredito}
        onChangePage={setPageCredito}
      />
      <Dialog dialog={dialog} hideDialog={hideDialog} />
      <Alert alert={alert} hideAlert={hideAlert} />
    </>
  );
}
