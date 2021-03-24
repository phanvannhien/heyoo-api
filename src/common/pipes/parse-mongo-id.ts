import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';


@Injectable()
export class MongoIdValidationPipe implements PipeTransform {
   
    transform(value: any, metadata: ArgumentMetadata) {
   
        if (!value.match(/^[0-9a-fA-F]{24}$/)) {
            throw new BadRequestException( metadata.data + ' is not valid');
        }
        return value;
    }
}
