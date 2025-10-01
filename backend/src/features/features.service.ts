import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { Feature } from './entities/features.entity';
import { Theatre } from 'src/theatre/entities/theatre.entity';

@Injectable()
export class FeaturesService {
  constructor(
    @InjectRepository(Feature)
    private featureRepo: Repository<Feature>,

    @InjectRepository(Theatre)
    private theatreRepo: Repository<Theatre>,
  ) {}

  async create(dto: CreateFeatureDto): Promise<Feature> {
    console.log('dto', dto);
    const theatre = await this.theatreRepo.findOneBy({ id: dto.theatreId });
    if (!theatre) throw new NotFoundException('Theatre not found');

    const feature = this.featureRepo.create({ ...dto, theatre });
    return this.featureRepo.save(feature);
  }

  findAll(): Promise<Feature[]> {
    return this.featureRepo.find({ relations: ['theatre'] });
  }

  async findOne(id: string): Promise<Feature> {
    const feature = await this.featureRepo.findOne({
      where: { id },
      relations: ['theatre'],
    });
    if (!feature) throw new NotFoundException('Feature not found');
    return feature;
  }

  async update(id: string, dto: UpdateFeatureDto): Promise<Feature> {
    const feature = await this.findOne(id);
    if (dto.theatreId) {
      const theatre = await this.theatreRepo.findOneBy({ id: dto.theatreId });
      if (!theatre) throw new NotFoundException('Theatre not found');
      feature.theatre = theatre;
    }

    Object.assign(feature, dto);
    return this.featureRepo.save(feature);
  }

  async remove(id: string): Promise<void> {
    const feature = await this.findOne(id);
    await this.featureRepo.remove(feature);
  }
}
