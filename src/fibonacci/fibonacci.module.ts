import { Module } from '@nestjs/common';
import { FibonacciWorkerHost } from './fibonacci-worker.host.js';
import { FibonacciController } from './fibonacci.controller';

@Module({
  controllers: [FibonacciController],
  providers: [FibonacciWorkerHost],
})
export class FibonacciModule {}
