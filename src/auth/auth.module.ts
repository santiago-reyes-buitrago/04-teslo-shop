import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {JwtStrategy} from "./strategies/jwt.stategy";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', ''),
        signOptions: {
          expiresIn: '1h'
        }
      })
    })
    // JwtModule.register({
    //   secret: process.env.JWT_SECRET,
    //   signOptions: {
    //     expiresIn: '1h'
    //   }
    // })
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  exports: [AuthService,JwtStrategy,PassportModule]
})
export class AuthModule {
}
