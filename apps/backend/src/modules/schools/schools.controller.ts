import { Body, Controller, Get, Headers, Post, Query, UnauthorizedException } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { getSupabaseUserFromToken } from '../auth/supabase-user'
import { CreateSchoolDto } from './dto/create-school.dto'
import { SchoolsService } from './schools.service'
import { SearchSchoolsQueryDto } from './dto/search-schools-query.dto'

@Controller('schools')
export class SchoolsController {
  constructor(private schoolsService: SchoolsService) {}

  @Get()
  search(@Query() query: SearchSchoolsQueryDto) {
    return this.schoolsService.search(query.q, query.limit, query.lat, query.lng)
  }

  @Post()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async create(@Headers('authorization') authorization: string | undefined, @Body() dto: CreateSchoolDto) {
    const token = authorization?.match(/^Bearer\s+(\S+)$/i)?.[1]
    if (!token) throw new UnauthorizedException('Inicia sesión para agregar un centro.')
    await getSupabaseUserFromToken(token)
    return this.schoolsService.create(dto)
  }
}
