import { Controller, Post } from '@nestjs/common';

@Controller('api/v1/players')
export class PlayersController {
  @Post()
  async createOrUpdatePlayer() {
    return 'This action adds or updates a player';
  }
}
