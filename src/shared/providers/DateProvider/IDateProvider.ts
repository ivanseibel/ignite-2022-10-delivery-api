interface IDateProvider {
  diffInHours(start_date: Date, end_date: Date): number;
  dateNow(): Date;
  addDays(days: number): Date;
}

export { IDateProvider };
