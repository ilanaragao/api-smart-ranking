import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './interfaces/category.interface';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { PlayersService } from 'src/players/players.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    private readonly playersService: PlayersService,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const { category } = createCategoryDto;
    const categoryFound = await this.categoryModel.findOne({ category }).exec();

    if (categoryFound) {
      throw new BadRequestException(
        `Category with name ${category} already exists`,
      );
    }

    const createdCategory = new this.categoryModel(createCategoryDto);
    return await createdCategory.save();
  }

  async assignCategoryToPlayer(params: string[]): Promise<void> {
    const category = params['category'];
    const playerId = params['playerId'];

    const categoryFound = await this.categoryModel.findOne({ category }).exec();
    const playerAlreadyAssigned = await this.categoryModel
      .find({ category })
      .where('players')
      .in(playerId)
      .exec();

    await this.playersService.getPlayerById(playerId);

    if (!categoryFound) {
      throw new BadRequestException(`Category with name ${category} not found`);
    }

    if (playerAlreadyAssigned.length > 0) {
      throw new BadRequestException(
        `Player with id ${playerId} already assigned to category ${category}`,
      );
    }

    categoryFound.players.push(playerId);
    await this.categoryModel
      .findOneAndUpdate({ category }, { $set: categoryFound })
      .exec();
  }

  async getAllCategories(): Promise<Category[]> {
    return await this.categoryModel.find().populate('players').exec();
  }

  async getCategoryById(category: string): Promise<Category> {
    const categoryFound = await this.categoryModel.findOne({ category }).exec();

    if (!categoryFound) {
      throw new BadRequestException(`Category with name ${category} not found`);
    }

    return categoryFound;
  }

  async getPlayerCategory(playerId: any): Promise<Category> {
    const players = await this.playersService.getAllPlayers();

    const playerFilter = players.filter((player) => player._id == playerId);

    if (playerFilter.length == 0) {
      throw new BadRequestException(`Player with id ${playerId} not found`);
    }

    return await this.categoryModel
      .findOne()
      .where('players')
      .in(playerId)
      .exec();
  }

  async updateCategory(
    category: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<void> {
    const categoryFound = await this.categoryModel.findOne({ category }).exec();

    if (!categoryFound) {
      throw new BadRequestException(`Category with name ${category} not found`);
    }

    await this.categoryModel
      .findOneAndUpdate({ category }, { $set: updateCategoryDto })
      .exec();
  }

  async deleteCategory(category: string): Promise<void> {
    const categoryFound = await this.categoryModel.findOne({ category }).exec();

    if (!categoryFound) {
      throw new BadRequestException(`Category with name ${category} not found`);
    }

    await this.categoryModel.deleteOne({ category }).exec();
  }
}
