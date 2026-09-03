import { Type } from 'class-transformer'
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator'

export class CreateCourseStudentDto {
  @IsOptional()
  @IsString()
  studentCode?: string

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

export class UpdateCourseStudentListNumberDto {
  @IsInt()
  @Min(1)
  listNumber!: number
}

export class ReorderCourseStudentsDto {
  @IsArray()
  @IsString({ each: true })
  studentIds!: string[]
}
