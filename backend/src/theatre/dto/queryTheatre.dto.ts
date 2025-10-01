import { IsOptional, IsString } from 'class-validator';

export class GetTheatreQueryDto {
  @IsOptional()
  @IsString()
  slug_location?: string;
}
