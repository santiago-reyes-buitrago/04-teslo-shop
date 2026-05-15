import type {Response} from 'express';
import {Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors} from '@nestjs/common';
import { FilesService } from './files.service';
import {FileInterceptor} from "@nestjs/platform-express";
import {fileFilter} from "./helpers/fileFilter.helper";
import {diskStorage} from "multer";
import {fileNamer} from "./helpers/fileNamer.helper";

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

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
    console.log('fileController - ', file)
    const secureUrl = `${file.filename}`
    return {secureUrl};
    // return this.filesService.create(createFileDto);
  }
}
