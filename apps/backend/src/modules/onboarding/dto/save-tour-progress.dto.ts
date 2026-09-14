import { IsIn, IsInt, Min } from 'class-validator'

export class SaveTourProgressDto {
  @IsInt()
  @Min(1)
  version!: number

  @IsIn(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED'])
  status!: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED'

  @IsInt()
  @Min(0)
  lastStep!: number
}
