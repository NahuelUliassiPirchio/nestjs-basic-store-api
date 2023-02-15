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
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../auth/decorators/public.decorator';
import { Roles } from '../../auth/decorators/role.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserRole } from '../../common/roles.enum';
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
  @ApiResponse({ status: 200, description: 'List of bids' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  getAll(@Query() params: FilterBidDto) {
    return this.bidsService.getAll(params);
  }

  @Public()
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Get bid' })
  @ApiResponse({ status: 404, description: 'Bid not found' })
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.bidsService.getById(id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Bid created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  addBid(@Body() bidData: CreateBidDto) {
    return this.bidsService.addBid(bidData);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Bid updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Bid not found' })
  updateBid(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBidData: UpdateBidDto,
  ) {
    return this.bidsService.updateBid(id, updateBidData);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Bid deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Bid not found' })
  deleteBid(@Param('id', ParseIntPipe) id: number) {
    return this.bidsService.deleteBid(id);
  }

  @Put(':id/items/:bid_item_id')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Bid item updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Bid item not found' })
  addBidItemToBid(
    @Param('id', ParseIntPipe) id: number,
    @Param('bid_item_id', ParseIntPipe) bidItemId: number,
  ) {
    return this.bidsService.addItemToBid(id, bidItemId);
  }

  @Delete(':id/items/:bid_item_id')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Bid item deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Bid item not found' })
  deleteBidItemFromBid(
    @Param('id', ParseIntPipe) id: number,
    @Param('bid_item_id', ParseIntPipe) bidItemId: number,
  ) {
    return this.bidsService.deleteItemFromBid(id, bidItemId);
  }
}
