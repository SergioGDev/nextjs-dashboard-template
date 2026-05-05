'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { createUserSchema, UserFormValues } from '@lib/validators/user.schema';
import { Input } from '@components/ui/input';
import { Select } from '@components/ui/select';
import { Button } from '@components/ui/button';

interface UserFormProps {
  defaultValues?: Partial<UserFormValues>;
  onSubmit: (values: UserFormValues) => Promise<void>;
  submitLabel?: string;
}

export function UserForm({ defaultValues, onSubmit, submitLabel }: UserFormProps) {
  const t = useTranslations('users');

  const schema = createUserSchema({
    nameRequired: t('validation.nameRequired'),
    nameTooLong: t('validation.nameTooLong'),
    emailRequired: t('validation.emailRequired'),
    emailInvalid: t('validation.emailInvalid'),
    roleRequired: t('validation.roleRequired'),
    statusRequired: t('validation.statusRequired'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'active', role: 'viewer', ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label={t('form.nameLabel')}
        placeholder={t('form.namePlaceholder')}
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label={t('form.emailLabel')}
        type="email"
        placeholder={t('form.emailPlaceholder')}
        error={errors.email?.message}
        {...register('email')}
      />
      <div className="grid grid-cols-2 gap-4">
        <Select label={t('form.roleLabel')} error={errors.role?.message} {...register('role')}>
          <option value="admin">{t('roles.admin')}</option>
          <option value="manager">{t('roles.manager')}</option>
          <option value="editor">{t('roles.editor')}</option>
          <option value="viewer">{t('roles.viewer')}</option>
        </Select>
        <Select label={t('form.statusLabel')} error={errors.status?.message} {...register('status')}>
          <option value="active">{t('statuses.active')}</option>
          <option value="inactive">{t('statuses.inactive')}</option>
        </Select>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" loading={isSubmitting}>
          {submitLabel ?? t('form.submitLabel')}
        </Button>
      </div>
    </form>
  );
}
