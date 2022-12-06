import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  getAll() {
    return this.userRepository.find();
  }

  create(data: CreateUserDto) {
    const newUser = this.userRepository.create(data);
    if (!data.avatar) {
      const userName = newUser.name.replace(' ', '+');
      newUser.avatar = `ui-avatars.com/api/?name=${userName}`;
    }
    return this.userRepository.save(newUser);
  }
}
