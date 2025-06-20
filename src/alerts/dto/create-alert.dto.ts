import { IsString, IsInt, IsDateString } from 'class-validator';

export class CreateAlertDto {
  @IsString()
  origin: string;

  @IsString()
  destination: string;

  @IsInt()
  maxPrice: number;

  @IsDateString()
  departureDate: string;
}
