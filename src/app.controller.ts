import { Controller, Get, UseGuards, Post, Request, Res, Body, 
  ValidationPipe, 
  UsePipes,
  ClassSerializerInterceptor, 
  UseInterceptors,
  SerializeOptions
} from '@nestjs/common';
import { AppService } from './app.service';
import { countries, languages } from 'countries-list'


@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('countries')
  getCountries(){
   
    let data = [];
    Object.keys(countries).forEach( o => {
      data[countries[o]] = {
        name: countries[o]['name'],
        phone: countries[o]['phone'],
      }
      // data.push()
    });
    return data;
  }

  @Get('v2/countries')
  getCountriesV2(){
    let data = [];
    Object.keys(countries).forEach( o => {
      data.push({
        name: countries[o]['name'],
        phone: countries[o]['phone'],
      })
    });
    return data;
  }

  @Get('languages')
  getLanguages(){
    return languages;
  }

}