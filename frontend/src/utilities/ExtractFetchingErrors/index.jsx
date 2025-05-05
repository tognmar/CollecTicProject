export default function extractErrorMessages(errorData) {
  if (!errorData) return "Unknown error occurred.";

  // Handle plain strings (e.g., network errors)
  if (typeof errorData === "string") return errorData;

  // Handle Djoser/Django's nested error structures
  return Object.values(errorData)
    .flatMap((messages) =>
      Array.isArray(messages) ? messages : [messages]
    )
    .join(" ");
}