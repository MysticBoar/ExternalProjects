// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, Badge, Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, useToast } from '@/components/ui';
// @ts-ignore;
import { Shield, Star, TrendingUp, Award, FileText, AlertCircle } from 'lucide-react';

// @ts-ignore;
export function CompanyCreditCard({
  creditData,
  onViewDetail
}) {
  const {
    toast
  } = useToast();
  if (!creditData) {
    return <Card className="border-l-4 border-l-gray-300 bg-gray-50">
          <CardContent className="p-4">
            <div className="flex items-center text-gray-400">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span className="text-sm">暂无信用档案</span>
            </div>
          </CardContent>
        </Card>;
  }

  // 获取信用等级
  const getCreditLevel = score => {
    if (score >= 90) return {
      level: 'AAA',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-400',
      description: '信用极好'
    };
    if (score >= 80) return {
      level: 'AA',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-400',
      description: '信用优秀'
    };
    if (score >= 70) return {
      level: 'A',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-400',
      description: '信用良好'
    };
    if (score >= 60) return {
      level: 'B',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-400',
      description: '信用一般'
    };
    return {
      level: 'C',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-400',
      description: '信用较差'
    };
  };
  const creditLevel = getCreditLevel(creditData.creditScore || 0);
  const reviewCount = creditData.reviews ? creditData.reviews.length : 0;
  const averageRating = reviewCount > 0 ? creditData.reviews.reduce((sum, review) => sum + (review.averageRating || 0), 0) / reviewCount : 0;
  return <Card className={`border-l-4 ${creditLevel.borderColor} ${creditLevel.bgColor} shadow-sm`}>
          <CardContent className="p-4">
            {/* 信用分和等级 */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Shield className={`w-5 h-5 mr-2 ${creditLevel.color}`} />
                <span className="font-bold text-lg text-gray-800">{creditData.creditScore || 0}</span>
                <span className="text-sm text-gray-500 ml-1">信用分</span>
              </div>
              <Badge className={`${creditLevel.bgColor} ${creditLevel.color} border-0`}>
                {creditLevel.level} {creditLevel.description}
              </Badge>
            </div>

            {/* 认证状态 */}
            <div className="mb-3">
              {creditData.certificationStatus === 'approved' ? <div className="flex items-center text-green-600">
                    <Award className="w-4 h-4 mr-1.5" />
                    <span className="text-sm font-medium">已认证企业</span>
                  </div> : creditData.certificationStatus === 'submitted' ? <div className="flex items-center text-yellow-600">
                    <AlertCircle className="w-4 h-4 mr-1.5" />
                    <span className="text-sm">认证审核中</span>
                  </div> : <div className="flex items-center text-gray-500">
                    <AlertCircle className="w-4 h-4 mr-1.5" />
                    <span className="text-sm">未认证</span>
                  </div>}
            </div>

            {/* 评价统计 */}
            {reviewCount > 0 && <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-500" />
                  <span className="font-medium">{averageRating.toFixed(1)}</span>
                  <span className="text-gray-400 ml-1">/ 5.0</span>
                </div>
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-1 text-blue-500" />
                  <span>{reviewCount}条评价</span>
                </div>
              </div>}

            {/* 趋势和操作 */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <div className="flex items-center text-xs text-gray-500">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>活跃度高</span>
              </div>
              {onViewDetail && <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-xs h-7 px-2" onClick={() => {
              toast({
                title: '查看详情',
                description: '正在加载信用档案详情...',
                status: 'info'
              });
            }}>
                      查看详情
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>企业信用档案</DialogTitle>
                      <DialogDescription>该企业的详细信用信息和认证记录</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                      {/* 基本信息 */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-sm mb-2">基本信息</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">企业名称：</span>
                            <span className="font-medium">{creditData.companyName || '-'}</span>
                          </div>
                          {creditData.creditCode && <div className="flex justify-between">
                              <span className="text-gray-500">信用代码：</span>
                              <span className="font-medium">{creditData.creditCode}</span>
                            </div>}
                          {creditData.legalPerson && <div className="flex justify-between">
                              <span className="text-gray-500">法定代表人：</span>
                              <span className="font-medium">{creditData.legalPerson}</span>
                            </div>}
                          {creditData.registeredCapital && <div className="flex justify-between">
                              <span className="text-gray-500">注册资本：</span>
                              <span className="font-medium">{creditData.registeredCapital}</span>
                            </div>}
                        </div>
                      </div>

                      {/* 信用详情 */}
                      <div className={`${creditLevel.bgColor} p-4 rounded-lg`}>
                        <h4 className="font-semibold text-sm mb-2">信用详情</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">当前信用分：</span>
                            <span className={`text-2xl font-bold ${creditLevel.color}`}>{creditData.creditScore || 0}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">信用等级：</span>
                            <span className={`text-lg font-bold ${creditLevel.color}`}>{creditLevel.level}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">信用评级：</span>
                            <span className={creditLevel.color}>{creditLevel.description}</span>
                          </div>
                          {creditData.initialScore && <div className="flex items-center justify-between">
                              <span className="text-gray-600">初始信用分：</span>
                              <span className="font-medium">{creditData.initialScore}</span>
                            </div>}
                        </div>
                      </div>

                      {/* 评价记录 */}
                      {reviewCount > 0 && <div className="bg-white border border-gray-200 p-4 rounded-lg">
                          <h4 className="font-semibold text-sm mb-2">最新评价</h4>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {creditData.reviews.slice(0, 3).map((review, index) => <div key={index} className="text-sm border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center">
                                    <Star className="w-3 h-3 text-yellow-500 mr-1" />
                                    <span className="font-medium">{review.averageRating || 0}</span>
                                    <span className="text-xs text-gray-400 ml-1">/ 5.0</span>
                                  </div>
                                  <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                                </div>
                                {review.comment && <p className="text-gray-600 text-xs line-clamp-2">{review.comment}</p>}
                              </div>)}
                          </div>
                        </div>}

                      {/* 认证状态 */}
                      <div className="bg-white border border-gray-200 p-4 rounded-lg">
                        <h4 className="font-semibold text-sm mb-2">认证状态</h4>
                        <div className={`flex items-center justify-between ${creditData.certificationStatus === 'approved' ? 'text-green-600' : 'text-gray-600'}`}>
                          <span>{creditData.certificationStatus === 'approved' ? '✓ 已通过认证' : creditData.certificationStatus === 'submitted' ? '○ 认证审核中' : '✗ 未认证'}</span>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>}
            </div>
          </CardContent>
        </Card>;
}