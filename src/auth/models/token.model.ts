import { UserRole } from '../../common/roles.enum';

export interface TokenPayload {
  role: UserRole;
  sub: number;
}
