import {BadRequestException} from "@nestjs/common";
import {ALLOWED_EXTENSIONS} from "../constants/extensions.constant";

export const fileFilter =(req: Express.Request, file: Express.Multer.File, callback: Function) => {
    if (!file) {
        callback(new BadRequestException('File is empty'), false);
        return;
    }
    if (!ALLOWED_EXTENSIONS.includes(file.mimetype)) {
        callback(new BadRequestException('type file not support'), false);
        return;
    }

    callback(null, true);
}