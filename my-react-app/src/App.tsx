import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QuotationPage } from './pages/quotation';
import { BeneficiariesPage } from './pages/beneficiaries';
import { PaymentPage } from './pages/payment';
import { PolicyResultPage } from './pages/policy-result';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/quotation" element={<QuotationPage />} />
          <Route path="/beneficiaries" element={<BeneficiariesPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/policy-result" element={<PolicyResultPage />} />
          <Route path="/" element={<Navigate to="/quotation" replace />} />
          <Route path="*" element={<Navigate to="/quotation" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

