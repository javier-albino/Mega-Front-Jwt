// authStore.js
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  token: null,
  
  // Acción para actualizar el token
  setToken: (newToken) => set({ token: newToken }),
  
  // Acción para limpiar el token
  clearToken: () => set({ token: null }),
}));

export default useAuthStore;
