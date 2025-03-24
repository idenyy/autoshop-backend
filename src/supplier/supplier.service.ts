import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { SupplierDto } from './dto/supplier.dto'

@Injectable()
export class SupplierService {
  constructor(private prisma: PrismaService) {}

  async getById(id: string) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
      include: {
        products: true
      }
    })

    return supplier
  }

  getAll() {
    return this.prisma.supplier.findMany()
  }

  async create(dto: SupplierDto) {
    const supplier = await this.prisma.supplier.create({
      data: {
        ...dto
      }
    })

    return supplier
  }

  async update(id: string, dto: SupplierDto) {
    const supplier = await this.prisma.supplier.findUnique({ where: { id } })
    if (!supplier) throw new NotFoundException('Supplier not found')

    return this.prisma.supplier.update({
      where: { id },
      data: {
        ...dto
      }
    })
  }

  async remove(id: string) {
    const supplier = await this.prisma.supplier.findUnique({ where: { id } })
    if (!supplier) throw new NotFoundException('Supplier not found')

    return this.prisma.supplier.delete({ where: { id } })
  }
}
