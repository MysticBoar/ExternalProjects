// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, useToast } from '@/components/ui';
// @ts-ignore;
import { Upload, CheckCircle, Clock, XCircle, FileText, User, AlertCircle, Award } from 'lucide-react';

import { CreditScoreDisplay } from '@/components/CreditScoreDisplay';
import { TabBar } from '@/components/TabBar';
export default function UserCertification({
  $w
}) {
  const {
    toast
  } = useToast();
  const [certificationStatus, setCertificationStatus] = useState('pending'); // pending, submitted, approved, rejected
  const [creditScore, setCreditScore] = useState(70); // 初始70分
  const [userInfo, setUserInfo] = useState({
    name: '',
    phone: '',
    email: '',
    jobTitle: '',
    workYears: ''
  });
  const [certificates, setCertificates] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activePage, setActivePage] = useState('creditProfile');

  // 从数据源加载认证数据
  useEffect(() => {
    const loadCertificationData = async () => {
      try {
        const result = await $w.cloud.callDataSource({
          dataSourceName: 'credit_user',
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
          setCreditScore(record.creditScore || record.initialScore || 70);
          if (record.name || record.phone || record.email) {
            setUserInfo({
              name: record.name || '',
              phone: record.phone || '',
              email: record.email || '',
              jobTitle: record.jobTitle || '',
              workYears: record.workYears || ''
            });
          }
          if (record.certificates && record.certificates.length > 0) {
            setCertificates(record.certificates);
          }
        } else {
          // 获取当前用户信息
          if ($w.auth.currentUser) {
            setUserInfo(prev => ({
              ...prev,
              name: $w.auth.currentUser.nickName || $w.auth.currentUser.name || '',
              phone: $w.auth.currentUser.userId || ''
            }));
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
  }, [$w.auth.currentUser]);

  // 添加证书
  const handleCertificateUpload = e => {
    const file = e.target.files[0];
    if (file) {
      const newCertificate = {
        id: Date.now(),
        file: file,
        name: file.name.replace(/\.[^/.]+$/, ''),
        type: '技能证书'
      };
      setCertificates(prev => [...prev, newCertificate]);
    }
  };

  // 删除证书
  const handleRemoveCertificate = id => {
    setCertificates(prev => prev.filter(cert => cert.id !== id));
  };

  // 提交认证
  const handleSubmit = async e => {
    e.preventDefault();
    if (!userInfo.name || !userInfo.phone) {
      toast({
        title: '请填写完整信息',
        description: '请填写姓名和联系电话',
        status: 'warning'
      });
      return;
    }
    if (certificates.length === 0) {
      toast({
        title: '请上传证书',
        description: '请至少上传一个技能证书',
        status: 'warning'
      });
      return;
    }
    setIsSubmitting(true);
    try {
      // 调用数据源创建或更新记录
      await $w.cloud.callDataSource({
        dataSourceName: 'credit_user',
        methodName: 'wedaCreateV2',
        params: {
          data: {
            name: userInfo.name,
            phone: userInfo.phone,
            email: userInfo.email,
            jobTitle: userInfo.jobTitle,
            workYears: userInfo.workYears,
            certificates: certificates,
            certificationStatus: 'submitted',
            creditScore: 70,
            initialScore: 70,
            reviews: []
          }
        }
      });
      setCertificationStatus('submitted');
      toast({
        title: '提交成功',
        description: '您的证书已上传，可用于求职展示',
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
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white p-6">
        <div className="flex items-center gap-3 mb-2">
          <User className="h-6 w-6" />
          <h1 className="text-xl font-bold">职场人资质认证</h1>
        </div>
        <p className="text-indigo-100 text-sm">
          上传技能证书，展示专业能力，初始信用分70分
        </p>
      </div>

      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        {/* 信用分展示 */}
        <CreditScoreDisplay score={creditScore} type="user" initialScore={70} />

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
              {certificationStatus === 'pending' && '请上传技能证书，完善个人资料'}
              {certificationStatus === 'submitted' && '您的证书已提交审核'}
              {certificationStatus === 'approved' && '恭喜！您的证书已通过审核，可在求职中展示'}
              {certificationStatus === 'rejected' && '审核未通过，请检查后重新提交'}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* 认证表单 */}
        {certificationStatus !== 'approved' && <form onSubmit={handleSubmit} className="space-y-4">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-lg">基本信息</CardTitle>
                <CardDescription>请填写个人基本信息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    姓名 <span className="text-red-500">*</span>
                  </label>
                  <input type="text" value={userInfo.name} onChange={e => setUserInfo(prev => ({
                ...prev,
                name: e.target.value
              }))} placeholder="请输入真实姓名" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" disabled={certificationStatus === 'submitted' || certificationStatus === 'rejected'} />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    联系电话 <span className="text-red-500">*</span>
                  </label>
                  <input type="tel" value={userInfo.phone} onChange={e => setUserInfo(prev => ({
                ...prev,
                phone: e.target.value
              }))} placeholder="请输入联系电话" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" disabled={certificationStatus === 'submitted' || certificationStatus === 'rejected'} />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    邮箱
                  </label>
                  <input type="email" value={userInfo.email} onChange={e => setUserInfo(prev => ({
                ...prev,
                email: e.target.value
              }))} placeholder="请输入邮箱地址" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" disabled={certificationStatus === 'submitted' || certificationStatus === 'rejected'} />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    求职意向
                  </label>
                  <input type="text" value={userInfo.jobTitle} onChange={e => setUserInfo(prev => ({
                ...prev,
                jobTitle: e.target.value
              }))} placeholder="如：软件工程师、产品经理" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" disabled={certificationStatus === 'submitted' || certificationStatus === 'rejected'} />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    工作年限
                  </label>
                  <select value={userInfo.workYears} onChange={e => setUserInfo(prev => ({
                ...prev,
                workYears: e.target.value
              }))} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" disabled={certificationStatus === 'submitted' || certificationStatus === 'rejected'}>
                    <option value="">请选择</option>
                    <option value="应届生">应届生</option>
                    <option value="1-3年">1-3年</option>
                    <option value="3-5年">3-5年</option>
                    <option value="5-10年">5-10年</option>
                    <option value="10年以上">10年以上</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* 技能证书上传 */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-indigo-600" />
                  技能证书
                </CardTitle>
                <CardDescription>上传您的专业技能证书，提升竞争力</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 已上传的证书列表 */}
                {certificates.length > 0 && <div className="space-y-2">
                    {certificates.map(cert => <div key={cert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-indigo-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{cert.name}</p>
                            <p className="text-xs text-gray-500">{(cert.file.size / 1024).toFixed(2)} KB</p>
                          </div>
                        </div>
                        <button type="button" onClick={() => handleRemoveCertificate(cert.id)} className="text-red-600 hover:text-red-700 text-sm" disabled={certificationStatus === 'submitted' || certificationStatus === 'rejected'}>
                          删除
                        </button>
                      </div>)}
                  </div>}

                {/* 上传区域 */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors">
                  <div className="space-y-2">
                    <Upload className="h-12 w-12 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-600">点击上传证书文件</p>
                    <p className="text-xs text-gray-400">支持 PDF、JPG、PNG 格式，最大 10MB</p>
                  </div>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleCertificateUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={certificationStatus === 'submitted' || certificationStatus === 'rejected'} />
                </div>
              </CardContent>
            </Card>

            {/* 温馨提示 */}
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800 mb-1">温馨提示</p>
                <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                  <li>证书将作为求职展示的一部分，请确保信息真实有效</li>
                  <li>支持上传多个证书，展示更多专业技能</li>
                  <li>证书仅用于展示，不会人工审核内容</li>
                  <li>初始信用分为70分，通过获得评价可提升信用分</li>
                </ul>
              </div>
            </div>

            {/* 提交按钮 */}
            <Button type="submit" disabled={isSubmitting || certificationStatus === 'submitted'} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              {isSubmitting ? <span>提交中...</span> : certificationStatus === 'submitted' ? <span>审核中...</span> : <span>提交认证</span>}
            </Button>
          </form>}
      </div>

      <TabBar activePage={activePage} onPageChange={setActivePage} />
    </div>;
}