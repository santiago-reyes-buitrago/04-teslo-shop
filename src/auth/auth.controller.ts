import {Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode} from '@nestjs/common';
import { AuthService } from './auth.service';
import {CreateUserDto} from "./dto/create-user.dto";
import {LoginAuthDto} from "./dto/login-auth.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('register')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto)
  }
}
