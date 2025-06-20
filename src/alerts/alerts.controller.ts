import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Delete,
  Param,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { Request } from 'express';

@Controller('alerts')
@UseGuards(AuthGuard('jwt'))
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  create(@Body() dto: CreateAlertDto, @Req() req: Request) {
    const user = req.user as { email: string };
    return this.alertsService.create(user.email, dto);
  }

  @Get()
  findAll(@Req() req: Request) {
    const user = req.user as { email: string };
    return this.alertsService.findAllByEmail(user.email);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as { email: string };
    return this.alertsService.delete(id, user.email);
  }
}
