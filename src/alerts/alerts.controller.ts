import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from '../auth/types/jwt-payload.type';
import { User } from 'src/auth/decorators/user.decorator';

@Controller('alerts')
export class AlertsController {
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMyAlerts(@User() user: JwtPayload) {
    return `Here are the alerts for ${user.email}`;
  }
}
