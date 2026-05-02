'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersHandler } from './users.handler';
import { userKeys } from './users.keys';
import { type CreateUserInput, type UpdateUserInput } from '../types/user.types';

export function useUsers() {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: ({ signal }) => usersHandler.getAll({ signal }),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: ({ signal }) => usersHandler.getById(id, { signal }),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateUserInput) => usersHandler.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.lists() }),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateUserInput) => usersHandler.update(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(data.id) });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersHandler.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.lists() }),
  });
}
