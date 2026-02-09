// utils/getStatusStyles.ts
export function getStatusClasses(status: string) {
  switch (status.toUpperCase()) {
    case "OPEN":
      return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    case "IN PROGRESS":
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-700 border border-blue-200";
    case "RESOLVED":
      return "bg-green-100 text-green-700 border border-green-200";
    case "CLOSED":
      return "bg-gray-200 text-gray-700 border border-gray-300";
    default:
      return "bg-gray-100 text-gray-600 border border-gray-200";
  }
}
