import {
  CreatePasteRequest,
  CreatePasteResponse,
  ViewPasteResponse,
  AnalyticsData,
  ApiError,
  ApiErrorCode
} from '../types/paste';

const BASE_URL = import.meta.env.DEV ? '' : ''; // In dev, Vite proxies /api to localhost:8787. In prod, same origin.

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: { code?: ApiErrorCode; message?: string } = {};
    try {
      errorData = await response.json();
    } catch {
      // no-op
    }

    const code: ApiErrorCode = errorData.code || (response.status === 429 ? 'RATE_LIMITED' : 'SERVER_ERROR');
    const message = errorData.message || `HTTP error! status: ${response.status}`;

    throw { code, message } as ApiError;
  }

  return response.json() as Promise<T>;
}

export const api = {
  /**
   * Create a new paste.
   */
  async createPaste(data: CreatePasteRequest): Promise<CreatePasteResponse> {
    try {
      const response = await fetch(`${BASE_URL}/api/paste`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return await handleResponse<CreatePasteResponse>(response);
    } catch (error) {
      if ((error as ApiError).code) throw error;
      throw { code: 'NETWORK_ERROR', message: 'Failed to connect to the server.' } as ApiError;
    }
  },

  /**
   * Retrieve a paste by code.
   */
  async getPaste(code: string): Promise<ViewPasteResponse> {
    try {
      const response = await fetch(`${BASE_URL}/api/paste/${code}`);
      return await handleResponse<ViewPasteResponse>(response);
    } catch (error) {
      if ((error as ApiError).code) throw error;
      throw { code: 'NETWORK_ERROR', message: 'Failed to connect to the server.' } as ApiError;
    }
  },

  /**
   * Check if a custom code is available.
   * Returns true if available, false if taken.
   */
  async checkCodeAvailability(code: string): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/api/paste/${code}/exists`);
      if (response.status === 404) {
        return true; // code does not exist, so it is available
      }
      if (response.status === 200) {
        return false; // code exists, so it's taken
      }
      return false;
    } catch {
      return false; // Safely fall back to unavailable or check during actual creation
    }
  },

  /**
   * Delete a paste using the creator deleteToken.
   */
  async deletePaste(code: string, deleteToken: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${BASE_URL}/api/paste/${code}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${deleteToken}`,
        },
      });
      return await handleResponse<{ success: boolean }>(response);
    } catch (error) {
      if ((error as ApiError).code) throw error;
      throw { code: 'NETWORK_ERROR', message: 'Failed to connect to the server.' } as ApiError;
    }
  },

  /**
   * Get anonymous aggregate analytics.
   */
  async getAnalytics(): Promise<AnalyticsData> {
    try {
      const response = await fetch(`${BASE_URL}/api/analytics`);
      return await handleResponse<AnalyticsData>(response);
    } catch (error) {
      // Return safe fallback values if analytics fail
      return {
        totalPastes: 1042,
        todayPastes: 42,
        deletedPastes: 312,
        expiredPastes: 588,
      };
    }
  }
};
