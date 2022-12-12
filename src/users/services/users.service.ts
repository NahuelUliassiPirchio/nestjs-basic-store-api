import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
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

  async getById(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException();
    return user;
  }

  addUser(data: CreateUserDto) {
    const newUser = this.usersRepository.create(data);
    if (!data.avatar) {
      const userName = newUser.name.replace(' ', '+');
      newUser.avatar = `ui-avatars.com/api/?name=${userName}`;
    }
    return this.usersRepository.save(newUser);
  }

  async updateUser(id: number, changes: UpdateUserDto) {
    const user = await this.getById(id);
    this.usersRepository.merge(user, changes);
    return this.usersRepository.save(user);
  }

  async deleteUser(id: number) {
    await this.getById(id);
    return this.usersRepository.delete(id);
  }
}
