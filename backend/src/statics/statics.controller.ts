import { Controller, Get } from '@nestjs/common';
import { StaticsService } from './statics.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Statics')
@Controller('statics')
export class StaticsController {
  constructor(private readonly staticsService: StaticsService) {}

  @Get('overview')
  getOverview() {
    return this.staticsService.getSystemOverview();
  }

  @Get('users')
  getUserStats() {
    return this.staticsService.getUserStats();
  }

  @Get('tickets')
  getTicketAndRevenue() {
    return this.staticsService.getTicketAndRevenueStats();
  }

  @Get('movies')
  getMovieStats() {
    return this.staticsService.getMovieStats();
  }

  @Get('revenue/monthly')
  getRevenueByMonth() {
    return this.staticsService.getRevenueByMonth();
  }
}
