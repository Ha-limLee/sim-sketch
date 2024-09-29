import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @UseInterceptors(
    NoFilesInterceptor(), // to accept form data
  )
  async create(@Body() createUserDto: CreateUserDto): Promise<User | null> {
    return await this.userService.create(createUserDto);
  }
}
