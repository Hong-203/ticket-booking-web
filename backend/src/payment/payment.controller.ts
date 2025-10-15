// src/payments/payment.controller.ts
import {
  All,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import {
  CreatePaymentMoMoDto,
  CreatePaymentZaloPayDto,
} from './dto/create-momo.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FilterPaymentDto } from './dto/filter-payment.dto';

@ApiTags('Payment')
@ApiBearerAuth()
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-momo')
  async createMoMo(@Body() dto: CreatePaymentMoMoDto) {
    return this.paymentService.createMoMoPayment(dto);
  }

  @Post('create-momo-mobile')
  async createMoMoMobile(@Body() dto: CreatePaymentMoMoDto) {
    return this.paymentService.createMoMoPaymentMobile(dto);
  }

  @Post('create-zalopay')
  async createZaloPay(@Body() dto: CreatePaymentZaloPayDto) {
    const ticketId = dto.ticketId;
    console.log('ticketId', ticketId);
    const result = await this.paymentService.createZaloPayPayment(ticketId);
    return result;
  }

  @Post('create-zalopay-mobile')
  async createZaloPayMobile(@Body() dto: CreatePaymentZaloPayDto) {
    const ticketId = dto.ticketId;
    console.log('ticketId', ticketId);
    const result =
      await this.paymentService.createZaloPayPaymentMobile(ticketId);
    return result;
  }

  @Post('momo-ipn')
  async handleMoMoIPN(@Body() body: any) {
    return this.paymentService.handleMoMoIPN(body);
  }

  @Post('zalopay-callback')
  async handleZaloPayNotify(@Body() body: any) {
    return this.paymentService.handleZaloPayCallback(body);
  }

  @Get('zalopay-callback')
  handleZaloPayRedirect(@Query() query: any, @Res() res: Response) {
    console.log('ZaloPay redirect query:', query);
  }

  @Get()
  // @UseGuards(AuthGuard('jwt'))
  getAll(@Query() filter: FilterPaymentDto) {
    return this.paymentService.getPayments(filter);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getMyPayments(@Request() req, @Query() filter: FilterPaymentDto) {
    const userId = req.user.userId;
    return this.paymentService.getPaymentsByUser(userId, filter);
  }
}
