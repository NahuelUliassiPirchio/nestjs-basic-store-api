import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, IsNull, Like, Not, Repository } from 'typeorm';
import {
  CreateProductDto,
  FilterProductDto,
  UpdateProductDto,
} from '../dtos/product.dto';
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

  getAll(params?: FilterProductDto) {
    if (params.minPrice > params.maxPrice) throw new ConflictException();
    const price =
      params.minPrice && params.maxPrice
        ? Between(params.minPrice, params.maxPrice)
        : undefined;

    let hasActiveBid = Not(IsNull());
    if (params.hasBid === false) hasActiveBid = IsNull();
    else if (params.hasBid === undefined) hasActiveBid = undefined;

    return this.productsRepository.find({
      relations: { categories: true, bids: true },
      take: params.limit,
      skip: params.offset,
      where: {
        price,
        bids: {
          id: hasActiveBid,
        },
        categories: {
          id: params.categoryId ? In([params.categoryId]) : undefined,
        },
        name: params.name ? Like(`%${params.name}%`) : undefined,
        description: params.description
          ? Like(`%${params.description}%`)
          : undefined,
      },
      order: {
        price: params.order ? params.order : undefined,
      },
    });
  }

  async getById(id: number) {
    const product = await this.productsRepository.findOne({
      relations: { categories: true, bids: true },
      where: { id },
    });
    if (!product) throw new NotFoundException();
    return product;
  }

  async addProduct(data: CreateProductDto) {
    const newProduct = this.productsRepository.create(data);

    newProduct.brand = await this.brandsService.getById(data.brandId);
    newProduct.categories = await this.categoriesService.getByIds(
      data.categoriesIds,
    );

    try {
      return await this.productsRepository.save(newProduct);
    } catch (error) {
      if (error?.code == 23505) throw new ConflictException();
      else throw error;
    }
  }

  async updateProduct(id: number, changes: UpdateProductDto) {
    const product = await this.getById(id);

    if (changes.brandId)
      product.brand = await this.brandsService.getById(changes.brandId);
    if (changes.categoriesIds)
      product.categories = await this.categoriesService.getByIds(
        changes.categoriesIds,
      );

    this.productsRepository.merge(product, changes);
    return this.productsRepository.save(product);
  }

  async deleteProduct(id: number) {
    await this.getById(id);
    return this.productsRepository.delete(id);
  }

  async addCategoryToProduct(id: number, categoryId: number) {
    const product = await this.getById(id);
    const category = await this.categoriesService.getById(categoryId);
    product.categories.push(category);

    return this.productsRepository.save(product);
  }

  async deleteCategoryFromProduct(id: number, categoryId: number) {
    const product = await this.getById(id);

    product.categories = product.categories.filter(
      (category) => category.id !== categoryId,
    );

    return this.productsRepository.save(product);
  }
}
