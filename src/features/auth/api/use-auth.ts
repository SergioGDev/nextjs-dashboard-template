'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authHandler } from './auth.handler';
import { authKeys } from './auth.keys';
import { type LoginInput } from '../types/auth.types';

export function useSession() {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: ({ signal }) => authHandler.me({ signal }),
    staleTime: 5 * 60_000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: LoginInput) => authHandler.login(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.session() }),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authHandler.logout(),
    onSuccess: () => queryClient.clear(),
  });
}
