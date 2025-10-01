import { Body, Controller, Post } from '@nestjs/common';
import { AssignSeatsDto } from './dto/assign-seats.dto';
import { HallwiseSeatService } from './hallwise-seat.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Hallwise-Seat')
@ApiBearerAuth()
@Controller('hallwise-seat')
export class HallwiseSeatController {
  constructor(private readonly hallwiseSeatService: HallwiseSeatService) {}

  @Post('assign-all-seats')
  assignAllSeats(@Body() dto: AssignSeatsDto): Promise<string> {
    return this.hallwiseSeatService.assignAllSeatsToHall(dto.hallId);
  }
}
