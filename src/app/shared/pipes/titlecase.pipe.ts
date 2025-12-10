import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'titlecaseCustom', standalone: true })
export class TitlecaseCustomPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    return value
      .split(' ')
      .filter((part) => part.trim().length > 0)
      .map((part) => part[0].toUpperCase() + part.slice(1))
      .join(' ');
  }
}
