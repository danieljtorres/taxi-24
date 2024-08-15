export abstract class LoggerService {
  abstract error(...data: unknown[]): void;
  abstract warn(...data: unknown[]): void;
  abstract debug(...data: unknown[]): void;
  abstract info(...data: unknown[]): void;
}
