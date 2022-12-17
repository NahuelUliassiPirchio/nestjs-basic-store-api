import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  CreateProductDto,
  FilterProductDto,
  UpdateProductDto,
} from '../dtos/product.dto';
import { ProductsService } from '../services/products.service';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}
  @Get()
  getAll(@Query() params: FilterProductDto) {
    return this.productsService.getAll(params);
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getById(id);
  }

  @Post()
  addProduct(@Body() productData: CreateProductDto) {
    return this.productsService.addProduct(productData);
  }

  @Put(':id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductData: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(id, updateProductData);
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.deleteProduct(id);
  }

  @Put(':id/categories/:category_id')
  addCategoryToProduct(
    @Param('id', ParseIntPipe) id: number,
    @Param('category_id', ParseIntPipe) categoryId: number,
  ) {
    return this.productsService.addCategoryToProduct(id, categoryId);
  }

  @Delete(':id/categories/:category_id')
  deleteCategoryFromProduct(
    @Param('id', ParseIntPipe) id: number,
    @Param('category_id', ParseIntPipe) categoryId: number,
  ) {
    return this.productsService.deleteCategoryFromProduct(id, categoryId);
  }
}
