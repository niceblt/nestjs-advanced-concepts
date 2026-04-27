import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CircuitBreaker } from './circuit-breaker.js';

@Injectable()
export class CircuitBreakerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const methodRef = context.getHandler();

    let circutBreaker: CircuitBreaker;
    if (this.circuitBreakerByHandler.has(methodRef)) {
      circutBreaker = this.circuitBreakerByHandler.get(
        methodRef,
      ) as CircuitBreaker;
    } else {
      circutBreaker = new CircuitBreaker();
      this.circuitBreakerByHandler.set(methodRef, circutBreaker);
    }

    return circutBreaker.exec(next);
  }

  private readonly circuitBreakerByHandler = new WeakMap<
    Function,
    CircuitBreaker
  >();
}
