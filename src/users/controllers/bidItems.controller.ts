import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HasIdentity } from 'src/auth/decorators/identity.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OwnsAuthGuard } from 'src/auth/guards/owns-auth.guard';
import { UserRole } from 'src/common/roles.enum';
import { CreateBidItemDto, UpdateBidItemDto } from '../dtos/bidItem.dto';
import { BidItemsService } from '../services/bidItems.service';

@ApiTags('bid-items')
@Controller('bids/:id/bid-items')
@UseGuards(JwtAuthGuard, OwnsAuthGuard)
export class BidItemsController {
  constructor(private bidItemsService: BidItemsService) {}
  @Get()
  @HasIdentity()
  getAll(@Request() req) {
    if (req.user.role === UserRole.ADMIN) return this.bidItemsService.getAll();
    return this.bidItemsService.getAllByUser(req.user.sub);
  }

  @Get(':itemId')
  getBidItem(
    @Param('id', ParseIntPipe) id: number,
    @Param('itemId') itemId: number,
  ) {
    return this.bidItemsService.getByIdFromBid(id, itemId);
  }

  @Post()
  @HasIdentity()
  addBidItem(
    @Body() bidItemData: CreateBidItemDto,
    @Param('id') id: number,
    @Request() req,
  ) {
    if (req.user.sub !== bidItemData.userId) throw new Error('Unauthorized');
    // if (id !== bidItemData.bidId) throw new Error('Unauthorized');
    return this.bidItemsService.addBidItem(bidItemData);
  }

  @Put(':itemId')
  updateBidItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBidItemData: UpdateBidItemDto,
  ) {
    return this.bidItemsService.updateBidItem(id, updateBidItemData);
  }

  @Delete(':itemId')
  deleteBidItem(@Param('id', ParseIntPipe) id: number) {
    return this.bidItemsService.deleteBidItem(id);
  }
}
