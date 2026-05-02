import { z } from 'zod';
import { mockUsers } from './_mock-data';
import { UserSchema } from '../schemas/users.schemas';
import { type User, type CreateUserInput, type UpdateUserInput } from '../types/user.types';
import { randomDelay } from '@lib/utils';
import { USE_MOCKS } from '@lib/api/config';
import { api } from '@lib/api/client';
import { validate } from '@lib/api/validate';

type Opts = { signal?: AbortSignal };

let usersStore: User[] = [...mockUsers];

export const usersHandler = {
  async getAll(opts: Opts = {}) {
    if (USE_MOCKS) {
      await randomDelay(opts.signal);
      return validate(z.array(UserSchema), [...usersStore]);
    }
    const data = await api.get<unknown>('/users', opts);
    return validate(z.array(UserSchema), data);
  },

  async getById(id: string, opts: Opts = {}): Promise<User | undefined> {
    if (USE_MOCKS) {
      await randomDelay(opts.signal);
      const found = usersStore.find((u) => u.id === id);
      return found ? validate(UserSchema, found) : undefined;
    }
    const data = await api.get<unknown>(`/users/${id}`, opts);
    return validate(UserSchema, data);
  },

  async create(input: CreateUserInput, opts: Opts = {}) {
    if (USE_MOCKS) {
      await randomDelay(opts.signal);
      const newUser = {
        id: String(Date.now()),
        ...input,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(input.name)}&background=6366F1&color=fff&size=128`,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      usersStore = [newUser, ...usersStore];
      return validate(UserSchema, newUser);
    }
    const data = await api.post<unknown>('/users', input, opts);
    return validate(UserSchema, data);
  },

  async update(input: UpdateUserInput, opts: Opts = {}) {
    if (USE_MOCKS) {
      await randomDelay(opts.signal);
      const index = usersStore.findIndex((u) => u.id === input.id);
      if (index === -1) throw new Error('User not found');
      const updated = { ...usersStore[index], ...input };
      usersStore = [...usersStore.slice(0, index), updated, ...usersStore.slice(index + 1)];
      return validate(UserSchema, updated);
    }
    const { id, ...patch } = input;
    const data = await api.patch<unknown>(`/users/${id}`, patch, opts);
    return validate(UserSchema, data);
  },

  async delete(id: string, opts: Opts = {}): Promise<void> {
    if (USE_MOCKS) {
      await randomDelay(opts.signal);
      usersStore = usersStore.filter((u) => u.id !== id);
      return;
    }
    await api.delete<void>(`/users/${id}`, opts);
  },
};
