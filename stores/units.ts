
//import { Units } from '@/app/(authenticated)/aluno/clientes/[id]/components/unitsTable';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface useProductProps {
  unit: any, // Units,
  setUnits: any // (e: Units) => void;
}

const useStore = create<useProductProps>()(persist(
  (set) => ({
    unit: {
      unidadeId: -14,
      nomeUnidade: '',
      cidade: '',
      uf: "",
      "status": "Ativo"
  },
    setUnits: (e: any) => set({
      unit: {
        ...e
      }
    })
  }),
  {
    name: 'unit-storage',
    storage: createJSONStorage(() => localStorage),
  }
));

export const useUnitStore = useStore;