import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { Player } from '../interfaces/challenge.interface';

export class CreateChallengeDto {
  @IsNotEmpty()
  @IsDateString()
  dateTimeChallenge: Date;

  @IsNotEmpty()
  requester: Player;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  players: Array<Player>;
}
