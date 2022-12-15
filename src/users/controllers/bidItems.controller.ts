import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateBidItemDto, UpdateBidItemDto } from '../dtos/bidItem.dto';
import { BidItemsService } from '../services/bidItems.service';

@Controller('bid-items')
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
