import {createParamDecorator} from '@nestjs/common';

export const GetRawHeadersDecorator = createParamDecorator(
    (data: string[]|string, context) => {
      const request = context.switchToHttp().getRequest();
      const headers: string[] = request.rawHeaders
      if (!data || data.length === 0) return headers;
      const validProperties = Array.isArray(data) ? data : [data];
      return headers.filter(header => validProperties.includes(header));
    }
);
