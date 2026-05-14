import {Controller, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import { FilesService } from './files.service';
import {FileInterceptor} from "@nestjs/platform-express";
import {fileFilter} from "./helpers/fileFilter.helper";
import {diskStorage} from "multer";

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors(FileInterceptor('file',{
    fileFilter: fileFilter,
    storage: diskStorage({
      destination: './static/uploads'
    })
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('fileController - ', file)
    return 'hola mundo';
    // return this.filesService.create(createFileDto);
  }
}
