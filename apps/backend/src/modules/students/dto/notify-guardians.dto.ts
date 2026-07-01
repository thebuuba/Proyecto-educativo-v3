import { IsOptional, IsString, MaxLength } from 'class-validator'

export class NotifyGuardiansDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  subject?: string

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  message?: string
}
