import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  getAll() {
    return this.usersRepository.find();
  }

  create(data: CreateUserDto) {
    const newUser = this.usersRepository.create(data);
    if (!data.avatar) {
      const userName = newUser.name.replace(' ', '+');
      newUser.avatar = `ui-avatars.com/api/?name=${userName}`;
    }
    return this.usersRepository.save(newUser);
  }
}
