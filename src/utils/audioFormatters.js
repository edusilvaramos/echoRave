export function formatDuration(durationMillis) {
  if (!durationMillis || durationMillis <= 0) {
    return "0:00";
  }

  const totalSeconds = Math.floor(durationMillis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function formatCreatedAt(createdAt) {
  if (!createdAt) {
    return "Unknown date";
  }

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleString();
}
