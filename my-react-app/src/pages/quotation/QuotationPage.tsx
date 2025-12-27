import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePolicyStore } from '@/store/policy.store';
import { useLookupService } from '@/hooks/useLookupService';
import { Loading } from '@/components/ui/loading';
import { ArrowLeft, ArrowRight, Calculator } from 'lucide-react';

const quotationSchema = z.object({
  policyType: z.string().min(1, 'يرجى اختيار نوع التأمين'),
  coverage: z.number().min(1000, 'يجب أن يكون المبلغ على الأقل 1000'),
  duration: z.number().min(1, 'يجب أن تكون المدة على الأقل سنة واحدة'),
});

type QuotationFormData = z.infer<typeof quotationSchema>;

export function QuotationPage() {
  const navigate = useNavigate();
  const { createQuotation, quotation, isLoading, error } = usePolicyStore();
  const { policyTypes, coverageAmounts, durations, isLoading: lookupLoading } = useLookupService();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<QuotationFormData>({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      policyType: '',
      coverage: 100000,
      duration: 1,
    },
  });

  const coverage = watch('coverage');
  const duration = watch('duration');

  // Calculate premium (simplified calculation)
  const calculatePremium = (coverage: number, duration: number) => {
    return Math.round((coverage * 0.01 * duration) / 12);
  };

  const premium = coverage && duration ? calculatePremium(coverage, duration) : 0;

  const onSubmit = async (data: QuotationFormData) => {
    try {
      await createQuotation({
        policyType: data.policyType,
        coverage: data.coverage,
        duration: data.duration,
        premium,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + data.duration * 365 * 24 * 60 * 60 * 1000).toISOString(),
        benefits: ['تغطية طبية شاملة', 'تغطية الوفاة', 'تغطية الإعاقة'],
        terms: ['شروط عامة', 'شروط خاصة'],
      });
      navigate('/beneficiaries');
    } catch (err) {
      console.error('Error creating quotation:', err);
    }
  };

  if (lookupLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading text="جاري تحميل البيانات..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-white)] p-4">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">عرض سعر التأمين</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                بيانات التأمين
              </CardTitle>
              <CardDescription>يرجى إدخال بيانات التأمين المطلوبة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="policyType">نوع التأمين *</Label>
                <Select
                  id="policyType"
                  {...register('policyType')}
                  className={errors.policyType ? 'border-destructive' : ''}
                >
                  <option value="">اختر نوع التأمين</option>
                  {policyTypes.map((type) => (
                    <option key={type.id} value={type.code}>
                      {type.name}
                    </option>
                  ))}
                </Select>
                {errors.policyType && (
                  <p className="text-sm text-destructive">{errors.policyType.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverage">مبلغ التغطية *</Label>
                <Input
                  id="coverage"
                  type="number"
                  {...register('coverage', { valueAsNumber: true })}
                  className={errors.coverage ? 'border-destructive' : ''}
                />
                {errors.coverage && (
                  <p className="text-sm text-destructive">{errors.coverage.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">مدة التأمين (بالسنوات) *</Label>
                <Select
                  id="duration"
                  {...register('duration', { valueAsNumber: true })}
                  className={errors.duration ? 'border-destructive' : ''}
                >
                  {durations.map((dur) => (
                    <option key={dur.id} value={dur.code}>
                      {dur.name}
                    </option>
                  ))}
                </Select>
                {errors.duration && (
                  <p className="text-sm text-destructive">{errors.duration.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ملخص العرض</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">مبلغ التغطية:</span>
                <span className="font-semibold">{coverage?.toLocaleString()} ريال</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">مدة التأمين:</span>
                <span className="font-semibold">{duration} سنة</span>
              </div>
              <div className="flex justify-between border-t pt-4">
                <span className="text-lg font-semibold">القسط الشهري:</span>
                <span className="text-lg font-bold text-[var(--base-sv-color)]">
                  {premium?.toLocaleString()} ريال
                </span>
              </div>
            </CardContent>
          </Card>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">
              إلغاء
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'جاري الحفظ...' : 'التالي'}
              <ArrowLeft className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

