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
import { Roles } from 'src/auth/decorators/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserRole } from 'src/common/roles.enum';
import { CreateBidDto, FilterBidDto, UpdateBidDto } from '../dtos/bid.dto';
import { BidsService } from '../services/bids.service';

@ApiTags('bids')
@UseGuards(JwtAuthGuard)
@Roles(UserRole.ADMIN)
@Controller('bids')
export class BidsController {
  constructor(private bidsService: BidsService) {}

  @Public()
  @Get()
  getAll(@Query() params: FilterBidDto) {
    return this.bidsService.getAll(params);
  }

  @Public()
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
