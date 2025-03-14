import { Body, Controller, Delete, Get, HttpCode, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { ReviewService } from './review.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { ReviewDto } from './dto/review.dto'
import { CurrentUser } from '../user/decorators/user.decorator'
import { Role } from '@prisma/client'

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @HttpCode(201)
  @UsePipes(new ValidationPipe())
  @Auth()
  @Post(':productId')
  async create(@CurrentUser('id') userId: string, @Param('productId') productId: string, @Body() dto: ReviewDto) {
    return this.reviewService.create(userId, productId, dto)
  }

  @Get()
  async getAll() {
    return this.reviewService.getAll()
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.reviewService.getById(id)
  }

  @HttpCode(200)
  @Auth()
  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser('id') userId: string, @CurrentUser('role') role: Role) {
    return this.reviewService.remove(id, userId, role)
  }
}
