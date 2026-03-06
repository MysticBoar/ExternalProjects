// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea, Card, CardContent, CardDescription, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger, useToast } from '@/components/ui';
// @ts-ignore;
import { Send, ArrowRight } from 'lucide-react';

import { useForm } from 'react-hook-form';
import { TabBar } from '@/components/TabBar';
export default function SupplyPublish({
  $w
}) {
  const {
    toast
  } = useToast();
  const [activeTab, setActiveTab] = useState('supply');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    defaultValues: {
      type: '',
      title: '',
      category: '',
      targetCustomer: '',
      supplierRequirement: '',
      priceRange: '',
      region: '',
      description: '',
      contactName: '',
      contactPhone: '',
      company: ''
    }
  });
  const onSubmit = async data => {
    setIsSubmitting(true);
    try {
      // 调用数据源创建记录
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'biz_supply_demand',
        methodName: 'wedaCreateV2',
        params: {
          data: {
            type: activeTab === 'supply' ? '供应' : '需求',
            title: data.title,
            category: data.category,
            targetCustomer: data.targetCustomer,
            supplierRequirement: data.supplierRequirement,
            priceRange: data.priceRange,
            region: data.region,
            description: data.description,
            contactName: data.contactName,
            contactPhone: data.contactPhone,
            company: data.company,
            creditScore: 80,
            // 初始信用分
            rating: 0,
            reviews: 0
          }
        }
      });
      toast({
        title: '提交成功',
        description: `${activeTab === 'supply' ? '供应' : '需求'}信息已发布，正在为您匹配...`,
        status: 'success'
      });

      // 跳转到匹配结果页
      setTimeout(() => {
        $w.utils.navigateTo({
          pageId: 'matchResults',
          params: {
            type: activeTab
          }
        });
      }, 1000);
    } catch (error) {
      console.error('提交失败:', error);
      toast({
        title: '提交失败',
        description: error.message || '网络错误，请稍后重试',
        status: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="min-h-screen bg-[#F5F5F5] font-sans pb-24">
      {/* 顶部导航 */}
      <div className="bg-[#0D47A1] text-white py-6 px-4 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold" style={{
          fontFamily: 'Space Mono, monospace'
        }}>供需广场</h1>
          <p className="text-blue-100 text-sm mt-1">发布信息，智能匹配</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="shadow-lg border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl" style={{
            fontFamily: 'Space Mono, monospace'
          }}>发布信息</CardTitle>
            <CardDescription>填写详细信息，系统将为您智能匹配合适的商业伙伴</CardDescription>
          </CardHeader>
          <CardContent>
            {/* 类型选择 */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                <TabsTrigger value="supply" className="data-[state=active]:bg-[#0D47A1] data-[state=active]:text-white">
                  我要供应
                </TabsTrigger>
                <TabsTrigger value="demand" className="data-[state=active]:bg-[#0D47A1] data-[state=active]:text-white">
                  我需要
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* 基本信息 */}
                <div className="border-l-4 border-[#FF6F00] pl-4 py-2">
                  <h3 className="text-lg font-semibold text-gray-900" style={{
                  fontFamily: 'Space Mono, monospace'
                }}>基本信息</h3>
                </div>

                <FormField control={form.control} name="title" render={({
                field
              }) => <FormItem>
                      <FormLabel className="text-gray-700 font-medium">{activeTab === 'supply' ? '产品/服务名称' : '需求标题'}</FormLabel>
                      <FormControl>
                        <Input placeholder={activeTab === 'supply' ? '例如：企业IT运维服务' : '例如：寻找IT运维服务商'} className="h-12 border-gray-300 focus:border-[#0D47A1]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="category" render={({
                  field
                }) => <FormItem>
                        <FormLabel className="text-gray-700 font-medium">类别</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 border-gray-300">
                              <SelectValue placeholder="选择类别" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="it">IT服务</SelectItem>
                            <SelectItem value="office">办公用品</SelectItem>
                            <SelectItem value="marketing">营销推广</SelectItem>
                            <SelectItem value="hr">人力资源</SelectItem>
                            <SelectItem value="finance">财务服务</SelectItem>
                            <SelectItem value="logistics">物流配送</SelectItem>
                            <SelectItem value="other">其他</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>} />

                  <FormField control={form.control} name="priceRange" render={({
                  field
                }) => <FormItem>
                        <FormLabel className="text-gray-700 font-medium">预算/报价范围</FormLabel>
                        <FormControl>
                          <Input placeholder="例如：5000-10000元/月" className="h-12 border-gray-300 focus:border-[#0D47A1]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />
                </div>

                {/* 目标信息 */}
                <div className="border-l-4 border-[#00BCD4] pl-4 py-2 mt-8">
                  <h3 className="text-lg font-semibold text-gray-900" style={{
                  fontFamily: 'Space Mono, monospace'
                }}>目标信息</h3>
                </div>

                <FormField control={form.control} name="targetCustomer" render={({
                field
              }) => <FormItem>
                      <FormLabel className="text-gray-700 font-medium">目标客户群</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 border-gray-300">
                            <SelectValue placeholder="选择目标客户类型" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="startup">初创企业</SelectItem>
                          <SelectItem value="sme">中小企业</SelectItem>
                          <SelectItem value="large">大型企业</SelectItem>
                          <SelectItem value="government">政府机构</SelectItem>
                          <SelectItem value="individual">个人</SelectItem>
                          <SelectItem value="all">不限</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="supplierRequirement" render={({
                field
              }) => <FormItem>
                      <FormLabel className="text-gray-700 font-medium">{activeTab === 'supply' ? '对采购方要求' : '对供应商要求'}</FormLabel>
                      <FormControl>
                        <Textarea placeholder="例如：要求供应商具备相关资质证书，服务响应时间不超过2小时..." className="min-h-[120px] border-gray-300 focus:border-[#0D47A1]" {...field} />
                      </FormControl>
                      <FormDescription className="text-sm text-gray-500">
                        请详细描述您的需求，以便系统更精准地匹配
                      </FormDescription>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="region" render={({
                field
              }) => <FormItem>
                      <FormLabel className="text-gray-700 font-medium">服务/需求区域</FormLabel>
                      <FormControl>
                        <Input placeholder="例如：北京朝阳区、深圳南山区" className="h-12 border-gray-300 focus:border-[#0D47A1]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                {/* 详细描述 */}
                <div className="border-l-4 border-[#0D47A1] pl-4 py-2 mt-8">
                  <h3 className="text-lg font-semibold text-gray-900" style={{
                  fontFamily: 'Space Mono, monospace'
                }}>详细描述</h3>
                </div>

                <FormField control={form.control} name="description" render={({
                field
              }) => <FormItem>
                      <FormLabel className="text-gray-700 font-medium">详细信息描述</FormLabel>
                      <FormControl>
                        <Textarea placeholder="请详细描述产品/服务的特点、优势，或具体需求内容..." className="min-h-[150px] border-gray-300 focus:border-[#0D47A1]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                {/* 联系信息 */}
                <div className="border-l-4 border-[#FF6F00] pl-4 py-2 mt-8">
                  <h3 className="text-lg font-semibold text-gray-900" style={{
                  fontFamily: 'Space Mono, monospace'
                }}>联系信息</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="contactName" render={({
                  field
                }) => <FormItem>
                        <FormLabel className="text-gray-700 font-medium">联系人姓名</FormLabel>
                        <FormControl>
                          <Input placeholder="您的姓名" className="h-12 border-gray-300 focus:border-[#0D47A1]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  <FormField control={form.control} name="contactPhone" render={({
                  field
                }) => <FormItem>
                        <FormLabel className="text-gray-700 font-medium">联系电话</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="您的联系电话" className="h-12 border-gray-300 focus:border-[#0D47A1]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />
                </div>

                <FormField control={form.control} name="company" render={({
                field
              }) => <FormItem>
                      <FormLabel className="text-gray-700 font-medium">公司名称</FormLabel>
                      <FormControl>
                        <Input placeholder="您的公司名称" className="h-12 border-gray-300 focus:border-[#0D47A1]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                {/* 提交按钮 */}
                <div className="pt-6">
                  <Button type="submit" className="w-full h-14 text-lg font-semibold bg-[#0D47A1] hover:bg-[#0a3a8e] text-white" disabled={isSubmitting}>
                    {isSubmitting ? <span className="flex items-center">
                        <span className="animate-spin mr-2">⟳</span>
                        提交中...
                      </span> : <span className="flex items-center justify-center">
                        提交信息
                        <ArrowRight className="ml-2" size={20} />
                      </span>}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* 温馨提示 */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">💡</span>
              <div>
                <h4 className="font-semibold text-[#0D47A1] mb-2">温馨提示</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 请填写真实、准确的信息，以便系统为您精准匹配</li>
                  <li>• 系统将在3公里范围内及同楼宇内为您智能推荐匹配结果</li>
                  <li>• 所有交易均由平台资金托管，保障您的权益</li>
                  <li>• 如有任何问题，请联系客服400-888-8888</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 底部导航 */}
      <TabBar activePage="publish" onPageChange={pageId => $w.utils.navigateTo({
      pageId
    })} />
    </div>;
}