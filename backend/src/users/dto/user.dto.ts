import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CrearUserDto {
    @IsString()
    username: string;

    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La contraseña debe contener mayúsculas, minúsculas y números/símbolos',
    })
    password: string;

    @IsString()
    @MinLength(2)
    nombres: string;

}