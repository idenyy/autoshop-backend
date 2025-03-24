import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { CategoryDto } from './dto/category.dto'

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getById(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id }
    })

    if (!category) throw new NotFoundException('Category not found')

    return category
  }

  getAll() {
    return this.prisma.category.findMany()
  }

  async create(dto: CategoryDto) {
    const existingCategory = await this.prisma.category.findUnique({
      where: { title: dto.title }
    })

    if (existingCategory) throw new ConflictException('Category already exists')

    return this.prisma.category.create({
      data: dto
    })
  }

  async update(id: string, dto: CategoryDto) {
    const category = await this.prisma.category.findUnique({ where: { id } })
    if (!category) throw new NotFoundException('Category not found')

    const existingCategory = await this.prisma.category.findUnique({
      where: { title: dto.title }
    })
    if (existingCategory) throw new ConflictException('Category already exists')

    return this.prisma.category.update({
      where: { id },
      data: {
        ...dto
      }
    })
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } })
    if (!category) throw new NotFoundException('Category not found')

    return this.prisma.category.delete({ where: { id } })
  }
}
