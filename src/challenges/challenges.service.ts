import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { PlayersService } from 'src/players/players.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Challenge, Match } from './interfaces/challenge.interface';
import { ChallengeStatus } from './interfaces/challenge-status.enum';
import { AssignChallengeMatchDto } from './dtos/assing-challenge-match.dto';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    @InjectModel('Match') private readonly matchModel: Model<Match>,
    private readonly playersService: PlayersService,
    private readonly categoriasService: CategoriesService,
  ) {}

  private readonly logger = new Logger(ChallengesService.name);

  async createChallenge(
    createChallengeDto: CreateChallengeDto,
  ): Promise<Challenge> {
    const players = await this.playersService.getAllPlayers();

    createChallengeDto.players.map((playerDto) => {
      const playerFilter = players.filter(
        (player) => player._id == playerDto._id,
      );

      if (playerFilter.length == 0) {
        throw new BadRequestException(
          `The id ${playerDto._id} is not a player!`,
        );
      }
    });

    const requesterIsAPlayer = await createChallengeDto.players.filter(
      (player) => player._id == createChallengeDto.requester,
    );

    if (requesterIsAPlayer.length == 0) {
      throw new BadRequestException(
        `The requester must be a player to create a challenge!`,
      );
    }

    const playerCategory = await this.categoriasService.getPlayerCategory(
      createChallengeDto.requester,
    );

    if (!playerCategory) {
      throw new BadRequestException(
        `The requester must be registered in a category to create a challenge!`,
      );
    }

    const challengeCreated = new this.challengeModel(createChallengeDto);
    challengeCreated.dateTimeRequest = new Date();
    challengeCreated.status = ChallengeStatus.PENDING;
    challengeCreated.category = playerCategory.category;

    this.logger.log(`challengeCreated: ${JSON.stringify(challengeCreated)}`);
    return await challengeCreated.save();
  }

  async getAllChallenges(): Promise<Challenge[]> {
    return await this.challengeModel
      .find()
      .populate('requester')
      .populate('players')
      .populate('match')
      .exec();
  }

  async getChallengesPlayer(_id: any): Promise<Challenge[]> {
    const players = await this.playersService.getAllPlayers();
    const playerFilter = players.filter((player) => player._id == _id);

    if (playerFilter.length == 0) {
      throw new BadRequestException(`The id ${_id} is not a player!`);
    }

    return await this.challengeModel
      .find()
      .where('players')
      .in(_id)
      .populate('requester')
      .populate('players')
      .populate('match')
      .exec();
  }

  async updateChallenge(
    _id: string,
    updateChallengeDto: UpdateChallengeDto,
  ): Promise<void> {
    const challengeFound = await this.challengeModel.findById({ _id }).exec();

    if (!challengeFound) {
      throw new BadRequestException(`Challenge with id ${_id} not found!`);
    }

    if (updateChallengeDto.status) {
      challengeFound.dateTimeResponse = new Date();
    }

    challengeFound.status = updateChallengeDto.status;
    challengeFound.dateTimeChallenge = updateChallengeDto.dateTimeChallenge;

    await this.challengeModel
      .findOneAndUpdate({ _id }, { $set: challengeFound })
      .exec();
  }

  async setMatchChallenge(
    _id: string,
    assignChallengeMatchDto: AssignChallengeMatchDto,
  ): Promise<void> {
    const challengeFound = await this.challengeModel.findById({ _id }).exec();

    if (!challengeFound) {
      throw new BadRequestException(`Challenge with id ${_id} not found!`);
    }

    const playerFilter = challengeFound.players.filter(
      (player) => player._id == assignChallengeMatchDto.def._id,
    );

    this.logger.log(`playerFilter: ${JSON.stringify(playerFilter)}`);
    this.logger.log(`challengeFound: ${JSON.stringify(challengeFound)}`);

    if (playerFilter.length == 0) {
      throw new BadRequestException(
        `The player ${assignChallengeMatchDto.def} is not part of the challenge!`,
      );
    }

    const match = new this.matchModel(assignChallengeMatchDto);
    match.category = challengeFound.category;
    match.players = challengeFound.players;

    const result = await match.save();

    challengeFound.status = ChallengeStatus.REALIZED;
    challengeFound.match = result;

    try {
      await this.challengeModel
        .findOneAndUpdate({ _id }, { $set: challengeFound })
        .exec();
    } catch (error) {
      await this.matchModel.deleteOne({ _id: result._id }).exec();
      throw new InternalServerErrorException();
    }
  }

  async removeChallenge(_id: string): Promise<void> {
    const challengeFound = await this.challengeModel.findById({ _id }).exec();

    if (!challengeFound) {
      throw new BadRequestException(`Challenge with id ${_id} not found!`);
    }

    challengeFound.status = ChallengeStatus.CANCELED;

    await this.challengeModel
      .findOneAndUpdate({ _id }, { $set: challengeFound })
      .exec();
  }
}
