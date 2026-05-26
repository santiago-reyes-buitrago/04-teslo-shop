import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {JwtPayload} from "../interfaces/jwt-payload.interface";
import {Injectable, UnauthorizedException} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {AuthService} from "../auth.service";
import {User} from "../entities/user.entity";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt'){
  constructor(
      private readonly configService: ConfigService,
      private readonly authService: AuthService,
  ) {
    super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          ignoreExpiration: false,
          secretOrKey: configService.get<string>('JWT_SECRET', '')
      });
  }
  async validate(payload: JwtPayload):Promise<User>{
    const user = await this.authService.validateUser(payload);
    if (!user) throw new UnauthorizedException('Invalid token');
    if (!user.isActive) throw new UnauthorizedException('Invalid user');
    return user;
  }

}