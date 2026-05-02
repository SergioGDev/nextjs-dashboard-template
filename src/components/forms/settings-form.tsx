'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSettingsSchema, ProfileSettingsValues } from '@/lib/validators/settings.schema';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store/user.store';
import { sleep } from '@/lib/utils';

export function SettingsForm() {
  const currentUser = useUserStore((s) => s.currentUser);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileSettingsValues>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      name: currentUser?.name ?? '',
      email: currentUser?.email ?? '',
      bio: '',
      website: '',
    },
  });

  async function onSubmit(_data: ProfileSettingsValues) {
    await sleep(500);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Full name" error={errors.name?.message} {...register('name')} />
        <Input label="Email address" type="email" error={errors.email?.message} {...register('email')} />
      </div>
      <Textarea label="Bio" placeholder="Tell us about yourself…" error={errors.bio?.message} {...register('bio')} />
      <Input label="Website" placeholder="https://yoursite.com" error={errors.website?.message} {...register('website')} />
      <div className="flex justify-end">
        <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
          Save changes
        </Button>
      </div>
    </form>
  );
}
