import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { usePolicyStore } from '@/store/policy.store';
import { useLookupService } from '@/hooks/useLookupService';
import { PaymentMethod, PaymentRequest } from '@/types/isa';
import { CreditCard, Wallet, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { Loading } from '@/components/ui/loading';

export function PaymentPage() {
  const navigate = useNavigate();
  const { currentPolicy, quotation, processPayment, isLoading, error } = usePolicyStore();
  const { paymentMethods } = useLookupService();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  const handlePayment = async () => {
    if (!selectedMethod || !currentPolicy) {
      alert('يرجى اختيار طريقة الدفع');
      return;
    }

    if (!quotation) {
      alert('لا يوجد عرض سعر');
      return;
    }

    const paymentRequest: PaymentRequest = {
      policyId: currentPolicy.id,
      amount: quotation.premium,
      method: selectedMethod,
    };

    try {
      await processPayment(paymentRequest);
      navigate('/policy-result');
    } catch (err) {
      console.error('Payment error:', err);
    }
  };

  const defaultPaymentMethods: PaymentMethod[] = [
    { id: '1', type: 'balance', name: 'الرصيد' },
    { id: '2', type: 'card', name: 'البطاقة الائتمانية' },
    { id: '3', type: 'agreement', name: 'الدفع التلقائي' },
  ];

  const methods = paymentMethods.length > 0
    ? paymentMethods.map((m) => ({
        id: m.id,
        type: m.code as 'balance' | 'card' | 'agreement',
        name: m.name,
      }))
    : defaultPaymentMethods;

  return (
    <div className="min-h-screen bg-[var(--bg-white)] p-4">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">الدفع</h1>
        </div>

        {quotation && (
          <Card>
            <CardHeader>
              <CardTitle>ملخص الطلب</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">مبلغ التغطية:</span>
                <span className="font-semibold">{quotation.coverage.toLocaleString()} ريال</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">مدة التأمين:</span>
                <span className="font-semibold">{quotation.duration} سنة</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-lg font-semibold">المبلغ المستحق:</span>
                <span className="text-lg font-bold text-[var(--base-sv-color)]">
                  {quotation.premium.toLocaleString()} ريال
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>اختر طريقة الدفع</CardTitle>
            <CardDescription>يرجى اختيار طريقة الدفع المفضلة</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {methods.map((method) => (
              <div
                key={method.id}
                className={`flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-colors ${
                  selectedMethod?.id === method.id
                    ? 'border-[var(--base-sv-color)] bg-[var(--base-sv-color)]/5'
                    : 'hover:bg-accent'
                }`}
                onClick={() => setSelectedMethod(method)}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--base-sv-color)]/10">
                  {method.type === 'balance' ? (
                    <Wallet className="h-5 w-5 text-[var(--base-sv-color)]" />
                  ) : method.type === 'card' ? (
                    <CreditCard className="h-5 w-5 text-[var(--base-sv-color)]" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-[var(--base-sv-color)]" />
                  )}
                </div>
                <div className="flex-1">
                  <Label className="cursor-pointer font-semibold">{method.name}</Label>
                  {method.type === 'agreement' && (
                    <p className="text-sm text-muted-foreground">
                      سيتم خصم المبلغ تلقائياً من حسابك
                    </p>
                  )}
                </div>
                <div
                  className={`h-5 w-5 rounded-full border-2 ${
                    selectedMethod?.id === method.id
                      ? 'border-[var(--base-sv-color)] bg-[var(--base-sv-color)]'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedMethod?.id === method.id && (
                    <div className="h-full w-full rounded-full bg-white scale-50" />
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {error && (
          <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">
            رجوع
          </Button>
          <Button
            type="button"
            onClick={handlePayment}
            disabled={isLoading || !selectedMethod}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loading className="flex-row gap-2" size={16} />
                جاري المعالجة...
              </>
            ) : (
              'تأكيد الدفع'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

