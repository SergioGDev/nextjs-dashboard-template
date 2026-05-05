'use client';

import { useRouter } from '@/i18n/navigation';
import { useLogout } from '@features/auth';
import { routes } from '@config/routes';
import { toast } from '@components/feedback/toast';

export function useLogoutAction() {
  const router = useRouter();
  const { mutate, isPending } = useLogout();

  function logout() {
    mutate(undefined, {
      onSuccess: () => {
        toast.info('Signed out');
        router.push(routes.login);
      },
    });
  }

  return { logout, isPending };
}
