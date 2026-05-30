import { IsString, IsOptional, IsDateString, MinLength } from 'class-validator'

export class CreateStudentDto {
  @IsString()
  @MinLength(1)
  studentCode!: string

  @IsString()
  @MinLength(1)
  firstName!: string

  @IsString()
  @MinLength(1)
  lastName!: string

  @IsOptional()
  @IsString()
  documentId?: string

  @IsDateString()
  birthDate!: string

  @IsOptional()
  @IsString()
  gender?: string

  @IsOptional()
  @IsString()
  address?: string
}
