import { Controller, Get, Query } from '@nestjs/common'
import { SchoolsService } from './schools.service'
import { SearchSchoolsQueryDto } from './dto/search-schools-query.dto'

@Controller('schools')
export class SchoolsController {
  constructor(private schoolsService: SchoolsService) {}

  @Get()
  search(@Query() query: SearchSchoolsQueryDto) {
    return this.schoolsService.search(query.q, query.limit, query.lat, query.lng)
  }
}
