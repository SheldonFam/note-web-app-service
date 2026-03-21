import {
  IsString,
  MaxLength,
  IsOptional,
  IsArray,
  ArrayMaxSize,
} from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(20)
  @IsOptional()
  tags?: string[];
}
