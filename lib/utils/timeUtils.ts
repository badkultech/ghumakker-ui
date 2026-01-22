export function formatTime(time24?: string | number[] | null): string {
  if (!time24) return "-";

  let timeString = "";

  if (Array.isArray(time24)) {
    if (time24.length < 2) return "-";
    const [h, m] = time24;
    // ensure two digits
    timeString = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  } else {
    timeString = time24;
  }

  // If the timeString doesn't have seconds, Date parsing might still work, 
  // but let's be safe. Usually "1970-01-01T14:30" works.
  // If the incoming string is just "14:30", we append it.

  const date = new Date(`1970-01-01T${timeString}`);

  if (isNaN(date.getTime())) return "-";

  const formatted = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return formatted.replace(/am|pm/i, (match) => match.toUpperCase());
}
