import {
  Injectable,
  BadRequestException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { ShownIn } from './entities/shown_in.entity';
import { ShownInDto } from './dto/shown-in.dto';
import { Movie } from 'src/movie/entities/movie.entity';
import { Hall } from 'src/hall/entities/hall.entity';
import { Showtime } from 'src/showtimes/entities/showtimes.entity';
import { GetShownInQueryDto } from './dto/shown-in-query.dto';

@Injectable()
export class ShownInService {
  private readonly logger = new Logger(ShownInService.name);
  constructor(
    @InjectRepository(ShownIn)
    private readonly shownInRepo: Repository<ShownIn>,
    @InjectRepository(Movie)
    private readonly movieRepo: Repository<Movie>,
    @InjectRepository(Hall)
    private readonly hallRepo: Repository<Hall>,
    @InjectRepository(Showtime)
    private readonly showtimeRepo: Repository<Showtime>,
  ) {}

  async create(createDto: ShownInDto): Promise<ShownIn> {
    const { movie_id, showtime_id, hall_id } = createDto;
    const movie = await this.movieRepo.findOne({ where: { id: movie_id } });

    if (!movie) {
      throw new BadRequestException('Movie not found');
    }
    const showtime = await this.showtimeRepo.findOne({
      where: { id: showtime_id },
    });
    if (!showtime) {
      throw new BadRequestException('Showtime not found');
    }

    const hall = await this.hallRepo.findOne({ where: { id: hall_id } });
    if (!hall) {
      throw new BadRequestException('Hall not found');
    }
    const existing = await this.shownInRepo.findOne({
      where: { hall_id, showtime_id },
    });

    if (existing) {
      throw new BadRequestException(
        'This hall is already assigned to another movie at the same showtime.',
      );
    }

    const newEntry = this.shownInRepo.create(createDto);
    return await this.shownInRepo.save(newEntry);
  }

  async update(
    oldDto: ShownInDto,
    newDto: Partial<ShownInDto>,
  ): Promise<ShownIn> {
    const existing = await this.shownInRepo.findOne({ where: oldDto });
    if (!existing) {
      throw new NotFoundException('ShownIn entry not found');
    }

    const updated = {
      movie_id: newDto.movie_id || oldDto.movie_id,
      showtime_id: newDto.showtime_id || oldDto.showtime_id,
      hall_id: newDto.hall_id || oldDto.hall_id,
    };

    // Kiểm tra tồn tại các thực thể
    const [movie, showtime, hall] = await Promise.all([
      this.movieRepo.findOne({ where: { id: updated.movie_id } }),
      this.showtimeRepo.findOne({ where: { id: updated.showtime_id } }),
      this.hallRepo.findOne({ where: { id: updated.hall_id } }),
    ]);
    if (!movie || !showtime || !hall) {
      throw new BadRequestException('Invalid movie, showtime, or hall ID');
    }

    // Kiểm tra trùng lịch chiếu
    const conflict = await this.shownInRepo.findOne({
      where: {
        hall_id: updated.hall_id,
        showtime_id: updated.showtime_id,
        movie_id: Not(oldDto.movie_id),
      },
    });
    if (conflict) {
      throw new BadRequestException(
        'This hall is already assigned to another movie at the same showtime.',
      );
    }

    await this.shownInRepo.delete(oldDto);
    const newEntry = this.shownInRepo.create(updated);
    return await this.shownInRepo.save(newEntry);
  }

  async delete(dto: ShownInDto): Promise<void> {
    const existing = await this.shownInRepo.findOne({ where: dto });
    if (!existing) {
      throw new NotFoundException('ShownIn entry not found');
    }
    await this.shownInRepo.remove(existing);
  }

  async getAllShownIn(query: GetShownInQueryDto) {
    const {
      movie_id,
      hall_id,
      showtime_id,
      showtime_date,
      theatre_id,
      slug_name,
    } = query;

    const qb = this.shownInRepo
      .createQueryBuilder('shown_in')
      .leftJoinAndSelect('shown_in.movie', 'movie')
      .leftJoinAndSelect('shown_in.hall', 'hall')
      .leftJoinAndSelect('hall.theatre', 'theatre')
      .leftJoinAndSelect('shown_in.showtime', 'showtime');

    if (movie_id) {
      qb.andWhere('movie.id = :movie_id', { movie_id });
    }

    if (slug_name) {
      qb.andWhere('movie.slug = :slug_name', { slug_name });
    }

    if (hall_id) {
      qb.andWhere('hall.id = :hall_id', { hall_id });
    }

    if (showtime_id) {
      qb.andWhere('showtime.id = :showtime_id', { showtime_id });
    }

    if (showtime_date) {
      qb.andWhere('DATE(showtime.showtime_date) = :showtime_date', {
        showtime_date,
      });
    }

    if (theatre_id) {
      qb.andWhere('theatre.id = :theatre_id', { theatre_id });
    }

    const shownIns = await qb.getMany();

    return shownIns.map((s) => ({
      ...s,
      movie: s.movie,
      showtime: s.showtime,
      hall: s.hall,
    }));
  }
}
