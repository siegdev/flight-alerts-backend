import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    const existingUser = await this.userService.findByEmail(dto.email);
    if (existingUser) {
      return existingUser;
    }
    return this.userService.createUser(dto);
  }
}
