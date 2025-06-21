import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface CompanyProp {
  cnpj: string
  id: number
  logo: string
  nomefantasia: string
  observacao: string,
  nomeResponsavel: string,
  emailResponsavel: string,
  cargoResponsavel: string,
  telefoneResponsavel: string,
  razaoSocial: string
  empresaId: number
}

interface AccessUser {
  backoffice: {
    id: 1,
    nomefantasia: "BackOffice",
    cnpj: string,
    logo: string
    empresaId: number
  } | null,
  lojistas: {
    id: number,
    nomefantasia: "Lojista",
    cnpj: string,
    logo: string,
    empresaId?: any
  }[]
  
}

interface UseAccessProps {
  access: AccessUser,
  setAccess: (e: AccessUser) => void;
}

interface UseCompanyProps {
  company: CompanyProp,
  setCompany: (e: CompanyProp) => void;
}

const useStore = create<UseAccessProps>((set) => ({
  access: {
    backoffice: null,
    lojistas: [],
  },
  setAccess: (e) => set({
    access: {
      ...e
    }
  })
}))

const useCompanyStore = create<UseCompanyProps>()(persist(
  (set) => ({
    company: {
      cnpj: '',
      logo: '',
      nomefantasia: '',
      id: -1,
      observacao: '',
      nomeResponsavel: '',
      emailResponsavel: '',
      cargoResponsavel: '',
      telefoneResponsavel: '',
      razaoSocial: '',
      empresaId: 0
    },
    setCompany: (e) => set({
      company: {
        ...e
      }
    })
  }),
  {
    name: 'companyLogin-storage',
    storage: createJSONStorage(() => localStorage)
  }
))

export const useAccessStore = useStore;
export const useLoginCompanyStore = useCompanyStore