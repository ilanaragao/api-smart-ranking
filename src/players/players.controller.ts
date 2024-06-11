import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { PlayersService } from './players.service';
import { Player } from './interfaces/player.interface';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import { ValidationParametersPipe } from 'src/common/pipes/validation-parameters.pipe';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  async getAllPlayers(): Promise<Player[]> {
    return await this.playersService.getAllPlayers();
  }

  @Get('/:_id')
  async getPlayerById(
    @Param('_id', ValidationParametersPipe) _id: string,
  ): Promise<Player> {
    return await this.playersService.getPlayerById(_id);
  }

  @Post()
  async createPlayer(
    @Body() createPlayerDto: CreatePlayerDto,
  ): Promise<Player> {
    return await this.playersService.createPlayer(createPlayerDto);
  }

  @Put('/:_id')
  async updatePlayer(
    @Body() updatePlayerDto: UpdatePlayerDto,
    @Param('_id', ValidationParametersPipe) _id: string,
  ): Promise<void> {
    await this.playersService.updatePlayer(_id, updatePlayerDto);
  }

  @Delete('/:_id')
  async deletePlayer(
    @Param('_id', ValidationParametersPipe) _id: string,
  ): Promise<void> {
    await this.playersService.deletePlayer(_id);
  }
}
