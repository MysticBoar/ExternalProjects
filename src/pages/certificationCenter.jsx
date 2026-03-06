// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from '@/components/ui';
// @ts-ignore;
import { Building, Building2, User, ChevronRight, Award, CheckCircle, Clock, AlertCircle } from 'lucide-react';

import { CreditScoreDisplay } from '@/components/CreditScoreDisplay';
import { TabBar } from '@/components/TabBar';
export default function CertificationCenter({
  $w
}) {
  const [activePage, setActivePage] = React.useState('certificationCenter');
  const [certificationStatus, setCertificationStatus] = useState({
    property: {
      status: 'pending',
      creditScore: 80,
      initialScore: 80,
      name: '未设置'
    },
    company: {
      status: 'pending',
      creditScore: 80,
      initialScore: 80,
      name: '未设置'
    },
    user: {
      status: 'pending',
      creditScore: 70,
      initialScore: 70,
      name: '未设置'
    }
  });

  // 从数据源加载认证状态
  useEffect(() => {
    const loadData = async () => {
      try {
        // 并行加载三个角色的数据
        const [propertyResult, companyResult, userResult] = await Promise.all([$w.cloud.callDataSource({
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
        }), $w.cloud.callDataSource({
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
        }), $w.cloud.callDataSource({
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
        })]);
        if (propertyResult && propertyResult.records && propertyResult.records.length > 0) {
          const record = propertyResult.records[0];
          setCertificationStatus(prev => ({
            ...prev,
            property: {
              status: record.certificationStatus || 'pending',
              creditScore: record.creditScore || record.initialScore || 80,
              initialScore: record.initialScore || 80,
              name: record.buildingName || '未设置'
            }
          }));
        }
        if (companyResult && companyResult.records && companyResult.records.length > 0) {
          const record = companyResult.records[0];
          setCertificationStatus(prev => ({
            ...prev,
            company: {
              status: record.certificationStatus || 'pending',
              creditScore: record.creditScore || record.initialScore || 80,
              initialScore: record.initialScore || 80,
              name: record.companyName || '未设置'
            }
          }));
        }
        if (userResult && userResult.records && userResult.records.length > 0) {
          const record = userResult.records[0];
          setCertificationStatus(prev => ({
            ...prev,
            user: {
              status: record.certificationStatus || 'pending',
              creditScore: record.creditScore || record.initialScore || 70,
              initialScore: record.initialScore || 70,
              name: record.name || '未设置'
            }
          }));
        }
      } catch (error) {
        console.error('加载认证状态失败:', error);
      }
    };
    loadData();
  }, []);
  const getStatusInfo = status => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="h-4 w-4" />,
          text: '未认证',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100'
        };
      case 'submitted':
        return {
          icon: <Clock className="h-4 w-4" />,
          text: '审核中',
          color: 'text-amber-600',
          bgColor: 'bg-amber-100'
        };
      case 'approved':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          text: '已认证',
          color: 'text-green-600',
          bgColor: 'bg-green-100'
        };
      case 'rejected':
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          text: '未通过',
          color: 'text-red-600',
          bgColor: 'bg-red-100'
        };
      default:
        return {
          icon: <Clock className="h-4 w-4" />,
          text: '未认证',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100'
        };
    }
  };
  return <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部导航 */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white p-6">
        <div className="flex items-center gap-3 mb-2">
          <Award className="h-6 w-6" />
          <h1 className="text-xl font-bold">认证中心</h1>
        </div>
        <p className="text-purple-100 text-sm">
          完成认证，建立信用体系，享受更多平台权益
        </p>
      </div>

      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        {/* 信用分总览卡片 */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white p-4 rounded-xl">
            <div className="text-center">
              <Building className="h-6 w-6 mx-auto mb-2 opacity-90" />
              <p className="text-2xl font-bold">{certificationStatus.property.creditScore}</p>
              <p className="text-xs opacity-90">物业信用</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl">
            <div className="text-center">
              <Building2 className="h-6 w-6 mx-auto mb-2 opacity-90" />
              <p className="text-2xl font-bold">{certificationStatus.company.creditScore}</p>
              <p className="text-xs opacity-90">企业信用</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-4 rounded-xl">
            <div className="text-center">
              <User className="h-6 w-6 mx-auto mb-2 opacity-90" />
              <p className="text-2xl font-bold">{certificationStatus.user.creditScore}</p>
              <p className="text-xs opacity-90">个人信用</p>
            </div>
          </div>
        </div>

        {/* 物业认证卡片 */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-cyan-500" onClick={() => $w.utils.navigateTo({
        pageId: 'propertyCertification'
      })}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-100 rounded-lg">
                  <Building className="h-6 w-6 text-cyan-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">物业资质认证</CardTitle>
                  <CardDescription>上传楼宇产权和运营资质</CardDescription>
                </div>
              </div>
              <Badge className={`${getStatusInfo(certificationStatus.property.status).bgColor} ${getStatusInfo(certificationStatus.property.status).color} border-0`}>
                {getStatusInfo(certificationStatus.property.status).icon}
                <span className="ml-1">{getStatusInfo(certificationStatus.property.status).text}</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">认证名称：</span>
              <span className="font-medium text-gray-900">{certificationStatus.property.name}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-gray-600">初始信用分：</span>
              <span className="font-medium text-cyan-600">{certificationStatus.property.initialScore}分</span>
            </div>
            <div className="mt-3 flex items-center justify-end text-cyan-600">
              <span className="text-sm">查看详情</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </CardContent>
        </Card>

        {/* 企业认证卡片 */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500" onClick={() => $w.utils.navigateTo({
        pageId: 'companyCertification'
      })}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">企业资质认证</CardTitle>
                  <CardDescription>输入营业执照和信用代码</CardDescription>
                </div>
              </div>
              <Badge className={`${getStatusInfo(certificationStatus.company.status).bgColor} ${getStatusInfo(certificationStatus.company.status).color} border-0`}>
                {getStatusInfo(certificationStatus.company.status).icon}
                <span className="ml-1">{getStatusInfo(certificationStatus.company.status).text}</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">企业名称：</span>
              <span className="font-medium text-gray-900">{certificationStatus.company.name}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-gray-600">初始信用分：</span>
              <span className="font-medium text-blue-600">{certificationStatus.company.initialScore}分</span>
            </div>
            <div className="mt-3 flex items-center justify-end text-blue-600">
              <span className="text-sm">查看详情</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </CardContent>
        </Card>

        {/* 职场人认证卡片 */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-indigo-500" onClick={() => $w.utils.navigateTo({
        pageId: 'userCertification'
      })}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <User className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">职场人资质认证</CardTitle>
                  <CardDescription>上传技能证书，展示专业能力</CardDescription>
                </div>
              </div>
              <Badge className={`${getStatusInfo(certificationStatus.user.status).bgColor} ${getStatusInfo(certificationStatus.user.status).color} border-0`}>
                {getStatusInfo(certificationStatus.user.status).icon}
                <div className="flex items-center gap-1">
                  {getStatusInfo(certificationStatus.user.status).icon}
                  <span>{getStatusInfo(certificationStatus.user.status).text}</span>
                </div>
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">用户姓名：</span>
              <span className="font-medium text-gray-900">{certificationStatus.user.name}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-gray-600">初始信用分：</span>
              <span className="font-medium text-indigo-600">{certificationStatus.user.initialScore}分</span>
            </div>
            <div className="mt-3 flex items-center justify-end text-indigo-600">
              <span className="text-sm">查看详情</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </CardContent>
        </Card>

        {/* 认证说明 */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              认证权益
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>物业/企业初始信用分80分，职场人初始70分</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>获得认证标签，提升在平台上的信任度</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>享受平台优先推荐和更多展示机会</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>通过获得好评可提升信用分</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <TabBar activePage={activePage} onPageChange={setActivePage} />
    </div>;
}