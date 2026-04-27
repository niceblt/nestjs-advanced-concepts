import { IntervalHost } from '../scheduler/decorators/interval-host.decorator.js';
import { Interval } from '../scheduler/decorators/interval.decorator.js';

@IntervalHost
export class CronService {
  @Interval(1000)
  everySecond() {
    // console.log('This will be logged every second');
  }
}
