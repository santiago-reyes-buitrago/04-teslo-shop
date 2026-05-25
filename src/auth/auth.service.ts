import {BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "./entities/user.entity";
import {CreateUserDto} from "./dto/create-user.dto";
import * as bcrypt from 'bcrypt'
import {LoginAuthDto} from "./dto/login-auth.dto";
import {JwtPayload} from "./interfaces/jwt-payload.interface";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
      @InjectRepository(User)private readonly userRepository: Repository<User>,
      private readonly jwtService: JwtService
  ) {}

  signUp(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create({...createUserDto, password: bcrypt.hashSync(createUserDto.password, 12)});
      return this.userRepository.save(user)
    }catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException('Error executing signUp');
    }
  }

  async login(loginAuthDto: LoginAuthDto) {
    try {
      const {email,password} = loginAuthDto;
      const user = await this.userRepository.findOne({where: {email},select: {email: true,password: true,id: true}})
      if (!user) throw new NotFoundException('No se encontro el usuario');
      if (!bcrypt.compareSync(password, user.password)) throw new BadRequestException('Credenciales invalidas')
      const { password: _password, id: _id, ...response } = {
        ...user,
        token: this.generateJWTToken({ id: user.id })
      };
      return response;
    }catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException('Error executing login');
    }
  }

  async validateUser(payload: JwtPayload){
    try {
      return await this.userRepository.findOneBy({id: payload.id});
    }catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException('Error executing validation');
    }
  }

  private generateJWTToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
