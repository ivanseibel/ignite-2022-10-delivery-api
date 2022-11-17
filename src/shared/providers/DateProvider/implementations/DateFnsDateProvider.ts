import { addDays, addHours, differenceInHours } from 'date-fns';
import {} from 'date-fns-tz';

import { IDateProvider } from '../IDateProvider';

class DateFnsDateProvider implements IDateProvider {
  isExpired(date: Date): boolean {
    return this.toUTC() > this.toUTC(date);
  }

  addHours(hours: number): Date {
    return addHours(this.toUTC(), hours);
  }

  addDays(days: number): Date {
    return addDays(this.toUTC(), days);
  }

  diffInHours(start_date: Date, end_date: Date): number {
    const diff = differenceInHours(new Date(end_date), new Date(start_date));
    return diff;
  }

  toUTC(date_to_convert?: Date): Date {
    const date = date_to_convert ? new Date(date_to_convert) : new Date();
    return new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      )
    );
  }
}

export { DateFnsDateProvider };
