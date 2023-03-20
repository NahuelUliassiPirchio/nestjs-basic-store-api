import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/role.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '../../common/roles.enum';
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dto';
import { BrandsService } from '../services/brands.service';

@ApiTags('brands')
@Controller('brands')
export class BrandsController {
  constructor(private brandsService: BrandsService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Get all brands' })
  getAll() {
    return this.brandsService.getAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Get brand' })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.brandsService.getById(id);
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Brand created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 419, description: 'Brand already exists' })
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  addBrand(@Body() brandData: CreateBrandDto) {
    return this.brandsService.addBrand(brandData);
  }

  @Put(':id')
  @ApiResponse({ status: 200, description: 'Brand updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateBrand(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBrandData: UpdateBrandDto,
  ) {
    return this.brandsService.updateBrand(id, updateBrandData);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Brand deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  deleteBrand(@Param('id', ParseIntPipe) id: number) {
    return this.brandsService.deleteBrand(id);
  }
}
