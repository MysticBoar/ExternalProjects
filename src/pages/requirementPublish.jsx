// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { useToast, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Button } from '@/components/ui';
// @ts-ignore;
import { ArrowLeft, Building2, MapPin, DollarSign, CheckCircle } from 'lucide-react';

import { useForm } from 'react-hook-form';
export default function RequirementPublish(props) {
  const {
    toast
  } = useToast();
  const {
    navigateBack,
    navigateTo
  } = props.$w.utils;
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const form = useForm({
    defaultValues: {
      companyName: '',
      contactPerson: '',
      phone: '',
      propertyType: '',
      areaMin: '',
      areaMax: '',
      budgetMin: '',
      budgetMax: '',
      region: '',
      district: '',
      moveInDate: '',
      leaseTerm: '',
      requirements: ''
    }
  });
  const propertyTypes = [{
    value: 'office',
    label: '办公楼'
  }, {
    value: 'commercial',
    label: '商业'
  }, {
    value: 'warehouse',
    label: '仓库'
  }, {
    value: 'factory',
    label: '厂房'
  }, {
    value: 'shared',
    label: '联合办公'
  }];
  const regions = [{
    value: 'nanshan',
    label: '南山区'
  }, {
    value: 'futian',
    label: '福田区'
  }, {
    value: 'baoan',
    label: '宝安区'
  }, {
    value: 'longhua',
    label: '龙华区'
  }, {
    value: 'qianhai',
    label: '前海自贸区'
  }, {
    value: 'guangming',
    label: '光明区'
  }];
  const leaseTerms = [{
    value: '1year',
    label: '1年'
  }, {
    value: '2years',
    label: '2年'
  }, {
    value: '3years',
    label: '3年'
  }, {
    value: '5years',
    label: '5年及以上'
  }, {
    value: 'flexible',
    label: '灵活租期'
  }];
  const onSubmit = data => {
    toast({
      title: '需求发布成功',
      description: '我们将尽快为您匹配合适的物业'
    });
    setTimeout(() => {
      navigateTo({
        pageId: 'propertyHome',
        params: {}
      });
    }, 1500);
  };
  const handleBack = () => {
    navigateBack();
  };
  return <div className="min-h-screen bg-[#FAF8F5]">
      {/* 顶部导航 */}
      <div className="bg-[#1B365D] text-white py-6 px-6">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button onClick={handleBack} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold" style={{
          fontFamily: 'Playfair Display, serif'
        }}>
            发布招商需求
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* 步骤指示器 */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map(s => <React.Fragment key={s}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${s <= step ? 'bg-[#C9A961] text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {s}
                  </div>
                  <span className={`font-medium ${s <= step ? 'text-[#1B365D]' : 'text-gray-400'}`}>
                    {s === 1 ? '基本信息' : s === 2 ? '需求详情' : '其他要求'}
                  </span>
                </div>
                {s < 3 && <div className={`w-16 h-1 ${s < step ? 'bg-[#C9A961]' : 'bg-gray-200'}`} />}
              </React.Fragment>)}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* 步骤1：基本信息 */}
            {step === 1 && <div className="bg-white rounded-xl p-8 shadow-lg">
                <h2 className="text-xl font-bold text-[#1B365D] mb-6 pb-4 border-b border-gray-100">
                  基本信息
                </h2>
                
                <div className="space-y-6">
                  <FormField control={form.control} name="companyName" render={({
                field
              }) => <FormItem>
                        <FormLabel className="text-[#2D3748] font-medium">公司名称 *</FormLabel>
                        <FormControl>
                          <Input placeholder="请输入公司名称" {...field} className="focus:ring-2 focus:ring-[#C9A961]" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  <div className="grid grid-cols-2 gap-6">
                    <FormField control={form.control} name="contactPerson" render={({
                  field
                }) => <FormItem>
                          <FormLabel className="text-[#2D3748] font-medium">联系人 *</FormLabel>
                          <FormControl>
                            <Input placeholder="姓名" {...field} className="focus:ring-2 focus:ring-[#C9A961]" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />

                    <FormField control={form.control} name="phone" render={({
                  field
                }) => <FormItem>
                          <FormLabel className="text-[#2D3748] font-medium">联系电话 *</FormLabel>
                          <FormControl>
                            <Input placeholder="手机号码" {...field} className="focus:ring-2 focus:ring-[#C9A961]" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <Button type="button" onClick={() => {
                if (form.watch('companyName') && form.watch('contactPerson') && form.watch('phone')) {
                  setStep(2);
                } else {
                  toast({
                    title: '请填写完整信息',
                    variant: 'destructive'
                  });
                }
              }} className="bg-[#1B365D] hover:bg-[#2D4A6D] text-white px-8">
                    下一步
                  </Button>
                </div>
              </div>}

            {/* 步骤2：需求详情 */}
            {step === 2 && <div className="bg-white rounded-xl p-8 shadow-lg">
                <h2 className="text-xl font-bold text-[#1B365D] mb-6 pb-4 border-b border-gray-100">
                  需求详情
                </h2>
                
                <div className="space-y-6">
                  <FormField control={form.control} name="propertyType" render={({
                field
              }) => <FormItem>
                        <FormLabel className="text-[#2D3748] font-medium">
                          <Building2 className="w-4 h-4 inline mr-2" />
                          物业类型 *
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="focus:ring-2 focus:ring-[#C9A961]">
                              <SelectValue placeholder="请选择物业类型" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {propertyTypes.map(type => <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>} />

                  <div className="grid grid-cols-2 gap-6">
                    <FormField control={form.control} name="areaMin" render={({
                  field
                }) => <FormItem>
                          <FormLabel className="text-[#2D3748] font-medium">最小面积 (㎡)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="例如：500" {...field} className="focus:ring-2 focus:ring-[#C9A961]" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />

                    <FormField control={form.control} name="areaMax" render={({
                  field
                }) => <FormItem>
                          <FormLabel className="text-[#2D3748] font-medium">最大面积 (㎡)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="例如：2000" {...field} className="focus:ring-2 focus:ring-[#C9A961]" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <FormField control={form.control} name="budgetMin" render={({
                  field
                }) => <FormItem>
                          <FormLabel className="text-[#2D3748] font-medium">
                            <DollarSign className="w-4 h-4 inline mr-2" />
                            最低预算 (元/㎡/天)
                          </FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" placeholder="例如：3" {...field} className="focus:ring-2 focus:ring-[#C9A961]" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />

                    <FormField control={form.control} name="budgetMax" render={({
                  field
                }) => <FormItem>
                          <FormLabel className="text-[#2D3748] font-medium">最高预算 (元/㎡/天)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" placeholder="例如：8" {...field} className="focus:ring-2 focus:ring-[#C9A961]" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                  </div>

                  <FormField control={form.control} name="region" render={({
                field
              }) => <FormItem>
                        <FormLabel className="text-[#2D3748] font-medium">
                          <MapPin className="w-4 h-4 inline mr-2" />
                          期望区域 *
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="focus:ring-2 focus:ring-[#C9A961]">
                              <SelectValue placeholder="请选择期望区域" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {regions.map(region => <SelectItem key={region.value} value={region.value}>
                                {region.label}
                              </SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>} />

                  <div className="grid grid-cols-2 gap-6">
                    <FormField control={form.control} name="moveInDate" render={({
                  field
                }) => <FormItem>
                          <FormLabel className="text-[#2D3748] font-medium">期望入住日期</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} className="focus:ring-2 focus:ring-[#C9A961]" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />

                    <FormField control={form.control} name="leaseTerm" render={({
                  field
                }) => <FormItem>
                          <FormLabel className="text-[#2D3748] font-medium">租期要求</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="focus:ring-2 focus:ring-[#C9A961]">
                                <SelectValue placeholder="请选择租期" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {leaseTerms.map(term => <SelectItem key={term.value} value={term.value}>
                                  {term.label}
                                </SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>} />
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button type="button" onClick={() => setStep(1)} variant="outline" className="border-[#1B365D] text-[#1B365D] hover:bg-[#1B365D] hover:text-white px-8">
                    上一步
                  </Button>
                  <Button type="button" onClick={() => {
                if (form.watch('propertyType') && form.watch('region')) {
                  setStep(3);
                } else {
                  toast({
                    title: '请选择物业类型和期望区域',
                    variant: 'destructive'
                  });
                }
              }} className="bg-[#1B365D] hover:bg-[#2D4A6D] text-white px-8">
                    下一步
                  </Button>
                </div>
              </div>}

            {/* 步骤3：其他要求 */}
            {step === 3 && <div className="bg-white rounded-xl p-8 shadow-lg">
                <h2 className="text-xl font-bold text-[#1B365D] mb-6 pb-4 border-b border-gray-100">
                  其他要求
                </h2>
                
                <div className="space-y-6">
                  <FormField control={form.control} name="requirements" render={({
                field
              }) => <FormItem>
                        <FormLabel className="text-[#2D3748] font-medium">其他需求描述</FormLabel>
                        <FormControl>
                          <textarea placeholder="请描述您的其他需求，例如：交通便利性、停车位、装修要求等..." className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A961] resize-none" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  <div className="bg-[#FAF8F5] rounded-lg p-6">
                    <h3 className="font-semibold text-[#1B365D] mb-4">增值服务</h3>
                    <div className="space-y-3">
                      {['需要装修设计服务', '需要工商注册代办', '需要企业征信服务', '需要物业管理对接'].map((service, idx) => <label key={idx} className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" className="w-5 h-5 accent-[#C9A961]" />
                          <span className="text-[#2D3748]">{service}</span>
                        </label>)}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button type="button" onClick={() => setStep(2)} variant="outline" className="border-[#1B365D] text-[#1B365D] hover:bg-[#1B365D] hover:text-white px-8">
                    上一步
                  </Button>
                  <Button type="submit" className="bg-[#D47A5C] hover:bg-[#C96B4D] text-white px-8 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    提交需求
                  </Button>
                </div>
              </div>}
          </form>
        </Form>
      </div>
    </div>;
}