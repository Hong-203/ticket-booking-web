import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, LessThanOrEqual, MoreThan, Repository } from 'typeorm';

import { Movie } from './entities/movie.entity';

import { CreateMovieDto } from './dto/create-movie.dto';
import { MovieDirector } from './entities/movie_directors.entity';
import { MovieGenre } from './entities/movie_genre.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { console } from 'inspector';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { GetMovieQueryDto } from './dto/query-movie-query.dto';
import { ReleaseStatus } from 'src/constants';
import { PaginationResult } from 'src/interface/pagination-result.interface';
import { paginate } from 'src/utils/pagination.util';
import { slugify } from 'src/utils/slugify';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private movieRepo: Repository<Movie>,

    @InjectRepository(MovieDirector)
    private directorRepo: Repository<MovieDirector>,

    @InjectRepository(MovieGenre)
    private genreRepo: Repository<MovieGenre>,

    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createMovieDto: CreateMovieDto,
    file: Express.Multer.File,
  ): Promise<Movie> {
    const { directors, genres, name, ...movieFields } = createMovieDto;

    const imageUrl = await this.cloudinaryService.uploadImage(file.buffer);

    if (!name) {
      throw new BadRequestException('Movie name is required');
    }
    const slug = slugify(name);

    const movieData = {
      ...movieFields,
      name,
      slug,
      image_path: imageUrl,
    };

    const movie = this.movieRepo.create(movieData);
    await this.movieRepo.save(movie);

    // Save directors
    if (directors?.length) {
      const movieDirectors = directors.map((d) =>
        this.directorRepo.create({ movie_id: movie.id, director: d }),
      );
      await this.directorRepo.save(movieDirectors);
    }

    // Save genres
    if (genres?.length) {
      const movieGenres = genres.map((g) =>
        this.genreRepo.create({ movie_id: movie.id, genre: g }),
      );
      await this.genreRepo.save(movieGenres);
    }

    return this.movieRepo.findOneOrFail({
      where: { id: movie.id },
      relations: ['directors', 'genres'],
    });
  }

  async findAll(query: GetMovieQueryDto): Promise<PaginationResult<Movie>> {
    const { status, page, limit } = query;
    const filters: any = {};
    const today = new Date();

    if (status === ReleaseStatus.NOW_SHOWING) {
      filters.release_date = LessThanOrEqual(today);
    } else if (status === ReleaseStatus.COMING_SOON) {
      filters.release_date = MoreThan(today);
    }

    return paginate(this.movieRepo, filters, page, limit, {
      relations: ['genres', 'directors'],
      order: { release_date: 'DESC' }, // optional: sort by release_date
    });
  }

  async findOne(id: string): Promise<Movie> {
    const movie = await this.movieRepo.findOne({
      where: { id },
      relations: ['directors', 'genres'],
    });
    if (!movie) throw new NotFoundException(`Movie with id ${id} not found`);
    return movie;
  }

  async findBySlug(slug: string): Promise<Movie> {
    const movie = await this.movieRepo.findOne({
      where: { slug },
      relations: ['directors', 'genres'],
    });
    if (!movie)
      throw new NotFoundException(`Movie with slug "${slug}" not found`);
    return movie;
  }

  async update(
    id: string,
    updateMovieDto: UpdateMovieDto,
    file?: Express.Multer.File,
  ): Promise<Movie> {
    const movie = await this.movieRepo.findOne({ where: { id } });
    if (!movie) throw new NotFoundException(`Movie with id ${id} not found`);

    const { directors, genres, ...movieData } = updateMovieDto;

    if (file) {
      // Xoá ảnh cũ nếu có
      if (movie.image_path) {
        const publicId = this.getPublicIdFromUrl(movie.image_path);
        if (publicId) {
          await this.cloudinaryService.deleteImage(publicId);
        }
      }
      // Upload ảnh mới
      const newImageUrl = await this.cloudinaryService.uploadImage(file.buffer);
      movieData.image_path = newImageUrl;
    }

    this.movieRepo.merge(movie, movieData);
    await this.movieRepo.save(movie);

    // Update directors
    if (directors) {
      await this.directorRepo.delete({ movie_id: id });
      if (directors.length) {
        const movieDirectors = directors.map((name) =>
          this.directorRepo.create({ movie_id: id, director: name }),
        );
        await this.directorRepo.save(movieDirectors);
      }
    }

    // Update genres
    if (genres) {
      await this.genreRepo.delete({ movie_id: id });
      if (genres.length) {
        const movieGenres = genres.map((name) =>
          this.genreRepo.create({ movie_id: id, genre: name }),
        );
        await this.genreRepo.save(movieGenres);
      }
    }

    return this.movieRepo.findOneOrFail({
      where: { id },
      relations: ['directors', 'genres'],
    });
  }

  private getPublicIdFromUrl(url: string): string | null {
    try {
      const parts = url.split('/');
      const uploadIndex = parts.findIndex((p) => p === 'upload');
      if (uploadIndex === -1) return null;

      const publicIdWithExtension = parts.slice(uploadIndex + 1).join('/');
      const lastDotIndex = publicIdWithExtension.lastIndexOf('.');
      if (lastDotIndex === -1) return publicIdWithExtension;

      return publicIdWithExtension.substring(0, lastDotIndex);
    } catch {
      return null;
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.movieRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Movie with id ${id} not found`);
  }

  async generateSlugsForExistingMovies(): Promise<void> {
    const movies = await this.movieRepo.find({
      where: { slug: IsNull() },
    });

    for (const movie of movies) {
      if (movie.name) {
        let baseSlug = slugify(movie.name);
        let slug = baseSlug;
        let count = 1;

        // Check trùng slug
        while (await this.movieRepo.findOne({ where: { slug } })) {
          slug = `${baseSlug}-${count++}`;
        }

        movie.slug = slug;
        await this.movieRepo.save(movie);
      }
    }
  }
}
