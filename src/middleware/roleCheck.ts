import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@/models/User';

export async function checkRole(
  requiredRoles: UserRole[],
  handler: Function
) {
  return async (...args: any[]) => {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    if (!requiredRoles.includes(session.user.role as UserRole)) {
      return NextResponse.json(
        { error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      );
    }

    return handler(...args);
  };
}

export const isSuperAdmin = (role: string) => role === UserRole.SUPER_ADMIN;
export const isAdmin = (role: string) => role === UserRole.ADMIN;
export const isCommitteeMember = (role: string) => role === UserRole.COMMITTEE_MEMBER;
export const isAttendee = (role: string) => role === UserRole.ATTENDEE;

export const canManageEvents = (role: string) => 
  [UserRole.SUPER_ADMIN, UserRole.ADMIN].includes(role as UserRole);

export const canManageReimbursements = (role: string) =>
  [UserRole.SUPER_ADMIN, UserRole.ADMIN].includes(role as UserRole);

export const canParticipateInChat = (role: string) =>
  [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.COMMITTEE_MEMBER].includes(role as UserRole);

export const canAccessAttendeeData = (role: string) =>
  [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.COMMITTEE_MEMBER].includes(role as UserRole);

export const canGenerateQR = (role: string) => role === UserRole.ATTENDEE;

export const canManageQuizzes = (role: string) =>
  [UserRole.SUPER_ADMIN, UserRole.ADMIN].includes(role as UserRole); 