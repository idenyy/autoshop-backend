import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { ReviewDto } from './dto/review.dto'
import { Role } from '@prisma/client'

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async getById(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        user: true
      }
    })

    return review
  }

  getAll() {
    return this.prisma.review.findMany()
  }

  async create(userId: string, productId: string, dto: ReviewDto) {
    return this.prisma.review.create({
      data: {
        ...dto,
        user: {
          connect: {
            id: userId
          }
        },
        product: {
          connect: {
            id: productId
          }
        }
      }
    })
  }

  async remove(id: string, userId: string, role?: Role) {
    const review = await this.getById(id)

    if (!review) throw new NotFoundException('Review not found')

    if (review.userId !== userId && role !== Role.MANAGER)
      throw new ConflictException('You are not allowed to delete this review')

    return this.prisma.review.delete({ where: { id } })
  }
}
