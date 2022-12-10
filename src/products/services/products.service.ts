import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';
import { Product } from '../entities/product.entity';
import { BrandsService } from './brands.service';
import { CategoriesService } from './categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private brandsService: BrandsService,
    private categoriesService: CategoriesService,
  ) {}

  getAll() {
    return this.productsRepository.find();
  }

  async getOne(id: number) {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) throw new NotFoundException();
    return product;
  }

  async addProduct(data: CreateProductDto) {
    const newProduct = this.productsRepository.create(data);

    newProduct.brand = await this.brandsService.getOne(data.brandId);
    newProduct.categories = await this.categoriesService.getByIds(
      data.categoriesIds,
    );

    return this.productsRepository.save(newProduct);
  }

  async updateProduct(id: number, changes: UpdateProductDto) {
    const product = await this.getOne(id);

    if (changes.brandId)
      product.brand = await this.brandsService.getOne(changes.brandId);
    if (changes.categoriesIds)
      product.categories = await this.categoriesService.getByIds(
        changes.categoriesIds,
      );

    this.productsRepository.merge(product, changes);
    return this.productsRepository.save(product);
  }

  async deleteProduct(id: number) {
    await this.getOne(id);
    return this.productsRepository.delete(id);
  }
}
