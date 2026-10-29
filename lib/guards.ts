import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { prisma } from './db';
import { UserRole } from './config';
import { redirect } from 'next/navigation';

export async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/login');
  }
  return session.user;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireUser();
  if (!allowedRoles.includes(user.role)) {
    redirect('/unauthorized');
  }
  return user;
}

export async function requireAdmin() {
  return requireRole(['ADMIN']);
}

export async function requireEditorOrAdmin() {
  return requireRole(['EDITOR', 'ADMIN']);
}

export async function requireCustomer() {
  return requireRole(['CUSTOMER']);
}

export async function requireWorkspaceAccess(workspaceId: string) {
  const user = await requireUser();

  if (user.role === 'ADMIN') {
    return user;
  }

  const membership = await prisma.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId,
      },
    },
  });

  if (!membership) {
    redirect('/unauthorized');
  }

  return user;
}