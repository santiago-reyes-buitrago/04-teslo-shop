import {Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards} from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";
import {AuthService} from './auth.service';
import {CreateUserDto} from "./dto/create-user.dto";
import {LoginAuthDto} from "./dto/login-auth.dto";
import {GetRawHeadersDecorator} from "../common/decorators/get-raw-headers.decorator";
import {User} from "./entities/user.entity";
import {ValidateRoleGuard} from "./guards/validate-role.guard";
import {ValidRole} from "./enum/valid-role.enum";
import {Auth, GetUserDecorator, ValidateRole} from "./decorators";


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

  @Get('private2')
  @ValidateRole(ValidRole.ADMIN)
  @UseGuards(AuthGuard(),ValidateRoleGuard)
  testingPrivateRoute2(
      // @Req() request: Express.Request
      @GetUserDecorator(['email','roles']) user: User,
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

  @Get('private3')
  @Auth(ValidRole.ADMIN)
  testingPrivateRoute3(
      // @Req() request: Express.Request
      @GetUserDecorator(['email','roles']) user: User,
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
