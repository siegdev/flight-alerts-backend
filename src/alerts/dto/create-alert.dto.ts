import { IsString, IsInt, IsDateString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAlertDto {
  @ApiProperty({
    description: 'Origin airport IATA code',
    example: 'GRU',
    minLength: 3,
    maxLength: 3,
    pattern: '^[A-Z]{3}$',
  })
  @IsString()
  @Matches(/^[A-Z]{3}$/)
  origin: string;

  @ApiProperty({
    description: 'Destination airport IATA code',
    example: 'JFK',
    minLength: 3,
    maxLength: 3,
    pattern: '^[A-Z]{3}$',
  })
  @IsString()
  @Matches(/^[A-Z]{3}$/)
  destination: string;

  @ApiProperty({
    description: 'Maximum price in cents',
    example: 500000,
    minimum: 1,
  })
  @IsInt()
  maxPrice: number;

  @ApiProperty({
    description: 'Departure date in ISO format',
    example: '2025-12-25',
    type: String,
    format: 'date',
  })
  @IsDateString()
  departureDate: string;
}
