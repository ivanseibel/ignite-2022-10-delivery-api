import { addDays, differenceInHours } from 'date-fns';
import {} from 'date-fns-tz';

import { IDateProvider } from '../IDateProvider';

class DateFnsDateProvider implements IDateProvider {
  addDays(days: number): Date {
    return addDays(this.dateNow(), days);
  }

  diffInHours(start_date: Date, end_date: Date): number {
    const diff = differenceInHours(new Date(end_date), new Date(start_date));
    return diff;
  }

  dateNow(): Date {
    const date = new Date();
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
