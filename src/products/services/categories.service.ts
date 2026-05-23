import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import {
  CreateCategoryDto,
  FilterCategoryDto,
  UpdateCategoryDto,
} from '../dtos/category.dto';
import { Category } from '../entities/category.entity';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

const CAT_VERSION_KEY = 'categories:meta:version';
const CAT_TTL = 5 * 60 * 1000;
const CAT_VERSION_TTL = 24 * 60 * 60 * 1000;
const categoryKey = (id: number) => `categories:${id}`;

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  private async getListVersion(): Promise<number> {
    const version = await this.cache.get<number>(CAT_VERSION_KEY);
    if (version !== undefined && version !== null) return version;
    const newVersion = Date.now();
    await this.cache.set(CAT_VERSION_KEY, newVersion, CAT_VERSION_TTL);
    return newVersion;
  }

  private async bustListCache() {
    const newVersion = Date.now();
    await this.cache.set(CAT_VERSION_KEY, newVersion, CAT_VERSION_TTL);
  }

  async getAll(params?: FilterCategoryDto) {
    const version = await this.getListVersion();
    const key = `categories:list:v${version}:${params?.limit ?? ''}:${params?.offset ?? ''}:${params?.name ?? ''}`;
    const cached = await this.cache.get<Category[]>(key);
    if (cached) return cached;

    const categories = await this.categoriesRepository.find({
      take: params.limit,
      skip: params.offset,
      where: {
        name: params.name ? Like(`%${params.name}%`) : undefined,
      },
    });

    await this.cache.set(key, categories, CAT_TTL);
    return categories;
  }

  getByIds(ids: number[]) {
    return this.categoriesRepository.findBy({ id: In(ids) });
  }

  async getById(id: number) {
    const key = categoryKey(id);
    const cached = await this.cache.get<Category>(key);
    if (cached) return cached;

    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!category) throw new NotFoundException();

    await this.cache.set(key, category, CAT_TTL);
    return category;
  }

  async getProductsByCategory(id: number) {
    const category = await this.getById(id);
    console.log(category);
    return category.products;
  }

  async addCategory(data: CreateCategoryDto) {
    const newCategory = this.categoriesRepository.create(data);
    try {
      const saved = await this.categoriesRepository.save(newCategory);
      await this.bustListCache();
      return saved;
    } catch (error) {
      if (error?.code == 23505) throw new ConflictException();
      else throw error;
    }
  }

  async updateCategory(id: number, changes: UpdateCategoryDto) {
    const category = await this.getById(id);
    this.categoriesRepository.merge(category, changes);
    const saved = await this.categoriesRepository.save(category);
    await Promise.all([this.cache.del(categoryKey(id)), this.bustListCache()]);
    return saved;
  }

  async deleteCategory(id: number) {
    const category = await this.getById(id);
    const result = await this.categoriesRepository.delete(category);
    await Promise.all([this.cache.del(categoryKey(id)), this.bustListCache()]);
    return result;
  }
}
