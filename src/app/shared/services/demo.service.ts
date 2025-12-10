import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DemoService {
  getGreeting(name: string): string {
    return `Hello, ${name}`;
  }
}
