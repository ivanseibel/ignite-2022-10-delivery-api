interface IDateProvider {
  diffInHours(start_date: Date, end_date: Date): number;
  dateNow(): Date;
}

export { IDateProvider };
