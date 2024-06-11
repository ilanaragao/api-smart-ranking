import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { Category } from './interfaces/category.interface';
import { CategoriesService } from './categories.service';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return await this.categoriesService.createCategory(createCategoryDto);
  }

  @Get()
  async getAllCategories(): Promise<Category[]> {
    return await this.categoriesService.getAllCategories();
  }

  @Get('/:category')
  async getCategoryById(
    @Param('category') category: string,
  ): Promise<Category> {
    return await this.categoriesService.getCategoryById(category);
  }
}
