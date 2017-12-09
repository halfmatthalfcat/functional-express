/**
 * Dummy class for validation testing
 */

import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from "class-validator";

export class DummyClassMock {

  @IsNotEmpty()
  @IsNumber()
  public a: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(5)
  public b: string;

}
