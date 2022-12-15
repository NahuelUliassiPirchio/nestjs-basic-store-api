import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dto';
import { Brand } from '../entities/brand.entity';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private brandsRepository: Repository<Brand>,
  ) {}

  getAll() {
    return this.brandsRepository.find();
  }

  async getById(id: number) {
    const brand = await this.brandsRepository.findOneBy({ id });
    if (!brand) throw new NotFoundException();
    return brand;
  }

  async addBrand(data: CreateBrandDto) {
    const newBrand = this.brandsRepository.create(data);

    try {
      return await this.brandsRepository.save(newBrand);
    } catch (error) {
      if (error?.code == 23505) throw new ConflictException();
      else throw error;
    }
  }

  async updateBrand(id: number, changes: UpdateBrandDto) {
    const brand = await this.getById(id);
    this.brandsRepository.merge(brand, changes);
    return this.brandsRepository.save(brand);
  }

  async deleteBrand(id: number) {
    const brand = await this.getById(id);
    return this.brandsRepository.delete(brand);
  }
}
