import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from '../common/encryption';
import { UsersService } from '../users/services/users.service';
import { SignInDto } from './auth.dto';
import { CreateUserDto } from 'src/users/dtos/user.dto';
import { UserRole } from 'src/common/roles.enum';
import { TokenPayload } from './models/token.model';
import { User } from 'src/users/entities/user.entity';

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

  async login(userData: User) {
    const payload: TokenPayload = { sub: userData.id, role: userData.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(userData: SignInDto) {
    const newUser: CreateUserDto = {
      ...userData,
      role: UserRole.CUSTOMER,
    };

    try {
      const user = await this.usersService.addUser(newUser);
      return await this.login(user);
    } catch (error) {
      throw error;
    }
  }
}
