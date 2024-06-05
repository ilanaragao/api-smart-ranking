import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { PlayersService } from './players.service';
import { Player } from './interfaces/player.interface';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  async getAllPlayers(
    @Query('email') email: string,
  ): Promise<Player[] | Player> {
    if (email) {
      return await this.playersService.getPlayerByEmail(email);
    } else {
      return await this.playersService.getAllPlayers();
    }
  }

  @Post()
  async createOrUpdatePlayer(@Body() createPlayerDto: CreatePlayerDto) {
    await this.playersService.createOrUpdatePlayer(createPlayerDto);
  }

  @Delete()
  async deletePlayer(@Query('email') email: string): Promise<void> {
    await this.playersService.deletePlayer(email);
  }
}
