import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBidDto, UpdateBidDto } from '../dtos/bid.dto';
import { Bid } from '../entities/bid.entity';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid)
    private bidsRepository: Repository<Bid>,
  ) {}

  getAll() {
    return this.bidsRepository.find();
  }

  getOne(id: number) {
    const bid = this.bidsRepository.findOneBy({ id });
    if (!bid) throw new NotFoundException();
    return bid;
  }

  addBid(data: CreateBidDto) {
    const newBid = this.bidsRepository.create(data);
    return this.bidsRepository.save(newBid);
  }

  async updateBid(id: number, changes: UpdateBidDto) {
    const bid = await this.getOne(id);
    this.bidsRepository.merge(bid, changes);
    return this.bidsRepository.save(bid);
  }

  async deleteBid(id: number) {
    await this.getOne(id);
    return this.bidsRepository.delete(id);
  }
}
