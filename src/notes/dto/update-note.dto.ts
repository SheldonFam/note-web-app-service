import {
  IsString,
  MaxLength,
  IsOptional,
  IsArray,
  ArrayMaxSize,
} from 'class-validator';

export class UpdateNoteDto {
  @IsString()
  @MaxLength(255)
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(20)
  @IsOptional()
  tags?: string[];
}
