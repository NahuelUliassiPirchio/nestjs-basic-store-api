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
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.bidsService.getOne(id);
  }

  @Post()
  addBid(@Body() bid: CreateBidDto) {
    return this.bidsService.addBid(bid);
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
}
