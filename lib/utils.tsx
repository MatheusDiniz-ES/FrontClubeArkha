//import { AttributesAcordoProps } from "@/app/(authenticated)/aluno/acordos-comerciais/cadastrar/page";
import { ClassValue, clsx } from "clsx";
import { FaDivide, FaMinus, FaPlus } from "react-icons/fa";
import { LuAsterisk } from "react-icons/lu";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertIdsToAccessControl(ids: number[]) {
  return;
}

export function formatCurrency(value: number, decimalPlaces: number = 2) {
  return new Intl.NumberFormat("pt-br", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(value);
}

interface ToggleTableFunction {
  isOpen: boolean;
  openValue?: string;
  closedValue?: string;
}

export function toggleTable({
  isOpen,
  openValue = "320px",
  closedValue = "64px",
}: ToggleTableFunction) {
  if (isOpen) {
    return "max-w-sidebarClose lg:max-w-sidebarOpen";
  } else {
    return "max-w-sidebarClose";
  }
}

export function changeColor(color: "cyan" | "orange" | "violet" | "emerald") {
  switch (color) {
    case "cyan":
      document.documentElement.classList.remove("orange", "violet", "emerald");
      break;
    case "orange":
      document.documentElement.classList.remove("cyan", "violet", "emerald");
      break;
    case "violet":
      document.documentElement.classList.remove("orange", "cyan", "emerald");
      break;
    case "emerald":
      document.documentElement.classList.remove("orange", "violet", "cyan");
      break;
  }
}


export function handleArea(areaId: 1 | 2 | 3 | 4) {
  switch (areaId) {
      case 1:
          return "backoffice";
      case 2:
          return "lojista";
      case 3:
          return "cliente";
      case 4:
          return "fornecedores";
  }
}

export function hashArea(area: string): string {
  switch (area) {
      case "lojista":
          return "sdksp3498-*/_mdsak";
      case "backoffice":
          return "asdar3243fsa8078ui55dasç";
      case "cliente":
          return "kafsjkjj1324j1291ijfsakPS3leasd54";
      default:
          return "";
  }
}

export function compareArea(area: string): string {
  switch (area) {
      case "sdksp3498-*/_mdsak":
          return "lojista";
      case "asdar3243fsa8078ui55dasç":
          return "backoffice";
      case "kafsjkjj1324j1291ijfsakPS3leasd54":
          return "cliente";
      default:
          return "";
  }
}

export type ErrorApi = {
  status: number;
  data: {
    data: any;
    description: string;
    [field: string]: any;
  };
  message: string;
  description: string;
  responseLabel: string;
};

export const formatInt = (value: number) => {
  return new Intl.NumberFormat("pt-br", 
    {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      
    }
  ).format(value);
};
