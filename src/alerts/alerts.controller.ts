import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Delete,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { User } from '../auth/decorators/user.decorator';
import { JwtPayload } from '../auth/types/jwt-payload.type';

@ApiTags('alerts')
@ApiBearerAuth()
@Controller('alerts')
@UseGuards(AuthGuard('jwt'))
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new flight alert' })
  @ApiResponse({
    status: 201,
    description: 'The alert has been successfully created.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(@Body() dto: CreateAlertDto, @User() user: JwtPayload) {
    return this.alertsService.create(user.email, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all alerts for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of all alerts.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAll(@User() user: JwtPayload) {
    return this.alertsService.findAllByEmail(user.email);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a flight alert' })
  @ApiResponse({ status: 200, description: 'Alert successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Alert not found.' })
  remove(@Param('id') id: string, @User() user: JwtPayload) {
    return this.alertsService.delete(id, user.email);
  }
}
