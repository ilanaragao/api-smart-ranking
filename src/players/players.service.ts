import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  async getAllPlayers(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async getPlayerByEmail(email: string): Promise<Player> {
    const playerFound = this.playerModel.findOne({ email }).exec();

    if (!playerFound) {
      throw new NotFoundException(`Player with e-mail ${email} not found`);
    }

    return playerFound;
  }

  async createOrUpdatePlayer(createPlayerDto: CreatePlayerDto): Promise<void> {
    const { email } = createPlayerDto;
    const playerFound = await this.playerModel.findOne({ email }).exec();

    if (playerFound) {
      this.updatePlayer(createPlayerDto);
    } else {
      this.createPlayer(createPlayerDto);
    }
  }

  async deletePlayer(email: string): Promise<any> {
    return await this.playerModel.deleteOne({ email }).exec();
  }

  private async createPlayer(
    createPlayerDto: CreatePlayerDto,
  ): Promise<Player> {
    const playerCreated = new this.playerModel(createPlayerDto);
    return await playerCreated.save();
  }

  private async updatePlayer(
    createPlayerDto: CreatePlayerDto,
  ): Promise<Player> {
    return await this.playerModel
      .findOneAndUpdate(
        { email: createPlayerDto.email },
        { $set: createPlayerDto },
      )
      .exec();
  }
}
