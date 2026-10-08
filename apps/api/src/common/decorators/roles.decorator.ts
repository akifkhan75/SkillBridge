import { SetMetadata } from '@nestjs/common';

export type Role = 'customer' | 'worker' | 'admin';
export const ROLES_KEY = 'roles';
/** Restrict a handler or controller to the listed roles. Enforced by RolesGuard. */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
