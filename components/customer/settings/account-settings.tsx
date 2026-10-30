'use client';

import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  Check,
  Image as ImageIcon,
  KeyRound,
  Loader2,
  Mail,
  UploadCloud,
  UserRound,
} from 'lucide-react';
import {
  changePassword,
  updateAvatar,
  updateProfile,
} from '@/app/(customer)/app/settings/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
]);

interface SignImageResponse {
  bucket?: string;
  path?: string;
  token?: string;
  error?: string;
}

const EMPTY_PASSWORDS = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

function initialsFor(name: string, email: string): string {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length > 0) {
    return words
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() ?? '')
      .join('');
  }

  return email.slice(0, 2).toUpperCase() || 'ME';
}

export interface AccountSettingsProps {
  initialName: string;
  email: string;
  initialAvatarUrl: string | null;
}

export function AccountSettings({
  initialName,
  email,
  initialAvatarUrl,
}: AccountSettingsProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState(initialName);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileNotice, setProfileNotice] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordNotice, setPasswordNotice] = useState<string | null>(null);
  const [passwords, setPasswords] = useState(EMPTY_PASSWORDS);

  async function uploadFile(file: File) {
    const contentType = file.type.split(';')[0]?.trim().toLowerCase() ?? '';

    if (!ALLOWED_TYPES.has(contentType)) {
      setProfileError('Upload a JPG, PNG, WebP, GIF, or AVIF image.');
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setProfileError('Choose an image smaller than 5 MB.');
      return;
    }

    setIsUploading(true);
    setProfileError(null);
    setProfileNotice(null);

    try {
      const signResponse = await fetch('/api/upload/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purpose: 'avatar',
          fileName: file.name,
          size: file.size,
          contentType,
        }),
      });

      let signPayload: SignImageResponse = {};

      try {
        signPayload = (await signResponse.json()) as SignImageResponse;
      } catch {
        signPayload = {};
      }

      if (
        !signResponse.ok ||
        !signPayload.bucket ||
        !signPayload.path ||
        !signPayload.token
      ) {
        throw new Error(
          signPayload.error || 'Could not prepare this avatar upload.'
        );
      }

      const supabase = createClient();
      const { error: uploadError } = await supabase.storage
        .from(signPayload.bucket)
        .uploadToSignedUrl(signPayload.path, signPayload.token, file, {
          contentType,
          cacheControl: '3600',
        });

      if (uploadError) {
        throw new Error(uploadError.message || 'The avatar upload failed.');
      }

      const saved = await updateAvatar({ path: signPayload.path });

      if (!saved.ok || !saved.avatarUrl) {
        throw new Error(saved.message);
      }

      setAvatarUrl(saved.avatarUrl);
      setProfileNotice(saved.message);
      router.refresh();
    } catch (uploadError) {
      setProfileError(
        uploadError instanceof Error
          ? uploadError.message
          : 'Could not upload the avatar. Try again.'
      );
    } finally {
      setIsUploading(false);

      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      void uploadFile(file);
    }
  }

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingProfile(true);
    setProfileError(null);
    setProfileNotice(null);

    try {
      const result = await updateProfile({ name });

      if (!result.ok) {
        setProfileError(result.message);
        return;
      }

      setName(name.trim());
      setProfileNotice(result.message);
      router.refresh();
    } catch {
      setProfileError('Could not save your profile. Try again.');
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingPassword(true);
    setPasswordError(null);
    setPasswordNotice(null);

    try {
      const result = await changePassword(passwords);

      if (!result.ok) {
        setPasswordError(result.message);
        return;
      }

      setPasswords(EMPTY_PASSWORDS);
      setPasswordNotice(result.message);
    } catch {
      setPasswordError('Could not update your password. Try again.');
    } finally {
      setIsSavingPassword(false);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <UserRound aria-hidden="true" className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-base font-semibold tracking-tight text-brand-ink">
              Profile
            </h2>
            <p className="text-xs text-slate-500">
              How you appear across your workspace.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={avatarUrl ?? undefined}
              alt={name ? `${name}'s avatar` : 'Your avatar'}
            />
            <AvatarFallback className="text-xl">
              {initialsFor(name, email)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-brand-ink">
              Profile photo
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Square images look best. JPG, PNG, WebP, GIF, or AVIF up to 5 MB.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                onChange={handleFileChange}
                className="sr-only"
                aria-label="Upload profile photo"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                isLoading={isUploading}
                disabled={isUploading}
                onClick={() => inputRef.current?.click()}
              >
                {isUploading ? null : (
                  <UploadCloud aria-hidden="true" className="h-4 w-4" />
                )}
                {avatarUrl ? 'Replace photo' : 'Upload photo'}
              </Button>
              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                <ImageIcon aria-hidden="true" className="h-3 w-3" />
                Public image
              </span>
            </div>
          </div>
        </div>

        {isUploading ? (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <Loader2
              aria-hidden="true"
              className="h-3.5 w-3.5 animate-spin"
            />
            Uploading and saving...
          </p>
        ) : null}

        {profileError ? (
          <div
            role="alert"
            className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700"
          >
            <AlertCircle
              aria-hidden="true"
              className="mt-0.5 h-3.5 w-3.5 shrink-0"
            />
            {profileError}
          </div>
        ) : null}

        {profileNotice ? (
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs text-emerald-700">
            <Check aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {profileNotice}
          </div>
        ) : null}

        <form onSubmit={handleProfileSubmit} className="mt-5 space-y-4">
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-brand-ink"
              htmlFor="settings-name"
            >
              Full name
            </label>
            <Input
              id="settings-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={80}
              autoComplete="name"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-brand-ink"
              htmlFor="settings-email"
            >
              Email
            </label>
            <div className="relative">
              <Mail
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              />
              <Input
                id="settings-email"
                type="email"
                value={email}
                className="pl-9"
                disabled
                readOnly
              />
            </div>
            <p className="text-xs text-slate-500">
              Contact support if you need to change your sign-in email.
            </p>
          </div>

          <Button type="submit" isLoading={isSavingProfile}>
            {isSavingProfile ? null : (
              <Check aria-hidden="true" className="h-4 w-4" />
            )}
            Save profile
          </Button>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <KeyRound aria-hidden="true" className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-base font-semibold tracking-tight text-brand-ink">
              Password
            </h2>
            <p className="text-xs text-slate-500">
              Use at least 8 characters.
            </p>
          </div>
        </div>

        {passwordError ? (
          <div
            role="alert"
            className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700"
          >
            <AlertCircle
              aria-hidden="true"
              className="mt-0.5 h-3.5 w-3.5 shrink-0"
            />
            {passwordError}
          </div>
        ) : null}

        {passwordNotice ? (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs text-emerald-700">
            <Check aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {passwordNotice}
          </div>
        ) : null}

        <form onSubmit={handlePasswordSubmit} className="mt-5 space-y-4">
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-brand-ink"
              htmlFor="current-password"
            >
              Current password
            </label>
            <Input
              id="current-password"
              type="password"
              value={passwords.currentPassword}
              onChange={(event) =>
                setPasswords((current) => ({
                  ...current,
                  currentPassword: event.target.value,
                }))
              }
              autoComplete="current-password"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-brand-ink"
              htmlFor="new-password"
            >
              New password
            </label>
            <Input
              id="new-password"
              type="password"
              value={passwords.newPassword}
              onChange={(event) =>
                setPasswords((current) => ({
                  ...current,
                  newPassword: event.target.value,
                }))
              }
              minLength={8}
              maxLength={72}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-brand-ink"
              htmlFor="confirm-password"
            >
              Confirm new password
            </label>
            <Input
              id="confirm-password"
              type="password"
              value={passwords.confirmPassword}
              onChange={(event) =>
                setPasswords((current) => ({
                  ...current,
                  confirmPassword: event.target.value,
                }))
              }
              minLength={8}
              maxLength={72}
              autoComplete="new-password"
              required
            />
          </div>

          <Button
            type="submit"
            variant="outline"
            isLoading={isSavingPassword}
          >
            {isSavingPassword ? null : (
              <KeyRound aria-hidden="true" className="h-4 w-4" />
            )}
            Update password
          </Button>
        </form>
      </section>
    </div>
  );
}
