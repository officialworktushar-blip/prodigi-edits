import { AccountSettings } from '@/components/customer/settings/account-settings';
import { PageHeader } from '@/components/shared/page-header';
import { requireUser } from '@/lib/guards';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const { user, profile } = await requireUser();
  const email = user.email ?? '';
  const metadataName =
    typeof user.user_metadata?.full_name === 'string'
      ? user.user_metadata.full_name
      : '';
  const fallbackName = email.split('@')[0] ?? '';
  const initialName = profile?.name?.trim() || metadataName || fallbackName;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="Your account, your preferences"
        highlight="preferences"
        description="Keep your profile current and your sign-in details secure."
      />

      <AccountSettings
        initialName={initialName}
        email={email}
        initialAvatarUrl={profile?.avatar_url ?? null}
      />
    </div>
  );
}
