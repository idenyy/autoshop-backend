import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { ProductDto, UpdateProductDto } from './dto/product.dto'

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getAll(searchTerm?: string) {
    if (searchTerm) return this.getSearchTermFilter(searchTerm)

    return this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        category: true
      }
    })
  }

  async getById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        users: true,
        reviews: true
      }
    })

    if (!product) throw new NotFoundException('Product not found')

    return product
  }

  async getByCategory(categoryId: string) {
    const products = await this.prisma.product.findMany({
      where: { categoryId },
      include: {
        category: true
      }
    })

    return products
  }

  async getBySupplier(supplierId: string) {
    const products = await this.prisma.product.findMany({
      where: { supplierId },
      include: {
        category: true
      }
    })

    return products
  }

  async getMostPopular() {
    const mostPopular = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      }
    })

    const productsIds = mostPopular.map((item) => item.productId)

    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: productsIds
        }
      },
      include: {
        category: true
      }
    })

    return products
  }

  async getSimilar(id: string) {
    const currentProduct = await this.getById(id)
    if (!currentProduct) throw new NotFoundException('Current product not found')

    const products = await this.prisma.product.findMany({
      where: {
        category: {
          title: currentProduct.category.title
        },
        NOT: {
          id: currentProduct.id
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        category: true
      }
    })

    return products
  }

  async getAverageRating(productId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { productId },
      select: { rating: true }
    })

    if (reviews.length === 0) return 0

    const total = reviews.reduce((acc, review) => acc + review.rating, 0)
    return total / reviews.length
  }

  async create(dto: ProductDto) {
    return this.prisma.product.create({
      data: dto
    })
  }

  async update(id: string, dto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: dto
    })
  }

  async remove(id: string) {
    return this.prisma.product.delete({ where: { id } })
  }

  private async getSearchTermFilter(searchTerm: string) {
    return this.prisma.product.findMany({
      where: {
        OR: [
          {
            title: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          },
          {
            description: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          }
        ]
      }
    })
  }
}
