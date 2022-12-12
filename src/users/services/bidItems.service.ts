import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBidItemDto, UpdateBidItemDto } from '../dtos/bidItem.dto';
import { BidItem } from '../entities/bidItem.entity';
import { BidsService } from './bids.service';

@Injectable()
export class BidItemsService {
  constructor(
    @InjectRepository(BidItem)
    private bidItemsRepository: Repository<BidItem>,
    private bidsService: BidsService,
  ) {}

  getAll() {
    return this.bidItemsRepository.find();
  }

  async getById(id: number) {
    const bidItem = await this.bidItemsRepository.findOneBy({ id });
    if (!bidItem) throw new NotFoundException();
    return bidItem;
  }

  async getAllFromBid(orderId: number) {
    const bid = await this.bidsService.getById(orderId);
    return bid.bidders;
  }

  async getByIdFromBid(orderId: number, orderItemId: number) {
    const bid = await this.bidsService.getById(orderId);
    const bidItem = await this.bidItemsRepository.findBy({
      bid,
      id: orderItemId,
    });
    if (!bidItem) throw new NotFoundException();
    return bidItem;
  }

  async addOrderItem(data: CreateBidItemDto) {
    const newOrderItem = this.bidItemsRepository.create(data);
    return this.bidItemsRepository.save(newOrderItem);
  }

  async updateOrderItem(id: number, changes: UpdateBidItemDto) {
    const bidItem = await this.getById(id);
    this.bidItemsRepository.merge(bidItem, changes);
    return this.bidItemsRepository.save(bidItem);
  }

  async deleteOrderItem(id: number) {
    await this.getById(id);
    return this.bidItemsRepository.delete(id);
  }
}
