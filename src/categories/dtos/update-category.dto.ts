import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateCategoryDto {
  @IsNotEmpty()
  @IsOptional()
  readonly category: string;

  @IsArray()
  @ArrayMinSize(1)
  readonly events: Array<Event>;
}
