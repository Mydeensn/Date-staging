// Vercel Serverless Function: /api/calendar
// Returns 30-minute slots from tomorrow for the next N business days (default 10), excluding weekends.

function generateNextDaysSlots(days = 10) {
  const dates = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let cur = new Date(today);
  cur.setDate(cur.getDate() + 1); // start from tomorrow

  const startTimeHour = 9;
  const startTimeMinute = 30;
  const endTimeHour = 18;
  const endTimeMinute = 30;

  let addedDays = 0;
  while (addedDays < days) {
    const dayOfWeek = cur.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    if (!isWeekend) {
      for (let hour = startTimeHour; hour <= endTimeHour; hour++) {
        for (let minute = (hour === startTimeHour ? startTimeMinute : 0); minute < 60; minute += 30) {
          if (hour > endTimeHour || (hour === endTimeHour && minute > endTimeMinute)) break;

          const slot = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate(), hour, minute);
          const options = { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
          const formattedDate = slot.toLocaleString('en-US', options);

          dates.push({ date: formattedDate, isWeekend: false });

          if (hour === endTimeHour && minute === endTimeMinute) break;
        }
      }
      addedDays++;
    }
    cur.setDate(cur.getDate() + 1);
  }

  return dates;
}

module.exports = (req, res) => {
  const days = Math.max(1, Math.min(31, parseInt((req.query?.days ?? '10'), 10)));
  res.setHeader('Content-Type', 'application/json');
  res.status(200).send(JSON.stringify(generateNextDaysSlots(days)));
};
