import { Body, Controller, Delete, Get, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { SupplierService } from './supplier.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { SupplierDto } from './dto/supplier.dto'

@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @Auth('MANAGER')
  async create(@Body() dto: SupplierDto) {
    return this.supplierService.create(dto)
  }

  @Get()
  @Auth('MANAGER')
  async getAll() {
    return this.supplierService.getAll()
  }

  @Get(':id')
  @Auth('MANAGER')
  async getById(@Param('id') id: string) {
    return this.supplierService.getById(id)
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  @Auth('MANAGER')
  async update(@Param('id') id: string, @Body() dto: SupplierDto) {
    return this.supplierService.update(id, dto)
  }

  @Delete(':id')
  @Auth('MANAGER')
  async remove(@Param('id') id: string) {
    return this.supplierService.remove(id)
  }
}
