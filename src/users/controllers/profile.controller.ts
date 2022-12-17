import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserDto } from '../dtos/user.dto';
import { ProfileService } from '../services/profile.service';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get()
  getProfile(@Request() req: any) {
    return this.profileService.getProfile(req.user);
  }

  @Put()
  updateProfile(@Request() req: any, @Body() profileData: UpdateUserDto) {
    return this.profileService.updateProfile(req.user, profileData);
  }

  @Delete()
  deleteProfile(@Request() req: any) {
    return this.profileService.deleteProfile(req.user);
  }
}
