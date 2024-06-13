import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { Category } from './interfaces/category.interface';
import { CategoriesService } from './categories.service';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getCategories(
    @Query() params: string[],
  ): Promise<Category[] | Category> {
    const categoryId = params['categoryId'];
    const playerId = params['playerId'];

    if (categoryId) {
      return await this.categoriesService.getCategoryById(categoryId);
    }

    if (playerId) {
      return await this.categoriesService.getPlayerCategory(playerId);
    }

    return await this.categoriesService.getAllCategories();
  }

  @Post()
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return await this.categoriesService.createCategory(createCategoryDto);
  }

  @Post('/:category/players/:playerId')
  async assignCategoryToPlayer(@Param() params: string[]): Promise<void> {
    return await this.categoriesService.assignCategoryToPlayer(params);
  }

  @Put('/:category')
  async updateCategory(
    @Param('category') category: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<void> {
    await this.categoriesService.updateCategory(category, updateCategoryDto);
  }

  @Delete('/:category')
  async deleteCategory(@Param('category') category: string): Promise<void> {
    await this.categoriesService.deleteCategory(category);
  }
}
