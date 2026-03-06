// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, useToast } from '@/components/ui';
// @ts-ignore;
import { Upload, CheckCircle, Clock, XCircle, FileText, Building2, AlertCircle } from 'lucide-react';

import { CreditScoreDisplay } from '@/components/CreditScoreDisplay';
import { TabBar } from '@/components/TabBar';
export default function PropertyCertification({
  $w
}) {
  const {
    toast
  } = useToast();
  const [certificationStatus, setCertificationStatus] = useState('pending'); // pending, submitted, approved, rejected
  const [creditScore, setCreditScore] = useState(80); // 初始80分
  const [files, setFiles] = useState({
    propertyRight: null,
    // 楼宇产权
    operatingLicense: null // 运营资质
  });
  const [buildingInfo, setBuildingInfo] = useState({
    name: '',
    address: '',
    area: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [activePage, setActivePage] = useState('creditProfile');

  // 从数据源加载认证数据
  useEffect(() => {
    const loadCertificationData = async () => {
      try {
        const result = await $w.cloud.callDataSource({
          dataSourceName: 'credit_property',
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
          if (record.buildingName || record.address || record.area) {
            setBuildingInfo({
              name: record.buildingName || '',
              address: record.address || '',
              area: record.area || ''
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

  // 处理文件上传
  const handleFileUpload = (type, e) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({
        ...prev,
        [type]: file
      }));
    }
  };

  // 提交认证
  const handleSubmit = async e => {
    e.preventDefault();
    if (!files.propertyRight || !files.operatingLicense) {
      toast({
        title: '请上传完整材料',
        description: '请上传楼宇产权和运营资质文件',
        status: 'warning'
      });
      return;
    }
    if (!buildingInfo.name || !buildingInfo.address || !buildingInfo.area) {
      toast({
        title: '请填写完整信息',
        description: '请填写楼宇名称、地址和面积信息',
        status: 'warning'
      });
      return;
    }
    setIsSubmitting(true);
    try {
      // 调用数据源创建或更新记录
      await $w.cloud.callDataSource({
        dataSourceName: 'credit_property',
        methodName: 'wedaCreateV2',
        params: {
          data: {
            buildingName: buildingInfo.name,
            address: buildingInfo.address,
            area: buildingInfo.area,
            propertyRightFile: files.propertyRight.name,
            operatingLicenseFile: files.operatingLicense.name,
            certificationStatus: 'submitted',
            creditScore: 80,
            initialScore: 80,
            reviews: []
          }
        }
      });
      //       createdAt: new Date().toISOString()
      //     }
      //   }
      // });

      setCertificationStatus('submitted');
      toast({
        title: '提交成功',
        description: '认证材料已提交，平台将在1-3个工作日内完成审核',
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
      <div className="bg-gradient-to-br from-cyan-600 to-cyan-700 text-white p-6">
        <div className="flex items-center gap-3 mb-2">
          <Building2 className="h-6 w-6" />
          <h1 className="text-xl font-bold">物业资质认证</h1>
        </div>
        <p className="text-cyan-100 text-sm">
          完成认证获得“平台认证楼宇”标签，提升信用分至80分
        </p>
      </div>

      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        {/* 信用分展示 */}
        <CreditScoreDisplay score={creditScore} type="property" initialScore={80} />

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
              {certificationStatus === 'pending' && '请上传楼宇产权和运营资质文件，完成认证审核'}
              {certificationStatus === 'submitted' && '您的认证材料正在审核中，预计1-3个工作日完成'}
              {certificationStatus === 'approved' && '恭喜！您的物业已通过平台认证，获得“平台认证楼宇”标签'}
              {certificationStatus === 'rejected' && '认证未通过，请检查材料后重新提交'}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* 认证表单 */}
        {certificationStatus !== 'approved' && <form onSubmit={handleSubmit} className="space-y-4">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-lg">基本信息</CardTitle>
                <CardDescription>请填写楼宇基本信息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    楼宇名称 <span className="text-red-500">*</span>
                  </label>
                  <input type="text" value={buildingInfo.name} onChange={e => setBuildingInfo(prev => ({
                ...prev,
                name: e.target.value
              }))} placeholder="请输入楼宇名称" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" disabled={certificationStatus === 'submitted' || certificationStatus === 'rejected'} />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    楼宇地址 <span className="text-red-500">*</span>
                  </label>
                  <input type="text" value={buildingInfo.address} onChange={e => setBuildingInfo(prev => ({
                ...prev,
                address: e.target.value
              }))} placeholder="请输入楼宇地址" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" disabled={certificationStatus === 'submitted' || certificationStatus === 'rejected'} />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    建筑面积（平方米）<span className="text-red-500">*</span>
                  </label>
                  <input type="text" value={buildingInfo.area} onChange={e => setBuildingInfo(prev => ({
                ...prev,
                area: e.target.value
              }))} placeholder="请输入建筑面积" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" disabled={certificationStatus === 'submitted' || certificationStatus === 'rejected'} />
                </div>
              </CardContent>
            </Card>

            {/* 楼宇产权上传 */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-cyan-600" />
                  楼宇产权证明
                </CardTitle>
                <CardDescription>请上传楼宇产权证明文件（PDF/图片）</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-cyan-500 transition-colors">
                  {files.propertyRight ? <div className="space-y-2">
                      <FileText className="h-12 w-12 mx-auto text-cyan-600" />
                      <p className="text-sm font-medium text-gray-900">{files.propertyRight.name}</p>
                      <p className="text-xs text-gray-500">{(files.propertyRight.size / 1024).toFixed(2)} KB</p>
                    </div> : <div className="space-y-2">
                      <Upload className="h-12 w-12 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-600">点击上传或拖拽文件到此处</p>
                      <p className="text-xs text-gray-400">支持 PDF、JPG、PNG 格式，最大 10MB</p>
                    </div>}
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => handleFileUpload('propertyRight', e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={certificationStatus === 'submitted' || certificationStatus === 'rejected'} />
                </div>
              </CardContent>
            </Card>

            {/* 运营资质上传 */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-cyan-600" />
                  运营资质证明
                </CardTitle>
                <CardDescription>请上传运营资质证明文件（PDF/图片）</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-cyan-500 transition-colors">
                  {files.operatingLicense ? <div className="space-y-2">
                      <FileText className="h-12 w-12 mx-auto text-cyan-600" />
                      <p className="text-sm font-medium text-gray-900">{files.operatingLicense.name}</p>
                      <p className="text-xs text-gray-500">{(files.operatingLicense.size / 1024).toFixed(2)} KB</p>
                    </div> : <div className="space-y-2">
                      <Upload className="h-12 w-12 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-600">点击上传或拖拽文件到此处</p>
                      <p className="text-xs text-gray-400">支持 PDF、JPG、PNG 格式，最大 10MB</p>
                    </div>}
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => handleFileUpload('operatingLicense', e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={certificationStatus === 'submitted' || certificationStatus === 'rejected'} />
                </div>
              </CardContent>
            </Card>

            {/* 温馨提示 */}
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800 mb-1">温馨提示</p>
                <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                  <li>请确保上传的文件清晰可见，信息完整</li>
                  <li>认证审核时间为1-3个工作日</li>
                  <li>审核通过后，您的信用分将提升至80分</li>
                  <li>如审核未通过，可根据驳回原因重新提交</li>
                </ul>
              </div>
            </div>

            {/* 提交按钮 */}
            <Button type="submit" disabled={isSubmitting || certificationStatus === 'submitted'} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
              {isSubmitting ? <span>提交中...</span> : certificationStatus === 'submitted' ? <span>审核中...</span> : <span>提交认证</span>}
            </Button>
          </form>}
      </div>

      <TabBar activePage={activePage} onPageChange={setActivePage} />
    </div>;
}