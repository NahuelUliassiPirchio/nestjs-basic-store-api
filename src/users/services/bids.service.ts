import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/products/services/products.service';
import { Repository } from 'typeorm';
import { CreateBidDto, FilterBidDto, UpdateBidDto } from '../dtos/bid.dto';
import { Bid } from '../entities/bid.entity';
import { BidItemsService } from './bidItems.service';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid)
    private bidsRepository: Repository<Bid>,
    @Inject(forwardRef(() => BidItemsService))
    private bidItemsService: BidItemsService,
    private productService: ProductsService,
  ) {}

  getAll(params?: FilterBidDto) {
    return this.bidsRepository.find({
      relations: {
        bidders: { user: true },
        product: true,
      },
      skip: params?.offset,
      take: params?.limit,
    });
  }

  async getById(id: number) {
    const bid = await this.bidsRepository.findOne({
      relations: { bidders: { user: true }, product: true },
      where: { id },
    });
    if (!bid) throw new NotFoundException();
    return bid;
  }

  async addBid(data: CreateBidDto) {
    const newBid = this.bidsRepository.create(data);

    newBid.product = await this.productService.getById(data.productId);

    newBid.initialDate = new Date(data.initialDate);
    newBid.endDate = new Date(data.endDate);

    return await this.bidsRepository.save(newBid);
  }

  async updateBid(id: number, changes: UpdateBidDto) {
    const bid = await this.getById(id);
    this.bidsRepository.merge(bid, changes);
    if (changes.productId)
      bid.product = await this.productService.getById(changes.productId);

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
