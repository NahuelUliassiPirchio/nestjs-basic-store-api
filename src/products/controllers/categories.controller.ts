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
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  CreateCategoryDto,
  FilterCategoryDto,
  UpdateCategoryDto,
} from '../dtos/category.dto';
import { CategoriesService } from '../services/categories.service';

@ApiTags('categories')
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Public()
  @Get()
  getAll(@Query() params: FilterCategoryDto) {
    return this.categoriesService.getAll(params);
  }

  @Public()
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.getById(id);
  }

  @Post()
  addCategory(@Body() categoryData: CreateCategoryDto) {
    return this.categoriesService.addCategory(categoryData);
  }

  @Put(':id')
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryData: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCategory(id, updateCategoryData);
  }

  @Delete(':id')
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.deleteCategory(id);
  }

  @Public()
  @Get(':id/products')
  getProductsByCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.getProductsByCategory(id);
  }
}
