// Insurance Service Application Types

export interface User {
  id: string;
  userId?: string;
  loginId?: string;
  hashLoginId?: string;
  name?: string;
  avatar?: string;
  gender?: string;
  birthday?: string;
  nationality?: string;
  contactInfo?: ContactInfo;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
}

export interface AuthResponse {
  authCode: string;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
}

export interface Quotation {
  id: string;
  policyType: string;
  coverage: number;
  premium: number;
  duration: number;
  startDate: string;
  endDate: string;
  benefits: string[];
  terms: string[];
}

export interface Beneficiary {
  id?: string;
  name: string;
  relation: string;
  idNumber: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  percentage: number;
}

export interface Policy {
  id: string;
  policyNumber: string;
  quotation: Quotation;
  beneficiaries: Beneficiary[];
  insured: User;
  status: 'draft' | 'pending' | 'active' | 'expired' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  id: string;
  type: 'balance' | 'card' | 'agreement';
  name: string;
  details?: string;
}

export interface PaymentRequest {
  policyId: string;
  amount: number;
  method: PaymentMethod;
  agreementCode?: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  policyId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  message?: string;
}

export interface PolicyResult {
  policy: Policy;
  payment: PaymentResponse;
  documentUrl?: string;
}

export interface LookupItem {
  id: string;
  code: string;
  name: string;
  nameEn?: string;
  description?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Alipay Mini App Types
export interface AlipayAuthScope {
  auth_base: string;
  auth_user: string;
  USER_ID: string;
  USER_LOGIN_ID: string;
  HASH_LOGIN_ID: string;
  USER_NAME: string;
  USER_AVATAR: string;
  USER_GENDER: string;
  USER_BIRTHDAY: string;
  USER_NATIONALITY: string;
  USER_CONTACTINFO: string;
  NOTIFICATION_INBOX: string;
  AGREEMENT_PAY: string;
}

export interface GetAuthCodeOptions {
  scopes: Array<keyof AlipayAuthScope>;
  success?: (res: { authCode: string; authSuccessScopes?: string[] }) => void;
  fail?: (res: { authErrorScopes?: Record<string, string> }) => void;
  complete?: () => void;
}

// Declare global Alipay Mini App API
declare global {
  interface Window {
    my?: {
      getAuthCode: (options: GetAuthCodeOptions) => void;
      alert: (options: { content: string }) => void;
    };
  }
}

