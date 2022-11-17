interface IDateProvider {
  diffInHours(start_date: Date, end_date: Date): number;
  toUTC(date_to_convert?: Date): Date;
  addDays(days: number): Date;
  addHours(hours: number): Date;
  isExpired(date: Date): boolean;
}

export { IDateProvider };
