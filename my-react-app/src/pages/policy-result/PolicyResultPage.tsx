import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePolicyStore } from '@/store/policy.store';
import { CheckCircle, Download, Home, FileText, AlertCircle } from 'lucide-react';
import { Loading } from '@/components/ui/loading';

export function PolicyResultPage() {
  const navigate = useNavigate();
  const { currentPolicy, paymentResponse, policyResult, getPolicyResult, isLoading } =
    usePolicyStore();

  useEffect(() => {
    if (currentPolicy && !policyResult) {
      getPolicyResult(currentPolicy.id).catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPolicy]);

  const handleDownload = () => {
    if (policyResult?.documentUrl) {
      window.open(policyResult.documentUrl, '_blank');
    } else {
      alert('الوثيقة غير متاحة حالياً');
    }
  };

  const handleGoHome = () => {
    navigate('/quotation');
  };

  if (isLoading && !policyResult) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading text="جاري تحميل النتيجة..." />
      </div>
    );
  }

  const isSuccess = paymentResponse?.success || paymentResponse?.status === 'completed';

  return (
    <div className="min-h-screen bg-[var(--bg-white)] p-4">
      <div className="mx-auto max-w-2xl space-y-6">
        <Card className="border-2">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-success)]/10">
              {isSuccess ? (
                <CheckCircle className="h-10 w-10 text-[var(--color-success)]" />
              ) : (
                <AlertCircle className="h-10 w-10 text-destructive" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {isSuccess ? 'تم إصدار الوثيقة بنجاح' : 'فشل إصدار الوثيقة'}
            </CardTitle>
            <CardDescription>
              {isSuccess
                ? 'تم إصدار وثيقة التأمين بنجاح ويمكنك تحميلها الآن'
                : paymentResponse?.message || 'حدث خطأ أثناء إصدار الوثيقة'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentPolicy && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 rounded-lg bg-muted p-4">
                  <FileText className="h-5 w-5 text-[var(--base-sv-color)]" />
                  <div className="flex-1">
                    <div className="font-semibold">رقم الوثيقة</div>
                    <div className="text-sm text-muted-foreground">{currentPolicy.policyNumber}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border p-4">
                    <div className="text-sm text-muted-foreground">مبلغ التغطية</div>
                    <div className="text-lg font-semibold">
                      {currentPolicy.quotation.coverage.toLocaleString()} ريال
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-sm text-muted-foreground">القسط</div>
                    <div className="text-lg font-semibold">
                      {currentPolicy.quotation.premium.toLocaleString()} ريال
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="text-sm text-muted-foreground mb-2">تاريخ الإصدار</div>
                  <div className="font-semibold">
                    {new Date(currentPolicy.createdAt).toLocaleDateString('ar-SA')}
                  </div>
                </div>
              </div>
            )}

            {paymentResponse && (
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground mb-2">رقم المعاملة</div>
                <div className="font-semibold">{paymentResponse.transactionId || 'غير متوفر'}</div>
              </div>
            )}

            {isSuccess && (
              <div className="space-y-4">
                <Button onClick={handleDownload} className="w-full" size="lg">
                  <Download className="ml-2 h-4 w-4" />
                  تحميل الوثيقة
                </Button>
                <Button onClick={handleGoHome} variant="outline" className="w-full">
                  <Home className="ml-2 h-4 w-4" />
                  إنشاء وثيقة جديدة
                </Button>
              </div>
            )}

            {!isSuccess && (
              <Button onClick={handleGoHome} className="w-full" size="lg">
                المحاولة مرة أخرى
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

