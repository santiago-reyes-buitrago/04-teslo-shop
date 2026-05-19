import type {Response} from 'express';
import {Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors} from '@nestjs/common';
import { FilesService } from './files.service';
import {FileInterceptor} from "@nestjs/platform-express";
import {fileFilter} from "./helpers/fileFilter.helper";
import {diskStorage} from "multer";
import {fileNamer} from "./helpers/fileNamer.helper";
import {ConfigService} from "@nestjs/config";

@Controller('files')
export class FilesController {
  constructor(
      private readonly filesService: FilesService,
      private readonly configService: ConfigService
  ) {}

  @Get('product/:id')
  getImageFile( @Param('id') id: string,@Res() response: Response) {
    const path = this.filesService.getStaticImage('products',id)
    response.sendFile(path)
  }

  @Post('product')
  @UseInterceptors(FileInterceptor('file',{
    fileFilter: fileFilter,
    storage: diskStorage({
      destination: './static/uploads/products',
      filename: fileNamer
    })
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const secureUrl = `${this.configService.get<string>('HOST_API','')}/files/product/${file.filename}`
    return {secureUrl};
    // return this.filesService.create(createFileDto);
  }
}
