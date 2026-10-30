'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireUser } from '@/lib/guards';
import { AVATARS_BUCKET, getPublicUrl } from '@/lib/storage';
import { createClient } from '@/lib/supabase/server';

const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Add your name.')
    .max(80, 'Keep your name under 80 characters.'),
});

export interface SettingsActionResult {
  ok: boolean;
  message: string;
}

export async function updateProfile(
  input: { name: string }
): Promise<SettingsActionResult> {
  const { user } = await requireUser();
  const parsed = profileSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message:
        parsed.error.issues[0]?.message ?? 'Check your profile details.',
    };
  }

  const supabase = createClient();
  const { error } = await supabase
    .from('profiles')
    .update({ name: parsed.data.name })
    .eq('id', user.id);

  if (error) {
    return {
      ok: false,
      message: 'Could not save your profile. Try again.',
    };
  }

  await supabase.auth.updateUser({
    data: { full_name: parsed.data.name },
  });

  revalidatePath('/app', 'layout');
  return { ok: true, message: 'Profile updated.' };
}

export interface AvatarResult extends SettingsActionResult {
  avatarUrl?: string;
}

export async function updateAvatar(input: {
  path: string;
}): Promise<AvatarResult> {
  const { user } = await requireUser();
  const expectedPrefix = `${user.id}/avatar/`;

  if (!input.path.startsWith(expectedPrefix)) {
    return {
      ok: false,
      message: 'That image does not belong to your account.',
    };
  }

  const avatarUrl = getPublicUrl(input.path, AVATARS_BUCKET);
  const supabase = createClient();
  const { error } = await supabase
    .from('profiles')
    .update({ avatar_url: avatarUrl })
    .eq('id', user.id);

  if (error) {
    return {
      ok: false,
      message: 'Could not save your avatar. Try again.',
    };
  }

  revalidatePath('/app', 'layout');
  return {
    ok: true,
    message: 'Avatar updated.',
    avatarUrl,
  };
}

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Enter your current password.')
      .max(72, 'That password is too long.'),
    newPassword: z
      .string()
      .min(8, 'Use at least 8 characters.')
      .max(72, 'Keep your password under 72 characters.'),
    confirmPassword: z
      .string()
      .min(1, 'Confirm your new password.'),
  })
  .refine(
    (value) => value.newPassword === value.confirmPassword,
    {
      message: 'The new passwords do not match.',
      path: ['confirmPassword'],
    }
  );

export async function changePassword(input: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<SettingsActionResult> {
  const { user } = await requireUser();
  const parsed = passwordSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message:
        parsed.error.issues[0]?.message ??
        'Check your password details and try again.',
    };
  }

  if (!user.email) {
    return {
      ok: false,
      message: 'This account does not have an email address to verify.',
    };
  }

  const supabase = createClient();
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: parsed.data.currentPassword,
  });

  if (verifyError) {
    return {
      ok: false,
      message: 'Your current password is incorrect.',
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.newPassword,
  });

  if (error) {
    return {
      ok: false,
      message: error.message || 'Could not update your password.',
    };
  }

  return {
    ok: true,
    message: 'Password updated.',
  };
}
