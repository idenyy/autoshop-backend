import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { JwtGuard } from '../guards/jwt.guard'
import { RolesGuard } from '../guards/role.guard'

export const ROLES_KEY = 'roles'
export const Auth = (...roles: string[]) => {
  return applyDecorators(SetMetadata(ROLES_KEY, roles), UseGuards(JwtGuard, RolesGuard))
}
