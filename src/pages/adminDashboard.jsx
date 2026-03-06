// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger, Badge, Button, useToast } from '@/components/ui';
// @ts-ignore;
import { ShieldCheck, FileText, Award, Clock, CheckCircle, XCircle, Building2, Building, User, MessageSquare, AlertTriangle } from 'lucide-react';

import { AdminReviewList } from '@/components/AdminReviewList';
import { ReviewAuditList } from '@/components/ReviewAuditList';
import { ViolationManagement } from '@/components/ViolationManagement';
import { TabBar } from '@/components/TabBar';
export default function AdminDashboard({
  $w
}) {
  const {
    toast
  } = useToast();
  const [activePage, setActivePage] = useState('adminDashboard');
  const [activeTab, setActiveTab] = useState('all');
  const [activeMainTab, setActiveMainTab] = useState('certification'); // 主标签页：certification-资质审核, review-评价审核, violation-违规管理
  const [propertyReviews, setPropertyReviews] = useState([]);
  const [companyReviews, setCompanyReviews] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // 从数据源加载待审核列表
  useEffect(() => {
    const loadData = async () => {
      try {
        const [propertyResult, companyResult, userResult] = await Promise.all([$w.cloud.callDataSource({
          dataSourceName: 'credit_property',
          methodName: 'wedaGetRecordsV2',
          params: {
            filter: {
              where: {
                $and: [{
                  certificationStatus: 'submitted'
                }]
              }
            },
            select: {
              $master: true
            },
            orderBy: [{
              createdAt: 'desc'
            }],
            pageSize: 50,
            pageNumber: 1
          }
        }), $w.cloud.callDataSource({
          dataSourceName: 'credit_company',
          methodName: 'wedaGetRecordsV2',
          params: {
            filter: {
              where: {
                $and: [{
                  certificationStatus: 'submitted'
                }]
              }
            },
            select: {
              $master: true
            },
            orderBy: [{
              createdAt: 'desc'
            }],
            pageSize: 50,
            pageNumber: 1
          }
        }), $w.cloud.callDataSource({
          dataSourceName: 'credit_user',
          methodName: 'wedaGetRecordsV2',
          params: {
            filter: {
              where: {
                $and: [{
                  certificationStatus: 'submitted'
                }]
              }
            },
            select: {
              $master: true
            },
            orderBy: [{
              createdAt: 'desc'
            }],
            pageSize: 50,
            pageNumber: 1
          }
        })]);
        setPropertyReviews(propertyResult?.records || []);
        setCompanyReviews(companyResult?.records || []);
        setUserReviews(userResult?.records || []);
      } catch (error) {
        console.error('加载待审核数据失败:', error);
        toast({
          title: '加载失败',
          description: error.message || '无法加载待审核数据',
          status: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 刷新待审核列表
  const handleRefresh = () => {
    setLoading(true);
    const loadData = async () => {
      try {
        const [propertyResult, companyResult, userResult] = await Promise.all([$w.cloud.callDataSource({
          dataSourceName: 'credit_property',
          methodName: 'wedaGetRecordsV2',
          params: {
            filter: {
              where: {
                $and: [{
                  certificationStatus: 'submitted'
                }]
              }
            },
            select: {
              $master: true
            },
            orderBy: [{
              createdAt: 'desc'
            }],
            pageSize: 50,
            pageNumber: 1
          }
        }), $w.cloud.callDataSource({
          dataSourceName: 'credit_company',
          methodName: 'wedaGetRecordsV2',
          params: {
            filter: {
              where: {
                $and: [{
                  certificationStatus: 'submitted'
                }]
              }
            },
            select: {
              $master: true
            },
            orderBy: [{
              createdAt: 'desc'
            }],
            pageSize: 50,
            pageNumber: 1
          }
        }), $w.cloud.callDataSource({
          dataSourceName: 'credit_user',
          methodName: 'wedaGetRecordsV2',
          params: {
            filter: {
              where: {
                $and: [{
                  certificationStatus: 'submitted'
                }]
              }
            },
            select: {
              $master: true
            },
            orderBy: [{
              createdAt: 'desc'
            }],
            pageSize: 50,
            pageNumber: 1
          }
        })]);
        setPropertyReviews(propertyResult?.records || []);
        setCompanyReviews(companyResult?.records || []);
        setUserReviews(userResult?.records || []);
      } catch (error) {
        console.error('刷新数据失败:', error);
        toast({
          title: '刷新失败',
          description: error.message || '无法刷新数据',
          status: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  };

  // 根据标签页类型获取对应数据
  const getReviewsByType = type => {
    switch (type) {
      case 'property':
        return propertyReviews;
      case 'company':
        return companyReviews;
      case 'user':
        return userReviews;
      default:
        return [...propertyReviews, ...companyReviews, ...userReviews];
    }
  };
  const currentReviews = getReviewsByType(activeTab);
  const totalCount = propertyReviews.length + companyReviews.length + userReviews.length;
  return <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      {/* 顶部统计卡片 */}
      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900" style={{
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
              管理端
            </h1>
            <p className="text-slate-600 mt-2">平台管理中心</p>
          </div>
          <Button onClick={handleRefresh} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
            <Clock className="w-4 h-4 mr-2" />
            刷新
          </Button>
        </div>

        {/* 主标签页切换 */}
        <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="mb-6">
          <TabsList className="bg-slate-200">
            <TabsTrigger value="certification" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
              <ShieldCheck className="w-4 h-4 mr-2" />
              资质审核
            </TabsTrigger>
            <TabsTrigger value="review" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
              <MessageSquare className="w-4 h-4 mr-2" />
              评价审核
            </TabsTrigger>
            <TabsTrigger value="violation" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
              <AlertTriangle className="w-4 h-4 mr-2" />
              违规管理
            </TabsTrigger>
          </TabsList>

          {/* 资质审核内容 */}
          <TabsContent value="certification">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-blue-900">物业认证</CardTitle>
                    <Building className="w-8 h-8 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-900">{propertyReviews.length}</div>
                  <p className="text-xs text-blue-600 mt-1">待审核申请</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-green-900">企业认证</CardTitle>
                    <Building2 className="w-8 h-8 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-900">{companyReviews.length}</div>
                  <p className="text-xs text-green-600 mt-1">待审核申请</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-purple-900">职场人认证</CardTitle>
                    <User className="w-8 h-8 text-purple-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-900">{userReviews.length}</div>
                  <p className="text-xs text-purple-600 mt-1">待审核申请</p>
                </CardContent>
              </Card>
            </div>

            {/* 资质审核列表 */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-slate-900" style={{
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}>
                      待审核列表
                    </CardTitle>
                    <CardDescription className="mt-1">
                      共 {totalCount} 条待审核申请
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="bg-slate-200">
                    <TabsTrigger value="all" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                      全部 ({totalCount})
                    </TabsTrigger>
                    <TabsTrigger value="property" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                      物业 ({propertyReviews.length})
                    </TabsTrigger>
                    <TabsTrigger value="company" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                      企业 ({companyReviews.length})
                    </TabsTrigger>
                    <TabsTrigger value="user" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                      职场人 ({userReviews.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value={activeTab} className="mt-6">
                    {loading ? <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                      </div> : currentReviews.length === 0 ? <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                        <ShieldCheck className="w-16 h-16 mb-4 opacity-50" />
                        <p className="text-lg">暂无待审核申请</p>
                      </div> : <AdminReviewList reviews={currentReviews} reviewType={activeTab} onRefresh={handleRefresh} $w={$w} />}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 评价审核内容 */}
          <TabsContent value="review">
            <Card>
              <CardHeader>
                <div>
                  <CardTitle className="text-slate-900" style={{
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                    评价审核
                  </CardTitle>
                  <CardDescription className="mt-1">
                    审核用户提交的评价内容，确保评价合规
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="bg-slate-200">
                    <TabsTrigger value="all" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                      全部评价
                    </TabsTrigger>
                    <TabsTrigger value="property" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                      物业评价
                    </TabsTrigger>
                    <TabsTrigger value="company" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                      企业评价
                    </TabsTrigger>
                    <TabsTrigger value="user" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                      职场人评价
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value={activeTab} className="mt-6">
                    <ReviewAuditList activeType={activeTab} $w={$w} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 违规管理内容 */}
          <TabsContent value="violation">
            <ViolationManagement $w={$w} />
          </TabsContent>
        </Tabs>
      </div>

      <TabBar activePage={activePage} onPageChange={setActivePage} />
    </div>;
}