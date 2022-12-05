import { Module } from '@nestjs/common';
import { ProductsController } from './controllers/products/products.controller';
import { ProductsService } from './services/products/products.service';
import { CategoriesService } from './services/categories/categories.service';
import { CategoriesController } from './controllers/categories.controller';
import { BrandsService } from './services/brands.service';
import { BrandsController } from './controllers/brands.controller';

@Module({
  controllers: [ProductsController, CategoriesController, BrandsController],
  providers: [ProductsService, CategoriesService, BrandsService],
})
export class ProductsModule {}
