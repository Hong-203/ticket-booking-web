// src/seat/seat.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  UseGuards,
  Patch,
  Query,
  ValidationPipe,
  Logger,
  Request,
} from '@nestjs/common';
import { SeatService } from './seat.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { BulkCreateSeatDto } from './dto/bulk-create-seat.dto';
import { SeatStatus } from 'src/constants';
import { QuerySeatsDto } from './dto/query-seat.dto';
import { PaginationResult } from 'src/interface/pagination-result.interface';
import { Seat } from './entities/seat.entity';
import { CreateSeatBookingDto } from './dto/seat-booking.dto';
import { GetAvailableSeatsDto } from './dto/get-available-seats.dto';

@ApiTags('Seats')
@ApiBearerAuth()
@Controller('seats')
export class SeatController {
  private readonly logger = new Logger(SeatController.name);
  constructor(private readonly seatService: SeatService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiBody({ type: [CreateSeatDto] })
  create(@Body() dto: CreateSeatDto[]): Promise<any> {
    return this.seatService.create(dto);
  }

  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true })) filterDto: QuerySeatsDto,
  ): Promise<PaginationResult<Seat>> {
    return this.seatService.findAll(filterDto);
  }

  @Get('available')
  getAvailableSeats(@Query() query: GetAvailableSeatsDto) {
    const { movie_id, hall_id, showtime_id } = query;
    return this.seatService.getAvailableSeats(movie_id, hall_id, showtime_id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.seatService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  update(@Param('id', ParseIntPipe) id: string, @Body() dto: UpdateSeatDto) {
    return this.seatService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.seatService.remove(id);
  }

  @Post('seat-booking')
  @UseGuards(AuthGuard('jwt'))
  async createSeatBookings(@Body() dto: CreateSeatBookingDto, @Request() req) {
    const user_id = req.user.userId;
    return this.seatService.createSeatBookings(user_id, dto);
  }
}
