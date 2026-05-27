import {Controller, Get, Post, Body, HttpStatus, HttpCode, UseGuards, Req} from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";
import { AuthService } from './auth.service';
import {CreateUserDto} from "./dto/create-user.dto";
import {LoginAuthDto} from "./dto/login-auth.dto";
import {GetUserDecorator} from "./decorators/get-user.decorator";
import {GetRawHeadersDecorator} from "./decorators/get-raw-headers.decorator";
import {User} from "./entities/user.entity";



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

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
      // @Req() request: Express.Request
      @GetUserDecorator('email') user: User,
      @GetRawHeadersDecorator() headers: string[]
  ){
    // console.log({user: request.user})
    return {
      ok: true,
      msg: 'ruta privada',
      user,
      headers
    }
  }
}
