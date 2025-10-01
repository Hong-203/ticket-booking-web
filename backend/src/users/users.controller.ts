import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  Query,
  Logger,
  Body,
  Patch,
  ForbiddenException,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UpdateUserDto } from './dto/updateUser.dto';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user) {
      return { message: 'User not found' };
    }
    const { password, ...result } = user;
    return result;
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async getAllUsers() {
    const users = await this.usersService.findAll();
    return users.map(({ password, ...rest }) => rest);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'customer')
  async updateUser(
    @Param('id') id: string,
    @Request() req,
    @Body() updateData: UpdateUserDto,
  ) {
    const requestingUserId = req.user.sub;
    const requestingRole = req.user.role;

    if (requestingRole !== 'admin' && requestingUserId !== id) {
      throw new ForbiddenException('You can only update your own account');
    }

    const updatedUser = await this.usersService.update(id, updateData);

    if (!updatedUser) {
      return { message: 'User not found' };
    }

    const { password, ...result } = updatedUser;
    return result;
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'customer')
  async deleteUser(@Param('id') id: string, @Request() req) {
    const requestingUserId = req.user.sub;
    const requestingRole = req.user.role;

    if (requestingRole !== 'admin' && requestingUserId !== id) {
      throw new ForbiddenException('You can only delete your own account');
    }

    await this.usersService.remove(id);
    return { message: 'User deleted successfully' };
  }
}
