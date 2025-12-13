export function LogCall(target: unknown, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  const original = descriptor.value;
  descriptor.value = function (...args: unknown[]) {
    console.debug(`[LogCall] ${propertyKey} called with`, args);
    return original.apply(this, args);
  };
  return descriptor;
}
