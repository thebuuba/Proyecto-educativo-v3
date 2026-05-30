import { Controller, Get, UseGuards } from '@nestjs/common'
import { SubjectsService } from './subjects.service'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'

@Controller('subjects')
@UseGuards(JwtAuthGuard)
export class SubjectsController {
  constructor(private subjectsService: SubjectsService) {}

  @Get()
  findAll() {
    return this.subjectsService.findAll()
  }
}
