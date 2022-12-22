import {
  ConflictException,
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

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  getAll(params?: FilterCategoryDto) {
    return this.categoriesRepository.find({
      take: params.limit,
      skip: params.offset,
      where: {
        name: params.name ? Like(`%${params.name}%`) : undefined,
      },
    });
  }

  getByIds(ids: number[]) {
    return this.categoriesRepository.findBy({ id: In(ids) });
  }

  async getById(id: number) {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!category) throw new NotFoundException();
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
      return await this.categoriesRepository.save(newCategory);
    } catch (error) {
      if (error?.code == 23505) throw new ConflictException();
      else throw error;
    }
  }

  async updateCategory(id: number, changes: UpdateCategoryDto) {
    const category = await this.getById(id);
    this.categoriesRepository.merge(category, changes);
    return this.categoriesRepository.save(category);
  }

  async deleteCategory(id: number) {
    const category = await this.getById(id);
    return this.categoriesRepository.delete(category);
  }
}
