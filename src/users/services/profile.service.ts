import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';
import { UsersService } from './users.service';

@Injectable()
export class ProfileService {
  constructor(private usersService: UsersService) {}

  getProfile(user: any) {
    return this.usersService.getById(user.sub);
  }

  updateProfile(user: User, profileData: UpdateUserDto) {
    // if (user.updatedAt.getMilliseconds() + 5 * 60 * 60 * 1000 > Date.now()) {
    //   return user;
    // }
    return this.usersService.updateUser(user.id, profileData);
  }

  deleteProfile(user: User) {
    return this.usersService.deleteUser(user.id);
  }
}
