import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'src/common/encryption.common';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  getAll(params) {
    return this.usersRepository.find({
      relations: { bids: true, orders: true },
      skip: params.offset,
      take: params.limit,
    });
  }

  async getById(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: { orders: true, bids: true },
    });
    if (!user) throw new NotFoundException();
    return user;
  }

  async getByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async addUser(data: CreateUserDto) {
    const newUser = this.usersRepository.create(data);
    if (!data.avatar) {
      const userName = newUser.name.replace(' ', '+');
      newUser.avatar = `ui-avatars.com/api/?name=${userName}`;
    }
    newUser.password = await hash(data.password);

    try {
      return await this.usersRepository.save(newUser);
    } catch (error) {
      if (error?.code == 23505) throw new ConflictException();
      else throw error;
    }
  }

  async updateUser(id: number, changes: UpdateUserDto) {
    const user = await this.getById(id);
    this.usersRepository.merge(user, changes);
    if (changes.password) user.password = await hash(changes.password);
    return this.usersRepository.save(user);
  }

  async deleteUser(id: number) {
    await this.getById(id);
    return this.usersRepository.delete(id);
  }
}
