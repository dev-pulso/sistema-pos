import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

import { Repository } from "typeorm";

import { Users } from "./entities/users.entity";
import { CrearUserDto } from "./dto/user.dto";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>) {}

  async findAll() {
    return this.usersRepository.find();
  }
  async crearUsuario(usuario: CrearUserDto) {
    const { nombres, username, password } = usuario;
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = this.usersRepository.create({
      nombres,
      username,
      password: hashedPassword,
    });
  }
}