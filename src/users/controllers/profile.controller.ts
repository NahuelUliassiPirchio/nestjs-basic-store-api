import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from '../dtos/user.dto';
import { ProfileService } from '../services/profile.service';

@ApiTags('profile')
@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Get profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Request() req: any) {
    return this.profileService.getProfile(req.user);
  }

  @Put()
  @ApiResponse({ status: 200, description: 'Update profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateProfile(@Request() req: any, @Body() profileData: UpdateUserDto) {
    return this.profileService.updateProfile(req.user, profileData);
  }

  @Delete()
  @ApiResponse({ status: 200, description: 'Delete profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  deleteProfile(@Request() req: any) {
    return this.profileService.deleteProfile(req.user);
  }
}
