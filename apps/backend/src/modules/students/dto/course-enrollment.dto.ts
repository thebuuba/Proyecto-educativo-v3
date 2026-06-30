import { Type } from 'class-transformer'
import {
  IsArray,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator'

export class CreateCourseStudentDto {
  @IsString()
  @MinLength(1)
  studentCode!: string

  @IsString()
  @MinLength(1)
  fullName!: string

  @IsOptional()
  @IsString()
  documentId?: string

  @IsOptional()
  @IsString()
  birthDate?: string

  @IsOptional()
  @IsString()
  gender?: string

  @IsOptional()
  @IsString()
  address?: string

  @IsOptional()
  @IsString()
  guardianPhone?: string

  @IsOptional()
  @IsString()
  guardianEmail?: string

  @IsOptional()
  @IsString()
  observations?: string

  @IsOptional()
  @IsString()
  status?: string
}

export class ImportCourseStudentRowDto {
  @IsOptional()
  @IsString()
  studentCode?: string

  @IsString()
  @MinLength(1)
  fullName!: string
}

export class ImportCourseStudentsPreviewDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportCourseStudentRowDto)
  students!: ImportCourseStudentRowDto[]
}

export class ImportCourseStudentsDto extends ImportCourseStudentsPreviewDto {}

export class TransferCourseStudentDto {
  @IsString()
  @MinLength(1)
  targetCourseId!: string
}
