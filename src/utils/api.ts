import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_URL, MAX_RETRIES, RETRY_DELAY } from '../config';
import { mockAnalyticsData } from './mockData';

/**
 * Demo mode is permanently disabled
 */
export const setDemoMode = (_: boolean) => {
  // Ignore attempt to enable demo mode - just update localStorage
  localStorage.setItem('medassyst_demo_mode', 'false');
  console.log('Demo mode is permanently disabled');
};

/**
 * Get current demo mode status - always returns false
 */
export const getDemoMode = (): boolean => {
  return false;
};

// Force disable demo mode on startup
try {
  localStorage.setItem('medassyst_demo_mode', 'false');
  console.log('Demo mode has been permanently disabled');
} catch (e) {
  console.warn('Could not access localStorage');
}

/**
 * Axios instance with base URL and default configs
 */
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 120000, // 120 seconds (2 minutes) - for very slow laptop server
  headers: {
    'Content-Type': 'application/json',
  }
});

/**
 * Enhanced API request with retry capability
 * 
 * @param method - HTTP method (get, post, etc)
 * @param url - Endpoint URL (without base)
 * @param data - Request payload for POST/PUT
 * @param config - Additional axios config
 * @returns Promise with response data
 */
export const apiRequest = async (
  method: 'get' | 'post' | 'put' | 'delete',
  url: string, 
  data?: any,
  config?: AxiosRequestConfig
): Promise<any> => {
  let retries = 0;
  let lastError;

  while (retries < MAX_RETRIES) {
    try {
      let response: AxiosResponse;

      switch (method) {
        case 'get':
          response = await apiClient.get(url, config);
          break;
        case 'post':
          response = await apiClient.post(url, data, config);
          break;
        case 'put':
          response = await apiClient.put(url, data, config);
          break;
        case 'delete':
          response = await apiClient.delete(url, config);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      return response.data;
    } catch (error: any) {
      lastError = error;
      retries++;
      
      if (retries >= MAX_RETRIES) {
        console.error(`Failed after ${MAX_RETRIES} retries:`, error);
        break;
      }

      // Wait before next retry (increasing delay based on retry count)
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retries));
      console.log(`Retry attempt ${retries}/${MAX_RETRIES} for ${url}`);
    }
  }

  throw lastError;
};

/**
 * Check if backend service is healthy
 * @returns Promise resolving to boolean - true if backend is healthy, false otherwise
 */
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    // Direct fetch with cache busting to avoid service worker issues
    console.log(`Checking backend health at: ${API_URL}/health?nocache=${Date.now()}`);
    const response = await fetch(`${API_URL}/health?nocache=${Date.now()}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });
    
    return response.ok; // Will be true for 200-299 status codes
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

/**
 * Check if external API service is running
 * @returns Promise with external API status info
 */
export const checkExternalAPIStatus = async (): Promise<{
  status: 'online' | 'offline' | 'degraded';
  message?: string;
}> => {
  try {
    // First check backend health
    const isBackendHealthy = await checkBackendHealth();
    
    if (!isBackendHealthy) {
      return {
        status: 'offline',
        message: 'Backend is not available'
      };
    }
    
    // Direct fetch to API health endpoint with cache-busting
    console.log(`Checking External API health at: ${API_URL}/api/health?nocache=${Date.now()}`);
    const response = await fetch(`${API_URL}/api/health?nocache=${Date.now()}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      
      // Return status from the backend health check
      return {
        status: data.status as 'online' | 'offline' | 'degraded',
        message: data.message
      };
    }
    
    // Default to unknown if response is not as expected
    return {
      status: 'degraded',
      message: 'Unexpected response from API health check'
    };
  } catch (error) {
    console.error('External API health check failed:', error);
    return {
      status: 'offline',
      message: 'Could not connect to external API service'
    };
  }
};





/**
 * Force real AI diagnosis even if in demo mode
 * @param symptoms - User symptoms text
 * @returns Promise with diagnosis response from real AI
 */
export const forceRealDiagnosis = async (symptoms: string): Promise<{
  diagnosis: string;
  consultation_id?: number;
  severity?: number;
}> => {
  try {
    console.log('Forcing real AI diagnosis directly');
    
    // Create a controller to enable timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 second (2 minute) timeout
    
    try {
      // Direct fetch without going through axios or any middleware
      const response = await fetch(`${API_URL}/api/consult`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms, no_demo: true }),
        signal: controller.signal
      });
      
      // Clear the timeout since we got a response
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get diagnosis: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      return {
        diagnosis: data.diagnosis,
        consultation_id: data.consultation_id,
        severity: data.severity || 0
      };
    } catch (fetchError) {
      // Clear the timeout to prevent memory leaks
      clearTimeout(timeoutId);
      throw fetchError;
    }
  } catch (error: unknown) {
    console.error('Error with real diagnosis:', error);
    
    // Special error message for connection issues
    if (error instanceof TypeError && (error as TypeError).message.includes('Failed to fetch')) {
      throw new Error(`Не удалось подключиться к серверу. Убедитесь, что запущен backend сервер (python -m uvicorn main:app --reload) и есть подключение к интернету.`);
    }
    
    // Show abort error in a user-friendly way
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(`Сервер не ответил вовремя. Возможно, сервер перегружен или работает медленно. Пожалуйста, попробуйте еще раз позже.`);
    }
    
    throw error; // Re-throw for other types of errors
  }
}


/**
 * Get a medical diagnosis for symptoms directly from the backend
 * @param symptoms - User symptoms text
 * @returns Promise with diagnosis response
 */
export const getDiagnosis = async (symptoms: string): Promise<{
  diagnosis: string;
  consultation_id?: number;
  severity?: number;
}> => {
  try {
    // Get diagnosis from backend API which uses the external API
    const data = await apiRequest('post', '/api/consult', { symptoms });
    return {
      diagnosis: data.diagnosis,
      consultation_id: data.consultation_id,
      severity: data.severity || 0
    };
  } catch (error) {
    console.error('Failed to get diagnosis:', error);
    // Let the error propagate up to be handled by the calling component
    throw error;
  }
};

/**
 * Get consultation history from the backend
 * @returns Promise with consultation history array
 */
export const getConsultationHistory = async (): Promise<any[]> => {
  try {
    // Get real consultation history from backend
    const data = await apiRequest('get', '/api/consultations/history');
    return data;
  } catch (error) {
    console.error('Failed to fetch consultation history:', error);
    // Let the error propagate to be handled by the calling component
    throw error;
  }
};

/**
 * Get analytics data for the dashboard
 * @returns Promise with analytics data
 */
export const getAnalyticsData = async (): Promise<any> => {
  try {
    // Return mock analytics data instead of calling the backend
    // This makes the frontend self-contained for easier deployment
    console.log('Using mock analytics data instead of backend API');
    return mockAnalyticsData;
  } catch (error) {
    console.error('Failed to load analytics data:', error);
    // Let the error propagate to be handled by the calling component
    throw error;
  }
};
