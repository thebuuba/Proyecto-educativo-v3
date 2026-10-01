import { Module } from '@nestjs/common'
import { GradingModule } from '../grading/grading.module'
import { ActivitiesController } from './activities.controller'
import { ActivitiesService } from './activities.service'

@Module({
  imports: [GradingModule],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
