import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  info(message: string, ...meta: unknown[]): void {
    console.info('[INFO]', message, ...meta);
  }
}
