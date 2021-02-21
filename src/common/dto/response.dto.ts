// success: true => message, data
// success: false => errorMessage, error
import { IResponse } from '../interfaces/response.interface';

export class ResponseError implements IResponse{
  constructor (error: any) {
    this.error = error;
    console.warn(new Date().toString() + ' - [Response]: ' + JSON.stringify(error) );
  };
  data: any[];
  error: any;
}

export class ResponseSuccess implements IResponse{
  constructor (data: any) {
    this.data = data;
  };
  data: any[];
  error: any;
}