import {Injectable, Logger} from '@nestjs/common';
import {ClientData, IErrors, InformationSocketClient} from "./interface";
import {Socket} from "socket.io";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../auth/entities/user.entity";
import {Repository} from "typeorm";


@Injectable()
export class MessageWsService {
  private logger = new Logger(MessageWsService.name)
  private clients: ClientData<User>[] = [];
  // private readonly Errors: IErrors = {
  //   1259: (client: InformationSocketClient<User>,id: string) => {
  //     if (client.information.id === id) {
  //       client.socket.disconnect()
  //     }
  //   }
  // }


  constructor(
      @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
  }

  private checkUserConnection(user: User) {
    Object.keys(this.clients).forEach(id => {
      const client: InformationSocketClient<User> = this.clients[id];
      if (client.information.id === user.id) {
        client.socket.disconnect()
        throw new Error('Conexion ya existente')
      }
    })
  }

  async addClient(client: Socket, userId: string) {
    const user = await this.userRepository.findOneBy({id: userId});
    if (!user) throw new Error('User not found');
    if (!user.isActive) throw new Error('User not active');
    this.checkUserConnection(user);
    this.clients[client.id] = {Socket: client, information: user};
  }

  removeClient(id: string) {
    delete this.clients[id];
  }


  getConnectedClients(length?: boolean): string[] | number {
    const ids = Object.keys(this.clients) ?? [];
    if (length) return ids.length;
    return ids;
  }

  getUserFullName(socketID: string) {
    this.logger.log(this.clients[socketID])
    return this.clients[socketID].information.fullName;
  }
}
