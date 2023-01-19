import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBidItemDto, UpdateBidItemDto } from '../dtos/bidItem.dto';
import { BidItem } from '../entities/bidItem.entity';
import { BidsService } from './bids.service';
import { UsersService } from './users.service';

@Injectable()
export class BidItemsService {
  constructor(
    @InjectRepository(BidItem)
    private bidItemsRepository: Repository<BidItem>,
    @Inject(forwardRef(() => BidsService))
    private bidsService: BidsService,
    private usersService: UsersService,
  ) {}

  getAll() {
    return this.bidItemsRepository.find({
      relations: { bid: true, user: true },
    });
  }

  getAllByUser(id: number) {
    return this.bidItemsRepository.find({
      relations: { bid: true, user: true },
      where: { user: { id } },
    });
  }

  async getById(id: number) {
    const bidItem = await this.bidItemsRepository.findOne({
      relations: { user: true },
      where: { id },
    });
    if (!bidItem) throw new NotFoundException();
    return bidItem;
  }

  async getAllFromBid(bidId: number) {
    const bid = await this.bidsService.getById(bidId);
    return bid.bidders;
  }

  async getByIdFromBid(bidId: number, bidItemId: number) {
    const bid = await this.bidsService.getById(bidId);

    const bidItem = bid.bidders.find((item) => item.id == bidItemId);
    if (!bidItem) throw new NotFoundException();
    return bidItem;
  }

  async addBidItem(data: CreateBidItemDto) {
    const newBidItem = this.bidItemsRepository.create(data);
    newBidItem.user = await this.usersService.getById(data.userId);
    newBidItem.bid = await this.bidsService.getById(data.bidId);
    if (newBidItem.bid.currentPrice >= newBidItem.bidAmount)
      throw new ConflictException(
        'The bid amount must be higher than the current price',
      );
    try {
      return await this.bidItemsRepository.save(newBidItem);
    } catch (error) {
      if (error?.code == 23505) throw new ConflictException();
      else throw error;
    }
  }

  async updateBidItem(id: number, changes: UpdateBidItemDto) {
    const bidItem = await this.getById(id);
    if (changes.userId) {
      const user = await this.usersService.getById(changes.userId);
      bidItem.user = user;
    }
    if (changes.bidId) {
      const bid = await this.bidsService.getById(changes.bidId);
      bidItem.bid = bid;
    }
    this.bidItemsRepository.merge(bidItem, changes);
    return this.bidItemsRepository.save(bidItem);
  }

  async deleteBidItem(id: number) {
    const deleteNotif = await this.bidItemsRepository.delete(id);
    if (deleteNotif.affected == 0) throw new NotFoundException();
    return { message: 'BidItem deleted' };
  }
}
