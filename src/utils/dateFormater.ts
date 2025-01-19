// Utility function to format date 
export const formatDateWithMonth = (isoString: string) => {
  const date = new Date(isoString);
  const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long" };
  return date.toLocaleDateString("en-US", options);
};

// Utility function to get relative time like "10 hours ago"
export const timeAgo = (isoString: string) => {
  const now = new Date();
  const past = new Date(isoString);
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} days ago`;
  return formatDateWithMonth(isoString);
};
