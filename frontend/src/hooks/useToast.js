import { useToastStore } from '../store/useToastStore';

export function useToast() {
  const pushToast = useToastStore((state) => state.pushToast);

  return {
    toast: pushToast,
  };
}
