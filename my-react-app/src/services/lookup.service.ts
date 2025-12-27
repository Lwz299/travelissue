import axios from 'axios';
import { LookupItem, ApiError } from '@/types/isa';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';

class LookupService {
  private baseURL = `${API_BASE_URL}/lookup`;

  /**
   * Get lookup items by category
   */
  async getLookupItems(category: string): Promise<LookupItem[]> {
    try {
      const response = await axios.get<LookupItem[]>(
        `${this.baseURL}/${category}`
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get policy types
   */
  async getPolicyTypes(): Promise<LookupItem[]> {
    return this.getLookupItems('policy-types');
  }

  /**
   * Get beneficiary relations
   */
  async getBeneficiaryRelations(): Promise<LookupItem[]> {
    return this.getLookupItems('beneficiary-relations');
  }

  /**
   * Get payment methods
   */
  async getPaymentMethods(): Promise<LookupItem[]> {
    return this.getLookupItems('payment-methods');
  }

  /**
   * Get coverage amounts
   */
  async getCoverageAmounts(): Promise<LookupItem[]> {
    return this.getLookupItems('coverage-amounts');
  }

  /**
   * Get policy durations
   */
  async getPolicyDurations(): Promise<LookupItem[]> {
    return this.getLookupItems('policy-durations');
  }

  private handleError(error: any): ApiError {
    if (error.response) {
      return {
        code: error.response.data?.code || 'UNKNOWN_ERROR',
        message: error.response.data?.message || error.message,
        details: error.response.data,
      };
    }
    return {
      code: 'NETWORK_ERROR',
      message: error.message || 'Network error occurred',
    };
  }
}

export const lookupService = new LookupService();

