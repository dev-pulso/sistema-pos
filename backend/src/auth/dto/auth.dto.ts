import { IsString, Matches, MaxLength, MinLength } from "class-validator";
import { Rols } from "src/users/entities/users.entity";

export class RegisterDto { 

  @IsString()
  @MinLength(8, { message: ' La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'La contraseña debe contener mayúsculas, minúsculas y números/símbolos',
  })
  password: string;

  @IsString()
  @MinLength(2, { message: ' El nombre debe tener al menos 2 caracteres' })
  nombres: string;

  @IsString()
  @MinLength(2, { message: ' El nombre de usuario debe tener al menos 2 caracteres' })
  username: string;

  @IsString()
  rol: Rols;
}

export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}