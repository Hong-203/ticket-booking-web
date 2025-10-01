import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Patch,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { GetMovieQueryDto } from './dto/query-movie-query.dto';

@ApiTags('Movies')
@ApiBearerAuth()
@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}
  @Get('generate-slugs')
  generateSlugs() {
    return this.movieService.generateSlugsForExistingMovies();
  }
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('image'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createMovieDto: CreateMovieDto,
  ) {
    return this.movieService.create(createMovieDto, file);
  }

  @Get()
  findAll(@Query() query: GetMovieQueryDto) {
    return this.movieService.findAll(query);
  }

  @Get('slug/:slug')
  getMovieBySlug(@Param('slug') slug: string) {
    return this.movieService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movieService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMovieDto: UpdateMovieDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.movieService.update(id, updateMovieDto, file);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movieService.remove(id);
  }
}
