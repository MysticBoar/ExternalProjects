// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger, Badge, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, useToast } from '@/components/ui';
// @ts-ignore;
import { Shield, Star, TrendingUp, MessageSquare, FileText, Building, User, ChevronRight, Award, CheckCircle, Clock } from 'lucide-react';

import { CreditScoreDisplay } from '@/components/CreditScoreDisplay';
import { ReviewForm, ReviewList } from '@/components/ReviewForm';
import { TabBar } from '@/components/TabBar';
export default function CreditProfile({
  $w
}) {
  const {
    toast
  } = useToast();
  const [activeTab, setActiveTab] = useState('property');
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState('creditProfile');

  // Mock数据 - 在实际项目中应该从数据源加载
  const [profileData, setProfileData] = useState({
    property: {
      certificationStatus: 'approved',
      creditScore: 85,
      initialScore: 80,
      name: '科技园A座',
      address: '深圳南山区科技园路88号',
      area: '50000',
      reviews: [{
        targetType: '物业',
        averageRating: 4.8,
        ratings: {
          '服务响应': 5,
          '设施维护': 4,
          '安全保障': 5
        },
        comment: '物业管理服务响应很快，设施维护及时，整体很满意！',
        createdAt: '2026-02-28T10:30:00Z'
      }, {
        targetType: '物业',
        averageRating: 4.5,
        ratings: {
          '服务响应': 4,
          '设施维护': 5,
          '安全保障': 4
        },
        comment: '环境不错，就是有时候响应慢了一点',
        createdAt: '2026-02-25T14:20:00Z'
      }]
    },
    company: {
      certificationStatus: 'approved',
      creditScore: 88,
      initialScore: 80,
      name: '智联科技有限公司',
      creditCode: '91440300MA5EQXXXXX',
      legalPerson: '张三',
      registeredCapital: '1000万元人民币',
      reviews: [{
        targetType: '企业',
        averageRating: 4.7,
        ratings: {
          '薪资待遇': 5,
          '企业文化': 4,
          '发展空间': 5
        },
        comment: '公司待遇不错，发展空间大，同事关系融洽',
        createdAt: '2026-03-01T09:15:00Z'
      }]
    },
    user: {
      certificationStatus: 'approved',
      creditScore: 75,
      initialScore: 70,
      name: '李四',
      phone: '138****8888',
      jobTitle: '软件工程师',
      workYears: '3-5年',
      reviews: []
    }
  });

  // 从数据源加载数据
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

        // 处理物业数据
        if (propertyResult && propertyResult.records && propertyResult.records.length > 0) {
          const record = propertyResult.records[0];
          setProfileData(prev => ({
            ...prev,
            property: {
              certificationStatus: record.certificationStatus || 'pending',
              creditScore: record.creditScore || record.initialScore || 80,
              initialScore: record.initialScore || 80,
              name: record.buildingName || '未设置',
              address: record.address || '',
              area: record.area || '',
              reviews: record.reviews || []
            }
          }));
        }

        // 处理企业数据
        if (companyResult && companyResult.records && companyResult.records.length > 0) {
          const record = companyResult.records[0];
          setProfileData(prev => ({
            ...prev,
            company: {
              certificationStatus: record.certificationStatus || 'pending',
              creditScore: record.creditScore || record.initialScore || 80,
              initialScore: record.initialScore || 80,
              name: record.companyName || '未设置',
              creditCode: record.creditCode || '',
              legalPerson: record.legalPerson || '',
              registeredCapital: record.registeredCapital || '',
              reviews: record.reviews || []
            }
          }));
        }

        // 处理职场人数据
        if (userResult && userResult.records && userResult.records.length > 0) {
          const record = userResult.records[0];
          setProfileData(prev => ({
            ...prev,
            user: {
              certificationStatus: record.certificationStatus || 'pending',
              creditScore: record.creditScore || record.initialScore || 70,
              initialScore: record.initialScore || 70,
              name: record.name || '未设置',
              phone: record.phone || '',
              jobTitle: record.jobTitle || '',
              workYears: record.workYears || '',
              reviews: record.reviews || []
            }
          }));
        }
      } catch (error) {
        console.error('加载信用数据失败:', error);
        toast({
          title: '加载失败',
          description: error.message || '无法加载信用数据',
          status: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 提交评价
  const handleSubmitReview = async reviewData => {
    try {
      // 更新信用分（好评+5，差评-10）
      const scoreChange = reviewData.averageRating >= 4 ? 5 : reviewData.averageRating < 3 ? -10 : 0;
      const newCreditScore = profileData[activeTab].creditScore + scoreChange;
      const newReview = {
        ...reviewData,
        createdAt: new Date().toISOString()
      };
      const newReviews = [newReview, ...profileData[activeTab].reviews];

      // 根据当前活跃标签页选择对应的数据源
      let dataSourceName = '';
      let updateData = {};
      if (activeTab === 'property') {
        dataSourceName = 'credit_property';
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
          await $w.cloud.callDataSource({
            dataSourceName: 'credit_property',
            methodName: 'wedaUpdateV2',
            params: {
              filter: {
                where: {
                  _id: record._id
                }
              },
              data: {
                creditScore: newCreditScore,
                reviews: newReviews
              }
            }
          });
        }
      } else if (activeTab === 'company') {
        dataSourceName = 'credit_company';
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
          await $w.cloud.callDataSource({
            dataSourceName: 'credit_company',
            methodName: 'wedaUpdateV2',
            params: {
              filter: {
                where: {
                  _id: record._id
                }
              },
              data: {
                creditScore: newCreditScore,
                reviews: newReviews
              }
            }
          });
        }
      } else if (activeTab === 'user') {
        dataSourceName = 'credit_user';
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
          await $w.cloud.callDataSource({
            dataSourceName: 'credit_user',
            methodName: 'wedaUpdateV2',
            params: {
              filter: {
                where: {
                  _id: record._id
                }
              },
              data: {
                creditScore: newCreditScore,
                reviews: newReviews
              }
            }
          });
        }
      }

      // 更新本地状态
      setProfileData(prev => ({
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          creditScore: newCreditScore,
          reviews: newReviews
        }
      }));
      setShowReviewDialog(false);
      toast({
        title: '评价成功',
        description: scoreChange > 0 ? '感谢您的好评！信用分已增加。' : scoreChange < 0 ? '您的评价已提交，信用分已调整。' : '感谢您的评价！',
        status: 'success'
      });
    } catch (error) {
      console.error('提交评价失败:', error);
      toast({
        title: '提交失败',
        description: error.message || '无法提交评价，请稍后重试',
        status: 'error'
      });
      throw error;
    }
  };

  // 获取评价维度配置
  const getReviewDimensions = type => {
    switch (type) {
      case 'property':
        return [{
          key: '服务响应',
          label: '服务响应'
        }, {
          key: '设施维护',
          label: '设施维护'
        }, {
          key: '安全保障',
          label: '安全保障'
        }];
      case 'company':
        return [{
          key: '薪资待遇',
          label: '薪资待遇'
        }, {
          key: '企业文化',
          label: '企业文化'
        }, {
          key: '发展空间',
          label: '发展空间'
        }];
      case 'supply':
        return [{
          key: '履约质量',
          label: '履约质量'
        }, {
          key: '服务态度',
          label: '服务态度'
        }, {
          key: '响应速度',
          label: '响应速度'
        }];
      default:
        return [];
    }
  };

  // 计算平均评分
  const calculateAverageRating = reviews => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + review.averageRating, 0);
    return (sum / reviews.length).toFixed(1);
  };
  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Clock className="h-12 w-12 mx-auto text-gray-400 animate-spin" />
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部导航 */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white p-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-6 w-6" />
          <h1 className="text-xl font-bold">信用档案</h1>
        </div>
        <p className="text-purple-100 text-sm">
          查看和管理您的信用档案、认证状态和评价信息
        </p>
      </div>

      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        {/* 信用分总览 */}
        <div className="grid grid-cols-3 gap-3">
          <div className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${activeTab === 'property' ? 'border-cyan-500 bg-cyan-50' : 'border-gray-200 bg-white'}`} onClick={() => setActiveTab('property')}>
            <div className="text-center">
              <Building className="h-6 w-6 mx-auto mb-2 text-cyan-600" />
              <p className="text-lg font-bold text-gray-900">{profileData.property.creditScore}</p>
              <p className="text-xs text-gray-600">物业信用</p>
            </div>
          </div>
          <div className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${activeTab === 'company' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`} onClick={() => setActiveTab('company')}>
            <div className="text-center">
              <Building className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <p className="text-lg font-bold text-gray-900">{profileData.company.creditScore}</p>
              <p className="text-xs text-gray-600">企业信用</p>
            </div>
          </div>
          <div className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${activeTab === 'user' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white'}`} onClick={() => setActiveTab('user')}>
            <div className="text-center">
              <User className="h-6 w-6 mx-auto mb-2 text-indigo-600" />
              <p className="text-lg font-bold text-gray-900">{profileData.user.creditScore}</p>
              <p className="text-xs text-gray-600">个人信用</p>
            </div>
          </div>
        </div>

        {/* 标签页内容 */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="property">
            <div className="space-y-4">
              <CreditScoreDisplay score={profileData.property.creditScore} type="property" initialScore={profileData.property.initialScore} />

              {/* 认证信息 */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5 text-cyan-600" />
                    认证信息
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">楼宇名称</span>
                    <span className="text-sm font-medium text-gray-900">{profileData.property.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">地址</span>
                    <span className="text-sm font-medium text-gray-900">{profileData.property.address}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">建筑面积</span>
                    <span className="text-sm font-medium text-gray-900">{profileData.property.area} 平方米</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">认证状态</span>
                    <Badge className="bg-green-100 text-green-700 border-0">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      已认证
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* 评价统计 */}
              <Card className="bg-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">评价统计</CardTitle>
                    <Button size="sm" onClick={() => setShowReviewDialog(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
                      写评价
                    </Button>
                  </div>
                  <CardDescription>共 {profileData.property.reviews.length} 条评价</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-3xl font-bold text-purple-600">
                      {calculateAverageRating(profileData.property.reviews)}
                    </div>
                    <div className="flex-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => <Star key={star} className={`h-5 w-5 ${star <= Math.round(calculateAverageRating(profileData.property.reviews)) ? 'text-amber-500 fill-current' : 'text-gray-300'}`} />)}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {profileData.property.reviews.length} 条评价
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 评价列表 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">全部评价</h3>
                <ReviewList reviews={profileData.property.reviews} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="company">
            <div className="space-y-4">
              <CreditScoreDisplay score={profileData.company.creditScore} type="company" initialScore={profileData.company.initialScore} />

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-600" />
                    认证信息
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">企业名称</span>
                    <span className="text-sm font-medium text-gray-900">{profileData.company.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">信用代码</span>
                    <span className="text-sm font-medium text-gray-900">{profileData.company.creditCode}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">法定代表人</span>
                    <span className="text-sm font-medium text-gray-900">{profileData.company.legalPerson}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">注册资本</span>
                    <span className="text-sm font-medium text-gray-900">{profileData.company.registeredCapital}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">认证状态</span>
                    <Badge className="bg-green-100 text-green-700 border-0">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      已认证
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">评价统计</CardTitle>
                    <Button size="sm" onClick={() => setShowReviewDialog(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
                      写评价
                    </Button>
                  </div>
                  <CardDescription>共 {profileData.company.reviews.length} 条评价</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-3xl font-bold text-purple-600">
                      {calculateAverageRating(profileData.company.reviews)}
                    </div>
                    <div className="flex-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => <Star key={star} className={`h-5 w-5 ${star <= Math.round(calculateAverageRating(profileData.company.reviews)) ? 'text-amber-500 fill-current' : 'text-gray-300'}`} />)}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {profileData.company.reviews.length} 条评价
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">全部评价</h3>
                <ReviewList reviews={profileData.company.reviews} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="user">
            <div className="space-y-4">
              <CreditScoreDisplay score={profileData.user.creditScore} type="user" initialScore={profileData.user.initialScore} />

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5 text-indigo-600" />
                    认证信息
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">姓名</span>
                    <span className="text-sm font-medium text-gray-900">{profileData.user.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">联系电话</span>
                    <span className="text-sm font-medium text-gray-900">{profileData.user.phone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">求职意向</span>
                    <span className="text-sm font-medium text-gray-900">{profileData.user.jobTitle || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">工作年限</span>
                    <span className="text-sm font-medium text-gray-900">{profileData.user.workYears || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">认证状态</span>
                    <Badge className="bg-green-100 text-green-700 border-0">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      已认证
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-lg">评价统计</CardTitle>
                  <CardDescription>暂无评价</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-sm text-gray-500">您还没有收到评价</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* 评价对话框 */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>写评价</DialogTitle>
            <DialogDescription>
              您的评价将帮助我们提升服务质量
            </DialogDescription>
          </DialogHeader>
          <ReviewForm targetType={activeTab} targetId={profileData[activeTab].name} targetName={profileData[activeTab].name} dimensions={getReviewDimensions(activeTab)} onSubmit={handleSubmitReview} />
        </DialogContent>
      </Dialog>

      <TabBar activePage={activePage} onPageChange={setActivePage} />
    </div>;
}