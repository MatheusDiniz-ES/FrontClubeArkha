"use client";
import { Dispatch, SetStateAction, useEffect } from "react";
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
import { Status } from "@/components/status";
import { Divisor } from "@/components/Divisor";
import { TablePagination } from "@/components/TablePagination";
import { useDialog } from "@/components/dialog/useDialog";
import { Dialog } from "@/components/dialog";
import useAlert from "@/components/alert/useAlert";
import Alert from "@/components/alert";
import { UseMutateFunction, useQuery } from "react-query";
import { Promocao } from "../../page";

import { Filter } from "@/components/filterContainer";
import { RadioButton, RadioButtonContainer } from "@/components/radio";
import { unitsArray } from "@/lib/units";
import api from "@/lib/api";

interface TablePromocoesListProps {
  isLoading: boolean;
  sorting?: {
    field: string;
    direction: string;
  };
  ativar: UseMutateFunction<void, unknown, number, unknown>;
  desativar: UseMutateFunction<void, unknown, number, unknown>;
  excluir: UseMutateFunction<void, unknown, number, unknown>;
  setSorting?: Dispatch<
    SetStateAction<{
      field: string;
      direction: string;
    }>
  >;
  data: Promocao[] | undefined;
  count: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  limit: number;
  setLimit: Dispatch<SetStateAction<number>>;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  filters: {
    status: string;
  };
  setFilters: Dispatch<
    SetStateAction<{
      status: string;
    }>
  >;
}

export function TablePromocoesList({
  isLoading,
  setSorting,
  sorting,
  data,
  count,
  limit,
  page,
  setLimit,
  setPage,
  ativar,
  desativar,
  name,
  setName,
  excluir,
  filters,
  setFilters,
}: TablePromocoesListProps) {

  const { dialog, hideDialog, showDialog } = useDialog();
  const { alert, showAlert, hideAlert } = useAlert();


  const columns: ColumnDef<Promocao>[] = [
    {
      accessorKey: "id",
      header: ({ column }: any) => {
        return (
          <span
            className="flex items-center w-full gap-4"
            onClick={() => {
            }}
          >
            ID
            <LuChevronsUpDown className="ml-2 h-4 w-4" />
          </span>
        );
      },
    },
    {
      accessorKey: "usuarioNome",
      header: ({ column }: any) => {
        return (
          <span
            className="flex items-center w-full gap-4"
            onClick={() => {
            }}
          >
           Arquiteto
            <LuChevronsUpDown className="ml-2 h-4 w-4" />
          </span>
        );
      },
    },
    {
      accessorKey: "valor",
      header: ({ column }: any) => {
        return (
          <span
            className="flex items-center w-full gap-4"
            onClick={() => {
            }}
          >
            Valor
            <LuChevronsUpDown className="ml-2 h-4 w-4" />
          </span>
        );
      },
      cell: ({ row }) => {
        const valor = row.original.valor;
        return new Intl.NumberFormat('pt-BR', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 20 // mostra até 20 casas decimais sem cortar
        }).format(valor);
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
            Pontuação
            <LuChevronsUpDown className="ml-2 h-4 w-4" />
          </span>
        );
      },
       cell: ({ row }) => {
        const valor = row.original.valorPontuacao;
        const point = new Intl.NumberFormat('pt-BR', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 20 // mostra até 20 casas decimais sem cortar
        }).format(valor)
        return point + "pts" ;
      }
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Popover.Root>
          <Popover.Trigger>
            <Button testID="showMoreActions" type="secondary">
              <BsThreeDots className="w-5 h-5" />
            </Button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className="flex flex-col bg-white shadow rounded-[8px] dark:bg-gray-750 text-gray-700 dark:text-gray-300"
              sideOffset={5}
              side="bottom"
              align="end"
            >
              <Link
                href={`/lojista/pontuacao/${row.original.id}`}
                className={clsx(
                  "flex items-center gap-4 transition-colors duration-300 py-4 px-6 hover:bg-gray-300 hover:text-gray-700 rounded-ss-[8px] rounded-se-[8px]"
                )}
                data-test-id="visualizar"
              >
                <LuEye className="w-5 h-5" />
                Visualizar
              </Link>

                {/* <div
                  aria-test-id="status"
                  onClick={() =>
                    showDialog({
                          isOpen: true,
                          setIsOpen: () => "",
                          icon: <IoMdPower className="w-6 h-6" />,
                          title: `Deseja ${
                            row.original.status == 'Ativo'
                              ? "inativar"
                              : "ativar"
                          } este lojista?`,
                          subtitle:
                            row.original.status == 'Ativo'
                              ? "Ao confirmar a inativação, este lojista terá suas permissões inativadas até sua reativação."
                              : "Ao confirmar a ativação, este lojista terá suas permissões ativadas.",
                          secondButton: {
                            children: "Cancelar",
                            testID: "CancelarAlteracao",
                            type: "secondary",
                            onClick: hideDialog,
                          },
                          button: {
                            children: `Sim, desejo ${
                              row.original.status == 'Ativo'
                                ? "inativar"
                                : "ativar"
                            }`,
                            testID: "alterarStatus",
                            type:
                              row.original.status == 'Ativo'
                                ? "error"
                                : "primary",
                            onClick: async () => {
                              if (row.original.status == 'Ativo') {
                                await desativar(row.original.id);
                              } else {

                                await ativar(row.original.id);
                              }
                              hideDialog();
                            },
                          },
                          error: row.original.status == 'Ativo',
                        })
                  }
                  className={clsx(
                    "flex items-center !justify-start gap-4 transition-colors duration-300 !py-4 !px-6 hover:!bg-gray-300 hover:!text-gray-700 cursor-pointer disabled:cursor-not-allowed !border-none"
                  )}
                >
                  <IoMdPower className="w-5 h-5" />
                  Alterar status
                </div> */}
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
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
      Math.ceil(count / limit) < page
    ) {
      setPage(1);
    }
  }, [name, filters, count, limit]);

  return (
    <>
      <div className="flex py-2 items-center w-full justify-between gap-4 flex-wrap">
        <label className="flex text-gray-700 dark:text-gray-300 items-center justify-center gap-4 mx-auto sm:mx-0">
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
        </label>
        {/* <div className="flex flex-1 justify-center items-center md:justify-end gap-4 flex-wrap">
          <Input
            inputFieldProps={{
              testID: "pesquisar",
              input: {
                value: name,
                onChange: (e) => setName(e.target.value),
                placeholder: "Pesquisar Prêmio",
              },
            }}
            rightIcon={<AiOutlineSearch className="w-6 h-6" />}
            className="!w-[270px] 2xl:!w-full 2xl:max-w-xl transition-all duration-300"
          />
          <Filter
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
          </Filter>
        </div> */}
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
        count={count}
        limit={limit}
        page={page}
        onChangePage={setPage}
      />
      <Dialog dialog={dialog} hideDialog={hideDialog} />
      <Alert alert={alert} hideAlert={hideAlert} />
    </>
  );
}
