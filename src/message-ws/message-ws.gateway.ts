import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect, WebSocketServer, SubscribeMessage
} from '@nestjs/websockets';
import {MessageWsService} from './message-ws.service';
import {Server, Socket} from "socket.io";
import {EVENT_TYPE_LISTEN,EVENT_TYPE_EMIT} from "./enums";
import {NewMessageDto} from "./dto/new-message.dto";

@WebSocketGateway({cors: true})
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server
  constructor(private readonly messageWsService: MessageWsService) {
  }

  handleConnection(client: Socket) {
    this.messageWsService.addClient(client)
    console.log('Client connected', this.messageWsService.getConnectedClients(true))
    this.wss.emit(EVENT_TYPE_LISTEN.UPDATE_CLIENT, this.messageWsService.getConnectedClients())
  }

  handleDisconnect(client: Socket) {
    this.messageWsService.removeClient(client.id)
  }

  @SubscribeMessage(EVENT_TYPE_EMIT.MESSAGE_FROM_CLIENT)
  handleMessageFromClient(client: Socket, payload: NewMessageDto){
    console.log(client.id, payload)

  }
}
