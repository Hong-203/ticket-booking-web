// ticket.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Ticket')
@ApiBearerAuth()
@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createTicketDto: CreateTicketDto, @Request() req) {
    const user_id = req.user.userId;
    const ticket = await this.ticketService.createTicket(
      createTicketDto,
      user_id,
    );
    return {
      message: 'Tạo vé thành công',
      data: ticket,
    };
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getMyTickets(@Request() req) {
    const userId = req.user.userId;
    const tickets = await this.ticketService.getTicketsByUser(userId);

    return {
      message: 'Lấy danh sách vé thành công',
      data: tickets,
    };
  }

  @Get('info/:id')
  async ticketInfo(@Param('id') id: string) {
    return await this.ticketService.ticketInfo(id);
  }

  @Get(':id')
  async getTicketDetail(@Param('id') id: string) {
    return await this.ticketService.getTicketDetail(id);
  }
}
