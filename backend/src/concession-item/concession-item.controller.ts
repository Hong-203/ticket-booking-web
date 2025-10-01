import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CreateConcessionItemDto } from './dto/create-concession-item.dto';
import { UpdateConcessionItemDto } from './dto/update-concession-item.dto';
import { ConcessionItemsService } from './concession-item.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Concession-Items')
@ApiBearerAuth()
@Controller('concession-items')
export class ConcessionItemsController {
  constructor(private readonly service: ConcessionItemsService) {}

  @Post()
  create(@Body() dto: CreateConcessionItemDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateConcessionItemDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
