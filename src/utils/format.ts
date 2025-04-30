export function cleanObject<T>(obj: T): T {
  if (typeof obj !== "object" || obj === null) return obj;

  const entries = Object.entries(obj)
    .map(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        const cleaned = cleanObject(value);
        return Object.keys(cleaned).length > 0 ? [key, cleaned] : null;
      }
      return value === "" ? null : [key, value];
    })
    .filter((entry): entry is [string, any] => entry !== null);

  return Object.fromEntries(entries) as T;
}
// Format date helper function
export const formatDateTime = (timestamp: string): string => {
  const date = new Date(timestamp).toLocaleDateString("en-US");
  const time = new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date} at ${time}`;
};

export const formatDate = (date: Date | null | undefined): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return "";

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};

// Format month for display
export const formatMonth = (date: Date | null | undefined): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return "";

  const options: Intl.DateTimeFormatOptions = { month: "short" };
  return date.toLocaleDateString("en-US", options);
};

// Calculate days ago
export const getDaysAgo = (date: Date | null | undefined): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return "";

  const today = new Date();
  // Clear time components to compare just dates
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(today.getTime() - compareDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else {
    return `${diffDays} days ago`;
  }
};
