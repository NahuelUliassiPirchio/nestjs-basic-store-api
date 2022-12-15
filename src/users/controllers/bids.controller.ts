import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateBidDto, UpdateBidDto } from '../dtos/bid.dto';
import { BidsService } from '../services/bids.service';

@Controller('bids')
export class BidsController {
  constructor(private bidsService: BidsService) {}

  @Get()
  getAll() {
    return this.bidsService.getAll();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.bidsService.getById(id);
  }

  @Post()
  addBid(@Body() bidData: CreateBidDto) {
    return this.bidsService.addBid(bidData);
  }

  @Put(':id')
  updateBid(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBidData: UpdateBidDto,
  ) {
    return this.bidsService.updateBid(id, updateBidData);
  }

  @Delete(':id')
  deleteBid(@Param('id', ParseIntPipe) id: number) {
    return this.bidsService.deleteBid(id);
  }

  @Put(':id/items/:bid_item_id')
  addBidItemToBid(
    @Param('id', ParseIntPipe) id: number,
    @Param('bid_item_id', ParseIntPipe) bidItemId: number,
  ) {
    return this.bidsService.addItemToBid(id, bidItemId);
  }

  @Delete(':id/items/:bid_item_id')
  deleteBidItemFromBid(
    @Param('id', ParseIntPipe) id: number,
    @Param('bid_item_id', ParseIntPipe) bidItemId: number,
  ) {
    return this.bidsService.deleteItemFromBid(id, bidItemId);
  }
}
