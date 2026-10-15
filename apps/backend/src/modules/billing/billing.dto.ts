import { IsBoolean, IsDateString, IsIn, IsInt, IsOptional, IsString, IsUUID, Length, Matches, Max, MaxLength, Min, MinLength } from 'class-validator'

export class CreateTransferDto {
  @IsUUID() priceId!: string
}
export class ReportTransferDto {
  @IsString() @Length(3, 160) bankReference!: string
}
export class CheckoutDto extends CreateTransferDto {
  @IsBoolean() acceptEarlyEnd!: boolean
  @IsString() @Length(1, 80) termsVersion!: string
}
export class CreateCourtesyDto {
  @IsUUID() userId!: string
  @IsUUID() planId!: string
  @IsDateString() startsAt!: string
  @IsOptional() @IsDateString() endsAt?: string
  @IsString() @Length(10, 1000) reason!: string
  @IsBoolean() acknowledgeActiveRenewal!: boolean
}
export class ReasonDto {
  @IsString() @Length(10, 1000) reason!: string
}
export class ApproveTransferDto extends ReasonDto {
  @IsString() @Length(3, 160) bankMovementId!: string
  @IsInt() @Min(1) @Max(Number.MAX_SAFE_INTEGER) amountMinor!: number
  @IsString() @Length(3, 3) currency!: string
  @IsDateString() receivedAt!: string
}
export class SupportDto {
  @IsIn(['payment', 'access', 'other']) category!: string
  @IsString() @Length(5, 160) subject!: string
  @IsString() @MinLength(10) @MaxLength(4000) message!: string
  @IsOptional() @IsUUID() paymentId?: string
}
export class UpdateSupportDto extends ReasonDto {
  @IsIn(['open', 'in_progress', 'resolved']) status!: string
}
export class BillingAdminQueryDto {
  @IsOptional() @IsString() @MaxLength(80) q?: string
  @IsOptional() @Matches(/^\d{1,5}$/) page?: string
  @IsOptional() @Matches(/^\d{1,3}$/) pageSize?: string
}
