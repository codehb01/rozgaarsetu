// Utility functions for handling JSON string fields in database

/**
 * Parse a JSON string back to an array, with fallback for safety
 */
export function parseJsonArray(jsonString: string | null | undefined): string[] {
  if (!jsonString) return [];
  
  try {
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Failed to parse JSON array:', jsonString);
    return [];
  }
}

/**
 * Convert array to JSON string for database storage
 */
export function stringifyArray(array: string[] | null | undefined): string {
  if (!array || !Array.isArray(array)) return '[]';
  return JSON.stringify(array);
}

/**
 * Parse skills from WorkerProfile (for backward compatibility)
 */
export function parseSkills(skilledIn: string | null | undefined): string[] {
  return parseJsonArray(skilledIn);
}

/**
 * Parse available areas from WorkerProfile (for backward compatibility)
 */
export function parseAreas(availableAreas: string | null | undefined): string[] {
  return parseJsonArray(availableAreas);
}

/**
 * Parse certificates from WorkerProfile (for backward compatibility)
 */
export function parseCertificates(certificates: string | null | undefined): string[] {
  return parseJsonArray(certificates);
}