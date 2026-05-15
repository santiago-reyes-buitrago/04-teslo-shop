import {existsSync} from "node:fs";
import { join } from "path";
import {Injectable, NotFoundException} from '@nestjs/common';


@Injectable()
export class FilesService {

  getStaticImage(folder: string,image: string){
    const path = join(__dirname, '../../static/uploads/', folder, image)
    if (!existsSync(path)) throw new NotFoundException('Image not found')
    return path
  }
}
