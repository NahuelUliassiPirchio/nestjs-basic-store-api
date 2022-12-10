import { Controller } from '@nestjs/common';
import { BidsService } from '../services/bids.service';

@Controller('bids')
export class BidsController {
  constructor(private bidsService: BidsService) {}
}
