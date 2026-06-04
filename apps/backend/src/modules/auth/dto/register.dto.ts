import { IsEmail, IsString, MinLength } from 'class-validator'

export class RegisterDto {
  @IsString()
  schoolName!: string

  @IsString()
  slug!: string

  @IsEmail()
  email!: string

  @IsString()
  @MinLength(6)
  password!: string

  @IsString()
  fullName!: string
}
