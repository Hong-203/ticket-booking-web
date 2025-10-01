import { IsOptional } from 'class-validator';
import { CreateMovieDto } from './create-movie.dto';

export class UpdateMovieDto extends CreateMovieDto {
  @IsOptional()
  image_path?: string;
}
