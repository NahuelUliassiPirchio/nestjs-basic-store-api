import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindOptionsWhere,
  FindOptionsWhereProperty,
  ILike,
  In,
  IsNull,
  LessThan,
  Like,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import {
  CreateProductDto,
  FilterProductDto,
  UpdateProductDto,
} from '../dtos/product.dto';
import { Product } from '../entities/product.entity';
import { BrandsService } from './brands.service';
import { CategoriesService } from './categories.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

const PRODUCT_TTL = 2 * 60 * 1000;
const productKey = (id: number) => `products:${id}`;

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private brandsService: BrandsService,
    private categoriesService: CategoriesService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async checkProductsExistence(productIds: number[]) {
    await Promise.all(
      productIds.map(async (productId) => {
        await this.getById(productId);
      }),
    );
  }

  async getAll(params?: FilterProductDto) {
    if (params.minPrice > params.maxPrice) throw new ConflictException();
    const limit = params.limit || 10;
    const offset = params.offset || 0;
    const price =
      params.minPrice && params.maxPrice
        ? Between(params.minPrice, params.maxPrice)
        : undefined;

    let bidsFilter: any = {
      id: Not(IsNull()),
      endDate: MoreThanOrEqual(new Date()),
    };
    if (params.hasBid === false) {
      bidsFilter = [{ id: IsNull() }, { endDate: LessThan(new Date()) }];
    } else if (params.hasBid === undefined) {
      bidsFilter = undefined;
    }

    let whereConditions: FindOptionsWhereProperty<Product> = {
      brand: params.brandId ? { id: params.brandId } : undefined,
      price,
      bids: bidsFilter,
      categories: {
        id: params.categoryId ? In([params.categoryId]) : undefined,
      },
      name: params.name ? ILike(`%${params.name}%`) : undefined,
      description: params.description
        ? ILike(`%${params.description}%`)
        : undefined,
    };

    if (params.searchTerm) {
      const searchTerm = `%${params.searchTerm}%`;
      whereConditions = [
        { name: ILike(searchTerm) },
        { description: ILike(searchTerm) },
        {
          brand: {
            name: ILike(searchTerm),
          },
        },
      ];
    }

    const [products, total] = await this.productsRepository.findAndCount({
      relations: { bids: true, brand: true },
      take: limit,
      skip: offset,
      where: whereConditions,
      order: {
        price: params.order ? params.order : undefined,
      },
    });

    return {
      data: products,
      totalProducts: total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getById(id: number) {
    const key = productKey(id);
    const cached = await this.cache.get<Product>(key);
    if (cached) return cached;

    const product = await this.productsRepository.findOne({
      relations: { categories: true, bids: true, brand: true },
      where: { id },
    });
    if (!product) throw new NotFoundException();

    await this.cache.set(key, product, PRODUCT_TTL);
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
    const saved = await this.productsRepository.save(product);
    await this.cache.del(productKey(id));
    return saved;
  }

  async deleteProduct(id: number) {
    await this.getById(id);
    const result = await this.productsRepository.delete(id);
    await this.cache.del(productKey(id));
    return result;
  }

  async addCategoryToProduct(id: number, categoryId: number) {
    const product = await this.getById(id);
    const category = await this.categoriesService.getById(categoryId);
    product.categories.push(category);

    const saved = await this.productsRepository.save(product);
    await this.cache.del(productKey(id));
    return saved;
  }

  async deleteCategoryFromProduct(id: number, categoryId: number) {
    const product = await this.getById(id);

    product.categories = product.categories.filter(
      (category) => category.id !== categoryId,
    );

    const saved = await this.productsRepository.save(product);
    await this.cache.del(productKey(id));
    return saved;
  }
}
