import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryNotesDto {
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  archived?: boolean;

  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  sort?: string = 'updatedAt:desc';
}
