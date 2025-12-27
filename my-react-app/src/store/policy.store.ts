import { create } from 'zustand';
import { Quotation, Policy, Beneficiary, PaymentRequest, PaymentResponse, PolicyResult } from '@/types/isa';
import { policyService } from '@/services/policy.service';

interface PolicyState {
  // Quotation
  quotation: Quotation | null;
  quotations: Quotation[];
  
  // Policy
  currentPolicy: Policy | null;
  policies: Policy[];
  
  // Beneficiaries
  beneficiaries: Beneficiary[];
  
  // Payment
  paymentResponse: PaymentResponse | null;
  
  // Result
  policyResult: PolicyResult | null;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Actions
  createQuotation: (quotationData: Partial<Quotation>) => Promise<void>;
  getQuotation: (id: string) => Promise<void>;
  setQuotation: (quotation: Quotation) => void;
  
  createPolicy: (quotationId: string, beneficiaries: Beneficiary[]) => Promise<void>;
  getPolicy: (id: string) => Promise<void>;
  getUserPolicies: () => Promise<void>;
  setCurrentPolicy: (policy: Policy) => void;
  
  addBeneficiary: (beneficiary: Beneficiary) => void;
  updateBeneficiary: (id: string, beneficiary: Partial<Beneficiary>) => void;
  removeBeneficiary: (id: string) => void;
  setBeneficiaries: (beneficiaries: Beneficiary[]) => void;
  clearBeneficiaries: () => void;
  
  processPayment: (paymentRequest: PaymentRequest) => Promise<void>;
  getPolicyResult: (policyId: string) => Promise<void>;
  
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  quotation: null,
  quotations: [],
  currentPolicy: null,
  policies: [],
  beneficiaries: [],
  paymentResponse: null,
  policyResult: null,
  isLoading: false,
  error: null,
};

export const usePolicyStore = create<PolicyState>((set, get) => ({
  ...initialState,

  createQuotation: async (quotationData: Partial<Quotation>) => {
    set({ isLoading: true, error: null });
    try {
      const quotation = await policyService.createQuotation(quotationData);
      set({
        quotation,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        error: error.message || 'فشل إنشاء عرض السعر',
        isLoading: false,
      });
      throw error;
    }
  },

  getQuotation: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const quotation = await policyService.getQuotation(id);
      set({
        quotation,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        error: error.message || 'فشل جلب عرض السعر',
        isLoading: false,
      });
      throw error;
    }
  },

  setQuotation: (quotation: Quotation) => {
    set({ quotation });
  },

  createPolicy: async (quotationId: string, beneficiaries: Beneficiary[]) => {
    set({ isLoading: true, error: null });
    try {
      const policy = await policyService.createPolicy({
        quotationId,
        beneficiaries,
      });
      set({
        currentPolicy: policy,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        error: error.message || 'فشل إنشاء الوثيقة',
        isLoading: false,
      });
      throw error;
    }
  },

  getPolicy: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const policy = await policyService.getPolicy(id);
      set({
        currentPolicy: policy,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({ error: error.message || 'فشل جلب الوثيقة', isLoading: false });
      throw error;
    }
  },

  getUserPolicies: async () => {
    set({ isLoading: true, error: null });
    try {
      const policies = await policyService.getUserPolicies();
      set({
        policies,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        error: error.message || 'فشل جلب الوثائق',
        isLoading: false,
      });
      throw error;
    }
  },

  setCurrentPolicy: (policy: Policy) => {
    set({ currentPolicy: policy });
  },

  addBeneficiary: (beneficiary: Beneficiary) => {
    const { beneficiaries } = get();
    set({
      beneficiaries: [...beneficiaries, { ...beneficiary, id: Date.now().toString() }],
    });
  },

  updateBeneficiary: (id: string, updates: Partial<Beneficiary>) => {
    const { beneficiaries } = get();
    set({
      beneficiaries: beneficiaries.map((b) =>
        b.id === id ? { ...b, ...updates } : b
      ),
    });
  },

  removeBeneficiary: (id: string) => {
    const { beneficiaries } = get();
    set({
      beneficiaries: beneficiaries.filter((b) => b.id !== id),
    });
  },

  setBeneficiaries: (beneficiaries: Beneficiary[]) => {
    set({ beneficiaries });
  },

  clearBeneficiaries: () => {
    set({ beneficiaries: [] });
  },

  processPayment: async (paymentRequest: PaymentRequest) => {
    set({ isLoading: true, error: null });
    try {
      const paymentResponse = await policyService.processPayment(paymentRequest);
      set({
        paymentResponse,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        error: error.message || 'فشل معالجة الدفع',
        isLoading: false,
      });
      throw error;
    }
  },

  getPolicyResult: async (policyId: string) => {
    set({ isLoading: true, error: null });
    try {
      const policyResult = await policyService.getPolicyResult(policyId);
      set({
        policyResult,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        error: error.message || 'فشل جلب نتيجة الوثيقة',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set(initialState);
  },
}));

