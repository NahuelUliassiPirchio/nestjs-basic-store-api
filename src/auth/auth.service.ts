import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'src/common/encryption.common';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.getByEmail(email);
    if (user) {
      const isValidate = await compare(password, user.password);
      if (isValidate) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(userData: any) {
    const payload = { sub: userData.id, email: userData.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}