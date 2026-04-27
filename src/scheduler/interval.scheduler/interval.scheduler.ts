import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { INTERVAL_HOST_KEY } from '../decorators/interval-host.decorator.js';
import { INTERVAL_KEY } from '../decorators/interval.decorator.js';

@Injectable()
export class IntervalScheduler
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly intervals: NodeJS.Timeout[] = [];
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
    private readonly metadataScanner: MetadataScanner,
  ) {}
  onApplicationShutdown(signal?: string) {
    this.intervals.forEach((intervalRef) => {
      clearInterval(intervalRef);
    });
  }
  onApplicationBootstrap() {
    const providers = this.discoveryService.getProviders();
    providers.forEach((wrapper) => {
      const { instance } = wrapper;
      const prototype = instance && Object.getPrototypeOf(instance);
      if (!instance || !prototype) {
        return;
      }

      const isIntervalHost =
        this.reflector.get(INTERVAL_HOST_KEY, instance.constructor) ?? false;

      if (!isIntervalHost) {
        return;
      }

      const methodKeys = this.metadataScanner.getAllMethodNames(prototype);

      methodKeys.forEach((methodKeys) => {
        const interval = this.reflector.get(INTERVAL_KEY, instance[methodKeys]);
        if (interval === undefined) {
          return;
        }

        const intervalRef = setInterval(() => instance[methodKeys](), interval);
        this.intervals.push(intervalRef);
      });
    });
  }
}
