import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Logger,
  Query,
  Put,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { Challenge } from './interfaces/challenge.interface';
import { ChallengeStatusValidationPipe } from './pipes/challenge-status-validation.pipe';
import { AssignChallengeMatchDto } from './dtos/assing-challenge-match.dto';

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  private readonly logger = new Logger(ChallengesController.name);

  @Post()
  async createChallenge(
    @Body() createChallengeDto: CreateChallengeDto,
  ): Promise<Challenge> {
    this.logger.log(
      `createChallengeDto: ${JSON.stringify(createChallengeDto)}`,
    );
    return await this.challengesService.createChallenge(createChallengeDto);
  }

  @Get()
  async getChallenges(@Query('playerId') _id: string): Promise<Challenge[]> {
    return _id
      ? await this.challengesService.getChallengesPlayer(_id)
      : await this.challengesService.getAllChallenges();
  }

  @Put('/:challenge')
  async updateChallenge(
    @Param('challenge') _id: string,
    @Body(ChallengeStatusValidationPipe) updateChallengeDto: UpdateChallengeDto,
  ): Promise<void> {
    await this.challengesService.updateChallenge(_id, updateChallengeDto);
  }

  @Post('/:challenge/match')
  async setMatchChallenge(
    @Body() assignChallengeMatchDto: AssignChallengeMatchDto,
    @Param('challenge') _id: string,
  ): Promise<void> {
    return await this.challengesService.setMatchChallenge(
      _id,
      assignChallengeMatchDto,
    );
  }

  @Delete('/:_id')
  async removeChallenge(@Param('_id') _id: string): Promise<void> {
    await this.challengesService.removeChallenge(_id);
  }
}
