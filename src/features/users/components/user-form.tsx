'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema, UserFormValues } from '@lib/validators/user.schema';
import { Input } from '@components/ui/input';
import { Select } from '@components/ui/select';
import { Button } from '@components/ui/button';
import { User } from '../types/user.types';

interface UserFormProps {
  defaultValues?: Partial<UserFormValues>;
  onSubmit: (values: UserFormValues) => Promise<void>;
  submitLabel?: string;
  initialData?: User;
}

export function UserForm({ defaultValues, onSubmit, submitLabel = 'Save user' }: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: { status: 'active', role: 'viewer', ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Full name"
        placeholder="Jane Doe"
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label="Email address"
        type="email"
        placeholder="jane@example.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <div className="grid grid-cols-2 gap-4">
        <Select label="Role" error={errors.role?.message} {...register('role')}>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </Select>
        <Select label="Status" error={errors.status?.message} {...register('status')}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" loading={isSubmitting}>{submitLabel}</Button>
      </div>
    </form>
  );
}
