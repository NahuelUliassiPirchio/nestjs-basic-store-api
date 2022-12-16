import { UserRole } from 'src/common/roles.enum';

export interface TokenPayload {
  role: UserRole;
  sub: number;
}
