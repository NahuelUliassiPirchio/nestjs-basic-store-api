import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dto';
import { Brand } from '../entities/brand.entity';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

const BRANDS_ALL = 'brands:all';
const BRAND_TTL = 5 * 60 * 1000;
const brandKey = (id: number) => `brands:${id}`;

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private brandsRepository: Repository<Brand>,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async getAll() {
    const cached = await this.cache.get<Brand[]>(BRANDS_ALL);
    if (cached) return cached;
    const brands = await this.brandsRepository.find();
    await this.cache.set(BRANDS_ALL, brands, BRAND_TTL);
    return brands;
  }

  async getById(id: number) {
    const key = brandKey(id);
    const cached = await this.cache.get<Brand>(key);
    if (cached) return cached;
    const brand = await this.brandsRepository.findOneBy({ id });
    if (!brand) throw new NotFoundException();
    await this.cache.set(key, brand, BRAND_TTL);
    return brand;
  }

  async addBrand(data: CreateBrandDto) {
    const newBrand = this.brandsRepository.create(data);
    try {
      const saved = await this.brandsRepository.save(newBrand);
      await this.cache.del(BRANDS_ALL);
      return saved;
    } catch (error) {
      if (error?.code == 23505) throw new ConflictException();
      else throw error;
    }
  }

  async updateBrand(id: number, changes: UpdateBrandDto) {
    const brand = await this.getById(id);
    this.brandsRepository.merge(brand, changes);
    const saved = await this.brandsRepository.save(brand);
    await Promise.all([this.cache.del(brandKey(id)), this.cache.del(BRANDS_ALL)]);
    return saved;
  }

  async deleteBrand(id: number) {
    const brand = await this.getById(id);
    const result = await this.brandsRepository.delete(brand);
    await Promise.all([this.cache.del(brandKey(id)), this.cache.del(BRANDS_ALL)]);
    return result;
  }
}
