import { Injectable, Logger } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);
  private players: Player[] = [];

  async createOrUpdatePlayer(createPlayerDto: CreatePlayerDto): Promise<void> {
    this.createPlayer(createPlayerDto);
  }

  private createPlayer(createPlayerDto: CreatePlayerDto): void {
    const { name, email, cellPhone } = createPlayerDto;

    const player: Player = {
      _id: uuid(),
      name,
      cellPhone,
      email,
      ranking: 'A',
      rankingPosition: 1,
      urlPhotoPlayer: 'www.google.com.br/foto123.jpg',
    };

    this.logger.log(`createOrUpdatePlayer: ${JSON.stringify(player)}`);
    this.players.push(player);
  }
}
