import { formatDistanceToNow } from "date-fns";

export const getTimeDifferenceFromUTC = (utcTimestamp: string): string => {
  const utcDate = new Date(utcTimestamp);
  return formatDistanceToNow(utcDate, {
    addSuffix: true,
    includeSeconds: true,
  });
};
