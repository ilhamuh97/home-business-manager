export function getGranularity<T>(dateRange: string) {
  switch (dateRange) {
    case "monthly":
      return "month";
    case "annually":
      return "year";
    default:
      return "month";
  }
}

export const getPercentageIncrease = (
  newValue: number,
  oldValue: number,
): number => {
  if (oldValue === 0) {
    return 0;
  }
  return Number((((newValue - oldValue) / oldValue) * 100).toFixed(2));
};
