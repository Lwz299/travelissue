import { useState } from 'react';
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
import { Beneficiary } from '@/types/isa';
import { Plus, Trash2, ArrowLeft, ArrowRight, Users } from 'lucide-react';

const beneficiarySchema = z.object({
  name: z.string().min(2, 'يجب أن يكون الاسم على الأقل حرفين'),
  relation: z.string().min(1, 'يرجى اختيار صلة القرابة'),
  idNumber: z.string().min(10, 'رقم الهوية غير صحيح'),
  dateOfBirth: z.string().min(1, 'يرجى إدخال تاريخ الميلاد'),
  gender: z.enum(['male', 'female'], { required_error: 'يرجى اختيار الجنس' }),
  percentage: z.number().min(1).max(100),
});

type BeneficiaryFormData = z.infer<typeof beneficiarySchema>;

export function BeneficiariesPage() {
  const navigate = useNavigate();
  const { beneficiaries, addBeneficiary, removeBeneficiary, quotation, createPolicy, isLoading } =
    usePolicyStore();
  const { beneficiaryRelations } = useLookupService();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<BeneficiaryFormData>({
    resolver: zodResolver(beneficiarySchema),
    defaultValues: {
      percentage: 100,
    },
  });

  const totalPercentage = beneficiaries.reduce((sum, b) => sum + b.percentage, 0);
  const percentage = watch('percentage') || 0;

  const onAddBeneficiary = (data: BeneficiaryFormData) => {
    if (totalPercentage + data.percentage > 100) {
      alert('إجمالي النسب المئوية لا يمكن أن يتجاوز 100%');
      return;
    }

    const beneficiary: Beneficiary = {
      ...data,
      id: Date.now().toString(),
    };
    addBeneficiary(beneficiary);
    reset();
  };

  const handleContinue = async () => {
    if (beneficiaries.length === 0) {
      alert('يرجى إضافة مستفيد واحد على الأقل');
      return;
    }

    if (totalPercentage !== 100) {
      alert('إجمالي النسب المئوية يجب أن يكون 100%');
      return;
    }

    if (!quotation) {
      alert('لا يوجد عرض سعر، يرجى الرجوع إلى صفحة عرض السعر');
      navigate('/quotation');
      return;
    }

    try {
      await createPolicy(quotation.id, beneficiaries);
      navigate('/payment');
    } catch (err) {
      console.error('Error creating policy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-white)] p-4">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">المستفيدون</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              إضافة مستفيد
            </CardTitle>
            <CardDescription>أضف بيانات المستفيدين من الوثيقة</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onAddBeneficiary)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم الكامل *</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="relation">صلة القرابة *</Label>
                  <Select
                    id="relation"
                    {...register('relation')}
                    className={errors.relation ? 'border-destructive' : ''}
                  >
                    <option value="">اختر صلة القرابة</option>
                    {beneficiaryRelations.map((rel) => (
                      <option key={rel.id} value={rel.code}>
                        {rel.name}
                      </option>
                    ))}
                  </Select>
                  {errors.relation && (
                    <p className="text-sm text-destructive">{errors.relation.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="idNumber">رقم الهوية *</Label>
                  <Input
                    id="idNumber"
                    {...register('idNumber')}
                    className={errors.idNumber ? 'border-destructive' : ''}
                  />
                  {errors.idNumber && (
                    <p className="text-sm text-destructive">{errors.idNumber.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">تاريخ الميلاد *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    {...register('dateOfBirth')}
                    className={errors.dateOfBirth ? 'border-destructive' : ''}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">الجنس *</Label>
                  <Select
                    id="gender"
                    {...register('gender')}
                    className={errors.gender ? 'border-destructive' : ''}
                  >
                    <option value="">اختر الجنس</option>
                    <option value="male">ذكر</option>
                    <option value="female">أنثى</option>
                  </Select>
                  {errors.gender && (
                    <p className="text-sm text-destructive">{errors.gender.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="percentage">النسبة المئوية (%) *</Label>
                  <Input
                    id="percentage"
                    type="number"
                    min="1"
                    max="100"
                    {...register('percentage', { valueAsNumber: true })}
                    className={errors.percentage ? 'border-destructive' : ''}
                  />
                  {errors.percentage && (
                    <p className="text-sm text-destructive">{errors.percentage.message}</p>
                  )}
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                إجمالي النسب المئوية: {totalPercentage + percentage}%
                {totalPercentage + percentage !== 100 && (
                  <span className="text-destructive"> (يجب أن يكون 100%)</span>
                )}
              </div>

              <Button type="submit" variant="outline" className="w-full">
                <Plus className="ml-2 h-4 w-4" />
                إضافة مستفيد
              </Button>
            </form>
          </CardContent>
        </Card>

        {beneficiaries.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>قائمة المستفيدين ({beneficiaries.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {beneficiaries.map((beneficiary) => (
                <div
                  key={beneficiary.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex-1">
                    <div className="font-semibold">{beneficiary.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {beneficiaryRelations.find((r) => r.code === beneficiary.relation)?.name} -{' '}
                      {beneficiary.percentage}%
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBeneficiary(beneficiary.id!)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">
            رجوع
          </Button>
          <Button
            type="button"
            onClick={handleContinue}
            disabled={isLoading || beneficiaries.length === 0 || totalPercentage !== 100}
            className="flex-1"
          >
            {isLoading ? 'جاري الحفظ...' : 'التالي'}
            <ArrowLeft className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

