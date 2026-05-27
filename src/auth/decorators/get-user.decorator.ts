import {createParamDecorator, ExecutionContext, InternalServerErrorException} from '@nestjs/common';
import {BuildObjectDinamicFunction} from "../../common/functions/build-object-dinamic.function";


const createUser = (user: Express.User,keys: string[]|null) => {
  if (!user) throw new InternalServerErrorException('User not found in context')
  return BuildObjectDinamicFunction<Express.User>(user,keys)
}

export const GetUserDecorator = createParamDecorator(
    (data: string[]|string, context: ExecutionContext) => {
      const request: Express.Request = context.switchToHttp().getRequest()
      const {user} = request
      return createUser(user!, Array.isArray(data) ? data : [data])
    }
)
