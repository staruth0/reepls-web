export const convertUtcToLocal = (utcDateString: string): Date => {
  const date = new Date(utcDateString);
  // The Date object automatically handles time zone conversion when created from a UTC string
  // and its methods like toLocaleString() will return the local time.
  return date;
};

export const formatToLocaleDateTime = (date: Date): string => {
  return date.toLocaleString();
};

export const formatToLocaleDate = (date: Date): string => {
  return date.toLocaleDateString();
};

export const formatToLocaleTime = (date: Date): string => {
  return date.toLocaleTimeString();
};