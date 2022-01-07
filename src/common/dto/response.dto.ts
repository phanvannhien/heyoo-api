// success: true => message, data
// success: false => errorMessage, error
import { IResponse } from '../interfaces/response.interface';

export class ResponseError implements IResponse{
  constructor (error: any) {
    this.error = error;
  };
  data: any[];
  error: any;
}

export class ResponseSuccess implements IResponse{
  constructor (data: any) {
    this.data = data;
    this.code = 200;
    this.message = "Successful"
  };
  data: any[];
  error: any;
  code: number;
  message: string;
}