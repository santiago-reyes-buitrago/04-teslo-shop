import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { CreateMessageWDto } from './dto/create-message-w.dto';
import { UpdateMessageWDto } from './dto/update-message-w.dto';

@WebSocketGateway({cors: true})
export class MessageWsGateway {
  constructor(private readonly messageWsService: MessageWsService) {}
}
