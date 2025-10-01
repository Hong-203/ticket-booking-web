import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Theatre } from './entities/theatre.entity';
import slugify from 'slugify';

@Injectable()
export class TheatreService {
  constructor(
    @InjectRepository(Theatre)
    private theatreRepository: Repository<Theatre>,
  ) {}

  async getAll(slug_location?: string): Promise<Theatre[]> {
    if (slug_location) {
      return this.theatreRepository.find({
        where: { slug_location },
      });
    }
    return this.theatreRepository.find();
  }

  async findById(id: string): Promise<Theatre> {
    const theatre = await this.theatreRepository.findOne({ where: { id } });
    if (!theatre) {
      throw new NotFoundException(`Theatre with id ${id} not found`);
    }
    return theatre;
  }

  async findBySlugName(slug_name: string): Promise<Theatre> {
    const theatre = await this.theatreRepository.findOne({
      where: { slug_name },
    });
    if (!theatre) {
      throw new NotFoundException(
        `Theatre with slug_name ${slug_name} not found`,
      );
    }
    return theatre;
  }

  async findByLocationSlug(slugLocation: string): Promise<Theatre[]> {
    return this.theatreRepository.find({
      where: { slug_location: slugLocation },
    });
  }

  async create(data: Partial<Theatre>): Promise<Theatre> {
    const slugName = slugify(data.name || '', { lower: true, strict: true });
    const slugLocation = slugify(data.location || '', {
      lower: true,
      strict: true,
    });

    const theatre = this.theatreRepository.create({
      ...data,
      slug_name: slugName,
      slug_location: slugLocation,
    });

    return this.theatreRepository.save(theatre);
  }

  async update(id: string, data: Partial<Theatre>): Promise<Theatre> {
    const theatre = await this.findById(id);

    if (data.name) {
      theatre.name = data.name;
      theatre.slug_name = slugify(data.name, { lower: true, locale: 'vi' });
    }

    if (data.location) {
      theatre.location = data.location;
      theatre.slug_location = slugify(data.location, {
        lower: true,
        locale: 'vi',
      });
    }

    if (data.locationDetails !== undefined) {
      theatre.locationDetails = data.locationDetails;
    }

    return this.theatreRepository.save(theatre);
  }

  async delete(id: string): Promise<void> {
    await this.theatreRepository.delete(id);
  }

  async deleteCase(ids: string[]): Promise<void> {
    await this.theatreRepository.delete({ id: In(ids) });
  }

  async getAllLocations(): Promise<
    { location: string; slug_location: string }[]
  > {
    const rawData = await this.theatreRepository
      .createQueryBuilder('theatre')
      .select(['theatre.location', 'theatre.slug_location'])
      .where(
        'theatre.location IS NOT NULL AND theatre.slug_location IS NOT NULL',
      )
      .distinct(true)
      .getRawMany();

    return rawData.map((item) => ({
      location: item.theatre_location,
      slug_location: item.theatre_slug_location,
    }));
  }
}
