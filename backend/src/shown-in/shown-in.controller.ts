import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ShownInService } from './shown-in.service';
import { ShownInDto } from './dto/shown-in.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { GetShownInQueryDto } from './dto/shown-in-query.dto';

@ApiTags('Shown-in')
@ApiBearerAuth()
@Controller('shown-in')
export class ShownInController {
  constructor(private readonly shownInService: ShownInService) {}

  @Get()
  getAllShownIn(@Query() query: GetShownInQueryDto) {
    return this.shownInService.getAllShownIn(query);
  }

  @Post()
  create(@Body() createDto: ShownInDto) {
    return this.shownInService.create(createDto);
  }

  @ApiExtraModels(ShownInDto)
  @Patch()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        old: { $ref: getSchemaPath(ShownInDto) },
        new: {
          type: 'object',
          properties: {
            movie_id: { type: 'string', format: 'uuid' },
            showtime_id: { type: 'string', format: 'uuid' },
            hall_id: { type: 'string', format: 'uuid' },
          },
        },
      },
    },
  })
  updateShownIn(
    @Body('old') oldDto: ShownInDto,
    @Body('new') newDto: Partial<ShownInDto>,
  ) {
    return this.shownInService.update(oldDto, newDto);
  }

  @Delete()
  deleteShownIn(@Body() dto: ShownInDto) {
    return this.shownInService.delete(dto);
  }
}
