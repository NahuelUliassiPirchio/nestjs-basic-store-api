import { Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Login' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('/login')
  login(@Request() req: any) {
    return this.authService.login(req.user);
  }
}
