import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HasIdentity } from 'src/auth/decorators/identity.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OwnsAuthGuard } from 'src/auth/guards/owns-auth.guard';
import { CreateBidItemDto, UpdateBidItemDto } from '../dtos/bidItem.dto';
import { BidItemsService } from '../services/bidItems.service';

@ApiTags('bid-items')
@Controller('bid-items')
@UseGuards(JwtAuthGuard, OwnsAuthGuard)
export class BidItemsController {
  constructor(private bidItemsService: BidItemsService) {}
  @Get()
  getAll() {
    return this.bidItemsService.getAll();
  }

  @Get(':id')
  getBidItem(@Param('id', ParseIntPipe) id: number) {
    return this.bidItemsService.getById(id);
  }

  @Post()
  @HasIdentity()
  addBidItem(@Body() bidItemData: CreateBidItemDto) {
    return this.bidItemsService.addBidItem(bidItemData);
  }

  @Put(':id')
  updateBidItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBidItemData: UpdateBidItemDto,
  ) {
    return this.bidItemsService.updateBidItem(id, updateBidItemData);
  }
}
