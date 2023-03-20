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
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/role.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '../../common/roles.enum';
import { Public } from '../../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
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
  @ApiResponse({ status: 200, description: 'List of categories' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @ApiQuery({ name: 'name', required: false })
  getAll(@Query() params: FilterCategoryDto) {
    return this.categoriesService.getAll(params);
  }

  @Public()
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Get category' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.getById(id);
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Category created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 419, description: 'Category already exists' })
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  addCategory(@Body() categoryData: CreateCategoryDto) {
    return this.categoriesService.addCategory(categoryData);
  }

  @Put(':id')
  @ApiResponse({ status: 200, description: 'Category updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryData: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCategory(id, updateCategoryData);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Category deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.deleteCategory(id);
  }

  @Public()
  @ApiResponse({ status: 200, description: 'Get products by category' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @Get(':id/products')
  getProductsByCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.getProductsByCategory(id);
  }
}
