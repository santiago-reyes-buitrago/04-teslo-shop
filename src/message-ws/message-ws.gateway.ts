import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect, WebSocketServer, SubscribeMessage
} from '@nestjs/websockets';
import {MessageWsService} from './message-ws.service';
import {Server, Socket} from "socket.io";
import {EVENT_TYPE_LISTEN, EVENT_TYPE_EMIT} from "./enums";
import {NewMessageDto} from "./dto/new-message.dto";
import {JwtService} from "@nestjs/jwt";
import {Logger} from "@nestjs/common";
import {JwtPayload} from "../auth/interfaces/jwt-payload.interface";

@WebSocketGateway({cors: true})
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(MessageWsGateway.name);
  @WebSocketServer() wss: Server

  constructor(
      private readonly messageWsService: MessageWsService,
      private readonly jwtService: JwtService,
  ) {
  }

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.jwt as string;
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token)
      console.log(token)
      await this.messageWsService.addClient(client,payload.id)
      console.log('Client connected', this.messageWsService.getConnectedClients(true))
      this.wss.emit(EVENT_TYPE_LISTEN.UPDATE_CLIENT, this.messageWsService.getConnectedClients())
    }catch (e) {
      client.disconnect()
      this.messageWsService.removeClient(client.id)
      this.logger.error(e)
    }
  }

  handleDisconnect(client: Socket) {
    this.messageWsService.removeClient(client.id)
  }

  @SubscribeMessage(EVENT_TYPE_LISTEN.MESSAGE_FROM_CLIENT)
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    // client.broadcast.emit(EVENT_TYPE_EMIT.MESSAGE_FROM_SERVER, {
    //   msg: payload.message
    // })

    // client.emit(EVENT_TYPE_EMIT.MESSAGE_FROM_SERVER, {
    //   msg: payload.message
    // })

    this.wss.emit(EVENT_TYPE_EMIT.MESSAGE_FROM_SERVER, {
      fullname: this.messageWsService.getUserFullName(client.id),
      msg: payload.message
    })
  }
}
