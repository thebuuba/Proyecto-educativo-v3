import { Module } from '@nestjs/common'
import { GradesSectionsController } from './grades-sections.controller'
import { GradesSectionsService } from './grades-sections.service'

@Module({
  controllers: [GradesSectionsController],
  providers: [GradesSectionsService],
})
export class GradesSectionsModule {}
