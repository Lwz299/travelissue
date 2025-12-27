import axios from 'axios';
import { Quotation, Policy, PaymentRequest, PaymentResponse, PolicyResult, ApiError } from '@/types/isa';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';

class PolicyService {
  private baseURL = `${API_BASE_URL}/policies`;

  /**
   * Get auth headers (removed authentication requirement)
   */
  private getAuthHeaders() {
    return {};
  }

  /**
   * Create quotation
   */
  async createQuotation(quotationData: Partial<Quotation>): Promise<Quotation> {
    try {
      const response = await axios.post<Quotation>(
        `${this.baseURL}/quotations`,
        quotationData,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get quotation by ID
   */
  async getQuotation(id: string): Promise<Quotation> {
    try {
      const response = await axios.get<Quotation>(
        `${this.baseURL}/quotations/${id}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Create policy
   */
  async createPolicy(policyData: {
    quotationId: string;
    beneficiaries: any[];
  }): Promise<Policy> {
    try {
      const response = await axios.post<Policy>(
        `${this.baseURL}`,
        policyData,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get policy by ID
   */
  async getPolicy(id: string): Promise<Policy> {
    try {
      const response = await axios.get<Policy>(
        `${this.baseURL}/${id}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get user policies
   */
  async getUserPolicies(): Promise<Policy[]> {
    try {
      const response = await axios.get<Policy[]>(
        `${this.baseURL}/user`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Process payment
   */
  async processPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await axios.post<PaymentResponse>(
        `${this.baseURL}/${paymentRequest.policyId}/payment`,
        paymentRequest,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get policy result (with payment status and document)
   */
  async getPolicyResult(policyId: string): Promise<PolicyResult> {
    try {
      const response = await axios.get<PolicyResult>(
        `${this.baseURL}/${policyId}/result`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
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

export const policyService = new PolicyService();

