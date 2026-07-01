import { IsDateString, IsIn, IsOptional, IsString, MaxLength } from 'class-validator'

export class CreateTaskDto {
  @IsString()
  @MaxLength(200)
  title!: string

  @IsOptional()
  @IsString()
  @IsIn(['pending', 'completed', 'archived'])
  status?: string

  @IsOptional()
  @IsString()
  @IsIn(['low', 'normal', 'high'])
  priority?: string

  @IsOptional()
  @IsDateString()
  dueDate?: string

  @IsOptional()
  @IsString()
  assignedTo?: string
}
