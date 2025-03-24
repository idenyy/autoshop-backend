import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator'

export class ReviewDto {
  @IsString()
  @IsNotEmpty()
  text: string

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rating: number
}
