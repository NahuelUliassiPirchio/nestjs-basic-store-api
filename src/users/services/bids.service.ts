import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBidDto, UpdateBidDto } from '../dtos/bid.dto';
import { Bid } from '../entities/bid.entity';
import { BidItemsService } from './bidItems.service';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid)
    private bidsRepository: Repository<Bid>,
    @Inject(forwardRef(() => BidItemsService))
    private bidItemsService: BidItemsService,
  ) {}

  getAll() {
    return this.bidsRepository.find({
      relations: {
        bidders: { user: true },
        // product: true
      },
    });
  }

  getById(id: number) {
    const bid = this.bidsRepository.findOne({
      relations: { bidders: { user: true } },
      where: { id },
    });
    if (!bid) throw new NotFoundException();
    return bid;
  }

  async addBid(data: CreateBidDto) {
    const newBid = this.bidsRepository.create(data);

    try {
      return await this.bidsRepository.save(newBid);
    } catch (error) {
      if (error?.code == 23505) throw new ConflictException();
      else throw error;
    }
  }

  async updateBid(id: number, changes: UpdateBidDto) {
    const bid = await this.getById(id);
    this.bidsRepository.merge(bid, changes);
    return this.bidsRepository.save(bid);
  }

  async deleteBid(id: number) {
    await this.getById(id);
    return this.bidsRepository.delete(id);
  }

  async addItemToBid(id: number, bidItemId: number) {
    const bid = await this.getById(id);
    const bidItem = await this.bidItemsService.getById(bidItemId);
    bid.bidders.push(bidItem);
    return this.bidsRepository.save(bid);
  }

  async deleteItemFromBid(id: number, bidItemId: number) {
    const bid = await this.getById(id);
    bid.bidders = bid.bidders.filter((item) => item.id !== bidItemId);
    return this.bidsRepository.save(bid);
  }
}
