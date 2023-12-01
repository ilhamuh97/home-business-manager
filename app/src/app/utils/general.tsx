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
