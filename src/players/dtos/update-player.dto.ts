import { IsNotEmpty } from 'class-validator';

export class UpdatePlayerDto {
  @IsNotEmpty()
  readonly cellPhone: string;

  @IsNotEmpty()
  readonly name: string;
}
