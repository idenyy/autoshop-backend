import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { ProductService } from './product.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { ProductDto, UpdateProductDto } from './dto/product.dto'

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return this.productService.getAll(searchTerm)
  }

  @Auth('MANAGER')
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.productService.getById(id)
  }

  @Get('category/:categoryId')
  async getByCategory(@Param('categoryId') categoryId: string) {
    return this.productService.getByCategory(categoryId)
  }

  @Get('supplier/:supplierId')
  async getBySupplier(@Param('supplierId') supplierId: string) {
    return this.productService.getBySupplier(supplierId)
  }

  @Get('popular')
  async getMostPopular() {
    return this.productService.getMostPopular()
  }

  @Get('similar/:id')
  async getSimilar(@Param('id') id: string) {
    return this.productService.getSimilar(id)
  }

  @Get(':id/rating')
  async getAverageRating(@Param('id') id: string) {
    return this.productService.getAverageRating(id)
  }

  @HttpCode(201)
  @UsePipes(new ValidationPipe())
  @Auth('MANAGER')
  @Post()
  async create(@Body() dto: ProductDto) {
    return this.productService.create(dto)
  }

  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Auth('MANAGER')
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto)
  }

  @HttpCode(200)
  @Auth('MANAGER')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productService.remove(id)
  }
}
