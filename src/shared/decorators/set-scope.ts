import { SetMetadata } from '@nestjs/common';

export const SetScope = (scope: string) => SetMetadata('requiredScope', scope);