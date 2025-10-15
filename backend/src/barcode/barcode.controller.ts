import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { BarcodeService } from './barcode.service';
import { Barcode } from './entities/barcode.entity';
import { CreateBarcodeDto } from './dto/create-barcode.dto';
import { UpdateBarcodeStatusDto } from './dto/update-barcode.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Barcode')
@ApiBearerAuth()
@Controller('barcode')
export class BarcodeController {
  constructor(private readonly barcodeService: BarcodeService) {}

  @Post()
  async create(@Body() createDto: CreateBarcodeDto): Promise<Barcode> {
    return await this.barcodeService.create(createDto);
  }

  @Get()
  async findAll(): Promise<Barcode[]> {
    return await this.barcodeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Barcode> {
    return await this.barcodeService.findOne(id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateBarcodeStatusDto,
  ): Promise<Barcode> {
    return await this.barcodeService.updateStatus(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return await this.barcodeService.remove(id);
  }
}
