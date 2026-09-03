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

function timeRemaining(date) {
  const diff = new Date(date) - new Date();

  if (diff <= 0) return "انتهى";

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) {
    if (days === 1) return "تبقى يوم";
    if (days === 2) return "تبقى يومين";
    return `تبقى ${days} أيام`;
  }

  if (hours > 0) {
    if (hours === 1) return "تبقى ساعة";
    if (hours === 2) return "تبقى ساعتين";
    return `تبقى ${hours} ساعات`;
  }

  if (minutes === 1) return "تبقى دقيقة";
  if (minutes === 2) return "تبقى دقيقتين";

  return `تبقى ${minutes} دقيقة`;
}

export default { dateOnly, arabicDate, arabicDateAndTime, timeRemaining };
