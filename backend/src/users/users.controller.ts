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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UpdateUserDto } from './dto/updateUser.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Patch('avatar')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async updateAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const updatedUser = await this.usersService.updateAvatar(
      req.user.userId,
      file.buffer,
    );
    const { password, ...result } = updatedUser;
    return {
      message: 'Avatar updated successfully',
      user: result,
    };
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'customer')
  async updateUser(
    @Param('id') id: string,
    @Request() req,
    @Body() updateData: UpdateUserDto,
  ) {
    const requestingUserId = req.user.userId;
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
    const requestingUserId = req.user.userId;
    const requestingRole = req.user.role;

    if (requestingRole !== 'admin' && requestingUserId !== id) {
      throw new ForbiddenException('You can only delete your own account');
    }

    await this.usersService.remove(id);
    return { message: 'User deleted successfully' };
  }
}
