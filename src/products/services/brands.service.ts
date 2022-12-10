import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getOne(id: number) {
    const brand = await this.brandsRepository.findOneBy({ id });
    if (!brand) throw new NotFoundException();
    return brand;
  }

  addBrand(data: CreateBrandDto) {
    const newBrand = this.brandsRepository.create(data);
    return this.brandsRepository.save(newBrand);
  }

  async updateBrand(id: number, changes: UpdateBrandDto) {
    const brand = await this.getOne(id);
    this.brandsRepository.merge(brand, changes);
    return this.brandsRepository.save(brand);
  }

  async deleteBrand(id: number) {
    const brand = await this.getOne(id);
    return this.brandsRepository.delete(brand);
  }
}
