import { Body, Controller, Get, Inject, Post, Req } from '@nestjs/common';
import { CreateUserDto } from '../dtos/user.dto';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.getAll();
  }

  @Post()
  createUser(@Body() data: CreateUserDto) {
    return this.usersService.create(data);
  }
}
