import { Controller } from "@nestjs/common";
import { UsersService } from "./user.services";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
}