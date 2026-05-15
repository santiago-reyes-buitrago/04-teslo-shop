import {BadRequestException} from "@nestjs/common";
import {v4} from "uuid";

export const fileNamer = (req: Express.Request, file: Express.Multer.File, callback: Function) => {
  if (!file) {
    callback(new BadRequestException('File is empty'), false);
    return;
  }

  const fileExtension = file.mimetype.split('/')[1];
  const fileName = `${v4()}.${fileExtension}`;

  callback(null, fileName);
}