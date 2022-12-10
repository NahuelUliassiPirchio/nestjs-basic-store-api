import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getOne(id: number) {
    const category = await this.categoriesRepository.findOneBy({ id });
    if (!category) throw new NotFoundException();
    return category;
  }

  addCategory(data: CreateCategoryDto) {
    const newCategory = this.categoriesRepository.create(data);
    return this.categoriesRepository.save(newCategory);
  }

  async updateCategory(id: number, changes: UpdateCategoryDto) {
    const category = await this.getOne(id);
    this.categoriesRepository.merge(category, changes);
    return this.categoriesRepository.save(category);
  }

  async deleteCategory(id: number) {
    const category = await this.getOne(id);
    return this.categoriesRepository.delete(category);
  }
}
