import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class DecodeUriPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    if (metadata.type === 'param' && typeof value === 'string') {
      return decodeURIComponent(value); 
    }
    return value;
  }
}