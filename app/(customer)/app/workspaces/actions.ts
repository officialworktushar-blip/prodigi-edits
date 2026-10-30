'use server';

import { z } from 'zod';
import { requireUser, requireWorkspaceAccess } from '@/lib/guards';
import { AVATARS_BUCKET, getPublicUrl } from '@/lib/storage';
import { createClient } from '@/lib/supabase/server';
import type { Workspace } from '@/types/db';

const brandingSchema = z.object({
  workspaceId: z.string().uuid('Choose a valid workspace.'),
  name: z
    .string()
    .trim()
    .min(1, 'Give the workspace a name.')
    .max(80, 'Keep the workspace name under 80 characters.'),
  notes: z
    .string()
    .max(2000, 'Keep notes under 2,000 characters.'),
  brandHeadingFont: z
    .string()
    .trim()
    .min(1, 'Add a heading font.')
    .max(80, 'Keep the font name under 80 characters.'),
  brandBodyFont: z
    .string()
    .trim()
    .min(1, 'Add a body font.')
    .max(80, 'Keep the font name under 80 characters.'),
  brandPrimaryColor: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Use a six-digit hex color.'),
  brandAccentColor: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Use a six-digit hex color.'),
});

export interface WorkspaceBrandingResult {
  ok: boolean;
  message: string;
  workspace?: Workspace;
  savedAt?: string;
}

export async function updateWorkspaceBranding(input: {
  workspaceId: string;
  name: string;
  notes: string;
  brandHeadingFont: string;
  brandBodyFont: string;
  brandPrimaryColor: string;
  brandAccentColor: string;
}): Promise<WorkspaceBrandingResult> {
  await requireUser();
  const parsed = brandingSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message:
        parsed.error.issues[0]?.message ??
        'Check the workspace details and try again.',
    };
  }

  const data = parsed.data;
  await requireWorkspaceAccess(data.workspaceId, 'MANAGER');

  const supabase = createClient();
  const { data: workspace, error } = await supabase
    .from('workspaces')
    .update({
      name: data.name,
      notes: data.notes.trim() ? data.notes.trim() : null,
      brand_heading_font: data.brandHeadingFont,
      brand_body_font: data.brandBodyFont,
      brand_primary_color: data.brandPrimaryColor,
      brand_accent_color: data.brandAccentColor,
    })
    .eq('id', data.workspaceId)
    .select('*')
    .single();

  if (error || !workspace) {
    return {
      ok: false,
      message: 'Could not save these workspace details. Try again.',
    };
  }

  return {
    ok: true,
    message: 'Workspace saved.',
    workspace: workspace as Workspace,
    savedAt: new Date().toISOString(),
  };
}

export interface WorkspaceLogoResult {
  ok: boolean;
  message: string;
  logoUrl?: string;
}

export async function updateWorkspaceLogo(input: {
  workspaceId: string;
  path: string;
}): Promise<WorkspaceLogoResult> {
  await requireUser();
  await requireWorkspaceAccess(input.workspaceId, 'MANAGER');

  const expectedPrefix = `${input.workspaceId}/brand/`;

  if (!input.path.startsWith(expectedPrefix)) {
    return {
      ok: false,
      message: 'That image does not belong to this workspace.',
    };
  }

  const logoUrl = getPublicUrl(input.path, AVATARS_BUCKET);
  const supabase = createClient();
  const { error } = await supabase
    .from('workspaces')
    .update({ logo_url: logoUrl })
    .eq('id', input.workspaceId);

  if (error) {
    return {
      ok: false,
      message: 'Could not save the workspace logo. Try again.',
    };
  }

  return {
    ok: true,
    message: 'Workspace logo updated.',
    logoUrl,
  };
}
