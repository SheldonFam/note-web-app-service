import { IsOptional, IsIn } from 'class-validator';

export class UpdatePreferencesDto {
  @IsOptional()
  @IsIn(['light', 'dark', 'system'])
  colorTheme?: string;

  @IsOptional()
  @IsIn(['sans', 'serif', 'mono'])
  fontTheme?: string;
}
