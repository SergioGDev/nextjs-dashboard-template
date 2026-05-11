'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { createProfileSettingsSchema, ProfileSettingsValues } from '@/lib/validators/settings.schema';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { useUserStore } from '@/store/user.store';
import { useUpdateProfile } from '@features/auth';
import { toast } from '@components/feedback/toast';

export function SettingsForm() {
  const t = useTranslations('settings');
  const user = useUserStore((s) => s.user);
  const updateProfile = useUpdateProfile();

  const schema = createProfileSettingsSchema({
    nameMin: t('profile.validation.nameMin'),
    emailInvalid: t('profile.validation.emailInvalid'),
    bioMax: t('profile.validation.bioMax'),
    websiteInvalid: t('profile.validation.websiteInvalid'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileSettingsValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      bio: user?.bio ?? '',
      website: user?.website ?? '',
      emailNotifications: user?.emailNotifications ?? false,
      compactMode: user?.compactMode ?? false,
    },
  });

  async function onSubmit(data: ProfileSettingsValues) {
    try {
      await updateProfile.mutateAsync(data);
      toast.success(t('profile.toasts.saved'));
    } catch {
      toast.error(t('profile.toasts.saveFailed'));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label={t('profile.form.nameLabel')} error={errors.name?.message} {...register('name')} />
        <Input label={t('profile.form.emailLabel')} type="email" error={errors.email?.message} {...register('email')} />
      </div>
      <Textarea
        label={t('profile.form.bioLabel')}
        placeholder={t('profile.form.bioPlaceholder')}
        error={errors.bio?.message}
        {...register('bio')}
      />
      <Input
        label={t('profile.form.websiteLabel')}
        placeholder={t('profile.form.websitePlaceholder')}
        error={errors.website?.message}
        {...register('website')}
      />
      <Switch
        label={t('profile.form.emailNotificationsLabel')}
        description={t('profile.form.emailNotificationsHint')}
        {...register('emailNotifications')}
      />
      <Checkbox
        label={t('profile.form.compactModeLabel')}
        description={t('profile.form.compactModeHint')}
        {...register('compactMode')}
      />
      <div className="flex justify-end">
        <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
          {isSubmitting ? t('profile.actions.saving') : t('profile.actions.save')}
        </Button>
      </div>
    </form>
  );
}
