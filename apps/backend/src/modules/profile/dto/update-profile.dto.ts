import { Transform } from 'class-transformer'
import { IsNotEmpty, IsOptional, IsString, isURL, MaxLength, ValidateBy, ValidateIf } from 'class-validator'
import { MANAGED_AVATAR } from '../profile-avatar'

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
  @ValidateBy({ name: 'avatarUrl', validator: { validate: value => typeof value === 'string'
    && (MANAGED_AVATAR.test(value) || isURL(value, { protocols: ['http', 'https'], require_protocol: true })) } })
  @MaxLength(2048)
  avatarUrl?: string | null
}
