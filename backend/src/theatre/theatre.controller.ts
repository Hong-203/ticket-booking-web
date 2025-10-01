import {
  Controller,
  Post,
  Body,
  Logger,
  UseGuards,
  Get,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TheatreService } from './theatre.service';
import { Theatre } from './entities/theatre.entity';
import { CreateTheatreDto } from './dto/createTheatre.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UpdateTheatreDto } from './dto/updateTheatre.dto';
import { GetTheatreQueryDto } from './dto/queryTheatre.dto';

@ApiTags('Theatres') // nên sửa thành 'Theatres' cho đúng resource
@ApiBearerAuth()
@Controller('theatre')
export class TheatreController {
  private readonly logger = new Logger(TheatreController.name);

  constructor(private readonly theatreService: TheatreService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async create(@Body() createTheatreDto: CreateTheatreDto): Promise<Theatre> {
    const theatre = await this.theatreService.create(createTheatreDto);
    return theatre;
  }

  @Get()
  async getAll(@Query() query: GetTheatreQueryDto): Promise<Theatre[]> {
    return this.theatreService.getAll(query.slug_location);
  }

  @Get('locations')
  getAllLocations() {
    return this.theatreService.getAllLocations();
  }

  @Get('id/:id')
  async getDetail(@Param('id') id: string): Promise<Theatre> {
    return this.theatreService.findById(id);
  }

  @Get('slug/:slug_name')
  async getDetailBySlugName(
    @Param('slug_name') slug_name: string,
  ): Promise<Theatre> {
    return this.theatreService.findBySlugName(slug_name);
  }

  @Get('location/:slug')
  async findByLocationSlug(@Param('slug') slug: string): Promise<Theatre[]> {
    return this.theatreService.findByLocationSlug(slug);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() updateTheatreDto: UpdateTheatreDto,
  ) {
    return this.theatreService.update(id, updateTheatreDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async delete(@Param('id') id: string) {
    await this.theatreService.delete(id);
    return { message: `Theatre with id ${id} has been successfully deleted.` };
  }
}
