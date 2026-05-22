import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {User} from "../entities/user.entity";
import {JwtPayload} from "../interfaces/jwt-payload.interface";
import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt'){
  constructor(
      private readonly configService: ConfigService
  ) {
    super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          ignoreExpiration: false,
          secretOrKey: configService.get<string>('JWT_SECRET', '')
      });
  }
  async validate(payload: JwtPayload){
    const {id} = payload;
    return ;
  }

}