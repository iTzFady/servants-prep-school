function dateOnly(isoDate) {
  const date = new Date(isoDate);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const result = `${year}-${month}-${day}`;
  return result;
}

function arabicDate(isoDate) {
  const date = new Date(isoDate);

  const result = date.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return result;
}

function arabicDateAndTime(isoDate) {
  const dateTime = new Date(isoDate);
  const date = dateTime.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const time = dateTime.toLocaleTimeString("ar-EG", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
  return { date, time };
}

export default { dateOnly, arabicDate, arabicDateAndTime };
