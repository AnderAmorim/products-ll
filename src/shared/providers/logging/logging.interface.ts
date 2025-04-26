export const ILoggingToken = 'ILoggingToken';

export interface LoggingMetadata {
  traceId: number;
}

export interface ILogging {
  info(message: string, data?: Partial<LoggingMetadata>): void;

  error(message: string, data?: Partial<LoggingMetadata>): void;
}
