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
    const bidItem = await this.bidItemsRepository.findBy({
      bid,
      id: bidItemId,
    });
    if (!bidItem) throw new NotFoundException();
    return bidItem;
  }

  async addBidItem(data: CreateBidItemDto) {
    const newBidItem = this.bidItemsRepository.create(data);
    const user = await this.usersService.getById(data.userId);
    newBidItem.user = user;
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
    this.bidItemsRepository.merge(bidItem, changes);
    return this.bidItemsRepository.save(bidItem);
  }

  async deleteBidItem(id: number) {
    await this.getById(id);
    return this.bidItemsRepository.delete(id);
  }
}
