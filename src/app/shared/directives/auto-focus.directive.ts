import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]',
  standalone: true
})
export class AutoFocusDirective implements OnInit {
  constructor(private readonly el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    queueMicrotask(() => this.el.nativeElement?.focus());
  }
}
