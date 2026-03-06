// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, useToast } from '@/components/ui';
// @ts-ignore;
import { CheckCircle, Clock, XCircle, FileText, Building, AlertCircle, Search } from 'lucide-react';

import { CreditScoreDisplay } from '@/components/CreditScoreDisplay';
import { TabBar } from '@/components/TabBar';
export default function CompanyCertification({
  $w
}) {
  const {
    toast
  } = useToast();
  const [certificationStatus, setCertificationStatus] = useState('pending'); // pending, submitted, approved, rejected
  const [creditScore, setCreditScore] = useState(80); // 初始80分
  const [companyInfo, setCompanyInfo] = useState({
    companyName: '',
    licenseNumber: '',
    creditCode: '',
    legalPerson: '',
    registeredCapital: '',
    businessScope: '',
    contactPhone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [activePage, setActivePage] = useState('creditProfile');

  // 从数据源加载认证数据
  useEffect(() => {
    const loadCertificationData = async () => {
      try {
        const result = await $w.cloud.callDataSource({
          dataSourceName: 'credit_company',
          methodName: 'wedaGetRecordsV2',
          params: {
            filter: {
              where: {
                $and: []
              }
            },
            select: {
              $master: true
            },
            orderBy: [{
              createdAt: 'desc'
            }],
            pageSize: 1,
            pageNumber: 1
          }
        });
        if (result && result.records && result.records.length > 0) {
          const record = result.records[0];
          setCertificationStatus(record.certificationStatus || 'pending');
          setCreditScore(record.creditScore || record.initialScore || 80);
          if (record.companyName || record.licenseNumber || record.creditCode) {
            setCompanyInfo({
              companyName: record.companyName || '',
              licenseNumber: record.licenseNumber || '',
              creditCode: record.creditCode || '',
              legalPerson: record.legalPerson || '',
              registeredCapital: record.registeredCapital || '',
              businessScope: record.businessScope || '',
              contactPhone: record.contactPhone || ''
            });
          }
        }
      } catch (error) {
        console.error('加载认证数据失败:', error);
        toast({
          title: '加载失败',
          description: error.message || '无法加载认证数据',
          status: 'error'
        });
      }
    };
    loadCertificationData();
  }, []);

  // 自动验证企业信息（对接天眼查API）
  const handleAutoVerify = async () => {
    if (!companyInfo.creditCode) {
      toast({
        title: '请输入信用代码',
        description: '请先输入企业统一社会信用代码',
        status: 'warning'
      });
      return;
    }
    setIsVerifying(true);
    try {
      // 模拟调用天眼查API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 实际项目中应该调用天眼查API
      // const result = await $w.cloud.callDataSource({
      //   dataSourceName: 'tianyancha_api',
      //   methodName: 'verifyCompany',
      //   params: {
      //     creditCode: companyInfo.creditCode
      //   }
      // });

      // 模拟验证结果
      setCompanyInfo(prev => ({
        ...prev,
        companyName: '智联科技有限公司',
        legalPerson: '张三',
        registeredCapital: '1000万元人民币',
        businessScope: '软件开发、技术服务、系统集成'
      }));
      toast({
        title: '验证成功',
        description: '已自动获取企业信息，请核对后确认',
        status: 'success'
      });
    } catch (error) {
      console.error('验证失败:', error);
      toast({
        title: '验证失败',
        description: '无法查找到该信用代码对应的企业信息，请手动填写',
        status: 'error'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // 提交认证
  const handleSubmit = async e => {
    e.preventDefault();
    if (!companyInfo.companyName || !companyInfo.creditCode || !companyInfo.licenseNumber) {
      toast({
        title: '请填写完整信息',
        description: '请填写企业名称、信用代码和营业执照号',
        status: 'warning'
      });
      return;
    }
    setIsSubmitting(true);
    try {
      // 调用数据源创建或更新记录
      await $w.cloud.callDataSource({
        dataSourceName: 'credit_company',
        methodName: 'wedaCreateV2',
        params: {
          data: {
            companyName: companyInfo.companyName,
            licenseNumber: companyInfo.licenseNumber,
            creditCode: companyInfo.creditCode,
            legalPerson: companyInfo.legalPerson,
            registeredCapital: companyInfo.registeredCapital,
            businessScope: companyInfo.businessScope,
            contactPhone: companyInfo.contactPhone,
            certificationStatus: 'submitted',
            creditScore: 80,
            initialScore: 80,
            reviews: []
          }
        }
      });
      //       creditCode: companyInfo.creditCode,
      //       legalPerson: companyInfo.legalPerson,
      //       registeredCapital: companyInfo.registeredCapital,
      //       businessScope: companyInfo.businessScope,
      //       contactPhone: companyInfo.contactPhone,
      //       status: 'submitted',
      //       creditScore: 80,
      //       createdAt: new Date().toISOString()
      //     }
      //   }
      // });

      setCertificationStatus('submitted');
      toast({
        title: '提交成功',
        description: '认证信息已提交，平台将自动审核企业资质',
        status: 'success'
      });
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

  // 获取认证状态信息
  const getStatusInfo = status => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="h-5 w-5" />,
          text: '未认证',
          color: 'text-gray-500',
          bgColor: 'bg-gray-100',
          borderColor: 'border-gray-200'
        };
      case 'submitted':
        return {
          icon: <Clock className="h-5 w-5" />,
          text: '审核中',
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200'
        };
      case 'approved':
        return {
          icon: <CheckCircle className="h-5 w-5" />,
          text: '已认证',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'rejected':
        return {
          icon: <XCircle className="h-5 w-5" />,
          text: '审核未通过',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      default:
        return {
          icon: <Clock className="h-5 w-5" />,
          text: '未认证',
          color: 'text-gray-500',
          bgColor: 'bg-gray-100',
          borderColor: 'border-gray-200'
        };
    }
  };
  const statusInfo = getStatusInfo(certificationStatus);
  return <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部导航 */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6">
        <div className="flex items-center gap-3 mb-2">
          <Building className="h-6 w-6" />
          <h1 className="text-xl font-bold">企业资质认证</h1>
        </div>
        <p className="text-blue-100 text-sm">
          完成认证后，您的企业信息将被公开，信用分提升至80分
        </p>
      </div>

      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        {/* 信用分展示 */}
        <CreditScoreDisplay score={creditScore} type="company" initialScore={80} />

        {/* 认证状态卡片 */}
        <Card className={`border-t-4 ${statusInfo.borderColor}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">认证状态</CardTitle>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusInfo.bgColor} ${statusInfo.color}`}>
                {statusInfo.icon}
                <span className="text-sm font-medium">{statusInfo.text}</span>
              </div>
            </div>
            <CardDescription>
              {certificationStatus === 'pending' && '请填写企业营业执照信息和信用代码，完成资质认证'}
              {certificationStatus === 'submitted' && '您的企业信息正在审核中，系统将自动验证企业资质'}
              {certificationStatus === 'approved' && '恭喜！您的企业已通过资质认证，可以在平台发布供求信息'}
              {certificationStatus === 'rejected' && '认证未通过，请检查信息后重新提交'}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* 认证表单 */}
        {certificationStatus !== 'approved' && <form onSubmit={handleSubmit} className="space-y-4">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-lg">企业基本信息</CardTitle>
                <CardDescription>请填写或自动获取企业信息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 信用代码和自动验证 */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    统一社会信用代码 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input type="text" value={companyInfo.creditCode} onChange={e => setCompanyInfo(prev => ({
                  ...prev,
                  creditCode: e.target.value
                }))} placeholder="请输入18位统一社会信用代码" className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled={certificationStatus === 'submitted' || certificationStatus === 'rejected'} maxLength={18} />
                    <Button type="button" onClick={handleAutoVerify} disabled={isVerifying || certificationStatus === 'submitted' || certificationStatus === 'rejected'} className="bg-blue-600 hover:bg-blue-700 text-white">
                      {isVerifying ? <span>验证中...</span> : <span className="flex items-center gap-2">
                          <Search className="h-4 w-4" />
                          自动验证
                        </span>}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">输入信用代码后可自动获取企业信息</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    企业名称 <span className="text-red-500">*</span>
                  </label>
                  <input type="text" value={companyInfo.companyName} onChange={e => setCompanyInfo(prev => ({
                ...prev,
                companyName: e.target.value
              }))} placeholder="请输入企业完整名称" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled={certificationStatus === 'submitted' || certificationStatus === 'rejected'} />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    营业执照号 <span className="text-red-500">*</span>
                  </label>
                  <input type="text" value={companyInfo.licenseNumber} onChange={e => setCompanyInfo(prev => ({
                ...prev,
                licenseNumber: e.target.value
              }))} placeholder="请输入营业执照注册号" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled={certificationStatus === 'submitted' || certificationStatus === 'rejected'} />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    法定代表人
                  </label>
                  <input type="text" value={companyInfo.legalPerson} onChange={e => setCompanyInfo(prev => ({
                ...prev,
                legalPerson: e.target.value
              }))} placeholder="请输入法定代表人姓名" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled={certificationStatus === 'submitted' || certificationStatus === 'rejected'} />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    注册资本
                  </label>
                  <input type="text" value={companyInfo.registeredCapital} onChange={e => setCompanyInfo(prev => ({
                ...prev,
                registeredCapital: e.target.value
              }))} placeholder="请输入注册资本" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled={certificationStatus === 'submitted' || certificationStatus === 'rejected'} />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    经营范围
                  </label>
                  <textarea value={companyInfo.businessScope} onChange={e => setCompanyInfo(prev => ({
                ...prev,
                businessScope: e.target.value
              }))} placeholder="请输入经营范围" rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" disabled={certificationStatus === 'submitted' || certificationStatus === 'rejected'} />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    联系电话
                  </label>
                  <input type="tel" value={companyInfo.contactPhone} onChange={e => setCompanyInfo(prev => ({
                ...prev,
                contactPhone: e.target.value
              }))} placeholder="请输入企业联系电话" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled={certificationStatus === 'submitted' || certificationStatus === 'rejected'} />
                </div>
              </CardContent>
            </Card>

            {/* 温馨提示 */}
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800 mb-1">温馨提示</p>
                <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                  <li>系统将自动验证企业资质，失信企业将被限制发布信息</li>
                  <li>信用代码与企业名称必须一致，否则无法通过审核</li>
                  <li>审核通过后，您的信用分将提升至80分</li>
                  <li>平台对接天眼查API，确保企业信息真实可靠</li>
                </ul>
              </div>
            </div>

            {/* 提交按钮 */}
            <Button type="submit" disabled={isSubmitting || certificationStatus === 'submitted'} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              {isSubmitting ? <span>提交中...</span> : certificationStatus === 'submitted' ? <span>审核中...</span> : <span>提交认证</span>}
            </Button>
          </form>}
      </div>

      <TabBar activePage={activePage} onPageChange={setActivePage} />
    </div>;
}