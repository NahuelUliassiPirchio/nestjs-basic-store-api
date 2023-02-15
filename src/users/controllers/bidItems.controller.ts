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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HasIdentity } from '../../auth/decorators/identity.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OwnsAuthGuard } from '../../auth/guards/owns-auth.guard';
import { UserRole } from '../../common/roles.enum';
import { CreateBidItemDto, UpdateBidItemDto } from '../dtos/bidItem.dto';
import { BidItemsService } from '../services/bidItems.service';

@ApiTags('bid-items')
@ApiBearerAuth()
@Controller('bids/:id/bid-items')
@UseGuards(JwtAuthGuard, OwnsAuthGuard)
export class BidItemsController {
  constructor(private bidItemsService: BidItemsService) {}
  @Get()
  @HasIdentity()
  @ApiResponse({ status: 200, description: 'Get all bid items' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getAll(@Request() req) {
    if (req.user.role === UserRole.ADMIN) return this.bidItemsService.getAll();
    return this.bidItemsService.getAllByUser(req.user.sub);
  }

  @Get(':itemId')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Get bid item' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Bid item not found' })
  getBidItem(
    @Param('id', ParseIntPipe) id: number,
    @Param('itemId') itemId: number,
  ) {
    return this.bidItemsService.getByIdFromBid(id, itemId);
  }

  @Post()
  @HasIdentity()
  @ApiResponse({ status: 201, description: 'Bid item created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Bid item updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Bid item not found' })
  updateBidItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBidItemData: UpdateBidItemDto,
  ) {
    return this.bidItemsService.updateBidItem(id, updateBidItemData);
  }

  @Delete(':itemId')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Bid item deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Bid item not found' })
  deleteBidItem(@Param('id', ParseIntPipe) id: number) {
    return this.bidItemsService.deleteBidItem(id);
  }
}
