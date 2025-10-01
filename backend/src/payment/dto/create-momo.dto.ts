import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreatePaymentMoMoDto {
  @IsUUID()
  @ApiProperty()
  ticketId: string;
}

export class CreatePaymentZaloPayDto {
  @IsUUID()
  @ApiProperty()
  ticketId: string;
}
