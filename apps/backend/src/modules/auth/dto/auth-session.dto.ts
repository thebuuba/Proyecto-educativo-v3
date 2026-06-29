import { IsString, MinLength } from 'class-validator'

export class AuthSessionDto {
  @IsString()
  @MinLength(10)
  supabaseAccessToken!: string
}
