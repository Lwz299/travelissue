import { useState, useEffect } from 'react';
import { lookupService } from '@/services/lookup.service';
import { LookupItem } from '@/types/isa';

export function useLookupService() {
  const [policyTypes, setPolicyTypes] = useState<LookupItem[]>([]);
  const [coverageAmounts, setCoverageAmounts] = useState<LookupItem[]>([]);
  const [durations, setDurations] = useState<LookupItem[]>([]);
  const [beneficiaryRelations, setBeneficiaryRelations] = useState<LookupItem[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<LookupItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLookups = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [types, amounts, dur, relations, methods] = await Promise.all([
          lookupService.getPolicyTypes(),
          lookupService.getCoverageAmounts(),
          lookupService.getPolicyDurations(),
          lookupService.getBeneficiaryRelations(),
          lookupService.getPaymentMethods(),
        ]);

        setPolicyTypes(types);
        setCoverageAmounts(amounts);
        setDurations(dur);
        setBeneficiaryRelations(relations);
        setPaymentMethods(methods);
      } catch (err: any) {
        setError(err.message);
        // Set default values for development
        setPolicyTypes([
          { id: '1', code: 'life', name: 'تأمين على الحياة' },
          { id: '2', code: 'health', name: 'تأمين صحي' },
          { id: '3', code: 'accident', name: 'تأمين ضد الحوادث' },
        ]);
        setDurations([
          { id: '1', code: '1', name: 'سنة واحدة' },
          { id: '2', code: '2', name: 'سنتان' },
          { id: '3', code: '3', name: '3 سنوات' },
          { id: '5', code: '5', name: '5 سنوات' },
        ]);
        setBeneficiaryRelations([
          { id: '1', code: 'spouse', name: 'زوج/زوجة' },
          { id: '2', code: 'child', name: 'ابن/ابنة' },
          { id: '3', code: 'parent', name: 'والد/والدة' },
          { id: '4', code: 'sibling', name: 'أخ/أخت' },
        ]);
        setPaymentMethods([
          { id: '1', code: 'balance', name: 'الرصيد' },
          { id: '2', code: 'card', name: 'البطاقة' },
          { id: '3', code: 'agreement', name: 'الدفع التلقائي' },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadLookups();
  }, []);

  return {
    policyTypes,
    coverageAmounts,
    durations,
    beneficiaryRelations,
    paymentMethods,
    isLoading,
    error,
  };
}

