export function generateDates(): { start_date: Date; end_date: Date } {
  const currentDate = new Date();
  const start_date = currentDate;
  const end_date = new Date(currentDate);
  end_date.setDate(currentDate.getDate() + 5);
  return { start_date, end_date };
}
