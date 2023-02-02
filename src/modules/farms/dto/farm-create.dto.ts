import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class FarmCreateDto {
  @IsString()
  @IsNotEmpty()
  public address: string;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsNumber()
  public yieldValue?: number

  @IsNumber()
  public size?: number
}
