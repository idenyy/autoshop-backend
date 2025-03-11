import { Body, Controller, Delete, Get, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { CategoryService } from './category.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { CategoryDto } from './dto/category.dto'

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @Auth('MANAGER')
  async create(@Body() dto: CategoryDto) {
    return this.categoryService.create(dto)
  }

  @Get()
  @Auth('MANAGER')
  async getAll() {
    return this.categoryService.getAll()
  }

  @Get(':id')
  @Auth('MANAGER')
  async getById(@Param('id') id: string) {
    return this.categoryService.getById(id)
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  @Auth('MANAGER')
  async update(@Param('id') id: string, @Body() dto: CategoryDto) {
    return this.categoryService.update(id, dto)
  }

  @Delete(':id')
  @Auth('MANAGER')
  async remove(@Param('id') id: string) {
    return this.categoryService.remove(id)
  }
}
