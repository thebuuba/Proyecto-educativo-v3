import { Module } from '@nestjs/common'
import { GradesController } from './grades.controller'
import { GradesService } from './grades.service'

@Module({
  controllers: [GradesController],
  providers: [GradesService],
})
export class AcademicGradesModule {}
