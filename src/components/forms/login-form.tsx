'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Mail, Lock } from 'lucide-react';
import { loginSchema, LoginFormValues } from '@/lib/validators/auth.schema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { sleep } from '@/lib/utils';
import { routes } from '@config/routes';
import React from 'react';

export function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(_data: LoginFormValues) {
    await sleep(600);
    router.push(routes.dashboard);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        leftIcon={<Mail size={14} />}
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        leftIcon={<Lock size={14} />}
        error={errors.password?.message}
        {...register('password')}
      />
      <Button type="submit" className="w-full mt-2" loading={isSubmitting} size="lg">
        Sign in
      </Button>
    </form>
  );
}
