import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import userDefaultImage from '../public/userDefault.jpg'

export type UserProps = {
  usuarioId?: number;
  usuarioNome?: string
  usuarioEmail?: string
  relacionamentoId?: number
  area?: string
  expiration?: string
  token?: string
  empresaId?: number 
}


interface UseUserProps {
  user: UserProps,
  setUser: (e: UserProps) => void;
  clearUser: () => void
}

const useStore = create<UseUserProps>()(persist(
  (set) => ({
    user: {
      usuarioId: 0,
      usuarioNome: '',
      usuarioEmail: '',
      area: '',
      expiration: '',
      relacionamentoId: 0,
      token: '',
      empresaId: 0
    },
    setUser: (e) => set({
      user: {
        ...e
      }
    }),
    clearUser: () => set({
      user: {
        usuarioId: 0,
        usuarioNome: '',
        usuarioEmail: '',
        area: '',
        expiration: '',
        relacionamentoId: 0,
        token: '',
        empresaId: 0
      }
    })
  }),
  {
    name: 'user-storage',
    storage: createJSONStorage(() => localStorage),
  }
));

export const useUser = useStore;