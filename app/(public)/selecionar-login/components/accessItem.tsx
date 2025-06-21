import { Divisor } from "@/components/Divisor";
import { Subtitle } from "@/components/Subtitle";
import { Title } from "@/components/Title";
import Image from "next/image";
import { MdChevronRight } from "react-icons/md";

interface AccessItemProp {
  nome_fantasia: string
  cnpj?: string
  logo: string
  gruposFornecimento?: {
    id: number;
    nome: string;
    cor: string;
  }[],
  onClick: () => void
}

export function AccessItem(props: AccessItemProp) {
  return (
    <>
      <div
        className="flex items-center min-w-fit flex-1 gap-4 transition-colors cursor-pointer duration-300 hover:bg-gray-200 p-2 rounded"
        onClick={props.onClick}
      >
        {!!props.logo.length ? (
          <Image
            src={props.logo}
            alt={`Logo da ${props.nome_fantasia}`}
            width={100}
            height={100}
            className="w-12 h-12 rounded object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded bg-gray-500" />
        )}
        <div className="flex flex-col flex-1">
          <Title size="sm" className="line-clamp-1">
            {props.nome_fantasia}
          </Title>
          {/* <Subtitle
            size="xs"
            className="line-clamp-1"
          >
            {(props.cnpj != undefined) && props.cnpj.replace(
              /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
              '$1.$2.$3/$4-$5'
            )}
          </Subtitle> */}

          {props?.gruposFornecimento?.map((grupo) => (
            <div className="flex gap-3 flex-wrap w-full">
              <div
                className={`flex gap-2 items-center justify-center px-2 py-1 text-sm rounded-xl border w-fit border-gray-300 dark:border-gray-500`}
                style={{
                  color: grupo?.cor || "",
                }}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-[${grupo?.cor}] transition-colors duration-300`}
                />
                {grupo?.nome}
              </div>
            </div>
          ))}
        </div>

        <MdChevronRight className="w-6 h-6 text-gray-500" />
      </div>
    </>
  );
}