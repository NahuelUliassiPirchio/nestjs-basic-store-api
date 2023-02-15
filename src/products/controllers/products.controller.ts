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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateProductDto,
  FilterProductDto,
  UpdateProductDto,
} from '../dtos/product.dto';
import { ProductsService } from '../services/products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}
  @Get()
  @ApiResponse({ status: 200, description: 'Get products' })
  getAll(@Query() params: FilterProductDto) {
    return this.productsService.getAll(params);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Get product' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getById(id);
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Product created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  addProduct(@Body() productData: CreateProductDto) {
    return this.productsService.addProduct(productData);
  }

  @Put(':id')
  @ApiResponse({ status: 200, description: 'Product updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductData: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(id, updateProductData);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Product deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.deleteProduct(id);
  }

  @Put(':id/categories/:category_id')
  @ApiResponse({ status: 200, description: 'Category added to product' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  addCategoryToProduct(
    @Param('id', ParseIntPipe) id: number,
    @Param('category_id', ParseIntPipe) categoryId: number,
  ) {
    return this.productsService.addCategoryToProduct(id, categoryId);
  }

  @Delete(':id/categories/:category_id')
  @ApiResponse({ status: 200, description: 'Category deleted from product' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  deleteCategoryFromProduct(
    @Param('id', ParseIntPipe) id: number,
    @Param('category_id', ParseIntPipe) categoryId: number,
  ) {
    return this.productsService.deleteCategoryFromProduct(id, categoryId);
  }
}
