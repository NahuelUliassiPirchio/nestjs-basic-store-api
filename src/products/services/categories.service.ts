import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dto';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  getAll() {
    return this.categoriesRepository.find();
  }

  getByIds(ids: number[]) {
    return this.categoriesRepository.findBy({ id: In(ids) });
  }

  async getById(id: number) {
    const category = await this.categoriesRepository.findOneBy({ id });
    if (!category) throw new NotFoundException();
    return category;
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
