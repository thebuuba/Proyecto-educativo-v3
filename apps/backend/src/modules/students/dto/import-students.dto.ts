import { Type } from 'class-transformer'
import {
  IsArray,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'

export class ImportStudentRowDto {
  @IsOptional()
  @IsString()
  studentCode?: string

  @IsOptional()
  @IsString()
  firstName?: string

  @IsOptional()
  @IsString()
  lastName?: string

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
}

export class ImportStudentsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportStudentRowDto)
  students!: ImportStudentRowDto[]
}
