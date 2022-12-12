import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { BidItemsService } from '../services/bidItems.service';

@Controller(':bid_id/bid-items')
export class BidItemsController {
  constructor(private bidItemsService: BidItemsService) {}
  @Get()
  getAll(@Param('bid_id', ParseIntPipe) bidId: number) {
    return this.bidItemsService.getAllFromBid(bidId);
  }

  @Get(':bid-item_id')
  getBidItem(
    @Param('bid-item_id') bidItemId: number,
    @Param('bid_id', ParseIntPipe) bidId: number,
  ) {
    return this.bidItemsService.getByIdFromBid(bidId, bidItemId);
  }
}
