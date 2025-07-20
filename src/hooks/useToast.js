import { create } from 'zustand';

const useToast = create((set) => ({
  toasts: [],
  
  addToast: (toast) => {
    const id = Date.now();
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }]
    }));
    return id;
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id)
    }));
  },
  
  // Helper methods
  success: (message, duration = 3000) => {
    const { addToast } = useToast.getState();
    return addToast({ type: 'success', message, duration });
  },
  
  error: (message, duration = 5000) => {
    const { addToast } = useToast.getState();
    return addToast({ type: 'error', message, duration });
  },
  
  info: (message, duration = 3000) => {
    const { addToast } = useToast.getState();
    return addToast({ type: 'info', message, duration });
  }
}));

export default useToast;