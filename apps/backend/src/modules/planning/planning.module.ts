import { Module } from '@nestjs/common'
import { PlanningController } from './planning.controller'
import { PlanningService } from './planning.service'

@Module({
  controllers: [PlanningController],
  providers: [PlanningService],
})
export class PlanningModule {}
