import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);
  private players: Player[] = [];

  async getAllPlayers(): Promise<Player[]> {
    return this.players;
  }

  async getPlayerByEmail(email: string): Promise<Player> {
    const playerFound = this.players.find((player) => player.email === email);

    if (!playerFound) {
      throw new NotFoundException(`Player with e-mail ${email} not found`);
    }

    return playerFound;
  }

  async createOrUpdatePlayer(createPlayerDto: CreatePlayerDto): Promise<void> {
    const { email } = createPlayerDto;
    const playerFound = this.players.find((player) => player.email === email);

    if (playerFound) {
      this.updatePlayer(playerFound, createPlayerDto);
    } else {
      this.createPlayer(createPlayerDto);
    }
  }

  async deletePlayer(email: string): Promise<void> {
    const playerFound = this.players.find((player) => player.email === email);

    if (!playerFound) {
      throw new NotFoundException(`Player with e-mail ${email} not found`);
    }

    this.players = this.players.filter(
      (player) => player.email !== playerFound.email,
    );
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

  private updatePlayer(
    playerFound: Player,
    createPlayerDto: CreatePlayerDto,
  ): void {
    const { name } = createPlayerDto;
    playerFound.name = name;
  }
}
