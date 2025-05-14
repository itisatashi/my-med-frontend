/**
 * Centralized configuration for API endpoints and other global settings
 */

// API URL with environment variable fallback
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// External API URL for diagnosis service
export const EXTERNAL_API_URL = 'https://begdulla.uz/APII/api.php';

// Number of retry attempts for API calls before failing
export const MAX_RETRIES = 3;

// Retry delay in milliseconds (increases with each retry)
export const RETRY_DELAY = 1000;
