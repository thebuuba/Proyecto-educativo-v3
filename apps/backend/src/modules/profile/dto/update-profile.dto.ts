import { Transform } from 'class-transformer'
import { IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, ValidateIf } from 'class-validator'

export class UpdateProfileDto {
  @ValidateIf((_object, value) => value !== undefined)
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  fullName?: string

  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string | null

  @IsOptional()
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  @MaxLength(2048)
  avatarUrl?: string | null
}
