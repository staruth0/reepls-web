// src/utils/dateFormatter.ts

export const formatDateWithMonth = (isoString: string) => {
  try {
    const date = new Date(isoString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
    };

    return date.toLocaleDateString("en-US", options);
  } catch (error) {
    void error;
    return "Invalid date";
  }
};

export const timeAgo = (isoString: string) => {
  try {
    const now = new Date();
    const past = new Date(isoString);

    // Check if date is valid
    if (isNaN(past.getTime())) {
      return "Invalid date";
    }

    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;

    const elapsed = now.getTime() - past.getTime();

    // Handle future dates
    if (elapsed < 0) {
      return formatDateWithMonth(isoString);
    }

    // More granular time differences
    if (elapsed < msPerMinute) {
      const seconds = Math.round(elapsed / 1000);
      return seconds <= 1 ? "just now" : `${seconds}s ago`;
    } else if (elapsed < msPerHour) {
      const minutes = Math.round(elapsed / msPerMinute);
      return minutes === 1 ? "1m ago" : `${minutes}m ago`;
    } else if (elapsed < msPerDay) {
      const hours = Math.round(elapsed / msPerHour);
      return hours === 1 ? "1h ago" : `${hours}h ago`;
    } else if (elapsed < msPerMonth) {
      const days = Math.round(elapsed / msPerDay);
      return days === 1 ? "1d ago" : `${days}d ago`;
    } else if (elapsed < msPerYear) {
      const months = Math.round(elapsed / msPerMonth);
      return months === 1 ? "1mo ago" : `${months}mo ago`;
    } else {
      return formatDateWithMonth(isoString);
    }
  } catch (error) {
    void error;
    return "Invalid date";
  }
};
