import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Patch,
  Query,
} from '@nestjs/common';
import { HallService } from './hall.service';
import { CreateHallDto } from './dto/create-hall.dto';
import { UpdateHallDto } from './dto/update-hall.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Seat } from 'src/seat/entities/seat.entity';
import { QuerySeatsDto } from 'src/seat/dto/query-seat.dto';
import { PaginationResult } from 'src/interface/pagination-result.interface';

@ApiTags('Hall')
@ApiBearerAuth()
@Controller('hall')
export class HallController {
  constructor(private readonly hallService: HallService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  create(@Body() createHallDto: CreateHallDto) {
    return this.hallService.create(createHallDto);
  }

  @Get()
  findAll() {
    return this.hallService.findAll();
  }

  @Get('hall-seats/:id')
  async getSeats(
    @Param('id') hallId: string,
    @Query() query: QuerySeatsDto,
  ): Promise<PaginationResult<Seat>> {
    return this.hallService.getSeatsByHallId(hallId, query);
  }

  @Get('by-theatre/:theatreId')
  getHallsByTheatre(@Param('theatreId') theatreId: string) {
    return this.hallService.getHallsByTheatre(theatreId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hallService.findOne(id);
  }

  @Patch(':id')
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateHallDto: UpdateHallDto) {
    return this.hallService.update(id, updateHallDto);
  }

  @Delete(':id')
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.hallService.remove(id);
  }
}
